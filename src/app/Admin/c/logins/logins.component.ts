import { Component, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-logins',
  templateUrl: './logins.component.html',
  styleUrls: ['./logins.component.css'],
})
export class LoginsComponent implements OnInit {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  // refresh_token_requested = false;
  initialDateValue = new Date();
  reload_checker: boolean = true;
  dtOptions: any;

  first_column_title = 'ID';
  second_column_title = 'User';
  third_column_title = 'Gender';
  fourth_column_title = 'Email';
  fifth_column_title = 'Roles';
  sixth_column_title = 'Activity';
  seventh_column_title = 'Date';
  eighth_column_title = 'Time';
  ninth_column_title = 'Ip';
  tenth_column_title = 'Browser Name';
  eleventh_column_title = 'Browser Version';

  constructor(
    private adminService: AdminService,
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService
  ) {}
  onReconDateChange(value: Date): void {
    this.initialDateValue = new Date(value);
    this.localStorageService.store(
      'recon_current_date_rtgs_manual',
      this.initialDateValue
    );
    if (!this.reload_checker)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.ajax.reload((data) => { }, false);
            });
          }
        }
      );
    this.reload_checker = false;
  }

  ngOnInit() {
    if (
      this.localStorageService.retrieve('recon_current_date_rtgs_manual') ==
      null
    ) {
      this.initialDateValue = new Date();
      this.localStorageService.store(
        'recon_current_date_rtgs_manual',
        this.initialDateValue
      );
    } else
      this.initialDateValue = new Date(
        this.localStorageService.retrieve('recon_current_date_rtgs_manual')
      );
    try {
      this.dtOptions = {
        scrollX: true,
        searching: true,
        lengthChange: true,
        ordering: true,
        paging: true,
        pagingType: 'full_numbers',
        pageLength: 12,
        select: false,

        ajax: (dataTablesParameters: any, callback: any) => {
          this.adminService.getAllLogs(formatDate(this.initialDateValue, 'MM-dd-yyyy', 'en-US')).subscribe(
            async (resp: any) => {
              if (resp != null) {
                console.log(
                  'response for table: ' + JSON.stringify(resp, null, 2)
                );
                callback({
                  recordsTotal: resp.recordsTotal,
                  recordsFiltered: resp.recordsFiltered,
                  data: resp,
                });
                console.log(
                  'records total(after token refresh): ' +
                    JSON.stringify(resp.length)
                );
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Permission',
                  text: 'You are not permitted to perform this action!',
                });
              }
            },
            (error: any) => {
              if (error.error.text === 'access-token-expired') {
                console.log('Access-token-expired requesting refresh token...');
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
                        this.adminService.getAllLogs(formatDate(this.initialDateValue, 'MM-dd-yyyy', 'en-US')).subscribe(
                          async (resp: any) => {
                            if (resp != null) {
                              console.log(
                                'response for table: ' +
                                  JSON.stringify(resp, null, 2)
                              );
                              callback({
                                recordsTotal: resp.recordsTotal,
                                recordsFiltered: resp.recordsFiltered,
                                data: resp,
                              });
                              console.log(
                                'records total(after token refresh): ' +
                                  JSON.stringify(resp.length)
                              );
                            } else {
                              Swal.fire({
                                icon: 'error',
                                title: 'Permission',
                                text: 'You are not permitted to perform this action!',
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
        },
        columns: [
          {
            title: this.first_column_title,
            data: 'role',
          },
          {
            title: this.second_column_title,
            data: 'user',
            // render: function (data: any, type: any, full: any) {
            //   document
            //     .getElementsByClassName('datatable-buttons')[0]
            //     ?.classList.remove('dt-button');
            //   return (
            //     '<h5>' +
            //     full.firstname +
            //     ' ' +
            //     full.middlename +
            //     ' ' +
            //     full.lastname +
            //     '</h5>'
            //   );
            // },
          },
          {
            title: this.third_column_title,
            data: 'gender',
          },
          {
            title: this.fourth_column_title,
            data: 'email',
          },
          {
            title: this.fifth_column_title,
            // data: 'role',
            render: function (data: any, type: any, full: any) {
              var r = ''
              for (let i = 0; i < full.roles.length; i++)
                if (full.roles.length - 1 == i)
                  r = r + full.roles[i].name
                else
                  r = r + full.roles[i].name + ', '
              return r
            },
          },
          {
            title: this.sixth_column_title,
            data: 'activity',
          },
          {
            title: this.seventh_column_title,
            data: 'date',
            // render: function (data: any, type: any, full: any) {
            //   document
            //     .getElementsByClassName('datatable-buttons')[0]
            //     ?.classList.remove('dt-button');
            //   return '<p>' + full.date.slice(0, 10) + '</p>';
            // },
          },
          {
            title: this.eighth_column_title,
            data: 'time',
            // render: function (data: any, type: any, full: any) {
            //   document
            //     .getElementsByClassName('datatable-buttons')[0]
            //     ?.classList.remove('dt-button');
            //   return '<p>' + full.date.slice(10, 21) + '</p>';
            // },
          },
          {
            title: this.ninth_column_title,
            data: 'ip',
          },
          {
            title: this.tenth_column_title,
            data: 'browser_type',
          },
          {
            title: this.eleventh_column_title,
            data: 'browser_version',
          },
        ],
        dom: "<'row mt-1 mx-1'P><'row mb-1 mt-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1 mt-3'Q>",

        colReorder: {
          order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          action: function (e: any, dt: any, node: any, config: any) {
            console.log('reordered');
          },
        },
        buttons: {
          buttons: [
            'colvis',
            ,
            {
              text: 'Reload',
              action: function (e: any, dt: any, node: any, config: any) {
                dt.ajax.reload();
                alert('reload success');
              },
            },
            {
              extend: 'copy',
              text: '<u>C</u>opy',
              key: {
                key: 'c',
                altKey: true,
              },
            },
            'print',
            {
              extend: 'pdf',
              text: 'Pdf',
            },
            {
              extend: 'pdf',
              text: 'Pdf current page',
              exportOptions: {
                modifier: {
                  page: 'current',
                },
              },
            },
            {
              extend: 'excel',
              text: 'Excel',
            },
            {
              extend: 'collection',
              text: 'Header',
              autoClose: true,
              background: true,
              dropup: false,
              collectionTitle: '',
              buttons: [
                {
                  text: 'Enable fixed header',
                  key: '1',
                  action: function (e: any, dt: any, node: any, config: any) {
                    dt.fixedHeader.enable();
                  },
                },
                {
                  text: 'Disable fixed header',
                  key: '1',
                  action: function (e: any, dt: any, node: any, config: any) {
                    dt.fixedHeader.disable();
                  },
                },
              ],
              fade: true,
            },
          ],
        },
        // columnDefs: [
        //   {
        //     targets: '_all',
        //     defaultContent: '-',
        //   },
        // ],
        stateSave: true,
        stateDuration: 0,
        fixedHeader: {
          header: true,
        },
        scrollCollapse: true,
        fixedColumns: false,
        searchPanes: {
          initCollapsed: true,
          cascadePanes: true,
          clear: true,
        },
        columnDefs: [
          {
            searchPanes: {
              show: true,
            },
            targets: [1, 4, 6, 8],
          },
          {
            searchPanes: {
              show: false,
            },
            targets: [0, 2, 3, 5, 7, 9, 10],
          },
        ],
        language: {
          searchPanes: {
            count: '{total} found',
            countFiltered: '{shown} / {total}',
          },
        },
      };
    } catch (ex) {
      console.log('Exception: ' + JSON.stringify(ex));
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
          
*/

