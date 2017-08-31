import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MapModel } from "../../../models/map.model";
import { CompanyContacts } from "../../../models/company-page/company-contacts.model";
import { CompanyService } from "../../../services/company-services/company.service";
import { ActivatedRoute, Params } from "@angular/router";
import { Contact } from "../../../models/contact.model";
import { ChatService } from "../../../services/chat/chat.service";
import { TokenHelperService } from "../../../services/helper/tokenhelper.service";
import { DialogModel } from "../../../models/chat/dialog.model";

@Component({
  selector: 'company-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.sass']
})
export class ContactsComponent implements OnInit {
  @Input()
  name: string;

  @Input()
  accountId: number;
  
  company: CompanyContacts;
  phones: Contact[];
  messengers: Contact[];
  socials: Contact[];
  emails: Contact[];


  openChat: boolean = false;
  ownerId: number;
  companyId: number;
  dialog: DialogModel;
  isLoaded: boolean = false;
  
  map: MapModel;

  constructor(private companyService: CompanyService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private tokenHelper: TokenHelperService) { }

  ngOnInit() { 
    this.route.params
    .switchMap((params: Params) => this.companyService.getCompanyContacts(params['id']))
    .subscribe(res => {       
      this.company = res;
      this.companyId = res.Id;      
      this.ownerId = +this.tokenHelper.getClaimByName('accountid');
      this.map = {
        center: {lat: this.company.Location.Latitude, lng: this.company.Location.Longitude},
        zoom: 18,    
        title: this.company.Title,
        label: this.company.Title,
        markerPos: {lat: this.company.Location.Latitude, lng: this.company.Location.Longitude}    
      };       
      this.phones = this.company.Contacts.filter(x => x.Type === "Phone");      
      this.emails = this.company.Contacts.filter(x => x.Type === "Email");
      this.messengers = this.company.Contacts.filter(x => x.Type === "Messenger");
      this.socials = this.company.Contacts.filter(x => x.Type === "Social");
      //console.log("account: "+ this.accountId + "; owner: " + this.ownerId);
    });     
    
  }
  
  createChat(){
    if(!this.openChat){
      this.isLoaded = true;
      this.chatService.findDialog(this.ownerId, this.accountId).then(res => {
        if(res !== null){        
          this.dialog = res; 
          this.dialog.ParticipantName = this.name;       
          this.isLoaded = false;
          this.openChat = true;
          return;       
      }      
      this.dialog = {
        Id: null,
        ParticipantOneId: this.ownerId,
        ParticipantTwoId: this.accountId,
        ParticipantName: this.name,
        Messages: null
      };    
      this.openChat = true;
      this.isLoaded = false;
      });  
    }
  }
}
