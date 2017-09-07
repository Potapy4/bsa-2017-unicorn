import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ImageCropperComponent, CropperSettings } from "ng2-img-cropper";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { SuiModalService, TemplateModalConfig, ModalTemplate, ModalSize, SuiActiveModal } from 'ng2-semantic-ui';
import { ToastsManager, Toast } from 'ng2-toastr';
import { ToastOptions } from 'ng2-toastr';

import { VendorService } from "../../../services/vendor.service";
import { ModalService } from "../../../services/modal/modal.service";
import { CategoryService } from "../../../services/category.service";
import { PhotoService, Ng2ImgurUploader } from "../../../services/photo.service";

import { Work } from "../../../models/work.model";
import { Category } from "../../../models/category.model";
import { Subcategory } from "../../../models/subcategory.model";

@Component({
  selector: 'app-vendor-edit-works',
  templateUrl: './vendor-edit-works.component.html',
  styleUrls: ['./vendor-edit-works.component.sass'],
  providers: [
    PhotoService,
    Ng2ImgurUploader,
    ModalService]
})
export class VendorEditWorksComponent implements OnInit {
  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<void, {}, void>;
  private activeModal: SuiActiveModal<void, {}, void>;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  enabled: boolean = false;
  enableTheme: boolean = false;
  saveImgButton: boolean = false;
  workIconUrl: SafeResourceUrl;
  uploading: boolean = false;
  loader:boolean = false;
  @ViewChild('modalDeleteTemplate')
  public modalDeleteTemplate: ModalTemplate<void, {}, void>;

  modalSize: string;
  cropperSettings: CropperSettings;
  data: any;
  file: File;
  imageUploaded: boolean;

  @Input() vendorId;

  works: Work[];
  categories: Category[];
  subcategories: Subcategory[];
  selectedCategory: Category;
  selectedSubcategory: Subcategory;
  selectedWork: Work;
  pendingWorks: Work[];

  isEditOpen: boolean;

  constructor(
    private vendorService: VendorService,
    private categoryService: CategoryService,
    private photoService: PhotoService,
    private sanitizer: DomSanitizer,
    private suiModalService: SuiModalService,
    private modalService: ModalService,
    private toastr: ToastsManager,
    private route: ActivatedRoute
  ) {
    this.cropperSettings = modalService.cropperSettings;
    this.data = {};
    this.imageUploaded = false;
  }

  ngOnInit() {
    this.isEditOpen = false;
    this.vendorService.getVendorWorks(this.vendorId)
      .then(resp => this.works = resp.body as Work[]);
    this.categoryService.getAll()
      .then(resp => this.categories = resp.body as Category[])
      .then(() => this.checkForWork());
    this.subcategories = [];
    this.pendingWorks = [];
    this.clearSelectedWork();
  }

  checkForWork() {
    let category = +this.route.snapshot.queryParams['category'];
    let subcategory = +this.route.snapshot.queryParams['subcategory'];
    let name = this.route.snapshot.queryParams['name'];
    if (category && subcategory && name) {

      // this.work = {
      //   Id: null,
      //   Description: null,
      //   Name: name,
      //   Subcategory: null,
      //   Icon: null
      // };
      this.selectedWork.Name = name;
      this.selectedCategory = this.categories.filter(c => c.Id === category)[0];
      this.onCategorySelect();
      this.selectedSubcategory = this.subcategories.filter(s => s.Id === subcategory)[0];
      // this.setSubcategory(subcategory);
      // if (!this.openedDetailedWindow){
      //   this.openedDetailedWindow = true;
      // }
      this.isEditOpen = true;
    }
    
    this.loader = true;
  }

  editToggle(): void {
    this.isEditOpen = !this.isEditOpen;
    this.clearSelectedWork();
  }

  onWorkSelect(work: Work): void {
    this.selectedWork = work;
    this.selectedCategory = this.categories.find(c => c.Id == this.selectedWork.CategoryId);
    this.onCategorySelect();
    this.selectedSubcategory = this.subcategories.find(c => c.Id == this.selectedWork.SubcategoryId);
    this.workIconUrl = this.buildSafeUrl(this.selectedWork.Icon);
    this.isEditOpen = true;
  }

