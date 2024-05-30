
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  OnDestroy,
} from '@angular/core'
import { DataTableDirective } from 'angular-datatables'
import { ActivatedRoute, Router } from '@angular/router'
import { LocalStorageService } from 'ngx-webstorage'
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2'
import Swal from 'sweetalert2'
import { RemarkPayload } from 'src/app/User/payloads/remark-payload'
import { CurrencyService } from 'src/app/User/services/currency.service'
import { RemarkService } from 'src/app/User/services/remark.service'
import { FormBuilder } from '@angular/forms'
import { AdminService } from 'src/app/Admin/services/admin.service'
import { AuthService } from 'src/app/services/auth-service.service'
import { UtilService } from 'src/app/services/util-service/util.service'
@Component({
  selector: 'app-remark',
  templateUrl: './remark.component.html',
  styleUrls: ['./remark.component.css']
})
export class RemarkComponent implements OnInit, AfterViewInit, OnDestroy {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild(DataTableDirective)
  datatableElement!: DataTableDirective
  remarkPayload: RemarkPayload = new RemarkPayload();
  dtOptions: any

  input_0!: any;
  input_1!: any;
  input_2!: any;
  input_3!: any;
  first_column_id = '0'
  second_column_id = '1'
  third_column_id = '2'
  fourth_column_id = '3'

