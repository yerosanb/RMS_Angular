import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
// import { ReplayRemarkPayload } from 'src/app/User/c/components/replay-remark-payload';
import { CurrencyRequest } from 'src/app/User/payloads/currency-request';
import { RemarkPayload } from 'src/app/User/payloads/remark-payload';
import { ReplayRemarkPayload } from 'src/app/User/payloads/replay-remark-payload';
import { AccountService } from 'src/app/User/services/account.service';
import { RemarkService } from 'src/app/User/services/remark.service';
// import { RemarkService } from 'src/app/User/c/components/remark.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-currency-remark',
  templateUrl: './edit-currency-remark.component.html',
  styleUrls: ['./edit-currency-remark.component.css'],
})
export class EditCurrencyRemarkComponent {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  submitRemarkForm!: FormGroup;
  remarkId!: number;
  userId!: number;

  submitted: boolean = false;
  remark: ReplayRemarkPayload = new ReplayRemarkPayload();
  remarkPayload: RemarkPayload = new RemarkPayload();
  //remarkPayload:RemarkPayload=new RemarkPayload();
  constructor(
    private remarkService: RemarkService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.remark = {
      title: '',
      description: '',
      remarkId: 0,
      userId: 0,

      // files: [],
    };

    this.remarkId = this.route.snapshot.params['id'];
    this.userId = this.localStorageService.retrieve('user');

    this.submitRemarkForm = this.formBuilder.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),

      description: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.getRemarkbyId();
  }

  getRemarkbyId() {
    this.remarkService.getRemarkyId(this.remarkId).subscribe(
      (data) => {
        this.remarkPayload = data;
        console.log(this.remarkPayload);
      },
      (error: any) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (
            this.localStorageService.retrieve('refresh_token_requested') == null
          ) {
            this.utilService.refreshToken().subscribe(
              (data: any) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.remarkService.getRemarkyId(this.remarkId).subscribe(
                    (data) => {
                      this.remarkPayload = data;
                      console.log(this.remarkPayload);
                    },
                    (error: any) => {
                      if (error.error.text === 'access-token-expired') {
                        console.log('refresh token expired.');
                        this.SwalSessionExpired.fire();
                        this._refreshTokenExpired();
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        });
                        console.log(
                          JSON.stringify(error.error.apierror, null, 2)
                        );
                      }
                    }
                  );
                  //================================================================================
                } else {
                  console.log('refresh token expired.');
                  this.SwalSessionExpired.fire();
                  this._refreshTokenExpired();
                }
              },
              (error: any) => {
                console.log('error refreshing access token');
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
                console.log(JSON.stringify(error.error.apierror, null, 2));
              }
            );
            this.localStorageService.store('refresh_token_requested', true);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
          console.log(JSON.stringify(error.error.apierror, null, 2));
        }
      }
    );
  }
  submitremarkReplay() {
    this.submitted = true;
    if (this.submitRemarkForm.valid) {
      this.remark.title = this.submitRemarkForm.get('title')?.value;
      this.remark.description = this.submitRemarkForm.get('description')?.value;
      (this.remark.remarkId = this.remarkId),
        (this.remark.userId = this.userId),
        console.log(this.remark);
      this.updateAccountRemark(this.remark);
    }
  }
  updateAccountRemark(replayRemarkPayload: ReplayRemarkPayload) {
    this.remarkService
      .updateRemark(this.remarkId, replayRemarkPayload)
      .subscribe(
        (data) => {
          //console.log(data);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Successfully updated!',
          });
          this.router.navigate(['user/view-currency-remark']);
        },
        (error: any) => {
          if (error.error.text === 'access-token-expired') {
            console.log('Access-token-expired requesting refresh token...');
            if (
              this.localStorageService.retrieve('refresh_token_requested') ==
              null
            ) {
              this.utilService.refreshToken().subscribe(
                (data) => {
                  if (data === true) {
                    console.log(
                      'refresh token success re-requesting the actual request'
                    );
                    this.localStorageService.clear('refresh_token_requested');
                    //================================================================================
                    this.remarkService
                      .updateRemark(this.remarkId, replayRemarkPayload)
                      .subscribe(
                        (data) => {
                          //console.log(data);
                          Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Successfully updated!',
                          });
                          this.router.navigate(['user/view-currency-remark']);
                        },
                        (error: any) => {
                          if (error.error.text === 'access-token-expired') {
                            console.log('refresh token expired.');
                            this.SwalSessionExpired.fire();
                            this._refreshTokenExpired();
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Something went wrong!',
                            });
                            console.log(
                              JSON.stringify(error.error.apierror, null, 2)
                            );
                          }
                        }
                      );
                    //================================================================================
                  } else {
                    console.log('refresh token expired.');
                    this.SwalSessionExpired.fire();
                    this._refreshTokenExpired();
                  }
                },
                (error: any) => {
                  console.log('error refreshing access token');
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                  });
                  console.log(JSON.stringify(error.error.apierror, null, 2));
                }
              );
              this.localStorageService.store('refresh_token_requested', true);
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
            console.log(JSON.stringify(error.error.apierror, null, 2));
          }
        }
      );
  }

  //FUNCTIONS
  _refreshTokenExpired() {
    console.log('logging out');

    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          delay(3500);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
        } else {
          console.log('login failed 001');
        }
      },
      (error) => {
        console.log(
          'Error: ' + JSON.stringify(error.error.apierror.message, null, 2)
        );
      }
    );
  }
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
