import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { AccountService } from 'src/app/User/services/account.service';
import { CurrencyService } from 'src/app/User/services/currency.service';
import { RequestViewService } from 'src/app/User/services/request-view.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-accounts',
  templateUrl: './all-accounts.component.html',
  styleUrls: ['./all-accounts.component.css']
})
export class AllAccountsComponent implements OnInit, AfterViewInit, OnDestroy
{
@ViewChild('SwalSessionExpired')
public readonly SwalSessionExpired!: SwalComponent;

@ViewChild(DataTableDirective)
datatableElement!: DataTableDirective;

dtOption1: any;
dtOption2: any;
dtOption3: any;
dtOption4: any;

message = '';
min!: number;
max!: number;
first_column_id = '0';
second_column_id = '1';
third_column_id = '2';
fourth_column_id = '3';

first_column_title1 = 'Id';
first_column_title = 'Name';
second_column_title = 'Code';
third_column_title = 'Description';
fourth_column_title = 'Created_date';
fifth_column_title = 'Currency';
sixth_column_title = 'Action2';
seventh_column_title2 = 'Status';

constructor(
  private renderer: Renderer2,
  private accountService: AccountService,
  private viewRequestService: RequestViewService,
  private router: Router,
  private localStorageService: LocalStorageService,
   private authService: AuthService,
  private utilService: UtilService,
 ) {}

someClickHandler(info: any): void {
  this.message = info.id + ' - ' + info.firstName;
}

displayToConsole(datatableElement: DataTableDirective): void {
  datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
    console.log(dtInstance)
  );
}
ngOnInit(): void {
  $.fn['dataTable'].ext.search.push(
    (settings: any, data: any, dataIndex: any) => {
      const id = parseFloat(data[0]) || 0; // use data for the id column
      if (
        (isNaN(this.min) && isNaN(this.max)) ||
        (isNaN(this.min) && id <= this.max) ||
        (this.min <= id && isNaN(this.max)) ||
        (this.min <= id && id <= this.max)
      ) {
        return true;
      }
      return false;
    }
  );


    //this dtOption displays ALL accounts
    this.dtOption1 = {
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
        this.viewRequestService.fetchAllAccount().subscribe((resp) => {
          console.log('currency ajax of dtoption one');

          callback({
            data: resp,
            // <-- see here
          });
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
                    this.viewRequestService.fetchAllAccount().subscribe((resp) => {
                      console.log('currency ajax of dtoption one');
            
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
          title: this.first_column_title1,
          data: 'id',
        },
        {
          title: this.first_column_title,
          data: 'name',
        },
        {
          title: this.second_column_title,
          data: 'code',
        },
        {
          title: this.third_column_title,
          data: 'description',
        },
        {
          title: this.fourth_column_title,
          data: 'created_date',
        },
        {
          title: this.fifth_column_title,
          data: 'currency',
        },
        

        {
          title: this.seventh_column_title2,
          render: function (data: any, type: any, full: any) {
            console.log('request status: ' + full.request_status);
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.request_status == 1)
              return (
                '<button class="btn btn-outline-success btn-sm" style="pointer-events: none; width:100px"' +
                full.id +
                '"><i class="mdi mdi-check"></i>Approved</button>'
              );
            else if (full.request_status == 2)
              return (
                '<button class="btn btn-outline-danger btn-sm" style="pointer-events: none; width:100px"' +
                full.id +
                '" ><i class="mdi mdi-window-close mr-1"></i>Denied</button>'
              );
            return (
              '<button class="btn btn-outline-primary btn-sm" style="pointer-events: none; width:100px"' +
              full.id +
              '"><i class="mdi mdi-progress-check"></i>Pending</button>'  
            );
          },
        },
      ],
      
      dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
       
      colReorder: {
        order: [0, 1, 2, 3,4],
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
          
          {
            text: 'Reload',
            action: function (e: any, dt: any, node: any, config: any) {
              dt.ajax.reload()
              alert('reload success')
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
           
        ],
      },

       
      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
          // className: 'select-checkbox',
        },
        
      ],
       
      stateDuration: 0,
      fixedColumns: true,

 
      fixedHeader: {
        header: true,
        // headerOffset: $('.navbar-custom').outerHeight(false)! - 1,
      },
       
      scrollCollapse: true,
       
      keys: false,
       
    };
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
          } else if (col.title == that.fifth_column_title) {
            that.fourth_column_id = c.toString();
          } else if (col.title == that.sixth_column_title) {
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
    if (event.target.hasAttribute('edit-pending-account-id')) {
      console.log(
        'the id is: ' + event.target.getAttribute('edit-pending-account-id')
      );
      this.router.navigate([
        '/user/edit-pending-account/' +
          event.target.getAttribute('edit-pending-account-id'),
      ]);
    } else if (event.target.hasAttribute('delete-pending-id')) {
      this.accountService
        .deleteAccountRequest(event.target.getAttribute('delete-pending-id'))
        .subscribe(
          (data) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'User deleted successfully!',
            });
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
                      this.accountService
                        .deleteAccountRequest(
                          event.target.getAttribute('delete-pending-id')
                        )
                        .subscribe(
                          (data: any) => {
                            Swal.fire({
                              icon: 'success',
                              title: 'Success',
                              text: 'User deleted successfully!',
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

