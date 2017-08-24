import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { CompanyService } from "../../../services/company-services/company.service";
import { CompanyVendors } from "../../../models/company-page/company-vendors.model";
import { Vendor } from "../../../models/company-page/vendor";

@Component({
  selector: 'app-company-vendors',
  templateUrl: './company-vendors.component.html',
  styleUrls: ['./company-vendors.component.sass']
})
export class CompanyVendorsComponent implements OnInit {  

  company: CompanyVendors;     
  isLoaded: boolean = false; 
  openedDetailedWindow: boolean = false;  
  allVendors: Vendor[];
  selectedVendors: Vendor[] = [];
  selectedVendor: Vendor;


  constructor(private companyService: CompanyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
    .switchMap((params: Params) => this.companyService.getCompanyVendors(params['id'])).subscribe(res => {
      this.company = res;   
      this.allVendors = this.company.AllVendors;
      // console.log(this.company.AllVendors);   
    });
  }  

  changeVendor(){
    // this.allVendors.Result  = this.company.AllVendors.Result;    
    // this.selectedVendors.push(this.selectedVendor);
    // this.allVendors.Result = this.allVendors.Result.filter(x => x.Id !== this.selectedVendor.Id);

    this.selectedVendors.push(this.selectedVendor);
    this.allVendors = this.allVendors.filter(x => x.Id !== this.selectedVendor.Id);
    this.selectedVendor = undefined;  
  }

  openDetailedWindow(){
    if(!this.openedDetailedWindow)  {
      this.openedDetailedWindow = true;  
      this.selectedVendors = [];
    }    
  }

  closeDetailedWindow(){
    this.openedDetailedWindow = false;  
    this.allVendors = this.company.AllVendors;
    this.selectedVendors = undefined;
    this.selectedVendor = undefined;
  }

  deleteVendor(vendor: Vendor){      
    // this.company.Vendors.Result =  this.company.Vendors.Result.filter(x => x.Id !== vendor.Id);   

    this.company.Vendors =  this.company.Vendors.filter(x => x.Id !== vendor.Id);   
    this.saveCompanyVendors();
    this.selectedVendors = undefined;
    this.selectedVendor = undefined;
    this.company = undefined;
    if(this.openedDetailedWindow)  
      this.openedDetailedWindow = !this.openedDetailedWindow;    
  }

  deleteSelectedVendor(vendor: Vendor){
    this.selectedVendors = this.selectedVendors.filter(x => x.Id !== vendor.Id);
    this.allVendors.push(vendor);
  }

  addVendor(){    
    // this.selectedVendors.forEach(vendor => {this.company.Vendors.Result.push(vendor);});      
    this.selectedVendors.forEach(vendor => {this.company.Vendors.push(vendor);});      
      this.saveCompanyVendors();  
      this.selectedVendors = undefined;
      this.selectedVendor = undefined;      
      this.company = undefined;    
      this.openedDetailedWindow = !this.openedDetailedWindow;     
  }


  saveCompanyVendors(){
    this.isLoaded = true;    
    this.companyService.saveCompanyVendors(this.company).then(() => {
      this.isLoaded = false;      
      this.ngOnInit();
    });
  }


}
