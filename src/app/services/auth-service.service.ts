import { Injectable } from '@angular/core';
import { CheckSubjectPayload } from 'src/app/utils_/payloads/Auth/check-subject-payload';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { JwtAutResponsePayload } from '../utils_/payloads/Auth/jwt-aut-response-payload';
import { loginPayload } from '../utils_/payloads/Auth/login-payload';
import { SubjectPayload } from '../utils_/payloads/Auth/subjects.payload';
import { registerPayload } from '../utils_/payloads/Auth/register-payload';
import { CheckUsernamePayload } from '../utils_/payloads/Auth/check-username-payload';

import { JsonPipe } from '@angular/common';
import { LogoutPayload } from '../utils_/payloads/Auth/logout-payload';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { RegisterActorPayload } from '../Admin/payloads/register_actor_payload';
import { CheckEmailExistPayload } from '../Admin/payloads/admin_check_email_exist_payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url =
    ((window as { [key: string]: any })['cfgApiBaseUrl'] as string) +
    '/api/auth/';
  // private url = 'http://localhost:5056/api/auth/';
  localData!: JwtAutResponsePayload;
  jsonObject!: JSON;
  logoutPayload!: LogoutPayload;

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.logoutPayload = {
      browser_type: this.detectBrowserName(),
      browser_version: this.detectBrowserVersion(),
    };
  }
  isAuthenticated(): boolean {
    return this.localStorageService.retrieve('user') != null;
  }
  isStudent(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    )) {
      if (result.name == 'Student') return true;
      // return true
    }
    return false;
  }
  isRoleMulti(): boolean {
    return ((Number) (JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ).length) > 1);

  }
  isTeacher(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Teacher') return true;
    return false;
  }
  getRoles() {
    return JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    );
  }
  //========Approver auth service===========
  isApprover(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Approver') return true;
    return false;
  }

  isIssueAccount(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'IssueAccount') return true;
    return false;
  }

  isFixedAsset(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'FixedAsset') return true;
    return false;
  }
  isUserApprover(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'userapprover') return true;
    return false;
  }
  isIssueApprover(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'IssueApprover') return true;
    return false;
  }
  ///////////////////// isStocke() begin //////////////////////
  isStoke(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Approver') return true;
    return false;
  }
  ////////////////////  isStock() ending ///////////////////
  isUser(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'User') return true;
    return false;
  }

  //========Approver end===========

  isAdmin(): boolean {
    for (let result of JSON.parse(
      JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
    ))
      if (result.name == 'Admin') return true;
    return false;
  }
  testConnection(): Observable<Boolean> {
    return this.httpClient.get<Boolean>('http://localhost:5056/test1');
  }
  checkNameExist(
    checkUsernamePayload: CheckUsernamePayload
  ): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'check_username/' + checkUsernamePayload.username
    );
  }
  forgotPassword(email: any) {
    console.log('the email is: ' + email);
    return this.httpClient.get(this.url + 'forgot_password/' + email);
  }
  login(login_payload: loginPayload): Observable<boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    return this.httpClient
      .post<JwtAutResponsePayload>(
        this.url + 'login',
        login_payload,
        requestOptions
      )
      .pipe(
        map(
          (data) => {
            if (data != null) {
              if (data.user.firsttime != '1') {
                console.log('firsttime: ' + data.user.firsttime);
                console.log(
                  'here=====================1' + JSON.stringify(data, null, 2)
                );
                this.localStorageService.store('user', data.user.id);
                console.log('here=====================2');
                this.localStorageService.store('roles', data.user.roles);
                console.log('here=====================3');
                return true;
              } else {
                this.localStorageService.store('password-reset', data.user.id);
                this.router.navigateByUrl('/change-password');
                return false;
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Permission',
                text: 'You are not permitted to perform this action!',
              });

              return false;
            }
          },
          (error: any) => {
            console.log('here=====================4');
            console.log('error: ' + JSON.stringify(error, null, 2));
          }
        )
      );
  }
  login_(login_payload: loginPayload): Observable<boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    return this.httpClient
      .post<JwtAutResponsePayload>(
        this.url + 'login_',
        login_payload,
        requestOptions
      )
      .pipe(
        map(
          (data) => {
            if (data != null) {
              if (data.user.firsttime != '1') {
                console.log('firsttime: ' + data.user.firsttime);
                console.log(
                  'here=====================1' + JSON.stringify(data, null, 2)
                );
                this.localStorageService.store('user', data.user.id);
                console.log('here=====================2');
                this.localStorageService.store('roles', data.user.roles);
                console.log('here=====================3');
                return true;
              } else {
                this.localStorageService.store('password-reset', data.user.id);
                this.router.navigateByUrl('/change-password');
                return false;
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Permission',
                text: 'You are not permitted to perform this action!',
              });

              return false;
            }
          },
          (error: any) => {
            console.log('here=====================4');
            console.log('error: ' + JSON.stringify(error, null, 2));
          }
        )
      );
  }
  register(registerPayload: registerPayload): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    return this.httpClient
      .post<JwtAutResponsePayload>(
        this.url + 'signup',
        registerPayload,
        requestOptions
      )
      .pipe(
        map((data) => {
          // console.log('response status: ' + data.status)
          console.log('response: ' + JSON.stringify(data, null, 2));
          // this.localStorageService.store('accessToken', data.accessToken)
          // this.localStorageService.store('refreshToken', data.refreshToken)
          this.localStorageService.store('user', data.user.id);
          this.localStorageService.store('roles', data.user.roles);
          return true;
        })
      );
  }
  logout() {
    return this.httpClient.post(this.url + 'logout', this.logoutPayload);
  }
  getLoginTrial(email: any) {
    return this.httpClient.get(this.url + 'get_login_trial/' + email);
  }

  clearCookies() {
    return this.httpClient.post(this.url + 'clear-cookies', '');
  }
  logoutAll() {
    return this.httpClient.post(this.url + 'logout-all', this.logoutPayload);
  }

  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  detectBrowserVersion() {
    var userAgent = navigator.userAgent,
      tem,
      matchTest =
        userAgent.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];

    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    matchTest = matchTest[2]
      ? [matchTest[1], matchTest[2]]
      : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null)
      matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }
  signUp(registerActorPayload: RegisterActorPayload): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(
        this.url + 'signup',
        registerActorPayload,
        requestOptions
      )
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }
  checkEmailExist(email:any
  ): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'email/' + email
    );
  }
  login_other_device_browser(email:any
    ): Observable<Boolean> {
      return this.httpClient.get<Boolean>(
        this.url + 'login_other_device_browser/' + email
      );
    }
  
}
