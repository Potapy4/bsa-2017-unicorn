import { Component, OnInit, Input,ViewChild, AfterViewChecked } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import {SuiModule} from 'ng2-semantic-ui';
import { User } from '../../../models/user';
import { NguiMapModule, Marker } from "@ngui/map";
import { UserService } from "../../../services/user.service";
import { LocationService } from "../../../services/location.service";
import { Review} from "../../../models/review.model"
import { MapModel } from "../../../models/map.model";
import { DialogModel } from "../../../models/chat/dialog.model";
import { ChatEventsService } from "../../../services/events/chat-events.service";
import { TokenHelperService } from "../../../services/helper/tokenhelper.service";
import { ChatService } from "../../../services/chat/chat.service";

@Component({
  selector: 'app-user-main-info',
  templateUrl: './user-main-info.component.html',
  styleUrls: ['./user-main-info.component.sass']
})
export class UserMainInfoComponent implements OnInit {
  @Input() user: User;
  rating: number;
  reviewsCount: number;
  map: MapModel;
  openChat: boolean = false;
  ownerId: number;
  dialog: DialogModel;
  isLoaded: boolean = false;
  isGuest: boolean;
  constructor(private userService: UserService,
    private chatEventsService: ChatEventsService,
    private tokenHelper: TokenHelperService,
    private chatService: ChatService) {}
 
    ngOnInit() {
     this.userService.getRating(this.user.Id)
     .then(resp =>{ this.rating = resp.body as number;
      this.map = {
        center: {lat: this.user.Location.Latitude, lng: this.user.Location.Longitude},
        zoom: 18,    
        title: this.user.Name,
        label: this.user.Name,
        markerPos: {lat: this.user.Location.Latitude, lng: this.user.Location.Longitude}    
      };  
      });

     this.ownerId = +this.tokenHelper.getClaimByName('accountid');
     this.isGuest = this.ownerId === 0;
          
     this.userService.getReviews(this.user.Id)
     .then(resp => this.reviewsCount = (resp.body as Review[]).length)
  }

  createChat(){
    this.isLoaded = true;
    if(this.ownerId === undefined){
      this.ownerId = +this.tokenHelper.getClaimByName('accountid');
    }
    this.chatService.findDialog(this.ownerId, this.user.AccountId).then(res => {
      if(res !== null){        
        this.dialog = res; 
        this.dialog.ParticipantName = this.user.Name + " " + this.user.SurName;       
        this.isLoaded = false;
        this.openChat = true;                      
      } 
      else{     
        this.dialog = {
          Id: null,
          ParticipantOneId: this.ownerId,
          ParticipantTwoId: this.user.AccountId,
          ParticipantName: this.user.Name + " " + this.user.SurName,
          Messages: null,
          LastMessageTime: null,
          IsReadedLastMessage: null
        };    
        this.openChat = true;
        this.isLoaded = false;
      }
      this.chatEventsService.openChat(this.dialog);     
    });
  }
}
