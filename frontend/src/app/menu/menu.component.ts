import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SuiModalService } from 'ng2-semantic-ui';
import { Subscription } from 'rxjs/Subscription';

import { MenuItem } from './menu-item/menu-item';
import { RegisterModal } from '../register/register-component/register.component';

import { AuthenticationEventService } from '../services/events/authenticationevent.service';
import { AuthenticationLoginService } from '../services/auth/authenticationlogin.service';
import { TokenHelperService } from '../services/helper/tokenhelper.service';
import { AccountService } from "../services/account.service";

import { ProfileShortInfo } from "../models/profile-short-info.model";
import { RoleRouter } from "../helpers/rolerouter";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass'],
  providers: []
})
export class MenuComponent implements OnInit {
  items: MenuItem[];
  isEnabled: boolean;
  isLogged: boolean;

  onLogIn: Subscription;
  onLogOut: Subscription;

  roleRouter: RoleRouter;

  profileInfo: ProfileShortInfo;
  profileUrl: string;

  showAccountDetails: boolean;
  showNotifications: boolean;
  notifications: Array<string>;

  constructor(
    private router: Router,
    private modalService: SuiModalService,
    private authEventService: AuthenticationEventService,
    private authLoginService: AuthenticationLoginService,
    private tokenHelper: TokenHelperService,
    private accountService: AccountService) {
    this.isLogged = this.tokenHelper.isTokenValid() && this.tokenHelper.isTokenNotExpired();
  }

  ngOnInit() {
    this.roleRouter = new RoleRouter();
    if (this.isLogged) {
      this.accountService.getShortInfo(+this.tokenHelper.getClaimByName("accountid"))
        .then(resp => this.profileInfo = resp.body as ProfileShortInfo);
      this.setProfileRoute();
    }
    else {
      this.profileInfo = {
        Avatar: "",
        Email: "",
        Name: "",
        Role: ""
      };
      this.profileUrl = "";
    }
    this.notifications = [
      "First notification",
      "Second notification",
      "Third notification"
    ];

    this.addMenuItems();
    this.isEnabled = true;

    this.onLogIn = this.authEventService.loginEvent$
      .subscribe(() => {
        this.isLogged = true;
        this.accountService.getShortInfo(+this.tokenHelper.getClaimByName("accountid"))
          .then(resp => this.profileInfo = resp.body as ProfileShortInfo);
        this.setProfileRoute();
      });

    this.onLogOut = this.authEventService.logoutEvent$
      .subscribe(() => {
        this.isLogged = false;
        this.profileInfo = {
          Avatar: "",
          Email: "",
          Name: "",
          Role: ""
        };
        this.showAccountDetails = false;
        this.profileUrl = "/search";
      });
  }

  ngOnDestroy() {
    this.onLogIn.unsubscribe();
    this.onLogOut.unsubscribe();
  }

  openModal() {
    this.modalService.open(new RegisterModal());
  }

  addMenuItems() {
    this.items = [{
      name: 'Search',
      route: 'search'
    }, {
      name: 'Vendors',
      route: '#'
    }, {
      name: 'Sign in',
      route: 'register'
    }];
  }

  signOut() {
    this.authLoginService.signOut();
    this.router.navigate(['index']);
  }

  goToAccount() {
    this.showAccountDetails = false;
    this.router.navigateByUrl(this.profileUrl);
  }

  onShowDetails() {
    this.showAccountDetails = !this.showAccountDetails;
    this.showNotifications = false;
  }

  onShowNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showAccountDetails = false;
  }

  getNotificationClass(): string {
    return this.isNotificationExist() ? "red" : "";
  }

  isNotificationExist(): boolean {
    return this.notifications && this.notifications.length != 0;
  }

  setProfileRoute(): void {
    const roleId = +this.tokenHelper.getClaimByName("roleid");
    const profileId = this.tokenHelper.getClaimByName("profileid");

    switch (roleId) {
      case 2:
        this.profileUrl = `/user/${profileId}/edit`;
        break;
      case 3:
        this.profileUrl = `/vendor/${profileId}/edit`;
        break;
      case 4:
        this.profileUrl = `/company/${profileId}/edit`;
        break;
      default:
        this.profileUrl = "/search";
        break;
    }
  }
}
