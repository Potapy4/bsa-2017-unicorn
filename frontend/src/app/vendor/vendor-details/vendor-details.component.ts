import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { JwtHelper } from '../../helpers/jwthelper';
import 'rxjs/add/operator/switchMap';


import { Vendor } from '../../models/vendor.model';

import { VendorService } from "../../services/vendor.service";
import { ModalService } from "../../services/modal/modal.service";

import { SuiModalService, TemplateModalConfig
  , ModalTemplate, ModalSize, SuiActiveModal } from 'ng2-semantic-ui';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { PhotoService, Ng2ImgurUploader } from "../../services/photo.service";

import { FormsModule }   from '@angular/forms';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.sass'],
  providers: [
        PhotoService,
        Ng2ImgurUploader,
        ModalService]
})
export class VendorDetailsComponent implements OnInit {

  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;
  enabled: boolean = false;
  enableTheme: boolean = false;
  saveImgButton:boolean = false;
  backgroundUrl: SafeResourceUrl;
  uploading: boolean;
  isOwner: boolean;
  dataLoaded: boolean;

  routePath: string;
  routeid: number;

  cropperSettings: CropperSettings;
  vendor: Vendor;
  isGuest: boolean;
  file: File;
  data: any;
  imageUploaded: boolean;

  tabActive: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private modalService: ModalService,
    private photoService: PhotoService,
    private sanitizer: DomSanitizer
  ) {
    this.getCurrentRole();
    this.cropperSettings = modalService.cropperSettings;
    this.data = {};
    this.imageUploaded = false;

    this.routePath = this.route.root.snapshot.firstChild.url[0].path;
    this.routeid = +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.dataLoaded = true;
    this.route.params
      .switchMap((params: Params) => this.vendorService.getVendor(params['id']))
      .subscribe(resp => {
        this.vendor = resp.body as Vendor;
        this.backgroundUrl = this.buildSafeUrl(this.vendor.Background);
      });
    if (this.route.snapshot.queryParams['tab'] === 'reviews') {
      this.tabActive = true;
    }
  }
  getCurrentRole()
  {
    let token = localStorage.getItem('token');
    if(token===null)
     { 
       this.isGuest=true;
       return;
     }
    const userClaims = new JwtHelper().decodeToken(token);
    if(userClaims['roleid']!=1)
        this.isGuest=false; else
    this.isGuest=true;
  }

  buildSafeUrl(link: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${link}')`);
  }
  
  bannerListener($event) {
      let file: File = $event.target.files[0];
      this.uploading = true;
      this.photoService.uploadToImgur(file).then(link => {
        console.log(link);
        return this.photoService.saveBanner(link);
      }).then(link => {
        this.backgroundUrl = this.buildSafeUrl(link);
        this.uploading = false;
      }).catch(err => {
        console.log(err);
        this.uploading = false;
      });
  }
}
