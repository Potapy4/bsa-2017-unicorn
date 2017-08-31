import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NguiMapModule, Marker } from "@ngui/map";
import { SuiModule } from 'ng2-semantic-ui';
import { ToastsManager, Toast } from 'ng2-toastr';
import { ToastOptions } from 'ng2-toastr';

import { Location } from "../../../models/location.model"
import { Vendor } from "../../../models/vendor.model";
import { MapModel } from "../../../models/map.model";
import { Work } from "../../../models/work.model";
import { Category } from "../../../models/category.model";
import { Subcategory } from "../../../models/subcategory.model";

import { VendorService } from "../../../services/vendor.service";
import { LocationService } from "../../../services/location.service";
import { CategoryService } from "../../../services/category.service";
import { WorkService } from "../../../services/work.service";

@Component({
  selector: 'app-vendor-edit-info',
  templateUrl: './vendor-edit-info.component.html',
  styleUrls: ['./vendor-edit-info.component.sass']
})
export class VendorEditInfoComponent implements OnInit {
  @Input() vendor: Vendor;
  
  location: Location;
  map: MapModel;
  dataLoaded: boolean;
  
  newWork: Work;
  categories: Category[];
  selectedCategory: Category;
  selectedSubcategory: Subcategory;
  works: Work[];
  subcategoryWorks: Work[];

  @ViewChild('vendorForm') public vendorForm: NgForm;
  
  constructor(
    private locationService: LocationService, 
    private vendorService: VendorService,
    private categoryService: CategoryService,
    private workService: WorkService,
    private toastr: ToastsManager
  ) { }

  ngOnInit() {
    this.dataLoaded = true;   
    this.categoryService.getAll()
      .then(resp => this.categories = resp.body as Category[]);
    this.workService.getAll()
      .then(resp => this.works = resp.body as Work[])
    this.locationService.getById(this.vendor.LocationId)
      .then(resp => this.location = resp.body as Location)
      .then(() => this.map = {
          center: {lat: this.location.Latitude, lng: this.location.Longitude},
          zoom: 18,    
          title: "Overcat 9000",
          label: "",
          markerPos: {lat: this.location.Latitude, lng: this.location.Longitude}
        });
  }

  onDateSelected(date: Date): void {
    console.log(date.getDate());
  }

  addWorkType(): void {
    if (this.newWork.Name !== "") {
      this.newWork.CategoryId = this.selectedCategory.Id;
      this.newWork.Category = this.selectedCategory.Name;
      this.newWork.SubcategoryId = this.selectedSubcategory.Id;
    }
  }

  saveVendor(): void {
    if (this.vendorForm.invalid) {
      return;
    }
    this.dataLoaded = false;
    this.vendor.Birthday.setDate(this.vendor.Birthday.getDate() + 1);
    this.vendorService.updateVendor(this.vendor)
      .then(resp => {
        this.vendor = resp.body as Vendor;
        this.vendor.Birthday = new Date(this.vendor.Birthday);
        this.vendor.Birthday.setDate(this.vendor.Birthday.getDate() - 1);
        this.dataLoaded = true;
        this.toastr.success('Changes were saved', 'Success!');
      })
      .catch(err => { 
        this.dataLoaded = true;
        this.toastr.error('Sorry, something went wrong', 'Error!');
      });
  }

}
