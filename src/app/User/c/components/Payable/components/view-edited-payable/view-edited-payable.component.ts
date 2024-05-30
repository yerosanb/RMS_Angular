import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { NgToastService } from 'ng-angular-popup';
import { LocalStorageService } from 'ngx-webstorage';
import { RasonEditDeletePayload } from 'src/app/User/payloads/edit-transaction-payload/reason_edit_delete';
import { ReconcileService } from 'src/app/User/services/reconcile.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
declare var window: any;
@Component({
  selector: 'app-view-edited-payable',
  templateUrl: './view-edited-payable.component.html',
  styleUrls: ['./view-edited-payable.component.css']
})
export class ViewEditedPayableComponent implements OnInit, AfterViewInit {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('edit-modal-file') public file_update_modal:
    | ElementRef
    | undefined;

  @ViewChild(DataTableDirective)
  datatableElement!: DataTableDirective;

  initialDateValue = new Date();
  dtOptions: any;
  dtOptions_detail: any;
  detailModal: any;
  idd: number = 0;

  length: number = 0;

  reason1: any[] = [];
  editedBy: any[] = [];
  editDate: any[] = [];
  edit_reason_id: any;
  reasonEditDelete: RasonEditDeletePayload [] = []


  //ats inits
  core_first_column_title = 'ID';
  core_second_column_title = 'Reference';
  core_third_column_title = 'Amount';
  core_fourth_column_title = 'Value Date-type';
  core_fifth_column_title = 'Sender';
  core_sixth_column_title = 'Receiver';
  core_seventh_column_title = 'Type';
  core_eighth_column_title = 'Upload Date';
  core_ninth_column_title = 'Additional Information';
  core_tenth_column_title = 'Action';

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private utilService: UtilService,
    private localStorageService: LocalStorageService,
    private reconcileService: ReconcileService,
    private toast: NgToastService,
    private authService: AuthService
   
  ) { 
   
  }


  goToPage(pageName: string) {
    // this.router.navigate([{ outlets: { inner_outlet: [`${pageName}`] } }])
    this.router.navigate([`${pageName}`]);
  }

  openModal(dt: any) {

    this.detailModal.show();
  }
  closeModal() {
    this.detailModal.hide();
  }
  clear() {
    $('#cleardata').empty()
  }



  ngOnInit(): void {
    const that = this;
    this.detailModal = new window.bootstrap.Modal(
      document.getElementById('details_transaction_modal')
    );
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
        this.reconcileService.getEditedPayableTransaction().subscribe(
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
                      this.reconcileService
                        .getEditedPayableTransaction().subscribe(
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
      },
      columns: [
        {
          title: this.core_first_column_title,
          data: 'id',
        },
        {
          title: this.core_tenth_column_title,
          render: function (data: any, type: any, full: any) {
            document
              .getElementsByClassName('datatable-buttons')[0]
              ?.classList.remove('dt-button');
            if (full.edit_delete == '1')
              return 'Edited';
            else
              return 'Deleted';
          },
        },
        {
          title: this.core_third_column_title,
          data: 'amount',
        },
        {
          title: this.core_fourth_column_title,
          data: 'value_date',
        },

        {
          title: this.core_seventh_column_title,
          data: 'dr_cr',
        },
        {
          title: this.core_eighth_column_title,
          data: 'upload_date',
        },
        {
          title: this.core_ninth_column_title,
          data: 'additional_information',
        },
        // {
        //   title: this.ats_tenth_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     document
        //      .getElementsByClassName('datatable-buttons')[0]
        //      ?.classList.remove('dt-button');
        //     if (full.status == 1)
        //    return '<button class="btn btn-primary">Active</button>';

        //     return '<span class="badge bg-danger rounded-pill">Inactive</span>';
        //  },
        // },
      ],
      dom: "<'row mt-2'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      colReorder: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // fixedColumnsLeft: 1,
        action: function (e: any, dt: any, node: any, config: any) { },
      },

      buttons: {
        buttons: [
          'colvis',
          ,
          {
            extend: 'selected',
            text: 'Detail',
            action: function (e: any, dt: any, node: any, config: any) {
              var rows = dt.rows({ selected: true }).data().toArray();
              for (let i = 0; i < rows.length; i++) {
                that.idd = rows[i].id;
                $('#view_detail').DataTable().ajax.reload()


                that.openModal(dt);
              }
            },
          },



          {
            text: 'Reload',
            action: function (e: any, dt: any, node: any, config: any) {
              dt.ajax.reload();
              alert('reload success');
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

      select: true,

      stateSave: true,
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

    this.dtOptions_detail = {
      serverSide: false,
      scrollX: true,
      searching: true,
      // lengthMenu: 'ten',
      // lengthChange: true,
      //ordering: true,
      //paging: true,

      // scrollY: 400,
      //pagingType: 'full_numbers',
      //pageLength: 10,
      // select: true,

      ajax: (dataTablesParameters: any, callback: any) => {
        this.reconcileService.getEditedDetailPayableTransaction(that.idd).subscribe(
          async (resp: any) => {

            if (resp != null) {
              // console.log('........id.......>'+that.idd)
              console.log(
                'response for table: ' + JSON.stringify(resp.length, null, 2)
              );
              this.length = resp.length
              console.log(
                'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm: ' + JSON.stringify(resp[0]?.reason, null, 2)
              );
              // this.reason1
              this.reason1 = [];
              this.editedBy = [];
              this.editDate = [];
              this.reasonEditDelete = []
              console.log("the length: " + this.length)
              for (let i = 0; i < this.length; i++) {
                console.log('ids: ' + resp[i]?.edit_reason_id)
                if (resp[i]?.edit_reason_id == resp[i + 1]?.edit_reason_id) {
                  var aa = new RasonEditDeletePayload ();
                  aa.reason = resp[i]?.reason
                  aa.by = resp[i]?.firstname + ' ' + resp[i]?.lastname
                  aa.date = resp[i]?.date
                  this.reasonEditDelete.push(aa)
                  i++
                }
                else {
                  var aa = new RasonEditDeletePayload ();
                  aa.reason = resp[i]?.reason
                  aa.by = resp[i]?.firstname + ' ' + resp[i]?.lastname
                  aa.date = resp[i]?.date
                  this.reasonEditDelete.push(aa)
                }
                // this.editedBy.push(resp[i]?.firstname + ' ' + resp[i]?.lastname)
                // this.editDate.push(resp[i]?.date)
              }

              for (let i = 0; i < this.reason1.length; i++) {
                console.log("reasonn: " + JSON.stringify(this.reason1[i]))
              }

              //this.reason[]= JSON.stringify(resp[0].reason)
              //this.editedBy=JSON.stringify(resp[0].firstname+' '+resp[0].lastname)
              //this.editDate=JSON.stringify(resp[0].date)
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
                      this.reconcileService
                        .getEditedDetailPayableTransaction(that.idd).subscribe(
                          async (resp: any) => {
                            if (resp != null) {
                              console.log(
                                'response for table: ' +
                                JSON.stringify(resp, null, 2)
                              );
                              for (let i = 0; i < this.length; i++) {
                                console.log('ids: ' + resp[i]?.edit_reason_id)
                                if (resp[i]?.edit_reason_id == resp[i + 1]?.edit_reason_id) {
                                  var aa = new RasonEditDeletePayload ();
                                  aa.reason = resp[i]?.reason
                                  aa.by = resp[i]?.firstname + ' ' + resp[i]?.lastname
                                  aa.date = resp[i]?.date
                                  this.reasonEditDelete.push(aa)
                                  i++
                                }
                                else {
                                  var aa = new RasonEditDeletePayload ();
                                  aa.reason = resp[i]?.reason
                                  aa.by = resp[i]?.firstname + ' ' + resp[i]?.lastname
                                  aa.date = resp[i]?.date
                                  this.reasonEditDelete.push(aa)
                                }
                                // this.editedBy.push(resp[i]?.firstname + ' ' + resp[i]?.lastname)
                                // this.editDate.push(resp[i]?.date)
                              }
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
      },
      columns: [
        {
          title: this.core_first_column_title,
          data: 'id',
        },
        {
          title: 'Old_New',
          data: 'new_old',
        },
        //{
        //  title: this.core_second_column_title,
        // data: 'reference',
        //},
        {
          title: this.core_third_column_title,
          data: 'amount',
        },
        {
          title: this.core_fourth_column_title,
          data: 'value_date',
        },

        {
          title: this.core_seventh_column_title,
          data: 'dr_cr',
        },
        {
          title: this.core_eighth_column_title,
          data: 'upload_date',
        },
        {
          title: this.core_ninth_column_title,
          data: 'additional_information',
        },
        // {
        //   title: this.ats_tenth_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     document
        //      .getElementsByClassName('datatable-buttons')[0]
        //      ?.classList.remove('dt-button');
        //     if (full.status == 1)
        //    return '<button class="btn btn-primary">Active</button>';

        //     return '<span class="badge bg-danger rounded-pill">Inactive</span>';
        //  },
        // },
      ],
      // dom: "<'row mt-2'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      colReorder: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // fixedColumnsLeft: 1,
        action: function (e: any, dt: any, node: any, config: any) { },
      },



      select: true,

      stateSave: true,
      stateDuration: 0,
      // fixedHeader: true,
      // fixedFooter: true,

      // fixed column
      scrollY: true,
      //scrollX:        true,
      //scrollCollapse: true,
      // paging:         false,
      // fixedColumns: false,

    };
  }






  ngAfterViewInit(): void {


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

