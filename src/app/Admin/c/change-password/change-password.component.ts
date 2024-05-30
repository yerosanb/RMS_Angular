import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { createPasswordMatchValidator } from 'src/app/utils_/validators/password_match_validator';
import { createPasswordStrengthValidator } from 'src/app/utils_/validators/validator_password_strength';
import Swal from 'sweetalert2';
import { ChangePasswordPayload } from '../../payloads/change_password_payload';
import { AdminService } from '../../services/admin.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { UtilService } from 'src/app/services/util-service/util.service';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  passwordResetForm!: FormGroup;
  submitted: Boolean = false;
  user_name = '';
  changePasswordPayload: ChangePasswordPayload;

  constructor(
    private adminService: AdminService,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
  ) {
    this.changePasswordPayload = {
      user_id: '',
      oldpassword: '',
      newpassword: '',
      confirmpassword: '',
    };
    this.passwordResetForm = this.formBuilder.group(
      {
        oldpassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
        newpassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          createPasswordStrengthValidator(),
        ]),
        confirmpassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      },
      { validators: createPasswordMatchValidator.MatchValidator }
    );
  }

  ngOnInit(): void {
    console.log('getting username...');
    this.adminService
      .getUserName()
      .subscribe(
        (data: any) => {
          console.log('username...: ' + JSON.stringify(data, null, 3));
          if (data != null) this.user_name = data.name;
        },
        (error: any) => {
          if (error.error.text === 'access-token-expired') {
            console.log('Access-token-expired requesting refresh token...');
            if (
              this.localStorageService.retrieve(
                'refresh_token_requested'
              ) == null
            ) {
              this.utilService.refreshToken().subscribe(
                (data) => {
                  if (data === true) {
                    console.log(
                      'refresh token success re-requesting the actual request'
                    );
                    this.localStorageService.clear(
                      'refresh_token_requested'
                    );
                    //================================================================================
                    this.adminService
                    .getUserName()
                    .subscribe(
                      (data: any) => {
                        if (data != null) this.user_name = data.name;
                         else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Permission',
                            text: 'You are not permitted to perform this action!',
                          });
                        }
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
                  console.log(
                    JSON.stringify(error.error.apierror, null, 2)
                  );
                }
              );
              this.localStorageService.store(
                'refresh_token_requested',
                true
              );
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

  resetPassword() {
    if (this.passwordResetForm.valid) {
      this.changePasswordPayload = this.passwordResetForm.value;
      this.changePasswordPayload.user_id =
        this.localStorageService.retrieve('password-reset');
      this.adminService.resetPassword(this.changePasswordPayload).subscribe(
        (data: any) => {
          if(data == true){
            console.log(JSON.stringify(data, null, 3));
            this.router.navigateByUrl('login')
            Swal.fire({
              icon: 'success',
              title: 'Password Changed Successfully!',
              text: 'Now you can login using your new password.!',
            });
          }
        },
        (error: any) => {
          const incorrect_password_message = document.getElementById(
            'incorrect-password-message'
          );
          const password_mismatch_message = document.getElementById(
            'password-mismatch-message'
          );
          if (error.error.text == 'incorrect-old-password') {
            console.log('error1: ' + error.error.text);
            incorrect_password_message?.classList.add('d-block');
            incorrect_password_message?.classList.remove('d-none');
            password_mismatch_message?.classList.add('d-none');
            password_mismatch_message?.classList.remove('d-block');
          } else if (error.error.text == 'password-mismatch') {
            incorrect_password_message?.classList.remove('d-block');
            incorrect_password_message?.classList.add('d-none');
            password_mismatch_message?.classList.remove('d-none');
            password_mismatch_message?.classList.add('d-block');
            console.log('error2: ' + error.error.text);
          }
          else if (error.error.text === 'access-token-expired') {
            console.log('Access-token-expired requesting refresh token...');
            if (
              this.localStorageService.retrieve(
                'refresh_token_requested'
              ) == null
            ) {
              this.utilService.refreshToken().subscribe(
                (data) => {
                  if (data === true) {
                    console.log(
                      'refresh token success re-requesting the actual request'
                    );
                    this.localStorageService.clear(
                      'refresh_token_requested'
                    );
                    //================================================================================
                    this.adminService.resetPassword(this.changePasswordPayload).subscribe(
                      (data: any) => {
                        if(data == true){
                          console.log(JSON.stringify(data, null, 3));
                          this.router.navigateByUrl('login')
                          Swal.fire({
                            icon: 'success',
                            title: 'Password Changed Successfully!',
                            text: 'Now you can login using your new password.!',
                          });
                        }
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
                  console.log(
                    JSON.stringify(error.error.apierror, null, 2)
                  );
                }
              );
              this.localStorageService.store(
                'refresh_token_requested',
                true
              );
            }
          }
           else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
            console.log('error3: ' + JSON.stringify(error.error.text, null, 4));
          }
        }
      );
      console.log('submit clicked:valid');
    } else {
      this.submitted = true;
      console.log('not valid');
    }
  }
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