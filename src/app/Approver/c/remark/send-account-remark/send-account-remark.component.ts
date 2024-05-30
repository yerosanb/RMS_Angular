import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { Remark } from 'src/app/Approver/payloads/remark';
import { ApproverService } from 'src/app/Approver/services/approver.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-send-account-remark',
  templateUrl: './send-account-remark.component.html',
  styleUrls: ['./send-account-remark.component.css']
})
export class SendAccountRemarkComponent implements OnInit {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalSendRemark')
  public readonly SuccessSwalSendRemark!: SwalComponent;
  request_id: any;

  //form and other
  registerForm!: FormGroup;
  submitted: boolean = false;
  emailChecked: boolean = false;
  remark!: Remark;
  user: any

  constructor(
    private formBuilder: FormBuilder,
    private approverService: ApproverService,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.request_id = this.activatedRoute.snapshot.paramMap.get('id');
   
    this.remark = {
      id: '',
      title: '',
      description: '',
      created_date:'',
      firstname:'',
    };
    // this.role_selected = '1';

    this.registerForm = this.formBuilder.group(
      {
        title: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ]),
        description: new FormControl('', [
          Validators.required,
        ]),
       
      },
    );
  }
  ngOnInit(): void {
  
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.remark = this.registerForm.value;
      console.log(
        'values' + JSON.stringify(this.remark, null, 2)
       
      );
      console.log('request id========>'+this.request_id);
      // this.roles
  
      this.saveRemark(this.request_id,this.remark);
    } else this.submitted = true;
  }

  saveRemark(request_id:any,remark: Remark) {
    console.log(
      'Payload: ' + JSON.stringify(this.remark, null, 2)
    );
    this.approverService.accountRemark(request_id,remark).subscribe(
      async (data) => {
        if (data == true) {
            this.SuccessSwalSendRemark.fire();
            this.registerForm.reset();
            this.submitted = false;
            console.log('remark success: ' + data);
          
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
                  //================================================================================
                  this.approverService.accountRemark(request_id,remark).subscribe(
                    async (data) => {
                      if (data == true) {
                    
                          this.SuccessSwalSendRemark.fire();
                          this.registerForm.reset();
              
                          this.submitted = false;
                          console.log('remark success: ' + data);
                        
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
        } 
        else {
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
