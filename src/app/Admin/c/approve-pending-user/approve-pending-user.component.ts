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
import Swal from 'sweetalert2';
import { CheckEmailExistPayload } from '../../payloads/admin_check_email_exist_payload';
import { RegisterActorPayload } from '../../payloads/register_actor_payload';
import { Roles } from '../../payloads/roles_payload';
import { AdminService } from '../../services/admin.service';
import { phoneNumberValidator } from '../../validators/phone_number_validator';
import { MultiDropdownRolesComponent } from './multi-dropdown-role/multi-dropdown-roles.component';
@Component({
  selector: 'app-approve-pending-user',
  templateUrl: './approve-pending-user.component.html',
  styleUrls: ['./approve-pending-user.component.css']
})
export class ApprovePendingUserComponent   implements OnInit {
  @ViewChild(MultiDropdownRolesComponent)
  componentMultiRoles!: MultiDropdownRolesComponent;
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalRegisterUser')
  public readonly SuccessSwalRegisterUser!: SwalComponent;
  @ViewChild('SuccessSwalUpdateUser')
  public readonly SuccessSwalUpdateUser!: SwalComponent;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  user_id: any;
  user_role: any;
  slect_role: boolean = false;

  //form and other
  registerForm!: FormGroup;
  submitted: boolean = false;
  emailChecked: boolean = false;
  registerActorPayload: RegisterActorPayload;
  checkEmailExistPayload!: CheckEmailExistPayload;
  roles!: Roles[];
  role_selected!: string;
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.checkEmailExistPayload = {
      email: '',
    };
    this.registerActorPayload = {
      id: null,
      firstname: '',
      middlename: '',
      lastname: '',
      gender: '',
      email: '',
      phonenumber: '',
      role: '',
    };
    // this.role_selected = '1';

