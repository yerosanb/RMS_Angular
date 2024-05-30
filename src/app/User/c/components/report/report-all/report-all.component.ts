import { formatDate } from '@angular/common';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import saveAs from 'file-saver';
import { UploadService } from 'src/app/User/services/upload/upload.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../services/auth-service.service';
import { map } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { Route, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util-service/util.service';

@Component({
  selector: 'app-report-all',
  templateUrl: './report-all.component.html',
  styleUrls: ['./report-all.component.css'],
})
export class ReportAllComponent implements OnInit {
  maxDate!: Date;
  transaction_date!: any;
  progress_download = 0;
  downloadStatus_title = 'Generating Report...';
  file_to_preview!: any;

  preview: boolean = false;
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  //report
  report_type_selected: any;
  sign_value_ifb: any = 1;
  sign_value_con: any = 1;
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  constructor(
    private uploadService: UploadService,
    public authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private utilService: UtilService
  ) {
    // this.transaction_date = new Date();
    // this.file_to_preview = File();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
    if (this.authService.isUser()) {
      this.report_type_selected = 'PAS';
    }
  }
  getFileType() {

  }

  dateChange(event: any) {
    console.log('change: ' + this.transaction_date);
    this.transaction_date = event;
  }

  downloadPdf() {
    var report_type = 'pdf';
    if (this.report_type_selected == 'PAS') {
      report_type = 'pdf';
    } else if (this.report_type_selected == 'Payable') {
      report_type = 'payable_pdf';
    } else if (this.report_type_selected == 'Receivable') {
      report_type = 'receivable_pdf';
    } else if (this.report_type_selected == 'Issue') {
      report_type = 'issue_pdf';
    } else if (this.report_type_selected == 'Fur_Fixed') {
      report_type = 'fur_fixed_pdf';
    } else if (this.report_type_selected == 'Comp_Fixed') {
      report_type = 'comp_fixed_pdf';
    } else if (this.report_type_selected == 'Vehi_Fixed') {
      report_type = 'vehi_fixed_pdf';
    } else if (this.report_type_selected == 'Equp_Fixed') {
      report_type = 'equp_fixed_pdf';
    }

    else if (this.report_type_selected == '121_stationary') {
      report_type = '121_stationary_pdf';
    }
    else if (this.report_type_selected == '111_tools') {
      report_type = '111_tools_pdf';
    }
    else if (this.report_type_selected == '113_spares') {
      report_type = '113_spares_pdf';
    }
    else if (this.report_type_selected == '105_uniform') {
      report_type = '105_uniform_pdf';
    }
    else if (this.report_type_selected == '119_accessory') {
      report_type = '119_accessory_pdf';
    }
    else if (this.report_type_selected == '120_check') {
      report_type = '120_check_pdf';
    }
    else if (this.report_type_selected == '112_sanitory') {
      report_type = '112_sanitory_pdf';
    }
    else if (this.report_type_selected == '106_computer') {
      report_type = '106_computer_pdf';
    }
    else if (this.report_type_selected == '107_furniture') {
      report_type = '107_furniture_pdf';
    }
    else if (this.report_type_selected == '104_office_equipment') {
      report_type = '104_office_equipment_pdf';
    }

    if (this.transaction_date != undefined) {
      this.preview = false;
      this.progress_download = 0;
      const sw = Swal.fire({
        allowOutsideClick: false,
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: false,
        showDenyButton: false,
        html:
          this.downloadStatus_title +
          ' <span class="status_download d-none"><b></b>%</span>',
        didOpen: () => {
          Swal.showLoading(Swal.getDenyButton()!);
          const status_download =
            Swal.getHtmlContainer()!.querySelector('status_download');
          const b = Swal.getHtmlContainer()!.querySelector('b');
          this.timerInterval = setInterval(() => {
            if (this.progress_download != 0) {
              status_download!.classList.remove('d-none');
              status_download!.classList.add('d-block');
              b!.textContent = this.progress_download.toString();
            }
          }, 100);
        },
      });

      this.uploadService
        .checkTokenDoesNotExpired(
          formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US')
        )
        .subscribe(
          (data: any) => {
            if (data == true) {
              console.log(
                '------------------------> axcess token not exprired'
              );
              this.uploadService
                .downloadReportFiles(
                  formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US'),
                  report_type, this.sign_value_con, this.sign_value_ifb
                )
                .subscribe(
                  (event: any) => {
                    console.log('the body: ' + JSON.stringify(event, null, 4));
                    this.downloadReportProgress(event);
                  },
                  (error: HttpErrorResponse) => {
                    Swal.fire({
                      title: 'Error',
                      icon: 'error',
                      text: 'Error Downloading the report. PLEASE MAKE SURE THE DATE YOU ENTERED IS CORRECT!!!.',
                    });
                    console.log(JSON.stringify(error, null, 4));
                    // console.log();
                  }
                );
            }
          },
          (error: any) => {
            console.log('------------------------> axcess token exprired');

            if (
              this.localStorageService.retrieve('refresh_token_requested') ==
              null
            ) {
              this.utilService.refreshToken().subscribe(
                (data: any) => {
                  if (data === true) {
                    console.log(
                      'refresh token success re-requesting the actual request'
                    );
                    this.localStorageService.clear('refresh_token_requested');
                    //================================================================================
                    this.uploadService
                      .downloadReportFiles(
                        formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US'),
                        report_type, this.sign_value_con, this.sign_value_ifb
                      )
                      .subscribe(
                        (event: any) => {
                          console.log(
                            'the body: ' + JSON.stringify(event, null, 4)
                          );
                          this.downloadReportProgress(event);
                        },
                        (error: any) => {
                          Swal.fire({
                            title: 'Error',
                            icon: 'error',
                            text: 'Error Downloading the report. PLEASE MAKE SURE THE DATE YOU ENTERED IS CORRECT!!!.',
                          });
                          console.log(JSON.stringify(error, null, 4));
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
        );

      const date_error = document.getElementById('date_error');
      date_error!.classList.remove('d-block');
      date_error!.classList.add('d-none');
    } else {
      const date_error = document.getElementById('date_error');
      date_error!.classList.remove('d-none');
      date_error!.classList.add('d-block');
    }
  }


  timerInterval: any;
  downloadExcel() {
    var report_type = 'excel';
    if (this.report_type_selected == 'PAS') {
      report_type = 'excel';
    } else if (this.report_type_selected == 'Payable') {
      report_type = 'payable_excel';
    } else if (this.report_type_selected == 'Receivable') {
      report_type = 'receivable_excel';
    } else if (this.report_type_selected == 'Issue') {
      report_type = 'issue_excel';
    } else if (this.report_type_selected == 'Fur_Fixed') {
      report_type = 'fur_fixed_excel';
    } else if (this.report_type_selected == 'Comp_Fixed') {
      report_type = 'comp_fixed_excel';
    } else if (this.report_type_selected == 'Vehi_Fixed') {
      report_type = 'Vehi_fixed_excel';
    } else if (this.report_type_selected == 'Equp_Fixed') {
      report_type = 'equp_fixed_excel';
    }

    else if (this.report_type_selected == '121_stationary') {
      report_type = '121_stationary_excel';
    }
    else if (this.report_type_selected == '111_tools') {
      report_type = '111_tools_excel';
    }
    else if (this.report_type_selected == '113_spares') {
      report_type = '113_spares_excel';
    }
    else if (this.report_type_selected == '105_uniform') {
      report_type = '105_uniform_excel';
    }
    else if (this.report_type_selected == '119_accessory') {
      report_type = '119_accessory_excel';
    }
    else if (this.report_type_selected == '120_check') {
      report_type = '120_check_excel';
    }
    else if (this.report_type_selected == '112_sanitory') {
      report_type = '112_sanitory_excel';
    }
    else if (this.report_type_selected == '106_computer') {
      report_type = '106_computer_excel';
    }
    else if (this.report_type_selected == '107_furniture') {
      report_type = '107_furniture_excel';
    }
    else if (this.report_type_selected == '104_office_equipment') {
      report_type = '104_office_equipment_excel';
    }

    if (this.transaction_date != undefined) {
      this.preview = false;
      this.progress_download = 0;
      const sw = Swal.fire({
        allowOutsideClick: false,
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: false,
        showDenyButton: false,
        html: this.downloadStatus_title + ' <span><b></b>%</span>',
        didOpen: () => {
          Swal.showLoading(Swal.getDenyButton()!);
          const b = Swal.getHtmlContainer()!.querySelector('b');
          this.timerInterval = setInterval(() => {
            b!.textContent = this.progress_download.toString();
          }, 100);
        },
      });
      this.uploadService
        .checkTokenDoesNotExpired(
          formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US')
        )
        .subscribe(
          (data: any) => {
            if (data == true) {
              console.log(
                '------------------------> axcess token not exprired'
              );
              this.uploadService
                .downloadReportFiles(
                  formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US'),
                  report_type, this.sign_value_con, this.sign_value_ifb
                )
                .subscribe(
                  (event: any) => {
                    console.log('the body: ' + JSON.stringify(event, null, 4));
                    this.downloadReportProgress(event);
                  },
                  (error: HttpErrorResponse) => {
                    Swal.fire({
                      title: 'Error',
                      icon: 'error',
                      text: 'Error Downloading the report. PLEASE MAKE SURE THE DATE YOU ENTERED IS CORRECT!!!.',
                    });
                    console.log(JSON.stringify(error, null, 4));
                    // console.log();
                  }
                );
            }
          },
          (error: any) => {
            console.log('------------------------> axcess token exprired');

            if (
              this.localStorageService.retrieve('refresh_token_requested') ==
              null
            ) {
              this.utilService.refreshToken().subscribe(
                (data: any) => {
                  if (data === true) {
                    console.log(
                      'refresh token success re-requesting the actual request'
                    );
                    this.localStorageService.clear('refresh_token_requested');
                    //================================================================================
                    this.uploadService
                      .downloadReportFiles(
                        formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US'),
                        report_type, this.sign_value_con, this.sign_value_ifb
                      )
                      .subscribe(
                        (event: any) => {
                          console.log(
                            'the body: ' + JSON.stringify(event, null, 4)
                          );
                          this.downloadReportProgress(event);
                        },
                        (error: any) => {
                          Swal.fire({
                            title: 'Error',
                            icon: 'error',
                            text: 'Error Downloading the report. PLEASE MAKE SURE THE DATE YOU ENTERED IS CORRECT!!!.',
                          });
                          console.log(JSON.stringify(error, null, 4));
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
        );
      const date_error = document.getElementById('date_error');
      date_error!.classList.remove('d-block');
      date_error!.classList.add('d-none');
    } else {
      const date_error = document.getElementById('date_error');
      date_error!.classList.remove('d-none');
      date_error!.classList.add('d-block');
    }
  }

  private downloadReportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch (httpEvent.type) {
      case HttpEventType.DownloadProgress:
        // this.uploadStatus(httpEvent.loaded, httpEvent.total!, 'Downloading...');
        this.progress_download = Math.round(
          (100 * httpEvent.loaded) / httpEvent.total!
        );
        break;
      case HttpEventType.ResponseHeader:
        // console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          for (const filename of httpEvent.body) {
          }
        } else {
          if (!this.preview) {
            console.log('the response is: ' + JSON.stringify(httpEvent));
            saveAs(
              new File(
                [httpEvent.body!],
                'R-M-S REPORT as of ' +
                new Date(this.transaction_date).toLocaleString('en-us', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }),
                {
                  type: `${httpEvent.headers.get(
                    'Content-Type'
                  )};charset=utf-8`,
                }
              )
            );
            Swal.hideLoading();
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'File downloaded successfully!',
            });
            clearInterval(this.timerInterval);
          } else {
            this.file_to_preview = URL.createObjectURL(httpEvent.body!);
            Swal.hideLoading();
            Swal.close();
          }
        }
        break;
      default:
        console.log('the default' + httpEvent);
    }
  }

  previewPdf() {
    var report_type = 'pdf';
    if (this.report_type_selected == 'PAS') {
      report_type = 'pdf';
    } else if (this.report_type_selected == 'Payable') {
      report_type = 'payable_pdf';
    } else if (this.report_type_selected == 'Receivable') {
      report_type = 'receivable_pdf';
    } else if (this.report_type_selected == 'Issue') {
      report_type = 'issue_pdf';
    } else if (this.report_type_selected == 'Fur_Fixed') {
      report_type = 'fur_fixed_pdf';
    } else if (this.report_type_selected == 'Comp_Fixed') {
      report_type = 'comp_fixed_pdf';
    } else if (this.report_type_selected == 'Vehi_Fixed') {
      report_type = 'vehi_fixed_pdf';
    } else if (this.report_type_selected == 'Equp_Fixed') {
      report_type = 'equp_fixed_pdf';
    }

    else if (this.report_type_selected == '121_stationary') {
      report_type = '121_stationary_pdf';
    }
    else if (this.report_type_selected == '111_tools') {
      report_type = '111_tools_pdf';
    }
    else if (this.report_type_selected == '113_spares') {
      report_type = '113_spares_pdf';
    }
    else if (this.report_type_selected == '105_uniform') {
      report_type = '105_uniform_pdf';
    }
    else if (this.report_type_selected == '119_accessory') {
      report_type = '119_accessory_pdf';
    }
    else if (this.report_type_selected == '120_check') {
      report_type = '120_check_pdf';
    }
    else if (this.report_type_selected == '112_sanitory') {
      report_type = '112_sanitory_pdf';
    }
    else if (this.report_type_selected == '106_computer') {
      report_type = '106_computer_pdf';
    }
    else if (this.report_type_selected == '107_furniture') {
      report_type = '107_furniture_pdf';
    }
    else if (this.report_type_selected == '104_office_equipment') {
      report_type = '104_office_equipment_pdf';
    }

    if (this.transaction_date != undefined) {
      this.preview = true;
      this.progress_download = 0;
      const sw = Swal.fire({
        allowOutsideClick: false,
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: false,
        showDenyButton: false,
        html: this.downloadStatus_title + ' <span><b></b>%</span>',
        didOpen: () => {
          Swal.showLoading(Swal.getDenyButton()!);
          const b = Swal.getHtmlContainer()!.querySelector('b');
          const timerInterval = setInterval(() => {
            b!.textContent = this.progress_download.toString();
          }, 100);
        },
      });
      this.uploadService
        .checkTokenDoesNotExpired(
          formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US')
        )
        .subscribe(
          (data: any) => {
            if (data == true) {
              console.log(
                '------------------------> axcess token not exprired'
              );
              this.uploadService
                .downloadReportFiles(
                  formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US'),
                  report_type, this.sign_value_con, this.sign_value_ifb
                )
                .subscribe(
                  (event: any) => {
                    console.log('the body: ' + JSON.stringify(event, null, 4));
                    this.downloadReportProgress(event);
                  },
                  (error: HttpErrorResponse) => {
                    Swal.fire({
                      title: 'Error',
                      icon: 'error',
                      text: 'Error Downloading the report. PLEASE MAKE SURE THE DATE YOU ENTERED IS CORRECT!!!.',
                    });
                    console.log(JSON.stringify(error, null, 4));
                    // console.log();
                  }
                );
            }
          },
          (error: any) => {
            console.log('------------------------> axcess token exprired');

            if (
              this.localStorageService.retrieve('refresh_token_requested') ==
              null
            ) {
              this.utilService.refreshToken().subscribe(
                (data: any) => {
                  if (data === true) {
                    console.log(
                      'refresh token success re-requesting the actual request'
                    );
                    this.localStorageService.clear('refresh_token_requested');
                    //================================================================================
                    this.uploadService
                      .downloadReportFiles(
                        formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US'),
                        report_type, this.sign_value_con, this.sign_value_ifb
                      )
                      .subscribe(
                        (event: any) => {
                          console.log(
                            'the body: ' + JSON.stringify(event, null, 4)
                          );
                          this.downloadReportProgress(event);
                        },
                        (error: any) => {
                          Swal.fire({
                            title: 'Error',
                            icon: 'error',
                            text: 'Error Downloading the report. PLEASE MAKE SURE THE DATE YOU ENTERED IS CORRECT!!!.',
                          });
                          console.log(JSON.stringify(error, null, 4));
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
        );
      const date_error = document.getElementById('date_error');
      date_error!.classList.remove('d-block');
      date_error!.classList.add('d-none');
    } else {
      const date_error = document.getElementById('date_error');
      date_error!.classList.remove('d-none');
      date_error!.classList.add('d-block');
    }
  }

  ngOnInit() { }

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
                  this.uploadService
                    .downloadReportFiles(
                      formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US'),
                      'pdf', this.sign_value_con, this.sign_value_ifb

                    )
                    .subscribe(
                      (event: any) => {
                        console.log(
                          'the body: ' + JSON.stringify(event, null, 4)
                        );
                        this.downloadReportProgress(event);
                      },
                      (error: HttpErrorResponse) => {
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
                        console.log(JSON.stringify(error, null, 4));
                        // console.log();
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

==========================*/