  first_column_title = 'Tile'
  second_column_title = 'Description'
  third_column_title = 'Sent from'
  fourth_column_title = ' Sent Date'
  fifth_column_title = 'Action'
  email: any

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

  ) { }

  ngOnInit(): void {
    this.services.getEmail().subscribe(
      data => {
       // this.email  = data.email;
       this.localStorageService.store("email",data.email)
        console.log("Email: " + JSON.stringify(data, null, 2))
      }, error => {
        console.log(JSON.stringify(error, null, 3))
      }
    )
    this.email=this.localStorageService.retrieve("email"),
    
    this.remarkPayload.userId = this.localStorageService.retrieve('user');
    const that=this
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
      select: false,
      // ajax: '../../../../assets/data/data.json',

      ajax: (dataTablesParameters: any, callback: any) => {
        this.services.getUserRemark().subscribe( async (resp: any) => {
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
        },);

        (error: any) => {
          if (error.error.text === 'access-token-expired') {
            console.log('Access-token-expired requesting refresh token...');
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
                    this.services.getUserRemark().subscribe(
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
  

      },
      columns: [
        {
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
          title: this.third_column_title,
          render: function (data: any, type: any, full: any) {
            var email = that.localStorageService.retrieve('email')
            //that
            if (full.email==that.email) {
             
              return (
                '<i class="mdi mdi-check">Me</i>'
                )
            }
            else {

              return (
                full.firstname + '-' + full.middlename + "-" + full.lastname )
            }

          }

        },
        {
          title: this.fifth_column_title,
          render: function (data: any, type: any, full: any) { 
            if (full.email == that.email) {
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button')
              return (

                '<button class="btn btn-outline-info btn-rounded" edit-currency-id="' +
                full.id +  '"><i class="mdi mdi-update"></i> Update</button>' +

                '<button class="btn btn-outline-warning btn-rounded" delete-currency-id="' +
                full.id +  '"><i class="mdi mdi-delete"></i> Delete</button>'


              )
            }
            else {
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button')
              return (

                '<button class="btn btn-outline-success btn-rounded"replay-id="' + 
                full.id +
                '"><i class="mdi mdi-replay"></i> Replay</button>' +
                '<button class="btn btn-outline-warning btn-rounded" delete-currency-id="' +
                full.id +  '"><i class="mdi mdi-delete"></i> Delete</button>'


              )
            }},
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
       dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
       // "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
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
          //   },
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

          {
            extend: 'collection',
            text: 'Header',
            autoClose: true,
            background: true,
            dropup: true,
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

      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
          // className: 'select-checkbox',
        },

      ],

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
      //select: true,

      //stateSave: true,
      stateDuration: 0,
      //fixedFooter: true,
      fixedHeader: {
       header: true,
       
      },
      scrollCollapse: true,
      // fixed column
      // scrollY:        "300px",
      // scrollX:        true,
      //scrollCollapse: true,
      // paging:         false,
      fixedColumns: true,
      // columnDefs: [
      //   {
      //     targets: '_all',
      //     defaultContent: '-',
      //     // className: 'select-checkbox',
      //   },
        //   {
        //     searchPanes: {
        //       show: true,
        //     },
        //     targets: [0, 1, 4, 5, 8],
        //   },
        //   {
        //     searchPanes: {
        //       show: false,
        //     },
        //     targets: [2, 3, 6, 7, 9, 10, 11],
        //   },
      //],
      // columnDefs: [
      //   {
      //     targets: '_all',
      //     defaultContent: '-',
      //     // className: 'select-checkbox',
      //   },
      //Keys
     // keys: true,
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
      //     paging: true,
      //     pagingType: 'numbers',
      //     searching: true,
      //   },
      // },
      language: {
        searchPanes: {
          count: '{total} found',
          countFiltered: '{shown} / {total}',
        },
      },
    }
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
      !localStorage.getItem('DataTables_table_1_/view-remarks') === null
    ) {
      console.log(
        'it exists: ' +
        // JSON.stringify(
        localStorage.getItem('DataTables_table_1_/view-remarks')?.search,
        // null,
        // 2,
        // ),
      )
    }
    let jsonObj = JSON.parse(
      localStorage.getItem('DataTables_table_1_/view-remarks')!,
    )
    // console.log(jsonObj)
    console.log(jsonObj.columns)
    var counter: number = 0
    for (let c of jsonObj.columns) {
      console.log(c.search.search)
      if (counter == 0) {
        this.input_0 = c.search.search
      } else if (counter == 1) {
        this.input_1 = c.search.search
      } else if (counter == 2) {
        this.input_2 = c.search.search
      }
      // else if (counter == 3) {
      //   this.input_3 = c.search.search
      // }
      counter++
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
            }
            console.log('the column is: ' + this['id']);
          }
        }
        );
      });
      dtInstance.on(
        'draw stateRestore-change',
        function (e, settings, details) {
          var c = 0;
          for (let col of settings.aoColumns) {
            if (col.title == that.first_column_title) {
              that.first_column_id = c.toString();
            } else if (col.title == that.second_column_title) {
              that.second_column_id = c.toString();
            } else if (col.title == that.third_column_title) {
              that.third_column_id = c.toString();
            } else if (col.title == that.fourth_column_title) {
              that.fourth_column_id = c.toString();
            } else if (col.title == that.fifth_column_title) {
              that.first_column_id = c.toString();
            }
            c++;
          }
        }
      );

      dtInstance.on('column-reorder', function (e, settings, details) {
        var c = 0;
        for (let col of settings.aoColumns) {
          if (col.title == that.first_column_title) {
            that.first_column_id = c.toString();
          } else if (col.title == that.second_column_title) {
            that.second_column_id = c.toString();
          } else if (col.title == that.third_column_title) {
            that.third_column_id = c.toString();
          } else if (col.title == that.fourth_column_title) {
            that.fourth_column_id = c.toString();
          } else if (col.title == that.fifth_column_title) {
            that.first_column_id = c.toString();
          } 
          c++;
        }
      });
    });
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('replay-id')) {
        this.router.navigate([
          'user/view-currency-remark/replay-remark/' + event.target.getAttribute('replay-id'),
        ])
      }
      else if (event.target.hasAttribute('edit-currency-id')) {
        this.router.navigate([
          'user/view-currency-remark/edit-currency-remark/' + event.target.getAttribute('edit-currency-id'),
        ])
      }
      else if (event.target.hasAttribute('delete-currency-id')) {
        this.services
          .deletCurrencyRemark(event.target.getAttribute('delete-currency-id'))
          .subscribe(
            (data) => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User deleted successfully!',
              })
              window.location.reload();
            }
            , (error: any) => {
              if (error.error.text === 'access-token-expired') {
                console.log('Access-token-expired requesting refresh token...');
                if (this.localStorageService.retrieve('refresh_token_requested') ==
                  null) {
                  this.utilService.refreshToken().subscribe(
                    (data: any) => {
                      if (data === true) {
                        console.log(
                          'refresh token success re-requesting the actual request'
                        );
                        this.localStorageService.clear('refresh_token_requested');
                        //================================================================================
                        this.service
                          .deleteCurrency(event.target.getAttribute('delete-currency-id'))
                          .subscribe(
                            (data: any) => {
                              Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'User deleted successfully!',
                              })
                            }
                            , (error: any) => {
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
            })

      }

    })
  }


  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
  }

  displayToConsole(datatableElement: DataTableDirective): void {
    datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
      console.log(dtInstance)
    );
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
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















