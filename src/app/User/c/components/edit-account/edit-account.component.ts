import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { AccountPayload } from 'src/app/User/payloads/account-payload';
import { CurrencyRequest } from 'src/app/User/payloads/currency-request';
import { AccountService } from 'src/app/User/services/account.service';
import { CurrencyService } from 'src/app/User/services/currency.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent {

    //Swal Config
    @ViewChild('SwalSessionExpired')
    public readonly SwalSessionExpired!: SwalComponent;
  
    submitAccountForm: FormGroup
    id!:number
    submitted: boolean = false
    currency!:CurrencyRequest[];
    accountPayload: AccountPayload
    account:AccountPayload = new AccountPayload
    constructor( private service:AccountService,
      private service2:CurrencyService,
      private formBuilder: FormBuilder,
      private adminService: AdminService,
      private authService: AuthService,
      private utilService: UtilService,
       private localStorageService: LocalStorageService,
      private activatedRoute: ActivatedRoute,
       private router: Router,
       private route: ActivatedRoute
      )

      { 
        this.accountPayload = {
        id:'',
        userId:'',
        name: '',
        code: '',
        description: '',
        currency:''
          
       }
      this.submitAccountForm = this.formBuilder.group({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(200),
        ]),
        code: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
        
        description: new FormControl('', [Validators.required]),
        currency: new FormControl('', [Validators.required]),
     
       })

      }
  
    ngOnInit(): void {
      
      try {
        this.getAllCurrencies();
      } catch (ex) {
        console.log('Exception: ' + JSON.stringify(ex));
      }
      this.id =this.route.snapshot.params['id'];
      this.getAllAccount();
    
    }
   
  getAllCurrencies(){
      //here i need to use approved currency method instead of currency request
      this.service2.getCurrencyList().subscribe((data)=>{

        this.currency = data;
      
        console.log("hellllloooooooooooo"+ this.currency);
         
      },
      (error:any) =>{
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (this.localStorageService.retrieve('refresh_token_requested') ==
                      null){
            this.utilService.refreshToken().subscribe(
              (data:any) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.service2.getCurrencyList().subscribe((data)=>{

                    this.currency = data;
                    console.log("hellllloooooooooooo"+ this.currency);
                     
                  }
                    ,(error:any) =>{
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
                    })
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
      )
    }
    getAllAccount(){
      this.service.getAccountRequestById(this.id).subscribe((data)=>{
        console.log(data);
        this.account = data;
      //  this.submitAccountForm.controls['currency'].setValue('32')
        //this.account.currency = '32'
        console.log("ihiyghjjhggkghhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"+this.account.currency);
        console.log("this is the account cirrency ="+this.account.currency)

      },
      (error:any) =>{
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (this.localStorageService.retrieve('refresh_token_requested') ==
                      null){
            this.utilService.refreshToken().subscribe(
              (data:any) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.service.getAccountRequestById(this.id).subscribe((data)=>{
                    console.log(data);
                    this.account = data;
                  //  this.submitAccountForm.controls['currency'].setValue('32')
                    //this.account.currency = '32'
                    console.log("ihiyghjjhggkghhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"+this.account.currency);
                    console.log("this is the account cirrency ="+this.account.currency)
            
                  }
                    ,(error:any) =>{
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
                    })
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
      )
    }

    submitAccount(){
      console.log('button clicked'+ this.accountPayload.name);
       if (this.submitAccountForm.valid) {
        this.accountPayload.name = this.submitAccountForm.get(
          'name',
        )?.value
        this.accountPayload.code = this.submitAccountForm.get(
          'code',
        )?.value
        this.accountPayload.description = this.submitAccountForm.get(
          'description',
        )?.value
        this.accountPayload.userId = this.localStorageService.retrieve('user');

        this.accountPayload.id = this.id =this.route.snapshot.params['id'];
        
        this.accountPayload.currency = this.submitAccountForm.get(
          'currency',

        )?.value
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh: " + this.accountPayload.currency)
  
        console.log('account payload data'+ this.accountPayload)
  
        this.AddAccount(this.accountPayload);
  
      } else{

        this.submitted = true

      }
       
    }
  
  AddAccount(accountPayload:AccountPayload){
     console.log(this.accountPayload)
   
      this.service.updateApprovedAccount(this.id, accountPayload).subscribe(data=>{
      console.log(data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'change saved successfully!',
      });
      this.submitAccountForm.reset();
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
                this.service.updateApprovedAccount(this.id, accountPayload).subscribe(data=>{
                  console.log(data);
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'change saved successfully!',
                  });
                  this.submitAccountForm.reset();
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
                //==========================================================================================
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
     });
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


