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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MultiDropdownRoleComponent } from './multi-dropdown-role/multi-dropdown-role.component';
@Component({
  selector: 'app-register-actor',
  templateUrl: './register-actor.component.html',
  styleUrls: ['./register-actor.component.css'],
})
export class RegisterActorComponent implements OnInit {
  @ViewChild(MultiDropdownRoleComponent)
  componentMultiRoles!: MultiDropdownRoleComponent;
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
    this.user_role = this.activatedRoute.snapshot.paramMap.get('role');
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
        gender: new FormControl('Male'),
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

    // this.dropdownSettings:IDropdownSettings = {
    //   singleSelection: false,
    //   idField: 'item_id',
    //   textField: 'item_text',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  rrr: any;
  getUser() {
    this.adminService.getUser(this.user_id).subscribe(
      (data: any) => {
        this.user = data;
        console.log('Result user: ' + JSON.stringify(data, null, 3));
        this.registerForm.patchValue(data);
        // this.registerForm.controls['role'].setValue(data.role, {
        //   onlySelf: true,
        // });
        // this.componentMultiRoles.selectedItems = data.role, {
        //   onlySelf: true,
        // };
        // var rr = null;
        console.log('the length of roles: ' + data.roles.length);
        let tmp: any[] = [];
        for (let i = 0; i < data.roles.length; i++) {
          // this.rrr.push(data.roles[i].name)
          if(data.roles[i].name=="User")
          data.roles[i].name="PAS"
          tmp.push({ id: data.roles[i].id, name: data.roles[i].name });
        }
        this.componentMultiRoles.selectedItems = tmp;
        console.log(
          'selected items: ' +
            JSON.stringify(this.componentMultiRoles.selectedItems)
        );
        // this.componentMultiRoles.dropdownList
        // this.role_selected = '2';
        // console.log('selected: ' + data.role);
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
    // var role_ids: any [] = []
    // if (role != undefined)
    //   this.registerActorPayload.role = role!.id.toLocaleString();
    // for(var i = 0; i < this.componentMultiRoles.selectedItems.length; i++){
    //   role_ids.push(this.componentMultiRoles.selectedItems[i].id)
    // }
    // console.log(role_ids)
    // console.log('selected values: ' + JSON.stringify(this.componentMultiRoles.selectedItems[0].id, null, 4))
    // console.log('selected values: ' + JSON.stringify(this.componentMultiRoles.selectedItems[1].id, null, 4))
    console.log(
      JSON.stringify(this.componentMultiRoles.selectedItems, null, 3)
    );
    if (
      this.registerForm.valid &&
      this.emailChecked &&
      this.componentMultiRoles.selectedItems.length > 0
    ) {
      this.registerActorPayload = this.registerForm.value;
      console.log(
        'values' + JSON.stringify(this.registerActorPayload, null, 2)
      );
      if (this.user_id != null) this.registerActorPayload.id = this.user_id;
      // this.roles
      // var role = this.roles.find((role) => {
      //   return role.name === this.registerActorPayload.role;
      // });
      console.log(
        'roles: ' +
          this.registerActorPayload.role +
          ':::' +
          JSON.stringify(this.roles, null, 3)
      );
      // console.log('role: ' + role + ':::' + JSON.stringify(role, null, 3));
      var role_ids: any[] = [];
      // if (role != undefined)
      //   this.registerActorPayload.role = role!.id.toLocaleString();
      console.log('selected items: ' + this.componentMultiRoles.selectedItems);
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
      if (this.registerActorPayload.role != null) {
        this.slect_role = true;
      } else {
        this.slect_role = false;
      }
      console.log('yyyyyyyyyy' + this.slect_role);
      this.registerActor(this.registerActorPayload);
    } else this.submitted = true;
  }

  registerActor(registerActorPayload: RegisterActorPayload) {
    console.log(
      'Payload: ' + JSON.stringify(this.registerActorPayload, null, 2)
    );
    this.adminService.register(registerActorPayload).subscribe(
      async (data) => {
        if (data == true) {
          this.SuccessSwalRegisterUser.fire();

          if (this.user_id != null) {
            this.SuccessSwalUpdateUser.fire();
            this.router.navigateByUrl('/admin/users');
            // console.log('update success: ' + data);
          } else {
            this.SuccessSwalRegisterUser.fire();
            this.registerForm.reset();
            this.componentMultiRoles.selectedItems = [];
            this.registerForm.controls['gender'].setValue('Male');
            this.submitted = false;
            console.log('register success: ' + data);
          }
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
                        this.SuccessSwalUpdateUser.fire();
                        if (this.user_id != null) {
                          this.router.navigateByUrl('/admin/users');
                          // console.log('update success: ' + data);
                        } else {
                          this.SuccessSwalRegisterUser.fire();
                          this.registerForm.reset();
                          this.componentMultiRoles.selectedItems = [];
                          this.registerForm.controls['gender'].setValue('Male');
                          // this.registerForm.get('gender')!.value = 'Male'
                          this.submitted = false;
                          console.log('register success: ' + data);
                        }
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

/*
//HTML
<swal
  #SwalSessionExpired
  title="Warning"
  text="Your session has expired! please login to continue."
  icon="warning"
  [showCancelButton]="false"
  [showConfirmButton]="false"
  [timer]="3500"
  [focusCancel]="true"
>
</swal>
================================================================================================================
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

================================================================================================================
  if (error.error.text === 'access-token-expired') {
    console.log('Access-token-expired requesting refresh token...');
    if (this.localStorageService.retrieve('refresh_token_requested') ==
                null){
      this.utilService.refreshToken().subscribe(
        (data) => {
          if (data === true) {
            console.log(
              'refresh token success re-requesting the actual request'
            );
            this.localStorageService.clear('refresh_token_requested');
            //================================================================================

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
========================================================================================================
  //AFTER TOKEN: REFRESH IF ERROR AGAIN

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
===========================================================================================================

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

  function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
===================================================================================================
    this.adminService.getUser(this.user_id).subscribe(
      (data: any) => {
        this.registerForm = data
      },
      (error: any) => {}
    );
*/
