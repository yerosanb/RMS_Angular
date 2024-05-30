import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { CurrencyRequest } from 'src/app/User/payloads/currency-request';
import { CurrencyService } from 'src/app/User/services/currency.service';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';
 
@Component({
  selector: 'app-register-role',
  templateUrl: './register-role.component.html',
  styleUrls: ['./register-role.component.css']
})
export class RegisterRoleComponent implements OnInit {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  // refresh_token_requested = false
  // @ViewChild('SwalSessionExpired')
  // public readonly SwalSessionExpired!: SwalComponent

  submitRoleForm: FormGroup;
  submitted: boolean = false;
  rolePayload: CurrencyRequest;

  constructor(
    private service: AdminService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.rolePayload = {
      userId:'',
      id:'',
      name: '',
      code: '',
      description: '',
  
      // files: [],
    };
    this.submitRoleForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('[a-zA-Z]*'),

      ]),
      // code: new FormControl('', [
      //   Validators.required,
      //   Validators.minLength(2),
      //   Validators.maxLength(50),
      // ]),
      description: new FormControl('', [Validators.required]),
     });
  }

  ngOnInit(): void {}
  submitRole() {
    console.log('button clicked' + this.rolePayload.name);
    if (this.submitRoleForm.valid) {
      this.rolePayload.name = this.submitRoleForm.get('name')?.value;
     // this.rolePayload.code = this.submitRoleForm.get('code')?.value;
      this.rolePayload.description =this.submitRoleForm.get('description')?.value;
      this.submitRoleForm.get('created_date')?.value;
      this.rolePayload.userId = this.localStorageService.retrieve('user');
      console.log('account payload data' + this.rolePayload);
      this.AddRole(this.rolePayload);
    }else{
      this.submitted = true;

    }
  }
  // this.service.postCurrencyRequest(rolePayload).subscribe((data) => {
  //   console.log(data);
  //   this.router.navigate(['/currency-list']);
  // });

  AddRole(rolePayload: CurrencyRequest) {
    console.log(this.rolePayload);
    this.service.postRoleRequest(rolePayload).subscribe(
      (data) => {
      console.log(data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Role registered successfully!',
      });
      this.submitRoleForm.reset();
      this.submitted=false;

      // this.router.navigate(['/currency-list']);
    },(error:any)=>{
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
                this.service.postRoleRequest(rolePayload).subscribe(
                  (data) => {
                  console.log(data);
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Role registered successfully!',
                  });
                  this.submitRoleForm.reset();
                  this.submitted=false;
            
                  // this.router.navigate(['/currency-list']);
                },(error:any)=>{
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
                    
                    
                 });
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
        if (error.error.text === 'currency already registered') {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'currency already exist!',
        });
      }
        console.log(JSON.stringify(error.error.apierror, null, 2));
      }
     })

  }
  _refreshTokenExpired() {
    console.log('logging out');

    this.authService.clearCookies().subscribe(
      (data:any) => {
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
      (error:any) => {
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
