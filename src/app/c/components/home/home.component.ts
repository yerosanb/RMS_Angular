import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
// import { fadeAnimation2 } from '../../../utils_/animations2'
// import { loadDatatableScripts } from '../../loadScripts';
import Chart from 'chart.js/auto';
import { DashboardService } from 'src/app/User/services/dashboard/dashboard.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { EMPTY } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // animations: [fadeAnimation2],
})


export class HomeComponent implements AfterViewChecked, OnInit {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('UnauthorizedSwal')
  public readonly UnauthorizedSwal!: SwalComponent;

  public chart1: any;
  public chart2: any;
  public chart3: any;
  public chart4: any;
  public chart5: any;
  data_is_ready: boolean = false;
  admin_data_is_ready: boolean = false;
  chart2_no_data: boolean = false;
  chart4_no_data: boolean = false;
  chart1_no_data: boolean = false;
  chart3_no_data: boolean = false;
  chart5_no_data: boolean = false;
  dashboard_data: any;
  adminDashboard_data: any;

  constructor(
    public authService: AuthService,

    private utilService: UtilService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private changeRef: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) { }
  ngAfterViewChecked(): void {
  }

  ngOnInit(): void {
    this.populateDashboardData();
    this.populateApproverDashboardData();
    this.populateAdminDashboardData();
  }
  total_number_of_users: string = '';
  total_number_active_users: string = '';
  total_number_inactive_users: string = '';
  total_functionalities: string = '';
  total_logins: string = '';
  total_number_of_user_activity: string = '';

  outstanding_core_total: string = '';
  outstanding_ats_total: string = '';

  outstanding_balance_core_total: string = '';
  outstanding_balance_ats_total: string = '';

  total_beginning_balance_core: string = '';
  total_ending_balance_core: string = '';
  current_adjusted_balance_ats: string = '';
  current_adjusted_balance_core: string = '';
  number_of_Currency_remark: string = '0';
  number_of_account_remark: string = '0';

