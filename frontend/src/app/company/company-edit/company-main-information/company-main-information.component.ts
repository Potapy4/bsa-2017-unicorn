import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CompanyDetails } from "../../../models/company-page/company-details.model";
import { CompanyService } from "../../../services/company-services/company.service";
import { ActivatedRoute, Params } from "@angular/router";
import { MapModel } from "../../../models/map.model";
import { CompanyWork } from "../../../models/company-page/company-work.model";
import { CompanyCategory } from "../../../models/company-page/company-category.model";
import { CompanySubcategory } from "../../../models/company-page/company-subcategory.model";
import { LocationService } from "../../../services/location.service";
import { NguiMapModule, Marker } from "@ngui/map";

@Component({
  selector: 'app-company-main-information',
  templateUrl: './company-main-information.component.html',
  styleUrls: ['./company-main-information.component.sass']
})
export class CompanyMainInformationComponent implements OnInit {
  company: CompanyDetails;
  isLoaded: boolean = false;
  map: MapModel;  
  position;
  autocomplete: google.maps.places.Autocomplete;
  address: any = {};
  marker;
  @ViewChild('companyForm') public companyForm: NgForm;

  constructor(private companyService: CompanyService,
    private route: ActivatedRoute, private LocationService: LocationService,
    private ref: ChangeDetectorRef) { }
    markerDragged(event)
    {
      this.company.Location.Latitude = event.latLng.lat();
      this.company.Location.Longitude = event.latLng.lng()

        this.LocationService.getLocDetails(this.company.Location.Latitude,this.company.Location.Longitude)
        .subscribe(
        result => {
           
            this.company.Location.Adress=result.formatted_address;
            this.company.Location.City=result.address_components[3].short_name;
        },
        error => console.log(error),
        () => console.log('Geocoding completed!')
        );
    }
  ngOnInit() {
       
    this.route.params
    .switchMap((params: Params) => this.companyService.getCompanyDetails(params['id'])).subscribe(res => {
      this.company = res;
      this.position={lat: this.company.Location.Latitude, lng: this.company.Location.Longitude};
      this.map = {
        center: {lat: this.company.Location.Latitude, lng: this.company.Location.Longitude},
        zoom: 18,    
        title: this.company.Name,
        label: this.company.Name,
        markerPos: {lat: this.company.Location.Latitude, lng: this.company.Location.Longitude}    
      };        
    });
  }

  save(){
    if (this.companyForm.invalid) {
      return;
    }
    this.isLoaded = true;
    this.companyService.saveCompanyDetails(this.company).then(() => {this.isLoaded = false});
  }
  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  placeChanged(event) {
    let place = this.autocomplete.getPlace();
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }

    this.position = this.address.locality;
    this.company.Location.Latitude = event.geometry.location.lat();
    this.company.Location.Longitude = event.geometry.location.lng()

    this.LocationService.getLocDetails(this.company.Location.Latitude,this.company.Location.Longitude)
   .subscribe(
    result => {
      
       this.company.Location.Adress=result.formatted_address;
        this.company.Location.City=result.address_components[3].short_name;
    },
    error => console.log(error),
    () => console.log('Geocoding completed!')
    );
    this.ref.detectChanges();
  }
}