    this.registerForm = this.formBuilder.group(
      {
        firstname: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z]*'),
        ]),
        middlename: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z]*'),
        ]),
        lastname: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z]*'),
        ]),
        gender: new FormControl(''),
        email: new FormControl('', [
          Validators.required,
          Validators.maxLength(320),
          Validators.email,
        ]),
        phonenumber: new FormControl('', [Validators.required]),
        // role: new FormControl('', [Validators.required]),
      },
      { validators: phoneNumberValidator.MatchValidator }
    );
  }
  ngOnInit(): void {
    this.getAllRoles();
    if (this.user_id != null) {
      this.getUser();
    }
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  rrr: any;
  getUser() {
    this.adminService.getPendingUserById(this.user_id).subscribe(
      (data: any) => {
        this.user = data;
        this.registerForm.patchValue(data);
      },
      (error: any) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (
            this.localStorageService.retrieve('refresh_token_requested') == null
          ) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.adminService.getUser(this.user_id).subscribe(
                    (data: any) => {
                      this.registerForm.patchValue(data);
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

  getAllRoles() {
    this.adminService.getAllRoles().subscribe(
      (data) => {
        if (data != null) {
          console.log('the rolles: ' + JSON.stringify(data, null, 2));
          this.roles = data;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Permission',
            text: 'You are not permitted to perform this action!',
          });
        }
      },

      (error) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (
            this.localStorageService.retrieve('refresh_token_requested') == null
          ) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  // ========================================================
                  this.adminService.getAllRoles().subscribe(
                    (data) => {
                      if (data != null) {
                        console.log(JSON.stringify(data, null, 2));
                        this.roles = data;
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Permission',
                          text: 'You are not permitted to perform this action!',
                        });
                      }
                    },
                    (error) => {
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
                  // ========================================================
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

  onSubmit() {
    if (
      this.registerForm.valid &&
      this.emailChecked &&
      this.componentMultiRoles.selectedItems.length > 0
    ) {
      this.registerActorPayload = this.registerForm.value;
 
      // console.log('role: ' + role + ':::' + JSON.stringify(role, null, 3));
      var role_ids: any[] = [];
      for (var i = 0; i < this.componentMultiRoles.selectedItems.length; i++) {
        console.log(
          'selected item: ' + this.componentMultiRoles.selectedItems[i].id
        );
        role_ids.push(
          this.componentMultiRoles.selectedItems[i].id
            .toLocaleString()
            .replace(',', '')
        );
      }
      // console.log(role_ids)
      this.registerActorPayload.role = role_ids.toLocaleString();
     this.registerActor(this.registerActorPayload);
    } else
    {console.log("------------------- no"+ this.componentMultiRoles.selectedItems.length)
      this.submitted = true;}
  }

  registerActor(registerActorPayload: RegisterActorPayload) {
    console.log(
      'Payload: ' + JSON.stringify(this.registerActorPayload, null, 2)
    );
    this.adminService.register(registerActorPayload).subscribe(
      async (data) => {
        if (data == true) {
          this.removePendingUser(this.user_id);
          this.SuccessSwalRegisterUser.fire();
          this.router.navigateByUrl(
            'User-Approver/pending-users');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Permission',
            text: 'You are not permitted to perform this action!',
          });
        }
      },
      (error) => {
        console.log('the error: ' + JSON.stringify(error, null, 3));
        if (error.error.text === 'user-is-logged-in') {
          Swal.fire({
            icon: 'warning',
            title: 'You cannot update the Email of the user.',
            text: 'You cannot update user email while the user is logged in. Please try again when the user is logged out of all devices.',
          });
        } else if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (
            this.localStorageService.retrieve('refresh_token_requested') == null
          ) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.adminService.register(registerActorPayload).subscribe(
                    async (data) => {
                      if (data == true) {
                        this.removePendingUser(this.user_id);
                        this.SuccessSwalRegisterUser.fire();
                        this.router.navigateByUrl(
                          'User-Approver/pending-users'

                        );

                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Permission',
                          text: 'You are not permitted to perform this action!',
                        });
                      }
                    },
                    (error) => {
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
                          'it is from here...' +
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
                console.log('it is here 2' + JSON.stringify(error, null, 2));
              }
            );
            this.localStorageService.store('refresh_token_requested', true);
          }
        } else {
          if (error.error.text == 'cannot-send-password-to-the-user') {
            Swal.fire({
              icon: 'warning',
              title: 'failed to send the password to the user!',
              text: 'The system could not send the password to the user. Please resend the password from users page by clicking on reset password button.',
            });
            this.registerForm.reset();
            this.registerForm.controls['gender'].setValue('Male');
            this.submitted = false;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
            console.log('it is here 1' + JSON.stringify(error, null, 2));
          }
          console.log(JSON.stringify(error, null, 2));
        }
      }
    );
  }
    removePendingUser(id:any)
    {
      this.adminService
      .approve_pending_user(id)
      .subscribe(
        (data: Boolean) => {
          if (data == true) {
          } else {
            Swal.fire({
              icon: 'error',
              title: 'permission',
              text: 'permission denied"!',
            });

          }
        },
        (error: any) => {
          if (error.error.text === 'access-token-expired') {
            console.log(
              'Access-token-expired requesting refresh token...'
            );
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
                      .approve_pending_user(
                       id
                      )
                      .subscribe(
                        (data: Boolean) => {
                          if (data == true) {
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'permission',
                              text: 'permission denied"!',
                            });

                          }
                        },
                        (error: any) => {
                          if (
                            error.error.text === 'access-token-expired'
                          ) {
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
                              JSON.stringify(
                                error.error.apierror,
                                null,
                                2
                              )
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
  checkEmailExist(email: string) {
    this.emailChecked = true;
    this.checkEmailExistPayload.email = email;
    if (
      this.checkEmailExistPayload.email !== null &&
      this.checkEmailExistPayload.email !== ''
    ) {
      this.adminService.checkEmailExist(this.checkEmailExistPayload).subscribe(
        (data: Boolean) => {
          document.getElementById('valid-email')?.classList.remove('d-none');
          document.getElementById('invalid-email')?.classList.remove('d-none');
          if (
            data === false ||
            (this.user_id != null &&
              this.registerForm.controls['email'].value == this.user.email)
          ) {
            document.getElementById('valid-email')?.classList.remove('d-block');
            document.getElementById('valid-email')?.classList.add('d-none');
            document.getElementById('invalid-email')?.classList.add('d-block');
            document
              .getElementById('invalid-email')
              ?.classList.remove('d-none');
            this.emailChecked = true;
          } else {
            document.getElementById('valid-email')?.classList.remove('d-none');
            document.getElementById('valid-email')?.classList.add('d-block');
            document.getElementById('invalid-email')?.classList.add('d-none');
            document
              .getElementById('invalid-email')
              ?.classList.remove('d-block');
            this.emailChecked = false;
          }
          console.log('check email exist response: ' + data);
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
                    if (
                      this.checkEmailExistPayload.email !== null &&
                      this.checkEmailExistPayload.email !== ''
                    ) {
                      this.adminService
                        .checkEmailExist(this.checkEmailExistPayload)
                        .subscribe(
                          (data: Boolean) => {
                            document
                              .getElementById('valid-email')
                              ?.classList.remove('d-none');
                            document
                              .getElementById('invalid-email')
                              ?.classList.remove('d-none');
                            if (data === false) {
                              document
                                .getElementById('valid-email')
                                ?.classList.remove('d-block');
                              document
                                .getElementById('valid-email')
                                ?.classList.add('d-none');
                              document
                                .getElementById('invalid-email')
                                ?.classList.add('d-block');
                              document
                                .getElementById('invalid-email')
                                ?.classList.remove('d-none');
                              this.emailChecked = true;
                            } else {
                              document
                                .getElementById('valid-email')
                                ?.classList.remove('d-none');
                              document
                                .getElementById('valid-email')
                                ?.classList.add('d-block');
                              document
                                .getElementById('invalid-email')
                                ?.classList.add('d-none');
                              document
                                .getElementById('invalid-email')
                                ?.classList.remove('d-block');
                              this.emailChecked = false;
                            }
                            console.log('check email exist response: ' + data);
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
                    } else {
                      document
                        .getElementById('invalid-email')
                        ?.classList.add('d-none');
                      document
                        .getElementById('valid-email')
                        ?.classList.add('d-none');
                      this.emailChecked = false;
                      console.log('email is empty:::::::::::::::::::::');
                    }
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
    } else {
      document.getElementById('invalid-email')?.classList.add('d-none');
      document.getElementById('valid-email')?.classList.add('d-none');
      this.emailChecked = false;
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

