import { Component, OnInit, Input } from '@angular/core';

import * as firebase from 'firebase/app';
import { RegisterService } from '../../services/register.service';
import { MapsAPILoader } from "@agm/core";

import { SuiActiveModal } from 'ng2-semantic-ui';
import { Vendor } from '../models/vendor';
import { HelperService } from '../../services/helper/helper.service';
import { AuthenticationEventService } from '../../services/events/authenticationevent.service';
import { Location } from '../../models/location.model'
import { LocationService } from "../../services/location.service";

import { AgmMap } from "@agm/core";

@Component({
  selector: 'app-register-vendor',
  templateUrl: './register-vendor.component.html',
  styleUrls: ['./register-vendor.component.css']
})
export class RegisterVendorComponent implements OnInit {

  @Input() social: firebase.User;
  @Input() public modal: SuiActiveModal<void, void, void>;

  experience: number;
  position: string;
  speciality: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  location: Location = new Location();
  mode: string;

  phone: string;
  birthday;

  constructor(private registerService: RegisterService,
    private helperService: HelperService,
    private authEventService: AuthenticationEventService,
    private locationService: LocationService,
    private mapsApiLoader: MapsAPILoader
  ) { }

  ngOnInit() {
    this.mode = 'date';
    let location = this.locationService.getCurrentLocation();
    this.mapsApiLoader.load()
      .then(() => {
        console.log('google script loaded');
      })
      .then(() => 
        this.locationService.getLocDetails(location.Latitude, location.Longitude).toPromise()
          .then(result => {
            location.Adress = result.formatted_address;
            location.City = result.address_components[3].short_name;
          })).then(()=>{this.location = location});
    this.email = this.social.email || null;
    this.phone = this.social.phoneNumber || null;
    this.initName();
  }

  initName() {
    let displayName = this.social.displayName;
    let nameValues = displayName.split(' ');
    this.firstName = nameValues[0] || null;
    this.lastName = nameValues[1] || null;
    
  }

  aggregateInfo(): Vendor {
    return {
      birthday: this.birthday,
      phone: this.phone,
      email: this.email,
      image: this.social.photoURL,
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      provider: this.social.providerData[0].providerId,
      uid: this.social.uid,
      experience: this.experience,
      position: this.position,
      speciality: this.speciality,
      location: this.location
    };
  }

  confirmRegister(formData) {
    if (formData.valid) {
      let regInfo = this.aggregateInfo();
      this.registerService.confirmVendor(regInfo).then(resp => {
        this.modal.deny(null);
        localStorage.setItem('token', resp.headers.get('token'));
        this.authEventService.signIn();
        this.helperService.redirectAfterAuthentication();
      });
    }
  }
}
