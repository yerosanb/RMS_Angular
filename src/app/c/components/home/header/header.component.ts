import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Location } from 'ngx-bootstrap/utils/facade/browser';
import { LocalStorageService } from 'ngx-webstorage';
import { fromEvent, merge, switchMap, timer } from 'rxjs';
import { ChangePasswordPayload } from 'src/app/Admin/payloads/change_password_payload';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { AccountPayload } from 'src/app/User/payloads/account-payload';
import { AccountService } from 'src/app/User/services/account.service';

import { createPasswordMatchValidator } from 'src/app/utils_/validators/password_match_validator';
import { createPasswordStrengthValidator } from 'src/app/utils_/validators/validator_password_strength';
import Swal from 'sweetalert2';

const executeOnIdle = (that: any, idleThreshold: number) => {
  const userActivity$ = merge(
    fromEvent(window, 'mousemove'),
    fromEvent(window, 'keydown')
  );
  const idleTimer$ = timer(idleThreshold);
  const idle$ = userActivity$.pipe(
    switchMap(() => idleTimer$),
    // startWith(idleTimer$)
  );
  idle$.subscribe(() => {
    if (that.localStorageService.retrieve('roles') != null)
      that.logout()
  });
};

declare var window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  nightMode: Boolean = false;
  full_name: any = '';
  role: any = '';
  password_change_modal: any;

  // current_reconciliation_type: string = "RTGS 103";

  accounts!: AccountPayload[];
  selected_account: any;
  selected_account_formatted!: any[];
  selected_account_full: any;
  //modal
  setAccountModal: any;
  passwordChangeForm!: FormGroup;
  submitted: Boolean = false;
  stock: Boolean = false;
  user_name = '';
  changePasswordPayload!: ChangePasswordPayload;

  // idleThreshold = 6000; // 10 minutes
  idleThreshold = 600000; // 10 minutes

  roles: any[] = [];
  constructor(
    public authService: AuthService,
    private router: Router,
    public localStorageService: LocalStorageService,
    private utilService: UtilService,
    private adminService: AdminService,
    private accountService: AccountService,
    private formBuilder: FormBuilder // private breakpointObserver: BreakpointObserver
  ) {
    this.changePasswordPayload = {
      user_id: '',
      oldpassword: '',
      newpassword: '',
      confirmpassword: '',
    };
    this.passwordChangeForm = this.formBuilder.group(
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
  isAdmin(item: any) {
    return item.name.toLowerCase() === 'admin';
  }

  isApprover(item: any) {
    return item.name.toLowerCase() === 'approver';
  }
  isFixedAsset(item: any) {
    return item.name.toLowerCase() === 'fixedasset';
  }
  ngOnInit(): void {
    for (const item of this.localStorageService.retrieve('roles') as any[]) {
      if (!this.isAdmin(item) && !this.isApprover(item)) {
        if (this.isFixedAsset(item)) {
          this.roles.push(item)
          // this.roles.push('Stock');
          this.stock=true;
        } else {
          this.roles.push(item)
          this.stock=false;
        }
      }
    }
    for (let i = 0; i < this.roles.length; i++) {
      console.log("Role=====" + this.roles)
    }


    // if(this.localStorageService.retrieve('user') != null)
    // this.breakpointObserver
    //   .observe(['(min-width: 400px)'])
    //   .subscribe((state: BreakpointState) => {
    //     if (state.matches) {
    //       this.showContainer = true;
    //     } else {
    //       this.showContainer = false;
    //     }
    //   });
    if (this.authService.isUser()||this.authService.isIssueAccount()) {
      this.populateAccount();
    }
    this.setAccountModal = new window.bootstrap.Modal(
      document.getElementById('setAccountModal')
    );
    this.password_change_modal = new window.bootstrap.Modal(
      document.getElementById('modal-change-password')
    );
    for (const item of this.roles) {
      if (!this.isAdmin(item) && !this.isApprover(item)) {
        console.log(item);
      }
    }
    if (
      this.localStorageService.retrieve('theme') == null ||
      this.localStorageService.retrieve('theme').trim() == 'light'.trim()
    )
      this.nightMode = true;
    else this.nightMode = false;
    this.toggleNightMode();
    this.adminService.getUserName().subscribe(
      (data: any) => {
        console.log('username...: ' + JSON.stringify(data, null, 3));
        if (data != null) this.full_name = data.name;
      },
      (error) => {
        console.log('error is...: ' + JSON.stringify(error, null, 3));
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
                  this.adminService.getUserName().subscribe(
                    (data: any) => {
                      console.log(
                        'username...: ' + JSON.stringify(data, null, 3)
                      );
                      if (data != null) this.full_name = data.name;
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
    if (
      JSON.parse(
        JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
      ).length > 1
    ) {
      console.log('it is true');
      for (let result of JSON.parse(
        JSON.stringify(this.localStorageService.retrieve('roles'), null, 2)
      ))
        if (this.role == '') {
          this.role = (result.name == 'User' ? 'PAS' : result.name);
        } else {
          this.role =
            this.role + ', ' + (result.name == 'User' ? 'PAS' : result.name);
        }
    } else {
      console.log('it is not true');
      this.role = JSON.parse(
        JSON.stringify(this.localStorageService.retrieve('roles'))
      )[0].name;
      if(this.role=='User')
      this.role='PAS';
    }
    executeOnIdle(this, this.idleThreshold);
  }
  populateSelectedAccount() {
    console.log('populating selected account');
    this.accountService.getSelectedAccount().subscribe(
      (data: any) => {
        console.log('SUCCESS DATA: ' + JSON.stringify(data, null, 8));
        // this.registerForm.controls['role'].setValue(data.role, {
        //   onlySelf: true,
        // });
        // {{account.code}}-{{ account.name }} --> {{account.currency}}
        var s_account = this.accounts.find((account) => {
          return account.id === data;
        });
        this.selected_account_full = s_account;
        this.selected_account =
          s_account?.code +
          '-' +
          s_account?.name +
          ' --> ' +
          s_account?.currency;

        var that = this;
        var counter = 0;
        this.accounts.forEach(function (ac) {
          // that.selected_account_formatted.push(ac?.code + '-' + ac?.name + ' --> ' + ac?.currency)
          that.accounts.at(counter++)!.description =
            ac?.code + '-' + ac?.name + ' --> ' + ac?.currency;
        });
        console.log('the description: ' + JSON.stringify(this.accounts));
        console.log(
          'account selected: ' + JSON.stringify(this.accounts, null, 6)
        );
        console.log(
          'account selected: ' + JSON.stringify(this.selected_account, null, 6)
        );
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
                  //================================================================================
                  this.accountService.getSelectedAccount().subscribe(
                    (data: any) => {
                      console.log(
                        'SUCCESS DATA: ' + JSON.stringify(data, null, 8)
                      );
                      // this.registerForm.controls['role'].setValue(data.role, {
                      //   onlySelf: true,
                      // });
                      // {{account.code}}-{{ account.name }} --> {{account.currency}}
                      var s_account = this.accounts.find((account) => {
                        return account.id === data;
                      });
                      this.selected_account_full = s_account;
                      this.selected_account =
                        s_account?.code +
                        '-' +
                        s_account?.name +
                        ' --> ' +
                        s_account?.currency;

                      var that = this;
                      var counter = 0;
                      this.accounts.forEach(function (ac) {
                        // that.selected_account_formatted.push(ac?.code + '-' + ac?.name + ' --> ' + ac?.currency)
                        that.accounts.at(counter++)!.description =
                          ac?.code + '-' + ac?.name + ' --> ' + ac?.currency;
                      });
                      console.log(
                        'the description: ' + JSON.stringify(this.accounts)
                      );
                      console.log(
                        'account selected: ' +
                        JSON.stringify(this.accounts, null, 6)
                      );
                      console.log(
                        'account selected: ' +
                        JSON.stringify(this.selected_account, null, 6)
                      );
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
  populateAccount() {
    this.accountService.getAllAccounts().subscribe(
      (data: any) => {
        console.log('SUCCESS DATA Accounts: ' + JSON.stringify(data, null, 8));
        this.accounts = data;
        this.populateSelectedAccount();
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
                  //================================================================================
                  this.accountService.getAllAccounts().subscribe(
                    (data: any) => {
                      console.log(
                        'SUCCESS DATA Accounts: ' +
                        JSON.stringify(data, null, 8)
                      );
                      this.accounts = data;
                      this.populateSelectedAccount();
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

  applyAccountChange() {
    console.log(this.selected_account);
    var s_account = this.accounts.find((account) => {
      return account.description === this.selected_account;
    });
    this.accountService.changeUserWorkspaceAccount(s_account?.id).subscribe(
      (data: any) => {
        console.log(JSON.stringify(data, null, 3));
        // this.populateSelectedAccount()
        this.selected_account_full = s_account;
        this.closeSetAccountModal();
        console.log('here...');
        this.goToPage('/home');
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
                  //================================================================================
                  this.accountService
                    .changeUserWorkspaceAccount(s_account?.id)
                    .subscribe(
                      (data: any) => {
                        console.log(JSON.stringify(data, null, 3));
                        // this.populateSelectedAccount()
                        this.selected_account_full = s_account;
                        this.closeSetAccountModal();
                        console.log('here...');
                        this.goToPage('/home');
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
    console.log(s_account?.id);
  }

  // lockScreen(){
  //   this.router.navigateByUrl('lockScreen')
  // }
  // changeAccount() {
  // this.openModal()
  // Swal.fire({
  //   title: 'Change the account of the workspace.',
  //   text: 'If you change the account for the workspace all the activities you perform will be performed on the account you selected.',
  //   icon: 'info',
  //   showCancelButton: true,
  //   confirmButtonColor: '#d33',
  //   cancelButtonColor: '#3085d6',
  //   confirmButtonText: 'Delete',
  // }).then((result) => {
  //   if (result.isConfirmed) {
  //   }
  // });
  // }
  logout() {
    this.authService.logout().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
        } else {
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
          window.location.reload();
        }
        // this.router.navigateByUrl('/register-success');
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
                  //================================================================================
                  this.authService.logout().subscribe(
                    (data) => {
                      if (data) {
                        console.log(data);
                        this.router.navigateByUrl('/login');
                        this.localStorageService.clear('user');
                        this.localStorageService.clear('roles');
                      } else {
                        // Swal.fire({
                        //   icon: 'error',
                        //   title: 'Permission',
                        //   text: 'You are not permitted to perform this action!',
                        // });
                        this.localStorageService.clear('user');
                        this.localStorageService.clear('roles');
                        window.location.reload();

                      }
                    },
                    (error) => {
                      if (error.error.text === 'access-token-expired') {
                        console.log('refresh token expired.');
                        this.logout_refreshTokenExpired();
                        this.router.navigateByUrl('/login');
                        this.localStorageService.clear('user');
                        this.localStorageService.clear('roles');
                      } else {
                        this.router.navigateByUrl('/login');
                        this.localStorageService.clear('user');
                        this.localStorageService.clear('roles');
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        });
                        console.log(
                          JSON.stringify(error.error.apierror, null, 2)
                        );
                      }
                      // console.log(
                      //   'Error: ' + JSON.stringify(error.error.apierror.message, null, 2),
                      // )
                      // console.log('login failed 002: ' + JSON.stringify(error, null, 2))
                    }
                  );
                  //================================================================================
                } else {
                  console.log('refresh token expired.');
                  this.logout_refreshTokenExpired();
                  this.router.navigateByUrl('/login');
                  this.localStorageService.clear('user');
                  this.localStorageService.clear('roles');
                }
              },
              (error: any) => {
                console.log('error refreshing access token');
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
                this.router.navigateByUrl('/login');
                this.localStorageService.clear('user');
                this.localStorageService.clear('roles');
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
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
          console.log(JSON.stringify(error.error.apierror, null, 2));
        }
        // if (error.error.apierror.message == 'bad credentials') {
        //   this.logout_refreshTokenExpired();
        // } else {
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Oops...',
        //     text: 'Something went wrong!',
        //   });
        // }

        // console.log(
        //   'Error: ' + JSON.stringify(error.error.apierror.message, null, 2),
        // )
        // console.log('login failed 002: ' + JSON.stringify(error, null, 2))
      }
    );
  }

  changeMyPassword() {
    this.password_change_modal.show();
  }
  changePassword() {
    if (this.passwordChangeForm.valid) {
      this.changePasswordPayload = this.passwordChangeForm.value;
      this.changePasswordPayload.user_id =
        this.localStorageService.retrieve('password-change');
      this.adminService.changePassword(this.changePasswordPayload).subscribe(
        (data: any) => {
          if (data == true) {
            // console.log(JSON.stringify(data, null, 3));
            // this.router.navigateByUrl('login')
            this.password_change_modal.hide();
            Swal.fire({
              icon: 'success',
              title: 'Password Change',
              text: 'Changed your password successfully.',
            });
          }
        },
        (error: any) => {
          if (error.error.text == 'incorrect-old-password') {
            Swal.fire({
              icon: 'error',
              title: 'Incorrect old Password...',
              text: 'Please enter correct old password !',
            });
          } else if (error.error.text == 'password-mismatch') {
            Swal.fire({
              icon: 'error',
              title: ' Mismatch...',
              text: 'Please enter the correct confirmation !',
            });
          } else if (error.error.text === 'access-token-expired') {
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
                    this.adminService
                      .changePassword(this.changePasswordPayload)
                      .subscribe(
                        (data: any) => {
                          if (data == true) {
                            console.log(JSON.stringify(data, null, 3));
                            this.router.navigateByUrl('login');
                            this.password_change_modal.hide();
                            Swal.fire({
                              icon: 'success',
                              title: 'Password Change',
                              text: 'Changed your password successfully.',
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
  logoutAll() {
    this.authService.logoutAll().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Permission',
            text: 'You are not permitted to perform this action!',
          });
        }
        // this.router.navigateByUrl('/register-success');
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
                  //================================================================================
                  this.authService.logoutAll().subscribe(
                    (data) => {
                      if (data) {
                        console.log(data);
                        this.router.navigateByUrl('/login');
                        this.localStorageService.clear('user');
                        this.localStorageService.clear('roles');
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
                        this.logout_refreshTokenExpired();
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
                      // console.log(
                      //   'Error: ' + JSON.stringify(error.error.apierror.message, null, 2),
                      // )
                      // console.log('login failed 002: ' + JSON.stringify(error, null, 2))
                    }
                  );
                  //================================================================================
                } else {
                  console.log('refresh token expired.');
                  this.logout_refreshTokenExpired();
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
        // if (error.error.apierror.message == 'bad credentials') {
        //   this.logout_refreshTokenExpired();
        // } else {
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Oops...',
        //     text: 'Something went wrong!',
        //   });
        // }

        // console.log(
        //   'Error: ' + JSON.stringify(error.error.apierror.message, null, 2),
        // )
        // console.log('login failed 002: ' + JSON.stringify(error, null, 2))
      }
    );
  }

  changeOverflow() {
    const body_all = document.body;
    const left_side_menu_container = document.getElementById(
      'leftside-menu-container'
    );
    const c_container = document.getElementById('c_container');

    if (!body_all.hasAttribute('data-leftbar-compact-mode')) {
      console.log('it is condensed.');
      left_side_menu_container?.classList.remove('overflow_x');
      c_container?.classList.add('d-none');
      c_container?.classList.remove('d-block');
    } else {
      left_side_menu_container?.classList.add('overflow_x');
      c_container?.classList.add('d-block');
      c_container?.classList.remove('d-none');
      console.log('it is expanded.');
    }
  }
  // w: number = 0
  toggleNightMode() {
    const tumbler = document.getElementById('tumbler');

    if (this.nightMode) {
      tumbler?.classList.remove('tumbler_transform');
      this.nightMode = false;

      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      // link.id   = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'assets/template_assets/css/app.min.css';
      link.media = 'all';
      head.appendChild(link);
      if (this.localStorageService.retrieve('theme') != null)
        this.localStorageService.clear('theme');
      this.localStorageService.store('theme', 'light');
    } else {
      tumbler?.classList.add('tumbler_transform');
      console.log('it is false');
      this.nightMode = true;

      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      // link.id   = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'assets/template_assets/css/app-dark.min.css';
      link.media = 'all';
      head.appendChild(link);
      if (this.localStorageService.retrieve('theme') != null)
        this.localStorageService.clear('theme');
      this.localStorageService.store('theme', 'dark');
    }

    // if (this.w === 0) {
    // var head = document.getElementsByTagName('head')[0]
    // var link = document.createElement('link')
    // // link.id   = cssId;
    // link.rel = 'stylesheet'
    // link.type = 'text/css'
    // link.href = 'assets/template_assets/css/app-dark.min.css'
    // link.media = 'all'
    // head.appendChild(link)
    // this.w = 1

    // var linkNode = document.getElementsByTagName('link')[1]
    // linkNode.parentNode?.removeChild(linkNode)
    // console.log('done!!01')
    // } else {
    // var head = document.getElementsByTagName('head')[0]
    // var link = document.createElement('link')
    // // link.id   = cssId;
    // link.rel = 'stylesheet'
    // link.type = 'text/css'
    // link.href = 'assets/template_assets/css/app.min.css'
    // link.media = 'all'
    // head.appendChild(link)
    // this.w = 0
    // console.log('done!!02')
    // }
  }

  logout_refreshTokenExpired() {
    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
        } else {
          console.log('login failed 001');
        }
      },
      (error) => {
        this.router.navigateByUrl('/login');
        this.localStorageService.clear('user');
      }
    );
  }
  goToPage(pageName: string) {
    // this.router.navigate([{ outlets: { inner_outlet: [`${pageName}`] } }])
    this.router.navigate([`${pageName}`]);
  }

  openSetAccountModal() {
    this.setAccountModal.show();

    // this.setAccountForm.controls['account'].setValue(this.selected_account.name, {
    //   onlySelf: true,
    // });
  }

  closeSetAccountModal() {
    this.setAccountModal.hide();
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