  onCategorySelect(): void {
    this.selectedSubcategory = null;
    this.subcategories = this.selectedCategory.Subcategories;
  }

  createWork(): void {
    this.selectedWork.CategoryId = this.selectedCategory.Id;
    this.selectedWork.SubcategoryId = this.selectedSubcategory.Id;

    this.selectedWork.Subcategory = this.selectedSubcategory.Name;
    this.selectedWork.Category = this.selectedCategory.Name;

    let work = this.selectedWork;

    this.pendingWorks.push(work);
    this.works.push(work)
    this.vendorService.postVendorWork(this.vendorId, this.selectedWork)
      .then(resp => {
        this.pendingWorks.splice(this.pendingWorks.findIndex(w => w === work), 1);
        work.Id = (resp.body as Work).Id;
        this.toastr.success('Changes were saved', 'Success!')
      })
      .catch(err => {
        this.pendingWorks.splice(this.pendingWorks.findIndex(w => w === work), 1);
        this.toastr.error('Sorry, something went wrong', 'Error!');
      });
    this.clearSelectedWork();
    this.isEditOpen = false;
  }

  updateWork(): void {
    this.selectedWork.CategoryId = this.selectedCategory.Id;
    this.selectedWork.SubcategoryId = this.selectedSubcategory.Id;
    this.vendorService.updateVendorWork(this.vendorId, this.selectedWork.Id, this.selectedWork)
      .then(() => this.toastr.success('Changes were saved', 'Success!'))
      .catch(() => this.toastr.error('Sorry, something went wrong', 'Error!'));
    this.clearSelectedWork();
    this.isEditOpen = false;
  }

  removeWork(work: Work): void {

    const config = new TemplateModalConfig<void, {}, void>(this.modalDeleteTemplate);
    
    config.size = ModalSize.Small;
    config.isInverted = true;
    
    let that = this;

    this.activeModal = this.suiModalService
      .open(config)
      .onApprove(result => { 
        if(this.activeModal !== undefined){ 
          this.activeModal.deny(null);  
        } 
    
        if (this.selectedWork.Id === work.Id){
          this.isEditOpen = false;
          this.clearSelectedWork();
        }

        this.pendingWorks.push(work);

        this.vendorService.removeVendorWork(this.vendorId, work.Id, work)
          .then(resp => {
            this.pendingWorks.splice(this.pendingWorks.findIndex(w => w === work), 1);
            this.works.splice(this.works.findIndex(w => w.Id === work.Id));
            this.toastr.success('Changes were saved', 'Success!');
          })
          .catch(() => {
            this.pendingWorks.splice(this.pendingWorks.findIndex(w => w === work), 1);
            this.toastr.error('Sorry, something went wrong', 'Error!');
          });
       })
      .onDeny(result => {  /* deny callback */   });
  }

  isWorkPending(work: Work): boolean {
    return this.pendingWorks.includes(work);
  }

  clearSelectedWork(): void {
    this.selectedCategory = null;
    this.selectedSubcategory = null;
    this.selectedWork = {
      Id: null,
      Category: "",
      Subcategory: "",
      CategoryId: null,
      SubcategoryId: null,
      Description: "",
      Name: "",
      Icon: ""
    };
  }

  buildSafeUrl(link: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${link}')`);
  }

  fileChangeListener($event) {
    var image: any = new Image();
    this.file = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);

    };
    this.imageUploaded = true;
    myReader.readAsDataURL(this.file);
  }

  fileSaveListener() {
    if (!this.data) {
      console.log("file can't be loaded");
      return;
    }
    if(!this.file){
      return;
    }
    this.uploading = true;
    this.photoService.uploadToImgur(this.file)
      .then(resp => {
        this.uploading = false;
        this.selectedWork.Icon = this.data.image;
        this.imageUploaded = false;
        this.activeModal.deny(null);
      })
      .catch(err => {
        console.log(err);
      });
  }

  public openModal() {
    this.activeModal = this.modalService.openModal(this.modalTemplate);
  }

}
