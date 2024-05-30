import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgToastService } from 'ng-angular-popup';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-disposed-amounts',
  templateUrl: './disposed-amounts.component.html',
  styleUrls: ['./disposed-amounts.component.css']
})
export class DisposedAmountsComponent implements OnInit {

  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  disposed_date: any;
  waiting_date: any;
  removed_date: any;
  type: any = "0";
  inputValue_com: number = 0
  inputValue_oe: number = 0
  inputValue_fur: number = 0
  inputValue_mv: number = 0
  inputValue_stock: number = 0

  label_inputValue_com: number = 0
  label_inputValue_oe: number = 0
  label_inputValue_fur: number = 0
  label_inputValue_mv: number = 0
  label_inputValue_stock_stationary: number = 0
  label_inputValue_stock_tools: number = 0
  label_inputValue_stock_spares: number = 0
  label_inputValue_stock_uniform: number = 0
  label_inputValue_stock_accessory: number = 0
  label_inputValue_stock_check: number = 0
  label_inputValue_stock_sanitory: number = 0
  label_inputValue_stock_computer: number = 0
  label_inputValue_stock_furniture: number = 0
  label_inputValue_stock_office_equipment: number = 0

  isCOMbuttonDisabled: boolean = true;
  isFURbuttonDisabled: boolean = true;
  isMVbuttonDisabled: boolean = true;
  isOEbuttonDisabled: boolean = true;


  constructor(private utilService: UtilService,
    public authService: AuthService,
    private localStorageService: LocalStorageService,
    public toast: NgToastService,
    private router: Router) { }

