import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SuiModule } from 'ng2-semantic-ui';
import { environment } from '../../environments/environment';
import { NguiMapModule } from "@ngui/map/dist";

import { BookModule } from '../book/book.module';
import { MapModule } from '../map/map.module';

import { VendorsComponent } from './vendors/vendors.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { VendorProfileInfoComponent } from './vendor-details/vendor-profile-info/vendor-profile-info.component';
import { VendorProfileContactsComponent } from './vendor-details/vendor-profile-contacts/vendor-profile-contacts.component';
import { VendorProfileReviewsComponent } from './vendor-details/vendor-profile-reviews/vendor-profile-reviews.component';
import { VendorProfilePortfolioComponent } from './vendor-details/vendor-profile-portfolio/vendor-profile-portfolio.component';

import { VendorRoutingModule } from './vendor-routing.module';

import { VendorService } from '../services/vendor.service';
import { ReviewService } from '../services/review.service';
import { DataService } from "../services/data.service";
import { LocationService } from "../services/location.service";
import { VendorEditComponent } from './vendor-edit/vendor-edit.component';
import { VendorEditInfoComponent } from './vendor-edit/vendor-edit-info/vendor-edit-info.component';

@NgModule({
  imports: [
    CommonModule,
    VendorRoutingModule,
    FormsModule,
    SuiModule,
    BookModule,
    MapModule
  ],
  declarations: [
    VendorDetailsComponent,
    VendorProfileInfoComponent,
    VendorProfileContactsComponent,
    VendorProfileReviewsComponent,
    VendorProfilePortfolioComponent,
    VendorsComponent,
    VendorEditComponent,
    VendorEditInfoComponent,
  ],
  providers: [
    DataService,
    VendorService,
    LocationService,
    ReviewService
  ]
})
export class VendorModule { }
