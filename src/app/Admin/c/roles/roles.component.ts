import {
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit, AfterViewInit {
  //Swal Config
  // @ViewChild('DeactivateRoleConfirmation')
  // public readonly DeactivateRoleConfirmation!: SwalComponent;

  //deactivate
  // selected_role: string = '';
  // selected_role_id: string = '';

  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  @ViewChild(DataTableDirective)
  datatableElement!: DataTableDirective;

  dtOptions: any;

  first_column_title = 'ID';
  second_column_title = 'Role';
  third_column_title = 'Description';
  fourth_column_title = 'Status';
  fifth_column_title = 'Action';
  sixth_column_title = 'Functionalities';

  constructor(
    private adminService: AdminService,
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    try {
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
        // ajax: '../../../../assets/data/data.json',
        ajax: (dataTablesParameters: any, callback: any) => {
          this.adminService.getAllRoles().subscribe(
            async (resp: any) => {
              if (resp != null) {
                console.log(
                  'response for table: ' + JSON.stringify(resp, null, 2)
                );
                // data: resp
                callback({
                  recordsTotal: resp.recordsTotal,
                  recordsFiltered: resp.recordsFiltered,
                  data: resp,
                });
                console.log(
                  'records total: ' + JSON.stringify(resp.recordsTotal)
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
                  console.log('it is requested...');
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
                        this.adminService.getAllRoles().subscribe(
                          async (resp: any) => {
                            if (resp != null) {
                              console.log(
                                'response for table: ' +
                                  JSON.stringify(resp, null, 2)
                              );
                              // data: resp
                              callback({
                                recordsTotal: resp.recordsTotal,
                                recordsFiltered: resp.recordsFiltered,
                                data: resp,
                              });
                              console.log(
                                'records total: ' +
                                  JSON.stringify(resp.recordsTotal)
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
                } else {
                  console.log(
                    'it is not requested...: ' +
                      this.localStorageService.retrieve(
                        'refresh_token_requested'
                      )
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
            data: 'id',
          },
          {
            title: this.second_column_title,
            data: 'name',
          },
          {
            title: this.third_column_title,
            data: 'description',
          },
          {
            title: this.fourth_column_title,
            render: function (data: any, type: any, full: any) {
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button');
              if (full.status == 1)
                return '<span class="badge bg-success rounded-pill">Active</span>';

              return '<span class="badge bg-danger rounded-pill">Inactive</span>';
            },
          },
          {
            title: this.fifth_column_title,
            render: function (data: any, type: any, full: any) {
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button');
              if (full.status == 1)
                return (
                  '<button class="btn btn-outline-danger btn-sm" deactivate-role-name="' +
                  full.name +
                  '" deactivate-role="' +
                  full.id +
                  '"><i class="mdi mdi-window-close mr-1"></i>Deactivate</button>'
                );

              return (
                '<button class="btn btn-outline-success btn-sm" activate-role-name="' +
                full.name +
                '" activate-role="' +
                full.id +
                '"><i class="mdi mdi-check"></i>Activate</button>'
              );
              // <button type="button" class="btn btn-warning"><i class="mdi mdi-wrench"></i> </button>
            },
          },
          {
            title: this.sixth_column_title,
            render: function (data: any, type: any, full: any) {
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button');
              return (
                '<button class="btn btn-outline-info btn-rounded" update-functionalities="' +
                full.id +
                '"><i class="mdi mdi-wrench"></i> Update</button>'
              );
              // <button type="button" class="btn btn-outline-danger"><i class="uil-cog"></i> Settings</button>
            },
          },
        ],

        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          const self = this;
          $('td', row).off('click');
          $('td', row).on('click', () => {
            // self.someClickHandler(data);
          });
          return row;
        },
        // dom: 'Bfrtip',
        dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
        // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
        // dom: 'Plfrtip',
        // dom: "<'row mb-1'<'col-sm-5'P><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",

        // dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
        // dom: 'Qlf',
        colReorder: {
          order: [0, 1, 2, 3],
          // fixedColumnsRight: 1
          // fixedColumnsLeft: 1,
          action: function (e: any, dt: any, node: any, config: any) {
            console.log('reordered');
          },
        },
        buttons: {
          buttons: [
            'colvis',
            ,
            // {
            //   extend: 'fixedColumns',
            //   text: 'FixedColumns',
            //   config: {
            //     left: 1,
            //     right: 0
            //   }
            // }
            // {
            //   extend: 'selected',
            //   text: 'Delete',
            //   action: function (e: any, dt: any, node: any, config: any) {
            //     var rows = dt.rows({ selected: true }).data().toArray();
            //     for (let i = 0; i < rows.length; i++) {
            //       console.log('row having database ID ' + rows[i].firstName);
            //     }
            //     alert('There are ' + rows.length + ' selected rows in the table');
            //   },
            // },
            // {
            //   extend: 'collection',
            //   text: 'Select',
            //   buttons: [
            //     'selectAll',
            //     'selectNone',
            //     // 'selectCells',
            //     'selectColumns',
            //     'selectRows',
            //     //Button that is enabled when one or more items are selected in the table
            //     'selected',
            //     // Button that is enabled when a single item is selected in the table
            //     'selectedSingle',
            //     {
            //       text: 'High priority',
            //       action: function () {
            //         alert('working...!!!');
            //       },
            //     },
            //   ],
            //   fade: true,
            // },
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
            // {
            //   extend: 'key',
            //   text: 'Keys',
            // },
            // {
            //   text: 'Some button',
            //   key: '2',
            //   action: function (e: any, dt: any, node: any, config: any) {
            //     alert('Button activated');
            //   },
            // },

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
            // {
            //   extend: 'fixedColumns',
            //   config: {
            //     left: 1,
            //     right: 1,
            //   },
            //   fade: true,
            // },
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
          // {
          //   searchPanes: {
          //     show: true,
          //   },
          //   targets: [0, 1, 2],
          //   // targets: [0, 1, 2, 3, 4, 5]
          // },
          // {
          //   searchPanes: {
          //     show: false,
          //   },
          //   targets: [3],
          // },
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
        //   search: 'applied',
        //   // selector: 'td:second-child',
        // },
        //   select: {
        //     select: true,
        //     style:    'os',
        //     selector: 'td:first-child',
        //     blurable: true
        // },
        // select: true,

        stateSave: true,
        stateDuration: 0,
        // fixedHeader: true,
        // fixedFooter: true,
        fixedHeader: {
          header: true,
          headerOffset: 70,
        },
        // fixed column
        // scrollY:        "300px",
        // scrollX:        true,
        scrollCollapse: true,
        // paging:         false,
        // fixedColumns: false,
        //Keys
        // keys: true,
        // keys: {
        //   blurable: true,
        // },
        //search panes
        // searchPanes: {
        //   initCollapsed: true,
        //   layout: 'columns-3',
        //   // threshold: 0.1,
        //   cascadePanes: true,
        //   viewTotal: true,
        //   columns: [0, 1, 2],
        //   clear: true,
        //   dtOpts: {
        //     dom: 'tp',
        //     paging: false,
        //     pagingType: 'numbers',
        //     searching: true,
        //   },
        // },
        // language: {
        //   searchPanes: {
        //     count: '{total} found',
        //     countFiltered: '{shown} / {total}',
        //   },
        // },
      };
      // console.log('height of navbar: ' + $('#navbar-custom-id_').outerHeight);
    } catch (ex) {
      console.log('Exception: ' + JSON.stringify(ex));
    }
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('deactivate-role')) {
        var selected_role_name = event.target.getAttribute(
          'deactivate-role-name'
        );
        var selected_role_id = event.target.getAttribute('deactivate-role');
        Swal.fire({
          title: 'Deactivate Role: ' + selected_role_name,
          text:
            'Are you sure? you are about to deactivate ' +
            selected_role_name +
            '.This means all users with this role will be prevented from use the system.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Deactivate',
        }).then((result) => {
          if (result.isConfirmed) {
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            this.adminService.deactivateRole(selected_role_id).subscribe(
              (data) => {
                if (data == true) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Successfully Deactivated!',
                  });
                  this.datatableElement.dtInstance.then(
                    (dtInstance: DataTables.Api) => {
                      dtInstance.ajax.reload();
                    }
                  );
                  // this.datatableElement.dtInstance.then()
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
                  console.log(
                    'Access-token-expired requesting refresh token...'
                  );
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
                          this.adminService
                            .deactivateRole(selected_role_id)
                            .subscribe(
                              (data) => {
                                if (data == true) {
                                  Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Successfully Deactivated!',
                                  });
                                  this.datatableElement.dtInstance.then(
                                    (dtInstance: DataTables.Api) => {
                                      dtInstance.ajax.reload();
                                    }
                                  );
                                  // this.datatableElement.dtInstance.then()
                                } else {
                                  Swal.fire({
                                    icon: 'error',
                                    title: 'Permission',
                                    text: 'You are not permitted to perform this action!',
                                  });
                                }
                              },
                              (error) => {
                                if (
                                  error.error.text === 'access-token-expired'
                                ) {
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
                                    JSON.stringify(
                                      error.error.apierror,
                                      null,
                                      2
                                    )
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
      } else if (event.target.hasAttribute('activate-role')) {
        var selected_role_name =
          event.target.getAttribute('activate-role-name');
        var selected_role_id = event.target.getAttribute('activate-role');
        Swal.fire({
          title: 'Activate Role: ' + selected_role_name,
          text:
            'Are you sure? you are about to activate ' +
            selected_role_name +
            '.This means all users with this role will be allowed to use the system.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0acf97',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Activate',
        }).then((result) => {
          if (result.isConfirmed) {
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            this.adminService.activateRole(selected_role_id).subscribe(
              (data) => {
                if (data) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Successfully Activated!',
                  });
                  this.datatableElement.dtInstance.then(
                    (dtInstance: DataTables.Api) => {
                      dtInstance.ajax.reload();
                    }
                  );
                  // this.datatableElement.dtInstance.then()
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
                  console.log(
                    'Access-token-expired requesting refresh token...'
                  );
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
                          this.adminService
                            .activateRole(selected_role_id)
                            .subscribe(
                              (data) => {
                                if (data) {
                                  Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Successfully Activated!',
                                  });
                                  this.datatableElement.dtInstance.then(
                                    (dtInstance: DataTables.Api) => {
                                      dtInstance.ajax.reload();
                                    }
                                  );
                                  // this.datatableElement.dtInstance.then()
                                } else {
                                  Swal.fire({
                                    icon: 'error',
                                    title: 'Permission',
                                    text: 'You are not permitted to perform this action!',
                                  });
                                }
                              },
                              (error) => {
                                if (
                                  error.error.text === 'access-token-expired'
                                ) {
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
                                    JSON.stringify(
                                      error.error.apierror,
                                      null,
                                      2
                                    )
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
      } else if (event.target.hasAttribute('update-functionalities')) {
        this.router.navigateByUrl(
          '/admin/roles/functionalities/' +
            event.target.getAttribute('update-functionalities')
        );
      }
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
  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
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