  DisposedDateChange(value: any): void {
    this.disposed_date = value;
  }
  RemovedDateChange(value: any): void {
    this.removed_date = value;
  }
  WaitingDateChange(value: any): void {
    this.waiting_date = value;
  }
  inputCOMChanged() {
    if (this.inputValue_com > 0)
      this.isCOMbuttonDisabled = false;
    else this.isCOMbuttonDisabled = true;
  }
  inputFURChanged() {
    if (this.inputValue_fur > 0)
      this.isFURbuttonDisabled = false;
    else this.isFURbuttonDisabled = true;
  }
  inputOEChanged() {
    if (this.inputValue_oe > 0)
      this.isOEbuttonDisabled = false;
    else this.isOEbuttonDisabled = true;
  }
  inputMVChanged() {
    if (this.inputValue_mv > 0)
      this.isMVbuttonDisabled = false;
    else this.isMVbuttonDisabled = true;
  }
  inputStockChanged() {
    if (this.inputValue_mv > 0)
      this.isMVbuttonDisabled = false;
    else this.isMVbuttonDisabled = true;
  }
  changeDRW() {
    if (this.disposed_date != null || this.removed_date != null || this.waiting_date != null) {
      const formData = new FormData();
      formData.append('disposed_date', this.convertDate(this.disposed_date));
      formData.append('removed_date', this.convertDate(this.removed_date));
      formData.append('waiting_date', this.convertDate(this.waiting_date));
      this.utilService.changeDate(formData).subscribe(
        (data: any) => {
          console.log('here is the data respond from serve '+data)
          if (data == true) {
            Swal.fire({
              icon: 'success',
              title: 'Date updated!',
              // text: 'Something went wrong!',
            });
            this.disposed_date=null
            this.removed_date=null
            this.waiting_date=null
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          }
        }, (error: any) => {
          console.log('error: ' + JSON.stringify(error, null, 3))
        }
      )
    }
    else {
      Swal.fire({
        icon: 'error',
        text: 'please fill the date!',
      });
      // this.showSelectionError();
    }
  }
  onChange(value: any) {
    this.type = value.target.value;
    if (this.type != '0') {
      this.utilService.getInitialStockEndingBalances().subscribe(
        (data: any) => {
          this.label_inputValue_stock_stationary = data.stock_stationary
          this.label_inputValue_stock_tools = data.stock_tools
          this.label_inputValue_stock_spares = data.stock_spares
          this.label_inputValue_stock_uniform = data.stock_uniform
          this.label_inputValue_stock_accessory = data.stock_accessory
          this.label_inputValue_stock_check = data.stock_check
          this.label_inputValue_stock_sanitory = data.stock_sanitory
          this.label_inputValue_stock_computer = data.stock_computer
          this.label_inputValue_stock_furniture = data.stock_furniture
          this.label_inputValue_stock_office_equipment = data.stock_office_equipment

        }, (error: any) => {
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
                    this.utilService.getInitialStockEndingBalances().subscribe(
                      (data: any) => {
                        this.label_inputValue_com = data.mms_comp
                        this.label_inputValue_oe = data.mms_oe
                        this.label_inputValue_stock_spares = data.stock_spares
                        this.label_inputValue_fur = data.mms_fur
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
                      }
                    )
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

  }

  ngOnInit(): void {
    this.utilService.getInitialFixedAssetEndingBalances().subscribe(
      (data: any) => {
        this.label_inputValue_com = data.mms_comp
        this.label_inputValue_oe = data.mms_oe
        this.label_inputValue_mv = data.mms_mv
        this.label_inputValue_fur = data.mms_fur
      }, (error: any) => {
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
                  this.utilService.getInitialFixedAssetEndingBalances().subscribe(
                    (data: any) => {
                      this.label_inputValue_com = data.mms_comp
                      this.label_inputValue_oe = data.mms_oe
                      this.label_inputValue_mv = data.mms_mv
                      this.label_inputValue_fur = data.mms_fur
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
                    }
                  )
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
    // this.utilService.getInitialFixedAssetEndingBalances().subscribe(
    //   (data: any) => {
    //     this.label_inputValue_com = data.mms_comp
    //     this.label_inputValue_oe = data.mms_oe
    //     this.label_inputValue_mv = data.mms_mv
    //     this.label_inputValue_fur = data.mms_fur
    //   }, (error: any) => {
    //     console.log('error: ' + JSON.stringify(error, null, 3))
    //   }
    // )
  }
  addTotalBalance(type: string) {
    let inputVal: any = 0;
    if (type == 'comp')
      inputVal = this.inputValue_com;
    else if (type == 'oe')
      inputVal = this.inputValue_oe;
    else if (type == 'mv')
      inputVal = this.inputValue_mv;
    else if (type == 'fur')
      inputVal = this.inputValue_fur;
    else
      inputVal = this.inputValue_stock;

    this.utilService.updateFixedAssetBalance(type, 'add', inputVal).subscribe(
      (data: any) => {
        console.log('data from backend: ' + data)
        if (data == true) {
          if (type == 'comp')
            this.label_inputValue_com += parseFloat(this.inputValue_com.toString())
          else if (type == 'oe')
            this.label_inputValue_oe += parseFloat(this.inputValue_oe.toString())
          else if (type == 'mv')
            this.label_inputValue_mv += parseFloat(this.inputValue_mv.toString())
          else if (type == 'fur')
            this.label_inputValue_fur += parseFloat(this.inputValue_fur.toString())
          else {
            if (this.type == "Stationary")
              this.label_inputValue_stock_stationary += parseFloat(this.inputValue_stock.toString());
            else if (this.type == "Tools")
              this.label_inputValue_stock_tools += parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Spares")
              this.label_inputValue_stock_spares += parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Uniform")
              this.label_inputValue_stock_uniform += parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Accessory")
              this.label_inputValue_stock_accessory += parseFloat(this.inputValue_stock.toString())
            else if (this.type == "check")
              this.label_inputValue_stock_check += parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Sanitory")
              this.label_inputValue_stock_sanitory += parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Computer")
              this.label_inputValue_stock_computer += parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Furniture")
              this.label_inputValue_stock_furniture += parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Equipment")
              this.label_inputValue_stock_office_equipment += parseFloat(this.inputValue_stock.toString())
          }
          Swal.fire({
            icon: 'success',
            title: 'Balance updated!',
            // text: 'Something went wrong!',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      }, (error: any) => {
        console.log('error: ' + JSON.stringify(error, null, 3))
      }
    )
  }
  subTotalBalance(type: string) {
    let inputVal: any = 0;
    if (type == 'comp')
      inputVal = this.inputValue_com;
    else if (type == 'oe')
      inputVal = this.inputValue_oe;
    else if (type == 'mv')
      inputVal = this.inputValue_mv;
    else if (type == 'fur')
      inputVal = this.inputValue_fur;
    else
      inputVal = this.inputValue_stock;
    this.utilService.updateFixedAssetBalance(type, 'sub', inputVal).subscribe(
      (data: any) => {
        console.log('data from backend: ' + data)
        if (data == true) {
          if (type == 'comp')
            this.label_inputValue_com -= this.inputValue_com
          else if (type == 'oe')
            this.label_inputValue_oe -= this.inputValue_oe
          else if (type == 'mv')
            this.label_inputValue_mv -= this.inputValue_mv
          else if (type == 'fur')
            this.label_inputValue_fur -= this.inputValue_fur
          else {
            if (this.type == "Stationary")
              this.label_inputValue_stock_stationary -= parseFloat(this.inputValue_stock.toString());
            else if (this.type == "Tools")
              this.label_inputValue_stock_tools -= parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Spares")
              this.label_inputValue_stock_spares -= parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Uniform")
              this.label_inputValue_stock_uniform -= parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Accessory")
              this.label_inputValue_stock_accessory -= parseFloat(this.inputValue_stock.toString())
            else if (this.type == "check")
              this.label_inputValue_stock_check -= parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Sanitory")
              this.label_inputValue_stock_sanitory -= parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Computer")
              this.label_inputValue_stock_computer -= parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Furniture")
              this.label_inputValue_stock_furniture -= parseFloat(this.inputValue_stock.toString())
            else if (this.type == "Equipment")
              this.label_inputValue_stock_office_equipment -= parseFloat(this.inputValue_stock.toString())
          }
          Swal.fire({
            icon: 'success',
            title: 'Balance updated!',
            // text: 'Something went wrong!',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      }, (error: any) => {
        console.log('error: ' + JSON.stringify(error, null, 3))
      }
    )
  }
  convertDate(str: string): string {
    if (str != null) {
        let date = new Date(str);
        console.log('Here is the date: ' + date); // Commented out for production
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        return [date.getFullYear(), month, day].join('-');
    } else {
         console.log('Here is the else date: ' + str); // Commented out for production
        return 'empty';
    }
}
  showSelectionError() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'please select disposed, waiting or removed date',
    });
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
                this.service.getCurrencyList().subscribe(resp => {
          console.log("currency ajax")

          callback({
            data: resp,
            // <-- see here
          });
        });  
*/
