import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { LocalStorageService } from 'ngx-webstorage';
import { Remark } from 'src/app/Approver/payloads/remark';
import { ApproverService } from 'src/app/Approver/services/approver.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';

declare var window: any

@Component({
  selector: 'app-account-requests',
  templateUrl: './account-requests.component.html',
  styleUrls: ['./account-requests.component.css']
})
export class AccountRequestsComponent implements OnInit, AfterViewInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent; 
  @ViewChild('SuccessSwalSendRemark')
  public readonly SuccessSwalSendRemark!: SwalComponent;
  request_id!: any;


  refresh_token_requested = false;
  reject_request_modal_account: any;
  registerForm!: FormGroup;
  submitted: boolean = false;
  remark!: Remark;
  user: any

  @ViewChild(DataTableDirective)
  datatableElement!: DataTableDirective;

  dtOptions: any;

  first_column_title = 'ID';
  second_column_title = 'Name';
  third_column_title = 'Code';
  fourth_column_title = 'Type';
  fifth_column_title = 'Created_date';
  sixth_column_title = 'Description';
  seventh_column_title ='Currency';
  eight_column_title = 'Sent_from';
  ninth_column_title = 'Actions';

  constructor(
    private formBuilder: FormBuilder,
    private approverService: ApproverService,
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService,
   // private activatedRoute: ActivatedRoute
  ) {    
    // this.request_id = this.activatedRoute.snapshot.paramMap.get('id');
   
  this.remark = {
    id: '',
    title: '',
    description: '',
    created_date:'',
    firstname:'',
  };
  // this.role_selected = '1';

  this.registerForm = this.formBuilder.group(
    {
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
      ]),
      description: new FormControl('', [
        Validators.required,
      ]), 
    },
  );
  }

  ngOnInit(): void {
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
        // that.http
        //   .post<DataTablesResponse>(
        //     'https://xtlncifojk.eu07.qoddiapp.com/',
        //     dataTablesParameters,
        //     {}
        //   )
        this.approverService.getAllAccountRequests().subscribe(
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
              if (!this.refresh_token_requested) {
                this.utilService.refreshToken().subscribe(
                  (data) => {
                    if (data === true) {
                      console.log(
                        'refresh token success re-requesting the actual request'
                      );
                      this.refresh_token_requested = false;
                      
                      //================================================================================
                      this.approverService.getAllAccountRequests().subscribe(
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
                this.refresh_token_requested = true;
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
          data: 'code',
        },
        {
          title: this.fourth_column_title,
          data: 'type',
        },
        {
          title: this.fifth_column_title,
          data: 'created_date',
        },
        {
          title: this.sixth_column_title,
          data: 'description',
        },
        {
          title: this.seventh_column_title,
          data: 'currency',
        },
    
        {
          title: this.eight_column_title,
          render: function (data: any, type: any, full: any) {

            return (full.firstname + " " + full.middlename)
          },
        },

        {
          title: this.ninth_column_title,
          render: function (data: any, type: any, full: any) {
            
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.request_status == 0)
              return (
                '<button class="btn btn-outline-success btn-sm" approve-request-name="' +
                full.firstname + " " + full.middlename +
                '" approve-request="' +
                full.id + '"account="' + full.name +
                '"><i class="mdi mdi-check"></i>Approve</button>' + " " +



                '<button class="btn btn-outline-danger btn-sm" reject-request-name="' +
                full.firstname + " " + full.middlename +
                '" reject-request="' +
                full.id + '"account="' + full.name +
                '"><i class="mdi mdi-window-close mr-1"></i>Reject</button>' + " " +


                '<button class="btn btn-outline-warning btn-rounded" send-account-remark="' +
                full.id +
                '"><i class="mdi"></i> Remark</button>'
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

      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
          // className: 'select-checkbox',
        },

      ],

      stateSave: true,
      stateDuration: 0,

      fixedHeader: {
        header: true,
        headerOffset: 70,
      },
      scrollCollapse: true,

    };

    this.reject_request_modal_account = new window.bootstrap.Modal(
      document.getElementById('reject-modal-account'),
    )
    // console.log('height of navbar: ' + $('#navbar-custom-id_').outerHeight);

  }

  onSubmit(){
    
    if (this.registerForm.valid) {
      this.remark = this.registerForm.value;
      console.log(
        'values' + JSON.stringify(this.remark, null, 2)
       
      );
      console.log('request id========>'+this.request_id);
      // this.roles
  
      this.saveRemark(this.request_id,this.remark);
    } else this.submitted = true;
  }

  saveRemark(request_id:any,remark: Remark) {
    console.log(
      'Payload: ' + JSON.stringify(this.remark, null, 2)
    );
    this.approverService.accountRemark(request_id,remark).subscribe(
      async (data) => {
        if (data == true) {
            this.SuccessSwalSendRemark.fire();
            this.registerForm.reset();
            this.closeModal();
            this.submitted = false;
            console.log('remark success: ' + data);
          
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
                  this.approverService.accountRemark(request_id,remark).subscribe(
                    async (data) => {
                      if (data == true) {
                          this.SuccessSwalSendRemark.fire();
                          this.registerForm.reset();
                          this.closeModal();
                          this.submitted = false;
                          console.log('remark success: ' + data);
                        
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
  }

  closeModal(){
    this.reject_request_modal_account.hide()
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('reject-request')) {
        var selected_request_name = event.target.getAttribute('reject-request-name');
        var selected_request_id = event.target.getAttribute('reject-request');
        var account = event.target.getAttribute('account');
        this.request_id =selected_request_id
       
        Swal.fire({
          title: 'Reject Request of ' + " " + selected_request_name,
          text:
            'Are you sure? you are rejecting ' + " " + account + " " + 'account request.' + " " +

            'This means the account will not be created.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Reject',
        }).then((result) => {
          if (result.isConfirmed) {
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            this.approverService.rejectAccountRequest(selected_request_id).subscribe(
              (data) => {
                if (data == true) {

                 this.reject_request_modal_account.show();
                  // Swal.fire({
                  //   icon: 'success',
                  //   title: 'Success',
                  //   text: 'Successfully Rejected!',
                  // });
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
                  if (!this.refresh_token_requested) {
                    this.utilService.refreshToken().subscribe(
                      (data) => {
                        if (data === true) {
                          console.log(
                            'refresh token success re-requesting the actual request'
                          );
                          this.refresh_token_requested = false;
                          //================================================================================
                          this.approverService
                            .rejectAccountRequest(selected_request_id)
                            .subscribe(
                              (data) => {
                                if (data == true) {
                                  Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Successfully Rejected!',
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
                    this.refresh_token_requested = true;
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
      } else if (event.target.hasAttribute('approve-request')) {
        var selected_request_name =
          event.target.getAttribute('approve-request-name');
        var selected_request_id = event.target.getAttribute('approve-request');
        var account = event.target.getAttribute('account');
        Swal.fire({
          title: 'Approve Request of ' + " " + selected_request_name,
          text:
            'Are you sure? you are approving ' + " " + account + " " + ' account.' + " " +
            'This means the account will be created.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0acf97',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Approve',
        }).then((result) => {
          if (result.isConfirmed) {
            // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            this.approverService.approveAccountRequest(selected_request_id).subscribe(
              (data) => {
                if (data) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Successfully Approved!',
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
                  if (!this.refresh_token_requested) {
                    this.utilService.refreshToken().subscribe(
                      (data) => {
                        if (data === true) {
                          console.log(
                            'refresh token success re-requesting the actual request'
                          );
                          this.refresh_token_requested = false;
                          //================================================================================
                          this.approverService.approveAccountRequest(selected_request_id).subscribe(
                            (data) => {
                              if (data) {
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Success',
                                  text: 'Successfully Approved!',
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
                    this.refresh_token_requested = true;
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
      } else if (event.target.hasAttribute('send-account-remark')) {
        this.router.navigateByUrl(
          'Approver/Account-requests/account-remark/' +
          event.target.getAttribute('send-account-remark')
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
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

