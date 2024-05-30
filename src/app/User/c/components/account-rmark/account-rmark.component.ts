import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { FormBuilder } from '@angular/forms';
import { CurrencyService } from 'src/app/User/services/currency.service';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { RemarkPayload } from 'src/app/User/payloads/remark-payload';
import { CheckEmailExistPayload } from 'src/app/Admin/payloads/admin_check_email_exist_payload';
import { RemarkService } from 'src/app/User/services/remark.service';
// import { RemarkService } from 'src/app/User/c/components/remark.service'
// import { RemarkPayload } from 'src/app/User/c/components/remark-payload'
// import { EmailPayload } from 'src/app/User/payloads/email-payload'
@Component({
  selector: 'app-account-rmark',
  templateUrl: './account-rmark.component.html',
  styleUrls: ['./account-rmark.component.css'],
})
export class AccountRmarkComponent implements OnInit, AfterViewInit, OnDestroy {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild(DataTableDirective)
  datatableElement!: DataTableDirective;
  remarkPayload: RemarkPayload = new RemarkPayload();
  emailPayload!: CheckEmailExistPayload;
  dtOptions: any;
  first_column_id = '0';
  second_column_id = '1';
  third_column_id = '2';
  fourth_column_id = '3';

  first_column_title = 'Tile';
  second_column_title = 'Description';
  third_column_title = 'Sent from';
  fourth_column_title = ' Sent Date';
  fifth_column_title = 'Action';
  email: any;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private localStorageService: LocalStorageService,
    private service: CurrencyService,
    private services: RemarkService,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private utilService: UtilService,
    private activatedRoute: ActivatedRoute
  ) {}

  goToPage(pageName: string) {
    // this.router.navigate([{ outlets: { inner_outlet: [`${pageName}`] } }])
    this.router.navigate([`${pageName}`]);
  }

  displayToConsole(datatableElement: DataTableDirective): void {
    datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
      console.log(dtInstance)
    );
  }

  ngOnInit(): void {
    this.services.getEmail().subscribe(
      (data) => {
        // this.email  = data.email;
        this.localStorageService.store('email', data.email);
        console.log('Email: ' + this.email);
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

                  this.services.getEmail().subscribe(
                    (data) => {
                      // this.email  = data.email;
                      this.localStorageService.store('email', data.email);
                      console.log('Email: ' + this.email);
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

    (this.email = this.localStorageService.retrieve('email')),
      (this.remarkPayload.userId = this.localStorageService.retrieve('user'));
    const that = this;
    this.dtOptions = {
      serverSide: false,
      scrollX: true,
      searching: true,
      // lengthMenu: 'ten',
      lengthChange: true,
      ordering: true,
      paging: true,

      // scrollY: 400,
      pagingType: 'full_numbers',
      pageLength: 7,
      // select: true,

      ajax: (dataTablesParameters: any, callback: any) => {
        this.services.getaccountRemark().subscribe((resp) => {
          console.log('currency ajax');

          callback({
            data: resp,
            // <-- see here
          });
        },
        (error: any) => {
          if (error.error.text === 'access-token-expired') {
            console.log('Access-token-expired requesting refresh token...');
            if (
              this.localStorageService.retrieve('refresh_token_requested') ==
              null
            )
             {
              this.utilService.refreshToken().subscribe(
                (data) => {
                  if (data === true) {
                    console.log(
                      'refresh token success re-requesting the actual request'
                    );
                    this.localStorageService.clear('refresh_token_requested');
                    //================================================================================
                    this.services.getaccountRemark().subscribe((resp) => {
                      console.log('currency ajax');
            
                      callback({
                        data: resp,
                        // <-- see here
                      });
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


      },
      columns: [
        {
          e: AnalyserNode,
          title: this.first_column_title,
          data: 'title',
        },
        {
          title: this.second_column_title,
          data: 'description',
        },
        {
          title: this.fourth_column_title,
          data: 'created_date',
        },
        {
          //email: this.emails,
          // this.localStorageService.retrieve("email"),
          title: this.third_column_title,
          //email=this.localStorageService.retrieve("email"),
          render: function (data: any, type: any, full: any) {
            //  =
            var email = that.localStorageService.retrieve('email');
            //that
            if (full.email == that.email) {
              return '<i class="mdi mdi-check">Me</i>';
            } else {
              return (
                full.firstname + '-' + full.middlename + '-' + full.lastname
              );
            }
          },
        },
        {
          title: this.fifth_column_title,
          render: function (data: any, type: any, full: any) {
            if (full.email == that.email) {
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button');
              return (
                '<button class="btn btn-outline-info btn-rounded" edit-account-id="' +
                full.id +
                '"><i class="mdi mdi-update"></i> Update</button>' +
                '<button class="btn btn-outline-warning btn-rounded" delete-account-id="' +
                full.id +
                '"><i class="mdi mdi-delete"></i> Delete</button>'
              );
            } else {
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button');
              return (
                '<button class="btn btn-outline-success btn-rounded"replay-account-id="' +
                full.id +
                '"><i class="mdi mdi-replay"></i> Replay</button>' +
                '<button class="btn btn-outline-warning btn-rounded" delete-account-id="' +
                full.id +
                '"><i class="mdi mdi-delete"></i> Delete</button>'
              );
            }
          },
        },
      ],

      // dom: 'Bfrtip',
      dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: 'Plfrtip',
      // dom: "<'row mb-1'<'col-sm-5'P><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",

      // dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: 'Qlf',
      colReorder: {
        order: [0, 1, 2, 3],
        // fixedColumnsRight: 1
        fixedColumnsLeft: 1,
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
              // alert('reload success');
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
            text: 'Some button',
            key: '2',
            action: function (e: any, dt: any, node: any, config: any) {
              alert('Button activated');
            },
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
          {
            extend: 'fixedColumns',
            config: {
              left: 1,
              right: 1,
            },
            fade: true,
          },
          // 'searchPanes',
          // {
          //       extend: 'searchPanes',
          //       config: {
          //           cascadePanes: true
          //       }
          //   }
        ],
      },

      //   searchBuilder: {
      //     preDefined: {
      //         criteria: [
      //             {
      //                 data: 'Id',
      //                 condition: '=',
      //                 value: [50]
      //             }
      //         ]
      //     }
      // },
      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
          // className: 'select-checkbox',
        },
        {
          searchPanes: {
            show: true,
          },
          targets: [0, 1, 2],
          // targets: [0, 1, 2, 3, 4, 5]
        },
        {
          searchPanes: {
            show: false,
          },
          targets: [3],
        },
        // {
        //   targets: 0,
        //   orderable: false,
        //   // className: 'select-checkbox',
        // },
        // {
        //   targets: [2],
        //   visible: false,
        // },
      ],
      // Selection: {
      //   style: 'os',
      //   order: 'current',
      //   page: 'all',
      //   search:'applied'
      //   // selector: 'td:second-child',
      // },
      //   select: {
      //     select: true,
      //     style:    'os',
      //     selector: 'td:first-child',
      //     blurable: true
      // },
      select: false,

      stateSave: false,
      stateDuration: 0,
      // fixedHeader: true,
      // fixedFooter: true,
      fixedHeader: {
        header: true,
        //  headerOffset: $('.navbar-custom').outerHeight(false)! - 1,
      },
      // fixed column
      // scrollY:        "300px",
      // scrollX:        true,
      scrollCollapse: true,
      // paging:         false,
      fixedColumns: true,
      //Keys
      keys: false,
      //search panes
      searchPanes: {
        initCollapsed: true,
        layout: 'columns-3',
        // threshold: 0.1,
        cascadePanes: true,
        viewTotal: true,
        columns: [0, 1, 2],
        clear: true,
        dtOpts: {
          dom: 'tp',
          paging: true,
          pagingType: 'numbers',
          searching: true,
        },
      },
      language: {
        searchPanes: {
          count: '{total} found',
          countFiltered: '{shown} / {total}',
        },
      },
    };
    // this.input_0 = this.localStorageService.retrieve('_id')
    // this.input_1 = this.localStorageService.retrieve('_firstName')
    // this.input_2 = this.localStorageService.retrieve('_lastName')
    // Object.keys(localStorage).forEach((data) => {
    //   let item = localStorage.getItem(data)
    //   console.log(JSON.stringify(data, null, 2)) // item is the item from storage.
    //   console.log(JSON.stringify(item, null, 2)) // item is the item from storage.
    // })
    // if (localStorage.getItem('DataTables_table_1_/view_assignments') === null)
    if (
      !localStorage.getItem('DataTables_table_1_/view-account-remarks') === null
    ) {
      console.log(
        'it exists: ' +
          // JSON.stringify(
          localStorage.getItem('DataTables_table_1_/view-account-remarks')
            ?.search
        // null,
        // 2,
        // ),
      );
    }
    let jsonObj = JSON.parse(
      localStorage.getItem('DataTables_table_1_/view-account-remarks')!
    );
    // console.log(jsonObj)
    console.log(jsonObj.columns);
    var counter: number = 0;
    for (let c of jsonObj.columns) {
      console.log(c.search.search);
      if (counter == 0) {
        this.input_0 = c.search.search;
      } else if (counter == 1) {
        this.input_1 = c.search.search;
      } else if (counter == 2) {
        this.input_2 = c.search.search;
      } else if (counter == 3) {
        this.input_3 = c.search.search;
      }
      counter++;
    }
  }

  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function () {
        $('input', this.footer()).on('keyup change', function () {
          if (this['id'] != '') {
            if (
              dtInstance.column(this['id']).search() !==
              (this as HTMLInputElement).value
            ) {
              dtInstance
                .column(this['id'])
                .search((this as HTMLInputElement).value)
                .draw();
              // if (
              //   document.getElementById(this['id'])?.classList.contains('_id')
              // )
              //   that.localStorageService.store(
              //     '_id',
              //     (this as HTMLInputElement).value,
              //   )
              // if (
              //   document
              //     .getElementById(this['id'])
              //     ?.classList.contains('_firstName')
              // )
              //   that.localStorageService.store(
              //     '_firstName',
              //     (this as HTMLInputElement).value,
              //   )
              // if (
              //   document
              //     .getElementById(this['id'])
              //     ?.classList.contains('_lastName')
              // )
              //   that.localStorageService.store(
              //     '_lastName',
              //     (this as HTMLInputElement).value,
              //   )
            }
            console.log('the column is: ' + this['id']);
          }
        });
      });
      dtInstance.on(
        'draw stateRestore-change',
        function (e, settings, details) {
          var c = 0;
          for (let col of settings.aoColumns) {
            console.log(JSON.stringify(col.title, null, 2));
            if (col.title == that.first_column_title) {
              that.first_column_id = c.toString();
            } else if (col.title == that.second_column_title) {
              that.second_column_id = c.toString();
            } else if (col.title == that.third_column_title) {
              that.third_column_id = c.toString();
            } else if (col.title == that.fourth_column_title) {
              that.fourth_column_id = c.toString();
            }
            c++;
          }
        }
      );

      dtInstance.on('column-reorder', function (e, settings, details) {
        var c = 0;
        for (let col of settings.aoColumns) {
          console.log(JSON.stringify(col.title, null, 2));
          if (col.title == that.first_column_title) {
            that.first_column_id = c.toString();
          } else if (col.title == that.second_column_title) {
            that.second_column_id = c.toString();
          } else if (col.title == that.third_column_title) {
            that.third_column_id = c.toString();
          } else if (col.title == that.fourth_column_title) {
            that.fourth_column_id = c.toString();
          }
          c++;
        }
      });
    });
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('replay-account-id')) {
        this.router.navigate([
          'user/view-account-remark/replay-account-remark/' +
            event.target.getAttribute('replay-account-id'),
        ]);
      } else if (event.target.hasAttribute('edit-account-id')) {
        this.router.navigate([
          'user/view-account-remark/edit-account-remark/' +
            event.target.getAttribute('edit-account-id'),
        ]);
      } else if (event.target.hasAttribute('delete-Account-id')) {
        this.services
          .deletAccountRemark(event.target.getAttribute('delete-Account-id'))
          .subscribe(
            (data) => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User deleted successfully!',
              });
              window.location.reload();
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
                    (data: any) => {
                      if (data === true) {
                        console.log(
                          'refresh token success re-requesting the actual request'
                        );
                        this.localStorageService.clear(
                          'refresh_token_requested'
                        );
                        //================================================================================
                        this.services
                        .deletAccountRemark(event.target.getAttribute('delete-Account-id'))
                        .subscribe(
                          (data) => {
                            Swal.fire({
                              icon: 'success',
                              title: 'Success',
                              text: 'User deleted successfully!',
                            });
                            window.location.reload();
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
      }
    });
  }

  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
  }

  filterById(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  saveIdSearchKey() {
    console.log('id changed');
    // this.localStorageService.store('id_search_key', this.id_model)
  }
  saveFirstNameSearchKey() {
    console.log('first name changed');
    // this.localStorageService.store('first_name_search_key', this.first_name_model)
  }
  saveLastNameSearchKey() {
    console.log('last name changed');
    // this.localStorageService.store('last_name_search_key', this.last_name_model)
  }

  input_0!: any;
  input_1!: any;
  input_2!: any;
  input_3!: any;

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

  // _id: string = '_id'
  // _firstName: string = '_firstName'
  // _lastName: string = '_lastName'
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