  populateApproverDashboardData() {
    if (this.authService.isApprover()) {
      this.utilService.checkAccessTokenDoesNotExpired().subscribe(
        (data: any) => {
          if (data == true) {
            console.log("------------------ token not expired")
            this.dashboardService.getApproverDashboardData().subscribe(
              (data: any) => {
                console.log('the response: ' + data);

                if (data.number_of_Currency_remark != null)
                  this.number_of_Currency_remark = Number(
                    data.number_of_Currency_remark
                  ).toLocaleString();

                if (data.number_of_account_remark != null)
                  this.number_of_account_remark = Number(
                    data.number_of_account_remark
                  ).toLocaleString();
                this.dashboard_data = data;
                this.chartFour();
                this.data_is_ready = true;
              });
          }
        },
        (error: any) => {
          console.log("------------------ token expired");
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
                  this.dashboardService.getApproverDashboardData().subscribe(
                    (data: any) => {
                      console.log('the response: ' + data);

                      if (data.number_of_Currency_remark != null)
                        this.number_of_Currency_remark = Number(
                          data.number_of_Currency_remark
                        ).toLocaleString();

                      if (data.number_of_account_remark != null)
                        this.number_of_account_remark = Number(
                          data.number_of_account_remark
                        ).toLocaleString();
                      this.dashboard_data = data;
                      this.chartFour();
                      this.data_is_ready = true;
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
        });
    }
  }
  /*
  */
  populateAdminDashboardData() {
    if (this.authService.isAdmin()) {
      this.utilService.checkAccessTokenDoesNotExpired().subscribe(
        (data: any) => {
          if (data == true) {
            console.log("------------------ token not expired")
            this.dashboardService.getAdminDashboardData().subscribe(
              (data1: any) => {
                console.log('data: ' + JSON.stringify(data1, null, 4));
                this.total_number_of_users = Number(
                  data1.total_number_of_Users
                ).toLocaleString();
                this.total_number_active_users = Number(
                  data1.total_number_active_users
                ).toLocaleString();
                this.total_number_inactive_users = Number(
                  data1.total_number_inactive_users
                ).toLocaleString();
                this.total_functionalities = Number(
                  data1.total_number_of_functionalities
                ).toLocaleString();
                this.total_logins = Number(data1.total_logins).toLocaleString();
                this.total_number_of_user_activity = Number(
                  data1.total_number_of_user_activity
                ).toLocaleString();
                console.log('ffffffffff======>: ' + this.total_functionalities);
                this.adminDashboard_data = data1;
                this.admin_data_is_ready = true;
                this.chartFive();
              });

          }
        },
        (error: any) => {
          console.log("------------------ token expired")
          if (
            this.localStorageService.retrieve('refresh_token_requested') ==
            null
          ) {

            this.utilService.refreshToken().subscribe(
              (data) => {
                if (data === true) {
                  console.log(
                    'refresh token success re-requesting the actual requestttttt'
                  );
                  this.localStorageService.clear('refresh_token_requested');
                  //================================================================================
                  this.dashboardService.getAdminDashboardData().subscribe(
                    (data1: any) => {
                      this.total_number_of_users = Number(
                        data1.total_number_of_Users
                      ).toLocaleString();
                      this.total_number_active_users = Number(
                        data1.total_number_active_users
                      ).toLocaleString();
                      this.total_number_inactive_users = Number(
                        data1.total_number_inactive_users
                      ).toLocaleString();
                      this.total_functionalities = Number(
                        data1.total_number_of_functionalities
                      ).toLocaleString();
                      this.total_logins = Number(
                        data1.total_logins
                      ).toLocaleString();
                      this.total_number_of_user_activity = Number(
                        data1.total_number_of_user_activity
                      ).toLocaleString();
                      console.log(
                        'ffffffffff======>: ' + this.total_functionalities
                      );
                      this.adminDashboard_data = data1;
                      this.admin_data_is_ready = true;
                      this.chartFive();
                    },
                    (error) => {

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

        });
    }
  }
  populateDashboardData() {
    if (this.authService.isUser()) {
      this.utilService.checkAccessTokenDoesNotExpired().subscribe(
        (data: any) => {
          if (data == true) {
            console.log("------------------ token not expired")
            this.dashboardService.getDashboardData().subscribe(
              (data: any) => {
                //69332711
                // date_7_ending_balance_conv, date_7_ending_balance_ifb, outstanding_balance_on_core_debit, outstanding_balance_on_ats_credit

                this.current_adjusted_balance_core = (
                  Number(data.date_7_ending_balance_conv) +
                  Number(data.date_7_ending_balance_ifb) +
                  Number(data.outstanding_balance_on_ats_credit) -
                  Number(data.outstanding_balance_on_ats_credit)
                ).toLocaleString();

                this.current_adjusted_balance_ats = (
                  Number(data.date_7_ending_balance_ats) -
                  Number(data.outstanding_balance_on_core_debit) +
                  Number(data.outstanding_balance_on_core_credit)
                ).toLocaleString();

                data.total_number_of_transactions_core = Number(
                  data.total_number_of_transactions_core
                ).toLocaleString();
                data.total_number_of_accounts = Number(
                  data.total_number_of_accounts
                ).toLocaleString();
                data.total_number_of_currencies = Number(
                  data.total_number_of_currencies
                ).toLocaleString();
                data.total_number_of_transactions_ats = Number(
                  data.total_number_of_transactions_ats
                ).toLocaleString();
                data.total_number_of_files = Number(
                  data.total_number_of_files
                ).toLocaleString();

                this.outstanding_core_total = (
                  data.outstanding_transactions_on_core_credit +
                  data.outstanding_transactions_on_core_debit
                ).toLocaleString();
                this.outstanding_ats_total = (
                  data.outstanding_transactions_on_ats_credit +
                  data.outstanding_transactions_on_ats_debit
                ).toLocaleString();

                data.beginning_balance_ats = Number(
                  data.beginning_balance_ats
                ).toLocaleString();
                data.ending_balance_ats = Number(
                  data.ending_balance_ats
                ).toLocaleString();
                // total_beginning_balance_core
                this.total_beginning_balance_core = (
                  data.beginning_balance_core_ifb + data.beginning_balance_core_conv
                ).toLocaleString();
                data.beginning_balance_core_ifb = Number(
                  data.beginning_balance_core_ifb
                ).toLocaleString();
                data.beginning_balance_core_conv = Number(
                  data.beginning_balance_core_conv
                ).toLocaleString();
                // total_ending_balance_core
                this.total_ending_balance_core = (
                  data.ending_balance_core_ifb + data.ending_balance_core_conv
                ).toLocaleString();
                data.ending_balance_core_ifb = Number(
                  data.ending_balance_core_ifb
                ).toLocaleString();
                data.ending_balance_core_conv = Number(
                  data.ending_balance_core_conv
                ).toLocaleString();

                this.outstanding_balance_core_total = (
                  data.outstanding_balance_on_core_credit +
                  data.outstanding_balance_on_core_debit
                ).toLocaleString();
                this.outstanding_balance_ats_total = (
                  data.outstanding_balance_on_ats_credit +
                  data.outstanding_balance_on_ats_debit
                ).toLocaleString();

                data.outstanding_balance_on_core_credit = Number(
                  data.outstanding_balance_on_core_credit
                ).toLocaleString();
                data.outstanding_balance_on_core_debit = Number(
                  data.outstanding_balance_on_core_debit
                ).toLocaleString();
                data.outstanding_balance_on_ats_credit = Number(
                  data.outstanding_balance_on_ats_credit
                ).toLocaleString();
                data.outstanding_balance_on_ats_debit = Number(
                  data.outstanding_balance_on_ats_debit
                ).toLocaleString();

                data.number_of_edited_transactions = Number(
                  data.number_of_edited_transactions
                ).toLocaleString();
                data.number_of_deleted_transactions = Number(
                  data.number_of_deleted_transactions
                ).toLocaleString();

                // ats_ending_balance + total_core_debit) - total_core_credit

                // date_7_ending_balance_ats, outstanding_balance_on_core_debit, outstanding_balance_on_core_credit

                this.dashboard_data = data;
                if (this.authService.isUser()) {
                  this.chartOne();
                  this.chartTwo();
                  this.chartThree();
                }
                this.data_is_ready = true;
              });

          }
        },
        (error: any) => {
          console.log("------------------ token expired");
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
                  this.dashboardService.getDashboardData().subscribe(
                    (data: any) => {
                      console.log(
                        'dashboard data: ' + JSON.stringify(data, null, 6)
                      );
                      console.log(
                        'number_of_edited_transactions: ' +
                        Number(
                          data.total_number_of_transactions_core
                        ).toLocaleString()
                      );
                      //69332711
                      // date_7_ending_balance_conv, date_7_ending_balance_ifb, outstanding_balance_on_core_debit, outstanding_balance_on_ats_credit

                      this.current_adjusted_balance_core = (
                        Number(data.date_7_ending_balance_conv) +
                        Number(data.date_7_ending_balance_ifb) +
                        Number(data.outstanding_balance_on_ats_credit) -
                        Number(data.outstanding_balance_on_ats_credit)
                      ).toLocaleString();

                      this.current_adjusted_balance_ats = (
                        Number(data.date_7_ending_balance_ats) -
                        Number(data.outstanding_balance_on_core_debit) +
                        Number(data.outstanding_balance_on_core_credit)
                      ).toLocaleString();

                      data.total_number_of_transactions_core = Number(
                        data.total_number_of_transactions_core
                      ).toLocaleString();
                      data.total_number_of_accounts = Number(
                        data.total_number_of_accounts
                      ).toLocaleString();
                      data.total_number_of_currencies = Number(
                        data.total_number_of_currencies
                      ).toLocaleString();
                      data.total_number_of_transactions_ats = Number(
                        data.total_number_of_transactions_ats
                      ).toLocaleString();
                      data.total_number_of_files = Number(
                        data.total_number_of_files
                      ).toLocaleString();

                      this.outstanding_core_total = (
                        data.outstanding_transactions_on_core_credit +
                        data.outstanding_transactions_on_core_debit
                      ).toLocaleString();
                      this.outstanding_ats_total = (
                        data.outstanding_transactions_on_ats_credit +
                        data.outstanding_transactions_on_ats_debit
                      ).toLocaleString();

                      data.beginning_balance_ats = Number(
                        data.beginning_balance_ats
                      ).toLocaleString();
                      data.ending_balance_ats = Number(
                        data.ending_balance_ats
                      ).toLocaleString();
                      // total_beginning_balance_core
                      this.total_beginning_balance_core = (
                        data.beginning_balance_core_ifb +
                        data.beginning_balance_core_conv
                      ).toLocaleString();
                      data.beginning_balance_core_ifb = Number(
                        data.beginning_balance_core_ifb
                      ).toLocaleString();
                      data.beginning_balance_core_conv = Number(
                        data.beginning_balance_core_conv
                      ).toLocaleString();
                      // total_ending_balance_core
                      this.total_ending_balance_core = (
                        data.ending_balance_core_ifb +
                        data.ending_balance_core_conv
                      ).toLocaleString();
                      data.ending_balance_core_ifb = Number(
                        data.ending_balance_core_ifb
                      ).toLocaleString();
                      data.ending_balance_core_conv = Number(
                        data.ending_balance_core_conv
                      ).toLocaleString();

                      this.outstanding_balance_core_total = (
                        data.outstanding_balance_on_core_credit +
                        data.outstanding_balance_on_core_debit
                      ).toLocaleString();
                      this.outstanding_balance_ats_total = (
                        data.outstanding_balance_on_ats_credit +
                        data.outstanding_balance_on_ats_debit
                      ).toLocaleString();

                      data.outstanding_balance_on_core_credit = Number(
                        data.outstanding_balance_on_core_credit
                      ).toLocaleString();
                      data.outstanding_balance_on_core_debit = Number(
                        data.outstanding_balance_on_core_debit
                      ).toLocaleString();
                      data.outstanding_balance_on_ats_credit = Number(
                        data.outstanding_balance_on_ats_credit
                      ).toLocaleString();
                      data.outstanding_balance_on_ats_debit = Number(
                        data.outstanding_balance_on_ats_debit
                      ).toLocaleString();

                      data.number_of_edited_transactions = Number(
                        data.number_of_edited_transactions
                      ).toLocaleString();
                      data.number_of_deleted_transactions = Number(
                        data.number_of_deleted_transactions
                      ).toLocaleString();

                      // ats_ending_balance + total_core_debit) - total_core_credit

                      // date_7_ending_balance_ats, outstanding_balance_on_core_debit, outstanding_balance_on_core_credit

                      this.dashboard_data = data;
                      if (this.authService.isUser()) {
                        this.chartOne();
                        this.chartTwo();
                        this.chartThree();
                      }
                      this.data_is_ready = true;
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
          ///------------

        });
      //   this.dashboardService.getDashboardData().subscribe(
      //     (data: any) => {
      //       //69332711
      //       // date_7_ending_balance_conv, date_7_ending_balance_ifb, outstanding_balance_on_core_debit, outstanding_balance_on_ats_credit

      //       this.current_adjusted_balance_core = (
      //         Number(data.date_7_ending_balance_conv) +
      //         Number(data.date_7_ending_balance_ifb) +
      //         Number(data.outstanding_balance_on_ats_credit) -
      //         Number(data.outstanding_balance_on_ats_credit)
      //       ).toLocaleString();

      //       this.current_adjusted_balance_ats = (
      //         Number(data.date_7_ending_balance_ats) -
      //         Number(data.outstanding_balance_on_core_debit) +
      //         Number(data.outstanding_balance_on_core_credit)
      //       ).toLocaleString();

      //       data.total_number_of_transactions_core = Number(
      //         data.total_number_of_transactions_core
      //       ).toLocaleString();
      //       data.total_number_of_accounts = Number(
      //         data.total_number_of_accounts
      //       ).toLocaleString();
      //       data.total_number_of_currencies = Number(
      //         data.total_number_of_currencies
      //       ).toLocaleString();
      //       data.total_number_of_transactions_ats = Number(
      //         data.total_number_of_transactions_ats
      //       ).toLocaleString();
      //       data.total_number_of_files = Number(
      //         data.total_number_of_files
      //       ).toLocaleString();

      //       this.outstanding_core_total = (
      //         data.outstanding_transactions_on_core_credit +
      //         data.outstanding_transactions_on_core_debit
      //       ).toLocaleString();
      //       this.outstanding_ats_total = (
      //         data.outstanding_transactions_on_ats_credit +
      //         data.outstanding_transactions_on_ats_debit
      //       ).toLocaleString();

      //       data.beginning_balance_ats = Number(
      //         data.beginning_balance_ats
      //       ).toLocaleString();
      //       data.ending_balance_ats = Number(
      //         data.ending_balance_ats
      //       ).toLocaleString();
      //       // total_beginning_balance_core
      //       this.total_beginning_balance_core = (
      //         data.beginning_balance_core_ifb + data.beginning_balance_core_conv
      //       ).toLocaleString();
      //       data.beginning_balance_core_ifb = Number(
      //         data.beginning_balance_core_ifb
      //       ).toLocaleString();
      //       data.beginning_balance_core_conv = Number(
      //         data.beginning_balance_core_conv
      //       ).toLocaleString();
      //       // total_ending_balance_core
      //       this.total_ending_balance_core = (
      //         data.ending_balance_core_ifb + data.ending_balance_core_conv
      //       ).toLocaleString();
      //       data.ending_balance_core_ifb = Number(
      //         data.ending_balance_core_ifb
      //       ).toLocaleString();
      //       data.ending_balance_core_conv = Number(
      //         data.ending_balance_core_conv
      //       ).toLocaleString();

      //       this.outstanding_balance_core_total = (
      //         data.outstanding_balance_on_core_credit +
      //         data.outstanding_balance_on_core_debit
      //       ).toLocaleString();
      //       this.outstanding_balance_ats_total = (
      //         data.outstanding_balance_on_ats_credit +
      //         data.outstanding_balance_on_ats_debit
      //       ).toLocaleString();

      //       data.outstanding_balance_on_core_credit = Number(
      //         data.outstanding_balance_on_core_credit
      //       ).toLocaleString();
      //       data.outstanding_balance_on_core_debit = Number(
      //         data.outstanding_balance_on_core_debit
      //       ).toLocaleString();
      //       data.outstanding_balance_on_ats_credit = Number(
      //         data.outstanding_balance_on_ats_credit
      //       ).toLocaleString();
      //       data.outstanding_balance_on_ats_debit = Number(
      //         data.outstanding_balance_on_ats_debit
      //       ).toLocaleString();

      //       data.number_of_edited_transactions = Number(
      //         data.number_of_edited_transactions
      //       ).toLocaleString();
      //       data.number_of_deleted_transactions = Number(
      //         data.number_of_deleted_transactions
      //       ).toLocaleString();

      //       // ats_ending_balance + total_core_debit) - total_core_credit

      //       // date_7_ending_balance_ats, outstanding_balance_on_core_debit, outstanding_balance_on_core_credit

      //       this.dashboard_data = data;
      //       if (this.authService.isUser()) {
      //         this.chartOne();
      //         this.chartTwo();
      //         this.chartThree();
      //       }
      //       this.data_is_ready = true;
      //     },
      //     (error) => {
      //       if (error.error.text === 'access-token-expired') {
      //         console.log('Access-token-expired requesting refresh token...');
      //         if (
      //           this.localStorageService.retrieve('refresh_token_requested') ==
      //           null
      //         ) {
      //           this.utilService.refreshToken().subscribe(
      //             (data) => {
      //               if (data === true) {
      //                 console.log(
      //                   'refresh token success re-requesting the actual request'
      //                 );
      //                 this.localStorageService.clear('refresh_token_requested');
      //                 //================================================================================
      //                 this.dashboardService.getDashboardData().subscribe(
      //                   (data: any) => {
      //                     console.log(
      //                       'dashboard data: ' + JSON.stringify(data, null, 6)
      //                     );
      //                     console.log(
      //                       'number_of_edited_transactions: ' +
      //                         Number(
      //                           data.total_number_of_transactions_core
      //                         ).toLocaleString()
      //                     );
      //                     //69332711
      //                     // date_7_ending_balance_conv, date_7_ending_balance_ifb, outstanding_balance_on_core_debit, outstanding_balance_on_ats_credit

      //                     this.current_adjusted_balance_core = (
      //                       Number(data.date_7_ending_balance_conv) +
      //                       Number(data.date_7_ending_balance_ifb) +
      //                       Number(data.outstanding_balance_on_ats_credit) -
      //                       Number(data.outstanding_balance_on_ats_credit)
      //                     ).toLocaleString();

      //                     this.current_adjusted_balance_ats = (
      //                       Number(data.date_7_ending_balance_ats) -
      //                       Number(data.outstanding_balance_on_core_debit) +
      //                       Number(data.outstanding_balance_on_core_credit)
      //                     ).toLocaleString();

      //                     data.total_number_of_transactions_core = Number(
      //                       data.total_number_of_transactions_core
      //                     ).toLocaleString();
      //                     data.total_number_of_accounts = Number(
      //                       data.total_number_of_accounts
      //                     ).toLocaleString();
      //                     data.total_number_of_currencies = Number(
      //                       data.total_number_of_currencies
      //                     ).toLocaleString();
      //                     data.total_number_of_transactions_ats = Number(
      //                       data.total_number_of_transactions_ats
      //                     ).toLocaleString();
      //                     data.total_number_of_files = Number(
      //                       data.total_number_of_files
      //                     ).toLocaleString();

      //                     this.outstanding_core_total = (
      //                       data.outstanding_transactions_on_core_credit +
      //                       data.outstanding_transactions_on_core_debit
      //                     ).toLocaleString();
      //                     this.outstanding_ats_total = (
      //                       data.outstanding_transactions_on_ats_credit +
      //                       data.outstanding_transactions_on_ats_debit
      //                     ).toLocaleString();

      //                     data.beginning_balance_ats = Number(
      //                       data.beginning_balance_ats
      //                     ).toLocaleString();
      //                     data.ending_balance_ats = Number(
      //                       data.ending_balance_ats
      //                     ).toLocaleString();
      //                     // total_beginning_balance_core
      //                     this.total_beginning_balance_core = (
      //                       data.beginning_balance_core_ifb +
      //                       data.beginning_balance_core_conv
      //                     ).toLocaleString();
      //                     data.beginning_balance_core_ifb = Number(
      //                       data.beginning_balance_core_ifb
      //                     ).toLocaleString();
      //                     data.beginning_balance_core_conv = Number(
      //                       data.beginning_balance_core_conv
      //                     ).toLocaleString();
      //                     // total_ending_balance_core
      //                     this.total_ending_balance_core = (
      //                       data.ending_balance_core_ifb +
      //                       data.ending_balance_core_conv
      //                     ).toLocaleString();
      //                     data.ending_balance_core_ifb = Number(
      //                       data.ending_balance_core_ifb
      //                     ).toLocaleString();
      //                     data.ending_balance_core_conv = Number(
      //                       data.ending_balance_core_conv
      //                     ).toLocaleString();

      //                     this.outstanding_balance_core_total = (
      //                       data.outstanding_balance_on_core_credit +
      //                       data.outstanding_balance_on_core_debit
      //                     ).toLocaleString();
      //                     this.outstanding_balance_ats_total = (
      //                       data.outstanding_balance_on_ats_credit +
      //                       data.outstanding_balance_on_ats_debit
      //                     ).toLocaleString();

      //                     data.outstanding_balance_on_core_credit = Number(
      //                       data.outstanding_balance_on_core_credit
      //                     ).toLocaleString();
      //                     data.outstanding_balance_on_core_debit = Number(
      //                       data.outstanding_balance_on_core_debit
      //                     ).toLocaleString();
      //                     data.outstanding_balance_on_ats_credit = Number(
      //                       data.outstanding_balance_on_ats_credit
      //                     ).toLocaleString();
      //                     data.outstanding_balance_on_ats_debit = Number(
      //                       data.outstanding_balance_on_ats_debit
      //                     ).toLocaleString();

      //                     data.number_of_edited_transactions = Number(
      //                       data.number_of_edited_transactions
      //                     ).toLocaleString();
      //                     data.number_of_deleted_transactions = Number(
      //                       data.number_of_deleted_transactions
      //                     ).toLocaleString();

      //                     // ats_ending_balance + total_core_debit) - total_core_credit

      //                     // date_7_ending_balance_ats, outstanding_balance_on_core_debit, outstanding_balance_on_core_credit

      //                     this.dashboard_data = data;
      //                     if (this.authService.isUser()) {
      //                       this.chartOne();
      //                       this.chartTwo();
      //                       this.chartThree();
      //                     }
      //                     this.data_is_ready = true;
      //                   },
      //                   (error) => {
      //                     if (error.error.text === 'access-token-expired') {
      //                       console.log('refresh token expired.');
      //                       this.SwalSessionExpired.fire();
      //                       this._refreshTokenExpired();
      //                     } else {
      //                       Swal.fire({
      //                         icon: 'error',
      //                         title: 'Oops...',
      //                         text: 'Something went wrong!',
      //                       });
      //                       console.log(
      //                         JSON.stringify(error.error.apierror, null, 2)
      //                       );
      //                     }
      //                   }
      //                 );
      //                 //================================================================================
      //               } else {
      //                 console.log('refresh token expired.');
      //                 this.SwalSessionExpired.fire();
      //                 this._refreshTokenExpired();
      //               }
      //             },
      //             (error: any) => {
      //               console.log('error refreshing access token');
      //               Swal.fire({
      //                 icon: 'error',
      //                 title: 'Oops...',
      //                 text: 'Something went wrong!',
      //               });
      //               console.log(JSON.stringify(error.error.apierror, null, 2));
      //             }
      //           );
      //           this.localStorageService.store('refresh_token_requested', true);
      //         }
      //       }else {
      //         Swal.fire({
      //           icon: 'error',
      //           title: 'Oops...',
      //           text: 'Something went wrong!',
      //         });
      //         console.log(JSON.stringify(error.error.apierror, null, 2));
      //       }
      //     }


      // );
    }
  }
  chartOne() {
    const data = {
      labels: [
        this.dashboard_data.date_1_1,
        this.dashboard_data.date_2_1,
        this.dashboard_data.date_3_1,
        this.dashboard_data.date_4_1,
        this.dashboard_data.date_5_1,
        this.dashboard_data.date_6_1,
        this.dashboard_data.date_7_1,
      ],
      datasets: [
        {
          label: 'Uploaded-ATS',
          data: [
            this.dashboard_data.date_1_total_upload_ats,
            this.dashboard_data.date_2_total_upload_ats,
            this.dashboard_data.date_3_total_upload_ats,
            this.dashboard_data.date_4_total_upload_ats,
            this.dashboard_data.date_5_total_upload_ats,
            this.dashboard_data.date_6_total_upload_ats,
            this.dashboard_data.date_7_total_upload_ats,
          ],
          backgroundColor: '#FF8066',
          barThickness: 15,
          stack: 'Stack 0',
        },
        {
          label: 'Uploaded-CORE',
          data: [
            this.dashboard_data.date_1_total_upload_core,
            this.dashboard_data.date_2_total_upload_core,
            this.dashboard_data.date_3_total_upload_core,
            this.dashboard_data.date_4_total_upload_core,
            this.dashboard_data.date_5_total_upload_core,
            this.dashboard_data.date_6_total_upload_core,
            this.dashboard_data.date_7_total_upload_core,
          ],
          backgroundColor: '#2C73D2',
          barThickness: 15,
          stack: 'Stack 0',
        },
        {
          label: 'Matched-ATS',
          data: [
            this.dashboard_data.date_1_matched_ats,
            this.dashboard_data.date_2_matched_ats,
            this.dashboard_data.date_3_matched_ats,
            this.dashboard_data.date_4_matched_ats,
            this.dashboard_data.date_5_matched_ats,
            this.dashboard_data.date_6_matched_ats,
            this.dashboard_data.date_7_matched_ats,
          ],
          backgroundColor: '#0089BA',
          barThickness: 15,
          stack: 'Stack 1',
        },
        {
          label: 'Matched-CORE',
          data: [
            this.dashboard_data.date_1_matched_core,
            this.dashboard_data.date_2_matched_core,
            this.dashboard_data.date_3_matched_core,
            this.dashboard_data.date_4_matched_core,
            this.dashboard_data.date_5_matched_core,
            this.dashboard_data.date_6_matched_core,
            this.dashboard_data.date_7_matched_core,
          ],
          backgroundColor: '#008F7A',
          barThickness: 15,
          stack: 'Stack 1',
        },
        {
          label: 'Outstanding-ATS',
          data: [
            this.dashboard_data.date_1_outstanding_core,
            this.dashboard_data.date_2_outstanding_core,
            this.dashboard_data.date_3_outstanding_core,
            this.dashboard_data.date_4_outstanding_core,
            this.dashboard_data.date_5_outstanding_core,
            this.dashboard_data.date_6_outstanding_core,
            this.dashboard_data.date_7_outstanding_core,
          ],
          backgroundColor: '#B39CD0',
          barThickness: 15,
          stack: 'Stack 2',
        },
        {
          label: 'Outstanding-CORE',
          data: [
            this.dashboard_data.date_1_outstanding_core,
            this.dashboard_data.date_2_outstanding_core,
            this.dashboard_data.date_3_outstanding_core,
            this.dashboard_data.date_4_outstanding_core,
            this.dashboard_data.date_5_outstanding_core,
            this.dashboard_data.date_6_outstanding_core,
            this.dashboard_data.date_7_outstanding_core,
          ],
          backgroundColor: '#00C9A7',
          barThickness: 15,
          stack: 'Stack 2',
        },
      ],
    };
    this.chart1 = new Chart('MyChart', {
      type: 'bar',

      data: data,
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
    if (this.chart1.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart1_no_data = true;
    }
  }
  chartTwo() {
    const data = {
      labels: ['RTGS', 'ERCA', 'SOS', 'B2B'],
      datasets: [
        {
          label: 'CORE',
          data: [
            this.dashboard_data.number_of_matched_transactions_core_rtgs,
            this.dashboard_data.number_of_matched_transactions_core_erca,
            this.dashboard_data.number_of_matched_transactions_core_sos,
            this.dashboard_data.number_of_matched_transactions_core_b2b,
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(45, 59, 144)',
          ],
        },
        {
          label: 'ATS',
          data: [
            this.dashboard_data.number_of_matched_transactions_ats_rtgs,
            this.dashboard_data.number_of_matched_transactions_ats_erca,
            this.dashboard_data.number_of_matched_transactions_ats_sos,
            this.dashboard_data.number_of_matched_transactions_ats_b2b,
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(45, 59, 144)',
          ],
        },
      ],
    };
    this.chart2 = new Chart('MyChart2', {
      type: 'pie',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
          // title: {
          //   display: true,
          //   text: 'Chart.js Pie Chart',
          // },
        },
      },
    });
    if (this.chart2.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart2_no_data = true;
    }
  }
  chartThree() {
    console.log('dddd: ' + this.dashboard_data.date_5_beginning_balance_ifb);
    console.log('dddd: ' + this.dashboard_data.date_5_beginning_balance_conv);
    console.log(
      'dddd: ' +
      Number(this.dashboard_data.date_5_beginning_balance_ifb) +
      Number(this.dashboard_data.date_5_beginning_balance_conv)
    );

    const data = {
      labels: [
        this.dashboard_data.date_1_1.slice(3, 5) + '-beg',
        this.dashboard_data.date_1_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_2_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_2_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_3_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_3_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_4_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_4_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_5_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_5_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_6_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_6_1.slice(3, 5) +
        '-end\n' +
        this.dashboard_data.date_7_1.slice(3, 5) +
        '-beg',
        this.dashboard_data.date_7_1.slice(3, 5) + '-end',
      ],
      datasets: [
        {
          label: 'ATS Balance',
          data: [
            this.dashboard_data.date_1_beginning_balance_ats,
            this.dashboard_data.date_2_beginning_balance_ats,
            this.dashboard_data.date_3_beginning_balance_ats,
            this.dashboard_data.date_4_beginning_balance_ats,
            this.dashboard_data.date_5_beginning_balance_ats,
            this.dashboard_data.date_6_beginning_balance_ats,
            this.dashboard_data.date_7_beginning_balance_ats,
            this.dashboard_data.date_7_ending_balance_ats,
          ],
          fill: false,
          borderColor: 'limegreen',
          tension: 0.1,
        },
        {
          label: 'CORE Balance',
          data: [
            this.dashboard_data.date_1_beginning_balance_ifb +
            this.dashboard_data.date_1_beginning_balance_conv,
            this.dashboard_data.date_2_beginning_balance_ifb +
            this.dashboard_data.date_2_beginning_balance_conv,
            this.dashboard_data.date_3_beginning_balance_ifb +
            this.dashboard_data.date_3_beginning_balance_conv,
            this.dashboard_data.date_4_beginning_balance_ifb +
            this.dashboard_data.date_4_beginning_balance_conv,
            this.dashboard_data.date_5_beginning_balance_ifb +
            this.dashboard_data.date_5_beginning_balance_conv,
            this.dashboard_data.date_6_beginning_balance_ifb +
            this.dashboard_data.date_6_beginning_balance_conv,
            this.dashboard_data.date_7_beginning_balance_ifb +
            this.dashboard_data.date_7_beginning_balance_conv,
            this.dashboard_data.date_7_ending_balance_ifb +
            this.dashboard_data.date_7_ending_balance_conv,
          ],
          fill: false,
          borderColor: 'red',
          tension: 0.1,
        },
        {
          label: 'CORE-IFB Balance',
          data: [
            this.dashboard_data.date_1_beginning_balance_ifb,
            this.dashboard_data.date_2_beginning_balance_ifb,
            this.dashboard_data.date_3_beginning_balance_ifb,
            this.dashboard_data.date_4_beginning_balance_ifb,
            this.dashboard_data.date_5_beginning_balance_ifb,
            this.dashboard_data.date_6_beginning_balance_ifb,
            this.dashboard_data.date_7_beginning_balance_ifb,
            this.dashboard_data.date_7_ending_balance_ifb,
          ],
          fill: false,
          borderColor: 'blue',
          tension: 0.1,
        },
        {
          label: 'CORE-CONV Balance',
          data: [
            this.dashboard_data.date_1_beginning_balance_conv,
            this.dashboard_data.date_2_beginning_balance_conv,
            this.dashboard_data.date_3_beginning_balance_conv,
            this.dashboard_data.date_4_beginning_balance_conv,
            this.dashboard_data.date_5_beginning_balance_conv,
            this.dashboard_data.date_6_beginning_balance_conv,
            this.dashboard_data.date_7_beginning_balance_conv,
            this.dashboard_data.date_7_ending_balance_conv,
          ],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
    this.chart3 = new Chart('MyChart3', {
      type: 'line',
      data: data,
      options: {
        aspectRatio: 2.5,
      },
    });
    if (this.chart3.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart3_no_data = true;
    }
  }
  ////////////////////////      chart4  begin       //////////////////////////////////
  chartFour() {
    const data = {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [
        {
          label: 'Account',
          data: [
            this.dashboard_data.number_of_account_approved,
            this.dashboard_data.number_of_account_pending,
            this.dashboard_data.number_of_account_rejected,
          ],
          backgroundColor: [
            'rgb(102, 153, 153)',
            'rgb(210, 210, 210)',
            'rgb(255, 204, 204)',
          ],
        },
        {
          label: 'Currency',
          data: [
            this.dashboard_data.number_of_currency_approved,
            this.dashboard_data.number_of_currency_pending,
            this.dashboard_data.number_of_currency_rejected,
          ],
          backgroundColor: [
            'rgb(102, 153, 153)',
            'rgb(210, 210, 210)',
            'rgb(255, 204, 204)',
          ],
        },
      ],
    };
    this.chart4 = new Chart('MyChart4', {
      type: 'pie',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
          // title: {
          //   display: true,
          //   text: 'Chart.js Pie Chart',
          // },
        },
      },
    });
    if (this.chart4.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart4_no_data = true;
    }
  }
  ////////////////////////       chart end        //////////////////////////////////
  chartFive() {
    const data = {
      labels: ['Admin', 'User', 'Approver'],
      datasets: [
        {
          label: 'functionalities',
          data: [
            this.adminDashboard_data.total_number_of_admin_functionalities,
            this.adminDashboard_data.total_number_of_user_functionalities,
            this.adminDashboard_data.total_number_of_approver_functionalities,
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
        },
      ],
    };
    this.chart5 = new Chart('MyChart5', {
      type: 'pie',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
          // title: {
          //   display: true,
          //   text: 'Chart.js Pie Chart',
          // },
        },
      },
    });
    if (this.chart5.data.datasets[0].data.every((item: number) => item == 0)) {
      this.chart5_no_data = true;
    }
  }
  logout() {
    // this.authService.logout()
    // console.log(this.authService.logout())

    this.authService.logout().subscribe(
      (data) => {
        if (data) {
          console.log(data);
        } else {
          console.log('login failed 001');
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
                      } else {
                        console.log('login failed 001');
                      }
                      // this.router.navigateByUrl('/register-success');
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
    this.router.navigateByUrl('/landing-page');
  }
  logoutAll() {
    // this.authService.logout()
    // console.log(this.authService.logout())

    this.authService.logoutAll().subscribe(
      (data) => {
        if (data) {
          console.log(data);
        } else {
          console.log('login failed 001');
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
                      } else {
                        console.log('login failed 001');
                      }
                      // this.router.navigateByUrl('/register-success');
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
    this.router.navigateByUrl('/landing-page');
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

/**
 * 
<div class="row">
    <div class="col-12">
        <div class="page-title-box">
            <app-navigator-upper></app-navigator-upper>
            <h4 class="page-title">Home</h4>
            <div class="row">
                <div class="col-md-6 ">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-book-account float-end'></i>
                                    <h6 class="text-uppercase mt-0">Accounts</h6>
                                    <h2 class="my-2" id="active-users-count">121</h2>
                                    <p class="mb-0 text-muted">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Number of created accounts</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-eur float-end'></i>
                                    <h6 class="text-uppercase mt-0">Currencies</h6>
                                    <h2 class="my-2" id="active-users-count">121</h2>
                                    <p class="mb-0 text-muted">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Number of created currencies</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 ">
                    <div class="row">
                        <div class="col-lg-6 col-xl-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-bank-transfer float-end'></i>
                                    <h6 class="text-uppercase mt-0">Transactions</h6>
                                    <h4 class="my-0" id="active-users-count">ATS &nbsp;&nbsp;&nbsp;:&nbsp; <span
                                            class="dashboard-number-text">6,784,457</span></h4>
                                    <h4 class="mb-1 mt-0" id="active-users-count">CORE&nbsp; :&nbsp; <span
                                            class="dashboard-number-text">6,545,158</span></h4>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total number of transactions</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-xl-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-file-chart float-end'></i>
                                    <h6 class="text-uppercase mt-0">Files</h6>
                                    <h2 class="my-2" id="active-users-count">121</h2>
                                    <p class="mb-0 text-muted">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total number of uploaded files</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body" style="height: 304px">
                                    <i class='mdi mdi-24px mdi-bank-transfer float-end'></i>
                                    <h6 class="text-uppercase mt-0">Current Transactions</h6>
                                    <h5 class="my-2 text-center mt-3" id="active-users-count">Core Total
                                        &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,784</span></h5>
                                    <h5 class="my-1 mt-3" id="active-users-count">Core Credit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,78</span></h5>
                                    <h5 class="my-1 mt-2" id="active-users-count">Core Debit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784</span></h5>
                                    <h5 class="my-2 text-center mt-3" id="active-users-count">Ats Total
                                        &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,78</span></h5>
                                    <h5 class="my-1 mt-2" id="active-users-count">Ats Credit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,78</span></h5>
                                    <h5 class="my-2 " id="active-users-count">Ats Debit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784</span></h5>
                                    <!-- <h4 class="my-1" id="active-users-count">ATS &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,784,457</span></h4> -->
                                    <!-- <h4 class="mb-1 mt-0" id="active-users-count">CORE : <span class="dashboard-number-text">6,545,158</span></h4> -->

                                    <p class="mb-0 text-muted ">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Current outstanding transactions</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">Beginning balance at ats</h6>
                                    <h2 class="my-2" id="active-users-count">6,784,457</h2>
                                    <p class="mb-0 text-muted">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span>
                                            5.27%</span> -->
                                        <span class="text-nowrap">Beginning balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">Ending balance at ats</h6>
                                    <h2 class="my-2" id="active-users-count">6,784,457</h2>
                                    <p class="mb-0 text-muted">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span>
                                            5.27%</span> -->
                                        <span class="text-nowrap">Ending balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-body" style="height: 304px !important">
                                    <h6 class="text-uppercase mt-0">Transactions of the last 7 days</h6>
                                    <div class="row" style="    display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 100%;
                                padding: 12px;">
                                        <canvas id="MyChart">{{ chart }}</canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-body" style="height: 468px !important">
                                    <h6 class="text-uppercase mt-0">total Matched transactions</h6>
                                    <div class="row" style="    display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 100%;
                                padding-bottom: 12px;">
                                        <canvas id="MyChart2">{{ chart }}</canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body" style="height: 304px">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">Current Balance</h6>
                                    <h5 class="my-2 text-center mt-3" id="active-users-count">Core Total
                                        &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,784,457</span></h5>
                                    <h5 class="my-1 mt-3" id="active-users-count">Core Credit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784,457</span></h5>
                                    <h5 class="my-1 mt-2" id="active-users-count">Core Debit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784,457</span></h5>
                                    <h5 class="my-2 text-center mt-3" id="active-users-count">Ats Total
                                        &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,784,457</span></h5>
                                    <h5 class="my-1 mt-2" id="active-users-count">Ats Credit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784,457</span></h5>
                                    <h5 class="my-2 " id="active-users-count">Ats Debit &nbsp;&nbsp;&nbsp;: <span
                                            class="dashboard-number-text">6,784,457</span></h5>
                                    <!-- <h4 class="my-1" id="active-users-count">ATS &nbsp;&nbsp;&nbsp;: <span class="dashboard-number-text">6,784,457</span></h4> -->
                                    <!-- <h4 class="mb-1 mt-0" id="active-users-count">CORE : <span class="dashboard-number-text">6,545,158</span></h4> -->

                                    <p class="mb-0 text-muted ">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Current outstanding balance</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">BEGINNING BALANCE AT core</h6>
                                    <h4 class="my-0" id="active-users-count">IFB &nbsp;&nbsp;&nbsp;:&nbsp; <span
                                            class="dashboard-number-text">6,784,457</span></h4>
                                    <h4 class="mb-1 mt-0" id="active-users-count">CONV&nbsp; :&nbsp; <span
                                            class="dashboard-number-text">6,545,158</span></h4>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Beginning balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">ENDING BALANCE AT core</h6>
                                    <h4 class="my-0" id="active-users-count">IFB &nbsp;&nbsp;&nbsp;:&nbsp; <span
                                            class="dashboard-number-text">6,784,457</span></h4>
                                    <h4 class="mb-1 mt-0" id="active-users-count">CONV&nbsp; :&nbsp; <span
                                            class="dashboard-number-text">6,545,158</span></h4>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Ending balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">total BEGINNING BALANCE AT CORE</h6>
                                    <h2 class="my-2" id="active-users-count">121,867,657</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total beginning balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">total ENDING BALANCE AT core</h6>
                                    <h2 class="my-2" id="active-users-count">121,867,657</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total Ending balance of the last day</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">adjusted BALANCE AT ats</h6>
                                    <h2 class="my-2" id="active-users-count">121,867,657</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total adjusted balance at ats</span>
                                    </p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-book-edit float-end'></i>
                                    <h6 class="text-uppercase mt-0">edited transactions</h6>
                                    <h2 class="my-2" id="active-users-count">8</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total number of edited transactions</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-currency-usd float-end'></i>
                                    <h6 class="text-uppercase mt-0">adjusted BALANCE AT core</h6>
                                    <h2 class="my-2" id="active-users-count">121,867,657</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total adjusted balance at core</span>
                                    </p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <i class='mdi mdi-24px mdi-delete float-end'></i>
                                    <h6 class="text-uppercase mt-0">deleted transactions</h6>
                                    <h2 class="my-2" id="active-users-count">12</h2>
                                    <p class="mb-0 text-muted float-bottom">
                                        <!-- <span class="text-success me-2"><span class="mdi mdi-arrow-up-bold"></span> 5.27%</span> -->
                                        <span class="text-nowrap">Total number of deleted transactions</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 ">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-body" style="height: 304px !important">
                                    <h6 class="text-uppercase mt-0">BEGINNING-ENDING balance of the last 7 days</h6>
                                    <div class="row" style="    display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 100%;
                                padding: 12px;">
                                        <canvas id="MyChart3">{{ chart }}</canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
 */
