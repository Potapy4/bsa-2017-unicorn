import { Component, OnInit, OnDestroy, Input, ViewChild, ChangeDetectorRef, forwardRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { MenuComponent } from '../../menu/menu.component';

import { RegisterService } from '../../services/register.service';

import { SuiModalService, TemplateModalConfig, SuiModal, ComponentModalConfig
  , ModalTemplate, ModalSize, SuiActiveModal } from 'ng2-semantic-ui';
  import 'rxjs/add/operator/map';

import { RegisterInfo } from '../models/register-info';

export interface IConfirmModalContext {
    title:string;
    question:string;
}

export class ConfirmModal extends ComponentModalConfig<IConfirmModalContext, void, void> {
    constructor(title:string, question:string) {
        super(RegisterComponent, { title, question });
        this.size = ModalSize.Small;
        this.isInverted = true;
    }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit, OnDestroy {

  private authState: Observable<firebase.User>
  private currentUser: firebase.User = null;

  @Input() enabled: boolean;

  mode: string;
  modalSize: string;
  error: boolean = false;

  public roles: {[role: string]: boolean} = {};

  social: any;
  sub: any;

  isLogged: boolean = false;

  roleSelected = false;

  isCustomer = false;
  isVendor = false;
  isCompany = false;

  constructor(
    public modal: SuiModal<IConfirmModalContext, void, void>,
    public router: Router,
    public registerService: RegisterService,
    public afAuth: AngularFireAuth) {


    this.mode = 'date';
    this.afAuth.auth.signOut();
    this.authState = this.afAuth.authState;
    
    this.isLogged = false;
    this.error = false;

    this.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
        let provider = user.providerData[0].providerId;
        let uid = user.uid;
        this.checkRegistration(provider, uid);
      } 
    });
    this.initRoles();
  }

  handleErrorLogin() {
    this.error = true;
  }

  saveToken(token: string) {
    console.log('token: ' + token);
    localStorage.setItem('token', token);
  }

  handleResponse(resp: any): void {
    console.log('resp: ' + resp);
    console.log('status: ' + resp.status);
    switch (resp.status) {
      case 204: this.isLogged = true; this.error = false; break;
      case 200: this.saveToken(resp.headers.get('token')); this.error = false; this.redirect(); break;
      default: this.handleErrorLogin(); break;
    }
  }

  checkRegistration(provider: string, uid: string) {
    this.registerService
      .checkAuthorized(provider, uid)
      .then(resp => {this.handleResponse(resp)})
      .catch(err => {
        console.log(err);
        this.handleErrorLogin();
      });
  }

  loginWithGoogle() {
    this.afAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider())
      .then(x => {
         console.log(x);
      })
      .catch(err => {
        this.handleErrorLogin();
      });
  }

  loginWithFacebook() {
    this.afAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider())
      .then(x => {
        console.log(x);
      })
      .catch(err => {
        this.handleErrorLogin();
      });
  }

  loginWithTwitter() {
    this.afAuth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider())
      .then(x => {
        console.log(x);
      })
      .catch(err => {
        this.handleErrorLogin();
      });
  }

  clearRoles() {
    for (let key in this.roles) {
      this.roles[key] = false;
    }
  }

  initRoles() {
    this.roles['customer'] = false;
    this.roles['vendor'] = false;
    this.roles['company'] = false;
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    this.error = false;
        this.isLogged = false;
        this.isCompany = false;
        this.isVendor = false;
        this.isCustomer = false;
        this.roleSelected = false;
        this.social = undefined;
        this.clearRoles();
  }

  private redirect() {
    this.modal.deny(undefined); 
    this.router.navigate(['login']);
  }

  selectRole(role: string) {
    this.clearRoles();  
    this.roles[role] = true;
  }
}