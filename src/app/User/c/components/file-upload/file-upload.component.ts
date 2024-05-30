import { formatDate } from '@angular/common';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import saveAs from 'file-saver';
import { LocalStorageService } from 'ngx-webstorage';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { FilePayload } from 'src/app/User/payloads/file-payload';
import { AccountService } from 'src/app/User/services/account.service';
import { RemarkService } from 'src/app/User/services/remark.service';
import { UploadService } from 'src/app/User/services/upload/upload.service';
declare var window: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit, AfterViewInit {
  uploadForm: FormGroup;
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('edit-modal-file') public file_update_modal:
    | ElementRef
    | undefined;

  submitted: Boolean = false;
  progress = 0;
  progress_download = 0;
  file_type: any = 'payable';

  fileId: any;
  dtOptions: any;
  filenames: string[] = [];
  fileStatus = { status: '', requestType: '', percent: 0 };
  uploadStatus_title = 'Uploading...';
  downloadStatus_title = 'Downloading...';

  maxDate!: Date;

  message = '';
  FilePayload: FilePayload = new FilePayload();
  filespayload!: FilePayload;

  first_column_title1 = 'Id';
  first_column_title = 'File Name';
  second_column_title = 'File Type';
  third_column_title = 'Upload date';
  fourth_column_title = 'Account Name';
  fifth_column_title = 'Currency Name';
  sixth_column_title = 'Uploaded By';
  seventh_column_title = 'Type';
  eighth_column_title = 'Action';
  email: any;
  // in app.component.ts
  files: File[] = [];
  transaction_date: any;
  file_edit_modal: any;
  nbe_core: any = '1';
  registerForm: FormGroup;
  constructor(
    public localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private uploadService: UploadService,
    private renderer: Renderer2,
    private router: Router,
    private adminService: AdminService,
    public authService: AuthService,
    private utilService: UtilService,
    private activatedRoute: ActivatedRoute,
    private services: RemarkService
  ) {
    if (authService.isUser()) this.nbe_core = '1';
    else if (authService.isIssueAccount()) this.nbe_core = '125';
    this.FilePayload = {
      id: '',
      file_name: '',
      email: '',
      file_type: '',
      upload_date: '',
      account_name: '',
      currency_name: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      type: '',
    };
    // this.role_selected = '1';

    this.registerForm = this.formBuilder.group({
      file_name: new FormControl('', [Validators.required]),
      file_type: new FormControl('', [Validators.required]),
      upload_date: new FormControl('', [Validators.required]),
      account_name: new FormControl('', [Validators.required]),
      currency_name: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      middle_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });

    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.uploadForm = this.formBuilder.group({
      upload_date: new FormControl('', [Validators.required]),
    });
  }
  someClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.firstName;
  }

  goToPage(pageName: string) {
    // this.router.navigate([{ outlets: { inner_outlet: [`${pageName}`] } }])
    this.router.navigate([`${pageName}`]);
  }
  ngOnInit() {
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

    this.email = this.localStorageService.retrieve('email');
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
      pageLength: 10,
      // select: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.uploadService.getUploadedFiles().subscribe(
          (resp) => {
            callback({
              data: resp,
            });
            // window.location.reload();
          },

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
                      this.uploadService.getUploadedFiles().subscribe(
                        (resp) => {
                          callback({
                            data: resp,
                          });
                          // window.location.reload();
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
        // window.location.reload();
      },
      columns: [
        {
          title: this.first_column_title1,
          data: 'id',
        },
        {
          title: this.first_column_title,
          data: 'file_name',
        },
        {
          title: this.second_column_title,
          data: 'file_type',
        },
        {
          title: this.third_column_title,
          data: 'upload_date',
        },
        {
          title: this.fourth_column_title,
          data: 'account_name',
        },
        {
          title: this.fifth_column_title,
          data: 'currency_name',
        },
        {
          title: this.sixth_column_title,
          render: function (data: any, type: any, full: any) {
            return (
              full.first_name + '  ' + full.middle_name + '  ' + full.last_name
            );
          },
        },

        {
          title: this.seventh_column_title,
          render: function (data: any, type: any, full: any) {
            //that
            if (full.type == '1') {
              return 'NBE (ATS)';
            } else if (full.type == '2') {
              return 'AB core (BFUB)';
            } else if (full.type == '3') {
              return 'PS Payable';
            } else if (full.type == '4') {
              return 'ps Receivable';
            } else if (full.type == '125') {
              return 'Issue QBS';
            } else if (full.type == '12d') {
              return 'Issue Core';
            } else {
              return full.type;
            }
          },
        },
        // {
        //   title: this.eighth_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     document
        //       .getElementsByClassName('datatable-buttons')[0]
        //       ?.classList.remove('dt-button');
        //     return (

        //       '<button class="btn btn-outline-success btn-rounded" file-download-id="' +
        //       full.id +
        //       '" style="margin-right:4px"><i class="mdi mdi-download"></i>download</i></button>' +
        //       '<button class="btn btn-outline-info btn-rounded" file-rollback-id="' +
        //       full.id +
        //       '" style="margin-right:4px"><i class="mdi mdi-backburger"></i>rollback</i></button>'
        //     );
        //   },
        // },
      ],

      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        // var row = dtInstance.rows({search: "applied"}).data();
        // var row = dtInstance.rows({selected: true}).data();
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.someClickHandler(data);
        });
        return row;
      },
      // dom: 'Bfrtip',
      // dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B> ",
      dom: " <'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",

      // dom: 'Plfrtip',
      // dom: "<'row mb-1'<'col-sm-5'P><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",

      // dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: 'Qlf',
      // colReorder: {
      //   order: [0, 1, 2, 3],
      //   // fixedColumnsRight: 1
      //   fixedColumnsLeft: 1,
      //   action: function (e: any, dt: any, node: any, config: any) {
      //     console.log('reordered');
      //   },
      // },
      buttons: {
        buttons: [
          'colvis',
          ,
          {
            extend: 'selected',
            text: '<i  style="color:red" class="mdi mdi-delete"></i>Delete</i>',
            action: function (e: any, dt: any, node: any, config: any) {
              var rows = dt.rows({ selected: true }).data().toArray();
              for (let i = 0; i < rows.length; i++) {
                const id = new FormData();
                id.append('id', rows[i].id);

                Swal.fire({
                  text: 'You are delete file. Are you sure? ',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#0acf97',
                  cancelButtonColor: '#3085d6',
                  confirmButtonText: 'Yes',
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire({
                      icon: 'success',
                      title: 'Success',
                      text: 'File deleted successfully!',
                    });
                    that.uploadService.deleteFile(id).subscribe(
                      (data) => {
                        $('#file_upload_table').DataTable().ajax.reload();
                      },
                      (error: any) => {
                        if (error.error.text === 'access-token-expired') {
                          console.log(
                            'Access-token-expired requesting refresh token...'
                          );
                          if (
                            that.localStorageService.retrieve(
                              'refresh_token_requested'
                            ) == null
                          ) {
                            that.utilService.refreshToken().subscribe(
                              (data: any) => {
                                if (data === true) {
                                  console.log(
                                    'refresh token success re-requesting the actual request'
                                  );
                                  that.localStorageService.clear(
                                    'refresh_token_requested'
                                  );
                                  //================================================================================
                                  that.uploadService.deleteFile(id).subscribe(
                                    (data) => {
                                      //alert('There are ' + rows.length + 'files deleted');
                                    },
                                    (error: any) => {
                                      if (
                                        error.error.text ===
                                        'access-token-expired'
                                      ) {
                                        console.log('refresh token expired.');
                                        that.SwalSessionExpired.fire();
                                        that._refreshTokenExpired();
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
                                  that.SwalSessionExpired.fire();
                                  that._refreshTokenExpired();
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
                            that.localStorageService.store(
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
                          console.log(
                            JSON.stringify(error.error.apierror, null, 2)
                          );
                        }
                      }
                    );

                    $('file_upload').DataTable().ajax.reload();
                  } else {
                  }
                });
              }
            },
          },
          {
            extend: 'selected',
            text: '<i style="color:khaki" class="mdi mdi-download"></i>Download',
            action: function (e: any, dt: any, node: any, config: any) {
              var rows = dt.rows({ selected: true }).data().toArray();
              if (rows.length > 1) {
                Swal.fire({
                  icon: 'error',
                  text: 'Select only one file at a time to download.',
                });
              } else {
                console.log(
                  'typeeeeeeeeeeee' + rows[0].file_type,
                  rows[0].type
                );
                that.onDownloadFile(
                  rows[0].id,
                  rows[0].file_name,
                  rows[0].upload_date,
                  rows[0].type
                );
                // console.log('row having database ID ' + rows[0].id);
              }
            },
          },

          {
            // extend: 'selected',
            text: '<i style="color:khaki" class="mdi mdi-backburger"></i>Roleback',
            action: function (e: any, dt: any, node: any, config: any) {
              var rows = dt.rows({ selected: true }).data().toArray();
              for (let i = 0; i < rows.length; i++) {
                const datas = new FormData();
                datas.append('id', rows[i].id);
                datas.append('type', rows[i].type);
                console.log('-------------------type is ' + rows[i].type);
                if (rows[i].type == 'Payable' || rows[i].type == 'Receivable') {
                  Swal.fire({
                    text: 'You can not roll back payable or receivable transactions.  ',
                    icon: 'warning',
                    showCancelButton: true,
                  });
                } else {
                  Swal.fire({
                    text: 'You are roleback transaction. Are you sure? ',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#0acf97',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      that.uploadService.rolebackFile(datas).subscribe(
                        (data) => {
                          if (data == true) {
                            Swal.fire({
                              icon: 'success',
                              title: 'Success',
                              text: 'Transactions roleback successfully!',
                            });
                            $('#file_upload_table').DataTable().ajax.reload();
                            console.log('row having database ID ' + rows[i].id);
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'imposible',
                              text: 'Transactions not roleback because  match  already started!',
                            });
                          }
                        },
                        (error: any) => {
                          if (error.error.text === 'access-token-expired') {
                            console.log(
                              'Access-token-expired requesting refresh token...'
                            );
                            if (
                              that.localStorageService.retrieve(
                                'refresh_token_requested'
                              ) == null
                            ) {
                              that.utilService.refreshToken().subscribe(
                                (data) => {
                                  if (data === true) {
                                    console.log(
                                      'refresh token success re-requesting the actual request'
                                    );
                                    that.localStorageService.clear(
                                      'refresh_token_requested'
                                    );
                                    //================================================================================
                                    that.uploadService
                                      .rolebackFile(datas)
                                      .subscribe(
                                        (data) => {
                                          if (data == true) {
                                            Swal.fire({
                                              icon: 'success',
                                              title: 'Success',
                                              text: 'Transactions roleback successfully!',
                                            });
                                            $('#file_upload_table')
                                              .DataTable()
                                              .ajax.reload();
                                            console.log(
                                              'row having database ID ' +
                                                rows[i].id
                                            );
                                          } else {
                                            Swal.fire({
                                              icon: 'error',
                                              title: 'imposible',
                                              text: 'Transactions not roleback because  match  already started!',
                                            });
                                          }
                                        },
                                        (error: any) => {
                                          if (
                                            error.error.text ===
                                            'access-token-expired'
                                          ) {
                                            console.log(
                                              'refresh token expired.'
                                            );
                                            that.SwalSessionExpired.fire();
                                            that._refreshTokenExpired();
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
                                    that.SwalSessionExpired.fire();
                                    that._refreshTokenExpired();
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
                                    JSON.stringify(
                                      error.error.apierror,
                                      null,
                                      2
                                    )
                                  );
                                }
                              );
                              that.localStorageService.store(
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
                            console.log(
                              JSON.stringify(error.error.apierror, null, 2)
                            );
                          }
                        }
                      );
                    } else {
                    }
                  });
                }
                console.log('row having database ID ' + rows[i].id);
              }
            },
          },
          // {
          //   // extend: 'selected',
          //   text: '<i style="color:khaki" class="mdi mdi-update"></i>Edit',
          //   action: function (e: any, dt: any, node: any, config: any) {
          //     var rows = dt.rows({ selected: true }).data().toArray();
          //     for (let i = 0; i < rows.length; i++) {
          //       that.uploadService.getUploadedFilebyId(rows[i].id).subscribe(
          //         (data => {
          //           that.filespayload = data
          //         })
          //       )
          //       that.fileId = rows[i].id;
          //       if (rows[i].id) {
          //         that.file_edit_modal = new window.bootstrap.Modal(
          //           document.getElementById('edit-modal-file'),
          //         ).show();
          //       }
          //       console.log('row having database ID ' + rows[i].id);
          //     }

          //   },
          // },
          {
            extend: 'collection',
            text: '<i  style="color:khaki" class="mdi mdi-select"></i>Select</i>',
            buttons: [
              'selectAll',
              'selectNone',
              'selectCells',
              'selectColumns',
              'selectRows',
              //Button that is enabled when one or more items are selected in the table
              'selected',
              // Button that is enabled when a single item is selected in the table
              'selectedSingle',
            ],
            fade: true,
          },
          {
            text: '<i style="color:khaki" class="mdi mdi-reload"></i>Reload',
            action: function (e: any, dt: any, node: any, config: any) {
              dt.ajax.reload();
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
          {
            fade: true,
          },
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
        //   // {
        //   //   targets: 0,
        //   //   orderable: false,
        //   //   // className: 'select-checkbox',
        //   // },
        //   // {
        //   //   targets: [2],
        //   //   visible: false,
        //   // },
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
      select: true,

      // stateSave: true,
      stateDuration: 0,
      // fixedHeader: true,
      // fixedFooter: true,
      fixedHeader: {
        header: true,
        // headerOffset: $('.navbar-custom').outerHeight(false)! - 1,
      },
      // fixed column
      // scrollY:        "300px",
      // scrollX:        true,
      scrollCollapse: true,
      // paging:         false,
      fixedColumns: false,
      //Keys
      // keys: true,
      // search panes
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
      // language: {
      //   searchPanes: {
      //     count: '{total} found',
      //     countFiltered: '{shown} / {total}',
      //   },
      // },
    };
  }
  onSubmit() {
    // if (this.registerForm.valid) {
    this.FilePayload = this.registerForm.value;
    console.log('upload payload: ' + this.FilePayload);
    this.uploadService.updateFile(this.fileId, this.FilePayload).subscribe(
      (data) => {
        if (data == true) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'updated successfully!',
          });
          this.closeModal();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Something went wrong!',
          });
        }
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
                  this.uploadService;
                  this.uploadService
                    .updateFile(this.fileId, this.FilePayload)
                    .subscribe(
                      (data) => {
                        if (data == true) {
                          Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'updated successfully!',
                          });
                          this.closeModal();
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Error...',
                            text: 'Something went wrong!',
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
    );

    // }
  }

  closeModal() {
    this.file_edit_modal.show();
  }
  onSelect(event: any) {
    if (this.uploadForm.valid) {
      this.files = event.addedFiles;
      if (
        this.files.at(0)! != undefined &&
        'application/vnd.ms-excel' == this.files.at(0)!['type']
        // || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' == this.files.at(0)!['type'] )
      ) {
        Swal.fire({
          title: 'Uploading file',
          text:
            'You are about to upload transaction records by: ' +
            formatDate(this.transaction_date, 'yyyy-MM-dd', 'en-US') +
            '. Are you sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0acf97',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes',
        }).then((result) => {
          // console.log("form validity: " + this.uploadForm.valid)
          if (result.isConfirmed) {
            let timerInterval;
            const sw = Swal.fire({
              // title: '<span></span>',
              allowOutsideClick: false,
              // timer: 4000,
              showConfirmButton: false,
              showCancelButton: false,
              showCloseButton: false,
              showDenyButton: false,
              html:
                '<kk>' +
                this.uploadStatus_title +
                '</kk>' +
                ' <span><b></b>%</span>',
              // text: this.progress + '',
              didOpen: () => {
                Swal.showLoading(Swal.getDenyButton()!);
                const b = Swal.getHtmlContainer()!.querySelector('b');
                const t = Swal.getHtmlContainer()!.querySelector('span');
                const kk = Swal.getHtmlContainer()!.querySelector('kk');
                timerInterval = setInterval(() => {
                  b!.textContent = this.progress.toString();
                  if (this.progress == 100) {
                    kk!.textContent = this.uploadStatus_title.toString();
                    this.uploadStatus_title = 'Extracting data...';
                    t?.setAttribute('style', 'display: none;');
                  } else {
                    this.uploadStatus_title = 'Uploading...';
                  }
                }, 100);
              },
            });
            this.uploadFile();
          } else {
          }
        });
      } else {
        Swal.fire({
          title: 'Invalid File',
          icon: 'warning',
          text: 'The file is invalid. The system only accepts excel file with type : Microsoft Excel 97-2003 Worksheet (.xls).',
        });
      }
    } else {
      this.submitted = true;
    }
  }

  convertDate(str: string) {
    var date = new Date(str);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), month, day].join('-');
  }

  uploadFile() {
    const formData = new FormData();
    // formData.append(
    //   'transaction_date',
    //   JSON.stringify(this.transaction_date).slice(1, 11)
    // );
    formData.append(
      'transaction_date',
      this.convertDate(this.transaction_date)
    );
    // this.convertDate(this.transaction_date)
    formData.append('nbe_core', JSON.stringify(this.nbe_core));
    formData.append('file', this.files.at(0)!, this.files.at(0)!.name);
    // console.log('this.transaction_date: ' + this.transaction_date);
    this.uploadService.uploadAndExtractFile(formData).subscribe(
      (event: any) => {
        if (event.body == true) {
          this.files = [];
          Swal.hideLoading();
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Transactions uploaded successfully!',
          });
          this.progress = 0;
          $('#file_upload_table').DataTable().ajax.reload();
        } else {
          this.reportProgress(event);
        }
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
                  this.uploadService.uploadAndExtractFile(formData).subscribe(
                    (event: any) => {
                      if (event.body == true) {
                        this.files = [];
                        Swal.hideLoading();
                        Swal.close();
                        Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: 'Transactions uploaded successfully!',
                        });
                        this.progress = 0;
                        $('#file_upload').DataTable().ajax.reload();
                      } else {
                        this.reportProgress(event);
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
          if (error.error.text == 'file-already-uploaded') {
            Swal.fire({
              icon: 'error',
              title: 'Duplication...',
              text: 'File already uploaded for this date.',
            });
          } else if (
            error.error.text ==
            'last day uploaded file closing balance different from opening balance of this? please check it'
          ) {
            Swal.fire({
              icon: 'error',
              title: 'Balance difference...',
              text: 'last day uploaded file closing balance different from opening balance of this. please try to check it!',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Invalid file',
              text: 'Excel file format  not correct. please try to  check excel file !',
            });
          }

          console.log(JSON.stringify(error, null, 2));
        }
      }
    );
  }

  onDownloadFile(
    id: any,
    file_name: string,
    upload_date: string,
    type: string
  ): void {
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

    this.uploadService.checkTokenDoesNotExpired(id).subscribe(
      (data: any) => {
        if (data == true) {
          // if (this.file_type=="payable"){
          this.uploadService.downloadFiles(id).subscribe(
            (event: any) => {
              console.log('the body: ' + JSON.stringify(event, null, 4));
              console.log(
                'here is the file tpeeeeeeeeeeeeeeeweeeeeeee' + this.file_type
              );
              this.downloadProgress(event, file_name, upload_date, type);
            },
            (error: any) => {
              console.log('error: ' + JSON.stringify(error, null, 4));
              Swal.hideLoading();
              Swal.close();
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'The requested file could not be found on the server!',
              });
            }
          );
          // }
          // else if(this.file_type=="recievable"){
          //   this.uploadService.downloadFiles_second(id, type).subscribe(
          //     (event: any) => {
          //       console.log('the body: ' + JSON.stringify(event, null, 4));
          //       console.log("here is the file nameeeeeeeeeeeeeeeeee" + type)
          //       console.log("here is the file tpeeeeeeeeeeeeeeeweeeeeeee" + this.file_type)
          //       this.downloadProgress(event, file_name);
          //     },
          //   );

          // }
        }
      },
      (error: any) => {
        if (
          this.localStorageService.retrieve('refresh_token_requested') == null
        ) {
          this.utilService.refreshToken().subscribe(
            (data: any) => {
              if (data === true) {
                console.log(
                  'refresh token success re-requesting the actual request'
                );
                this.localStorageService.clear('refresh_token_requested');
                //================================================================================
                this.uploadService.downloadFiles(id).subscribe(
                  (event: any) => {
                    console.log('the body: ' + JSON.stringify(event, null, 4));
                    this.downloadProgress(event, file_name, upload_date, type);
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
                        'the body: ' + JSON.stringify(event, null, 4)
                      );
                      // this.downloadProgress(event, file_name);
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
        console.log('------------------ token  expired');
      }
    );
  }

  private reportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.progress = Math.round((100 * httpEvent.loaded) / httpEvent.total!);
        break;
      // case HttpEventType.DownloadProgress:
      //   this.progress_download = Math.round((100 * httpEvent.loaded) / httpEvent.total!);
      //   break;
    }
  }
  private downloadProgress(
    httpEvent: HttpEvent<string[] | Blob>,
    file_name: string,
    upload_date: string,
    type: string
  ): void {
    switch (httpEvent.type) {
      case HttpEventType.DownloadProgress:
        // this.uploadStatus(httpEvent.loaded, httpEvent.total!, 'Downloading...');
        this.progress_download = Math.round(
          (100 * httpEvent.loaded) / httpEvent.total!
        );
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          for (const filename of httpEvent.body) {
            this.filenames.unshift(filename);
          }
        } else {
          // console.log('File url is: ' + JSON.stringify(httpEvent, null, 4));
          if (
            type == '4' ||
            type == '3' ||
            type == 'Payable' ||
            type == 'Receivable'
          ) {
            saveAs(
              new File(
                [httpEvent.body!],
                type == '3' || type == 'Payable'
                  ? 'Payable raw data on ' + upload_date
                  : 'Receivable raw data on ' + upload_date,
                {
                  type: `${httpEvent.headers.get(
                    'Content-Type'
                  )};charset=utf-8`,
                }
              )
            );
            this.progress_download = 0;
            Swal.hideLoading();
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'File downloaded successfully!',
            });
          } else {
            saveAs(
              new File([httpEvent.body!], file_name, {
                type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`,
              })
            );
            this.progress_download = 0;
            Swal.hideLoading();
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'File downloaded successfully!',
            });
          }
        }
        break;
      default:
        console.log('the default' + httpEvent);
    }
  }
  // private uploadStatus(loaded: number, total: number, requestType: string) {
  //   this.fileStatus.status = 'progress';
  //   this.fileStatus.requestType = requestType;
  //   this.fileStatus.percent = Math.round((100 * loaded) / total);
  // }

  dateChange(event: any) {
    console.log('change: ' + event);
    this.transaction_date = event;
  }

  db_cr_Change(event: any) {
    console.log('change: ' + event.target.value);
    this.nbe_core = event.target.value;
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  submitUploadForm() {
    console.log();
  }
  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {});
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
