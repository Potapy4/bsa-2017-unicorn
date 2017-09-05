import { Component, OnInit, ViewChild } from '@angular/core';

import { BookCard, BookStatus } from '../../../models/dashboard/book-card';

import { DashMessagingService } from '../../../services/dashboard/dash-messaging.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { NotificationService } from "../../../services/notifications/notification.service";

import {SuiModalService, TemplateModalConfig, ModalTemplate, ModalSize, SuiActiveModal} from 'ng2-semantic-ui';

import {ToastsManager, Toast} from 'ng2-toastr';
import {ToastOptions} from 'ng2-toastr';
import { MapModel } from "../../../models/map.model";

export interface IDeclineConfirm {
  id: number;
}
@Component({
  selector: 'app-dashboard-pendings',
  templateUrl: './dashboard-pendings.component.html',
  styleUrls: ['./dashboard-pendings.component.sass']
})
export class DashboardPendingsComponent implements OnInit {

  
  @ViewChild('mapModal')
  public modalTemplate:ModalTemplate<IDeclineConfirm, void, void>

  @ViewChild('declineModal')
  public declineTemplate:ModalTemplate<IDeclineConfirm, void, void>

  currModal: SuiActiveModal<IDeclineConfirm, {}, void>;

  books: BookCard[];

  aloads: {[bookId: number]: boolean} = {};
  dloads: {[bookId: number]: boolean} = {};

  reason: string;
  loader: boolean;
  map: MapModel;
  constructor(
    private dashboardService: DashboardService,
    private dashMessaging: DashMessagingService,
    private notificationService: NotificationService,
    private toastr: ToastsManager,
    private modalService: SuiModalService,
  ) { }

  ngOnInit() {
    this.loadData();
    this.notificationService.listen<any>("RefreshOrders", () => this.loadData());
    
  }

  loadData() {
    this.dashboardService.getPendingBooks().then(resp => {
      this.books = resp;
      console.log(this.books);
      
    });
  }

  accept(id: number) {
    let book: BookCard = this.books.filter(b => b.Id == id)[0];
    book.Status = BookStatus.Accepted;
    this.aloads[book.Id] = true;
    this.dashboardService.update(book)
    .then(resp => {
      this.books.splice(this.books.findIndex(b => b.Id === id), 1);
      this.dashMessaging.changePending();      
      this.aloads[book.Id] = false;
      this.toastr.success('Accepted task');
    })
    .catch(err => {
      this.aloads[book.Id] = false;      
      this.toastr.error('Ops. Cannot accept task');
    });
  }

  decline(id: number) {
    this.reason = '';
    const config = new TemplateModalConfig<IDeclineConfirm, void, void>(this.declineTemplate);
    config.context = {id: id};
    config.isInverted = true;
    config.size = ModalSize.Tiny;
    this.currModal = this.modalService.open(config);
  }

  declineConfirm(id: number) {
    let book: BookCard = this.books.filter(b => b.Id == id)[0];
    book.Status = BookStatus.Declined;
    book.DeclinedReason = this.reason;
    this.loader = true;
    this.dashboardService.update(book).then(resp => {
      this.books.splice(this.books.findIndex(b => b.Id === id), 1);
      this.loader = false;
      this.currModal.deny(undefined);
      this.toastr.success('Declined task');
    }).catch(err => {
      this.loader = false;
      this.currModal.deny(undefined);
      this.toastr.error('Ops. Cannot decline task');
    });
  }
 openMap(id:number)
 {
  this.map = {
    center: {lat: this.books.filter(b => b.Id == id)[0].Location.Latitude, lng: this.books[0].Location.Longitude},
    zoom: 18,    
    title: this.books.filter(b => b.Id == id)[0].Customer,
    label: this.books.filter(b => b.Id == id)[0].Customer,
    markerPos: {lat: this.books.filter(b => b.Id == id)[0].Location.Latitude, lng: this.books.filter(b => b.Id == id)[0].Location.Longitude}    
  };  
  const config = new TemplateModalConfig<IDeclineConfirm, void, void>(this.modalTemplate);
  config.isInverted = true;
  config.size = ModalSize.Tiny;
  this.currModal = this.modalService.open(config);
 }
}
