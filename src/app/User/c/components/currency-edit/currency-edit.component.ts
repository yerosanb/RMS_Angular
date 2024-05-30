import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { CurrencyRequest } from 'src/app/User/payloads/currency-request';
import { CurrencyService } from 'src/app/User/services/currency.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-currency-edit',
  templateUrl: './currency-edit.component.html',
  styleUrls: ['./currency-edit.component.css'],
})
export class CurrencyEditComponent implements OnInit {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  submitCurrencyForm: FormGroup
  id!: number
  submitted: boolean = false
  //  currency!:CurrencyRequest[];
  currencyRequest: CurrencyRequest
  currency: CurrencyRequest = new CurrencyRequest

  constructor(private service: CurrencyService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currencyRequest = {
      userId: '',
      id: '',
      name: '',
      code: '',
      description: '',

      // files: [],
    }
    this.submitCurrencyForm = this.formBuilder.group({
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


    })

  }

  ngOnInit(): void {
    //  try {
    //    this.getAllCurrencies();
    //  } catch (ex) {
    //    console.log('Exception: ' + JSON.stringify(ex));
    //  }
    this.id = this.route.snapshot.params['id'];
    this.getAllCurrencies();


  }

  getAllCurrencies() {
    console.log("this is the component method");

    this.service.getCurrencyById(this.id).subscribe((data) => {
      console.log("name isssssssssss" + this.currency.name);

      this.currency = data;

      console.log(data);

    },
      (error: any) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (this.localStorageService.retrieve('refresh_token_requested') ==
            null) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.service.getCurrencyById(this.id).subscribe((data) => {
                    console.log("name isssssssssss" + this.currency.name);

                    this.currency = data;

                    console.log(data);

                  }, (error: any) => {
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
        } else if (error.error.text === 'currency already registered') {

            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'currency already exist!',
            });
          }
         else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
         }
        
      }
    )

  }

  submitCurrency() {
    console.log('button clicked' + this.currencyRequest.name);
    if (this.submitCurrencyForm.valid) {
      this.currencyRequest.name = this.submitCurrencyForm.get(
        'name',
      )?.value
      this.currencyRequest.code = this.submitCurrencyForm.get(
        'code',
      )?.value
      this.currencyRequest.description = this.submitCurrencyForm.get(
        'description',
      )?.value
      this.currencyRequest.id = this.route.snapshot.params['id'];
      this.currencyRequest.userId = this.localStorageService.retrieve('user');


      console.log('account payload data' + this.currencyRequest)

      this.AddCurrency(this.currencyRequest);

    } else {
      this.submitted = true

    }


  }
  // this.service.postAccountRequest(accountPayload).subscribe(data=>{
  //   console.log(data);
  //   this.router.navigate(['/currency-list']);

  //  },(error:any)=>{

  //  });

  AddCurrency(currencyRequest: CurrencyRequest) {
    console.log(this.currencyRequest)

    this.service.updateApprovedCurrency(currencyRequest, this.id).subscribe(data => {
      console.log(data);
      //  this.router.navigate(['/currency-list']);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Change saved successfully!',
      });
      this.submitCurrencyForm.reset();

    },
      (error: any) => {
        if (error.error.text === 'access-token-expired') {
          console.log('Access-token-expired requesting refresh token...');
          if (this.localStorageService.retrieve('refresh_token_requested') ==
            null) {
            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual request'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.service.updateApprovedCurrency(currencyRequest, this.id).subscribe(data => {
                    console.log(data);
                    //  this.router.navigate(['/currency-list']);
                    Swal.fire({
                      icon: 'success',
                      title: 'Success',
                      text: 'Change saved successfully!',
                    });
                    this.submitCurrencyForm.reset();

                  }, (error: any) => {
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


