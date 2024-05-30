import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { NgToastService } from 'ng-angular-popup';
import { LocalStorageService } from 'ngx-webstorage';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { IssueAccountService } from '../../services/issue-account.service';

@Component({
  selector: 'app-recon-auto-issue',
  templateUrl: './recon-auto-issue.component.html',
  styleUrls: ['./recon-auto-issue.component.css']
})
export class ReconAutoIssueComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  dt_ats_current_page: number = 0;

  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  restricted: boolean = true;
  dtOptions_qbs: any;
  dtOptions_core: any;
  //core inits
  core_first_column_title = '-ID-';
  core_second_column_title = 'Branch';
  core_third_column_title = 'Amount';
  core_fourth_column_title = 'Value Date-type';
  // core_fifth_column_title = 'Sender';
  // core_sixth_column_title = 'Receiver';
  core_seventh_column_title = 'Type';
  core_eighth_column_title = 'Upload Date';
  core_ninth_column_title = 'Additional Information';
  // core_tenth_column_title = 'Action';

  core_input_0!: any;
  core_input_1!: any;
  core_input_2!: any;
  core_input_3!: any;
  // core_input_4!: any;
  // core_input_5!: any;
  core_input_6!: any;
  core_input_7!: any;
  core_input_8!: any;

  core_first_column_id = '0';
  core_second_column_id = '1';
  core_third_column_id = '2';
  core_fourth_column_id = '3';
  // core_fifth_column_id = '4';
  // core_sixth_column_id = '5';
  core_seventh_column_id = '4';
  core_eighth_column_id = '5';
  core_ninth_column_id = '6';

  //qbs inits
  qbs_first_column_title = '-ID-';
  qbs_second_column_title = 'Additional Information';
  qbs_third_column_title = 'Amount';
  qbs_fourth_column_title = 'Value Date';
  // qbs_fifth_column_title = 'Sender';
  // qbs_sixth_column_title = 'Receiver';
  qbs_fifth_column_title = 'Upload Date';
  qbs_sixth_column_title = 'Branch Code';
  qbs_seventh_column_title = 'Type';
  qbs_eighth_column_title = 'branch name';

  qbs_input_0!: any;
  qbs_input_1!: any;
  qbs_input_2!: any;
  qbs_input_3!: any;
  qbs_input_4!: any;
  qbs_input_5!: any;
  qbs_input_6!: any;
   qbs_input_7!: any;
  // qbs_input_8!: any;

  qbs_first_column_id = '0';
  qbs_second_column_id = '1';
  qbs_third_column_id = '2';
  qbs_fourth_column_id = '3';
  qbs_fifth_column_id = '4';
  qbs_sixth_column_id = '5';
  qbs_seventh_column_id = '6';
   qbs_eighth_column_id = '7';
  // qbs_ninth_column_id = '8';

  constructor(
    private router: Router,
    private utilService: UtilService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private issueAccountService: IssueAccountService,
    private toast: NgToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.dtOptions_core = {
      serverSide: false,
      scrollX: true,
      searching: true,
      // lengthMenu: 'ten',
      lengthChange: true,
      ordering: false,
      paging: true,
      // scrollY: 400,
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 20, 50, 100, 200, 500],
      select: true,
      // ajax: '../../../../assets/data/data.json',
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          // self.someFilterFromAts(data);
        });
        return row;
      },
      ajax: (dataTablesParameters: any, callback: any) => {
        this.issueAccountService.getCoreIssueForeRecon_auto().subscribe(
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
                      this.issueAccountService
                        .getCoreIssueForeRecon_auto()
                        .subscribe(
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
        );
      },
      columns: [
        {
          title: this.core_first_column_title,
          data: 'id',
        },
        {
          title: this.core_third_column_title,
          data: 'amount',
        },
        {
          title: this.core_second_column_title,
          data: 'branch',
        },
        {
          title: this.core_fourth_column_title,
          data: 'value_date',
        },
        // {
        //   title: this.core_fifth_column_title,
        //   data: 'sender',
        // },
        // {
        //   title: this.core_sixth_column_title,
        //   data: 'receiver',
        // },
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
        //   title: 'qbs_id',
        //   data: 'core_id',
        // },

        // {
        //   title: this.ats_tenth_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     document
        //       .getElementsByClassName('datatable-buttons')[0]
        //       ?.classList.remove('dt-button');
        //     // if (full.status == 1)
        //     return (
        //       '<i class="mdi mdi-18px mdi-delete text-danger" style="cursor: pointer; margin-left: 4px;" ' +
        //       'user-name="' +
        //       full.firstname +
        //       ' ' +
        //       full.lastname +
        //       '" delete-user="' +
        //       full.id +
        //       '"></i>'
        //     );

        //     // return '<span class="badge bg-danger rounded-pill">Inactive</span>';
        //   },
        // },
      ],
      dom: "<'row mb-1 my-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      // colReorder: {
      //   order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      //   // fixedColumnsLeft: 1,
      //   action: function (e: any, dt: any, node: any, config: any) {},
      // },
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
              // alert('reload success');
            },
          },

          {
            extend: 'selected',
            text: 'Sum',
            action: function (e: any, dt: any, node: any, config: any) {
              var rows = dt.rows({ selected: true }).data().toArray();
              if (rows.length < 2) {
                Swal.fire({
                  icon: 'warning',
                  text: 'Please select more than one row to sum up their amount.',
                });
              } else {
                var sum = 0;
                for (let i = 0; i < rows.length; i++) {
                  sum += rows[i].amount;
                }
                Swal.fire({
                  text: 'The sum of selected amounts is ' + sum.toFixed(2),
                });
              }
            },
          },
          {
            extend: 'selected',
            text: 'Edit',
            action: function (e: any, dt: any, node: any, config: any) {
              var rows = dt.rows({ selected: true }).data().toArray();
              if (rows.length > 1) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Please select only one row.',
                  text: "Select only one row to edit. you can't edit multiple rows at once.",
                });
              } else {
                // that.edit_core = false;
                // // console.log('the type is: ' + JSON.stringify(rows[0].dr_cr,null, 4))
                // that.editForm.controls['reference'].setValue(
                //   rows[0].reference
                // );
                // that.editForm.controls['amount'].setValue(rows[0].amount);
                // that.editForm.controls['value_date'].setValue(
                //   rows[0].value_date_type
                // );
                // that.editForm.controls['upload_date'].setValue(
                //   rows[0].upload_date
                // );
                // that.editForm.controls['additional_information'].setValue(
                //   rows[0].additional_information
                // );
                // that.editForm.controls['type'].setValue(rows[0].dr_cr);
                // $('#lalksdf6a5s4d6ffas').html(rows[0].id);
                // that.openModal();
              }
            },
          },
          {
            extend: 'selected',
            text: 'Delete',
            action: async function (e: any, dt: any, node: any, config: any) {
              // var rows = dt.rows({ selected: true }).data().toArray();
              // const { value: text } = await Swal.fire({
              //   input: 'textarea',
              //   inputLabel: 'Reason',
              //   inputPlaceholder: 'Type your reason here...',
              //   inputAttributes: {
              //     'aria-label': 'Type your reason here',
              //   },
              //   title: 'Delete Warning: ',
              //   text: 'You are trying to delete a transaction. If you are sure please state your reason.',
              //   icon: 'warning',
              //   showCancelButton: true,
              //   confirmButtonColor: '#d33',
              //   cancelButtonColor: '#3085d6',
              //   confirmButtonText: 'Delete anyways',
              // });
              // if (text == '') {
              //   Swal.fire({
              //     title: 'Delete failed. No reason found.',
              //     icon: 'error',
              //   });
              // } else if (text) {
              //   var ids: any[] = [];
              //   for (let i = 0; i < rows.length; i++) {
              //     ids.push(rows[i].id);
              //   }
              //   that.reconcileService
              //     .deleteTransactions(text, ids, 'ats')
              //     .subscribe(
              //       (data: any) => {
              //         console.log(JSON.stringify(data, null, 3));
              //         Swal.fire({
              //           title: 'Delete Success!',
              //           text: 'You have Deleted the transaction successfully.',
              //           icon: 'success',
              //         });
              //         that.dtElements.forEach(
              //           (dtElement: DataTableDirective, index: number) => {
              //             if (index == 0) {
              //               dtElement.dtInstance.then(
              //                 (dtInstance: DataTables.Api) => {
              //                   dtInstance.ajax.reload((data) => {
              //                     console.log('data reload 00');
              //                   }, false);
              //                 }
              //               );
              //             }
              //           }
              //         );
              //       },
              //       (error) => {
              //         if (error.error.text === 'access-token-expired') {
              //           console.log('Access-token-expired requesting refresh token...');
              //           if (
              //             that.localStorageService.retrieve('refresh_token_requested') == null
              //           ) {
              //             that.utilService.refreshToken().subscribe(
              //               (data) => {
              //                 if (data === true) {
              //                   console.log(
              //                     'refresh token success re-requesting the actual request'
              //                   );
              //                   that.localStorageService.clear('refresh_token_requested');
              //                   //================================================================================
              //                   that.reconcileService
              //                   .deleteTransactions(text, ids, 'ats')
              //                   .subscribe(
              //                     (data: any) => {
              //                       console.log(JSON.stringify(data, null, 3));
              //                       Swal.fire({
              //                         title: 'Delete Success!',
              //                         text: 'You have Deleted the transaction successfully.',
              //                         icon: 'success',
              //                       });
              //                       that.dtElements.forEach(
              //                         (dtElement: DataTableDirective, index: number) => {
              //                           if (index == 0) {
              //                             dtElement.dtInstance.then(
              //                               (dtInstance: DataTables.Api) => {
              //                                 dtInstance.ajax.reload((data) => {
              //                                   console.log('data reload 00');
              //                                 }, false);
              //                               }
              //                             );
              //                           }
              //                         }
              //                       );
              //                     },
              //                     (error: any) => {
              //                       if (error.error.text === 'access-token-expired') {
              //                         console.log('refresh token expired.');
              //                         that.SwalSessionExpired.fire();
              //                         that._refreshTokenExpired();
              //                       } else {
              //                         Swal.fire({
              //                           icon: 'error',
              //                           title: 'Oops...',
              //                           text: 'Something went wrong!',
              //                         });
              //                         console.log(
              //                           JSON.stringify(error.error.apierror, null, 2)
              //                         );
              //                       }
              //                     }
              //                   );
              //                   //================================================================================
              //                 } else {
              //                   console.log('refresh token expired.');
              //                   that.SwalSessionExpired.fire();
              //                   that._refreshTokenExpired();
              //                 }
              //               },
              //               (error: any) => {
              //                 console.log('error refreshing access token');
              //                 Swal.fire({
              //                   icon: 'error',
              //                   title: 'Oops...',
              //                   text: 'Something went wrong!',
              //                 });
              //                 console.log(JSON.stringify(error.error.apierror, null, 2));
              //               }
              //             );
              //             that.localStorageService.store('refresh_token_requested', true);
              //           }
              //         }
              //       }
              //     );
              // }
            },
          },
          // {
          //   extend: 'collection',
          //   text: 'Select',
          //   buttons: [
          //     'selectAll',
          //     'selectNone',
          //     'selectCells',
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
          // {
          //   extend: 'copy',
          //   text: '<u>C</u>opy',
          //   key: {
          //     key: 'c',
          //     altKey: true,
          //   },
          // },
          // 'print',
          // {
          //   extend: 'pdf',
          //   text: 'Pdf',
          // },
          // {
          //   extend: 'pdf',
          //   text: 'Pdf current page',
          //   exportOptions: {
          //     modifier: {
          //       page: 'current',
          //     },
          //   },
          // },
          // {
          //   extend: 'excel',
          //   text: 'Excel',
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
        ],
      },

      stateSave: true,
      stateDuration: 0,
      fixedFooter: true,
      fixedHeader: {
        header: true,
      },
      scrollCollapse: true,
      // searchPanes: {
      //   initCollapsed: true,
      //   cascadePanes: true,
      //   clear: true,
      // },
      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
          // className: 'select-checkbox',
        },
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
      ],
      // language: {
      //   searchPanes: {
      //     count: '{total} found',
      //     countFiltered: '{shown} / {total}',
      //   },
      // },
    };

    this.dtOptions_qbs = {
      serverSide: false,
      scrollX: true,
      searching: true,
      // lengthMenu: 'ten',
      lengthChange: true,
      ordering: false,
      paging: true,
      // scrollY: 400,
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 20, 50, 100, 200, 500],
      select: true,
      // ajax: '../../../../assets/data/data.json',
      ajax: (dataTablesParameters: any, callback: any) => {
        console.log('in ajax call 2');
        this.issueAccountService.getQbsIssueForeRecon_auto().subscribe(
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
                      this.issueAccountService.getQbsIssueForeRecon_auto().subscribe(
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
        );
      },
      columns: [
        {
          title: this.qbs_first_column_title,
          data: 'id',
        },
        {
          title: this.qbs_third_column_title,
          data: 'amount',
        },
        {
          title: this.qbs_second_column_title,
          data: 'additional_information',
        },
        {
          title: this.qbs_fourth_column_title,
          data: 'value_date',
        },
        {
          title: this.qbs_fifth_column_title,
          data: 'upload_date',
        },
        {
          title: this.qbs_sixth_column_title,
          data: 'branch',
        },
        {
          title: this.qbs_seventh_column_title,
          data: 'dr_cr',
        },
        {
          title: this.qbs_eighth_column_title,
          data: 'branch_name',
        },
        // {
        //   title: this.qbs_eighth_column_title,
        //   data: 'posting_date',
        // },
        // {
        //   title: this.qbs_ninth_column_title,
        //   data: 'transaction_reference',
        // },
        // {
        //   title: this.qbs_tenth_column_title,
        //   render: function (data: any, type: any, full: any) {
        //     document
        //       .getElementsByClassName('datatable-buttons')[0]
        //       ?.classList.remove('dt-button');
        //     // if (full.status == 1)
        //     // return '<button class="btn btn-primary">Active</button>';
        //     return (
        //       '<i class="mdi mdi-18px mdi-delete text-danger" style="cursor: pointer; margin-left: 4px;" ' +
        //       'user-name="' +
        //       full.firstname +
        //       ' ' +
        //       full.lastname +
        //       '" delete-user="' +
        //       full.id +
        //       '"></i>'
        //     );
        //     // return '<span class="badge bg-danger rounded-pill">Inactive</span>';
        //   },
        // },
      ],
      dom: "<'row mb-1 my-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
      // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
      // colReorder: {
      //   order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      //   // fixedColumnsLeft: 1,
      //   action: function (e: any, dt: any, node: any, config: any) {},
      // },
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
              // alert('reload success');
            },
          },

          {
            extend: 'selected',
            text: 'Sum',
            action: function (e: any, dt: any, node: any, config: any) {
              var rows = dt.rows({ selected: true }).data().toArray();
              if (rows.length < 2) {
                Swal.fire({
                  icon: 'warning',
                  text: 'Please select more than one row to sum up their amount.',
                });
              } else {
                var sum = 0;
                for (let i = 0; i < rows.length; i++) {
                  sum += rows[i].amount;
                }
                Swal.fire({
                  text: 'The sum of selected amounts is ' + sum.toFixed(2),
                });
              }
            },
          },

          {
            extend: 'selected',
            text: 'Edit',
            action: function (e: any, dt: any, node: any, config: any) {
              // var rows = dt.rows({ selected: true }).data().toArray();
              // if (rows.length > 1) {
              //   Swal.fire({
              //     icon: 'warning',
              //     title: 'Please select only one row.',
              //     text: "Select only one row to edit. you can't edit multiple rows at once.",
              //   });
              // } else {
              //   that.edit_core = true;
              //   // that.editForm.controls['reference'].setValue(
              //   //   rows[0].reference
              //   // );
              //   that.editForm.controls['amount'].setValue(rows[0].amount);
              //   that.editForm.controls['value_date'].setValue(
              //     rows[0].value_date
              //   );
              //   that.editForm.controls['upload_date'].setValue(
              //     rows[0].upload_date
              //   );
              //   that.editForm.controls['additional_information'].setValue(
              //     rows[0].additional_information
              //   );
              //   that.editForm.controls['type'].setValue(rows[0].dr_cr);
              //   $('#lalksdf6a5s4d6ffas').html(rows[0].id);
              //   that.openModal();
              // }
            },
          },
          {
            extend: 'selected',
            text: 'Delete',
            action: async function (e: any, dt: any, node: any, config: any) {
              // var rows = dt.rows({ selected: true }).data().toArray();
              // const { value: text } = await Swal.fire({
              //   input: 'textarea',
              //   inputLabel: 'Reason',
              //   inputPlaceholder: 'Type your reason here...',
              //   inputAttributes: {
              //     'aria-label': 'Type your reason here',
              //   },
              //   title: 'Delete Warning: ',
              //   text: 'You are trying to delete a transaction. If you are sure please state your reason.',
              //   icon: 'warning',
              //   showCancelButton: true,
              //   confirmButtonColor: '#d33',
              //   cancelButtonColor: '#3085d6',
              //   confirmButtonText: 'Delete anyways',
              // });
              // if (text == '') {
              //   Swal.fire({
              //     title: 'Delete failed. No reason found.',
              //     icon: 'error',
              //   });
              // } else if (text) {
              //   var ids: any[] = [];
              //   for (let i = 0; i < rows.length; i++) {
              //     ids.push(rows[i].id);
              //   }
              //   that.reconcileService
              //     .deleteTransactions(text, ids, 'core')
              //     .subscribe(
              //       (data: any) => {
              //         console.log(JSON.stringify(data, null, 3));
              //         Swal.fire({
              //           title: 'Delete Success!',
              //           text: 'You have Deleted the transaction successfully.',
              //           icon: 'success',
              //         });
              //         that.dtElements.forEach(
              //           (dtElement: DataTableDirective, index: number) => {
              //             if (index == 1) {
              //               dtElement.dtInstance.then(
              //                 (dtInstance: DataTables.Api) => {
              //                   dtInstance.ajax.reload((data) => {
              //                     console.log('data reload 00');
              //                   }, false);
              //                 }
              //               );
              //             }
              //           }
              //         );
              //       },
              //       (error) => {
              //         if (error.error.text === 'access-token-expired') {
              //           console.log('Access-token-expired requesting refresh token...');
              //           if (
              //             that.localStorageService.retrieve('refresh_token_requested') == null
              //           ) {
              //             that.utilService.refreshToken().subscribe(
              //               (data) => {
              //                 if (data === true) {
              //                   console.log(
              //                     'refresh token success re-requesting the actual request'
              //                   );
              //                   that.localStorageService.clear('refresh_token_requested');
              //                   //================================================================================
              //                   that.reconcileService
              //                   .deleteTransactions(text, ids, 'core')
              //                   .subscribe(
              //                     (data: any) => {
              //                       console.log(JSON.stringify(data, null, 3));
              //                       Swal.fire({
              //                         title: 'Delete Success!',
              //                         text: 'You have Deleted the transaction successfully.',
              //                         icon: 'success',
              //                       });
              //                       that.dtElements.forEach(
              //                         (dtElement: DataTableDirective, index: number) => {
              //                           if (index == 1) {
              //                             dtElement.dtInstance.then(
              //                               (dtInstance: DataTables.Api) => {
              //                                 dtInstance.ajax.reload((data) => {
              //                                   console.log('data reload 00');
              //                                 }, false);
              //                               }
              //                             );
              //                           }
              //                         }
              //                       );
              //                     },
              //                     (error) => {
              //                       if (error.error.text === 'access-token-expired') {
              //                         console.log('refresh token expired.');
              //                         that.SwalSessionExpired.fire();
              //                         that._refreshTokenExpired();
              //                       } else {
              //                         Swal.fire({
              //                           icon: 'error',
              //                           title: 'Oops...',
              //                           text: 'Something went wrong!',
              //                         });
              //                         console.log(
              //                           JSON.stringify(error.error.apierror, null, 2)
              //                         );
              //                       }
              //                     }
              //                   );
              //                   //================================================================================
              //                 } else {
              //                   console.log('refresh token expired.');
              //                   that.SwalSessionExpired.fire();
              //                   that._refreshTokenExpired();
              //                 }
              //               },
              //               (error: any) => {
              //                 console.log('error refreshing access token');
              //                 Swal.fire({
              //                   icon: 'error',
              //                   title: 'Oops...',
              //                   text: 'Something went wrong!',
              //                 });
              //                 console.log(JSON.stringify(error.error.apierror, null, 2));
              //               }
              //             );
              //             that.localStorageService.store('refresh_token_requested', true);
              //           }
              //         }
              //       }
              //     );
              // }
            },
          },
          // {
          //   extend: 'copy',
          //   text: '<u>C</u>opy',
          //   key: {
          //     key: 'c',
          //     altKey: true,
          //   },
          // },
          // 'print',
          // {
          //   extend: 'pdf',
          //   text: 'Pdf',
          // },
          // {
          //   extend: 'pdf',
          //   text: 'Pdf current page',
          //   exportOptions: {
          //     modifier: {
          //       page: 'current',
          //     },
          //   },
          // },
          // {
          //   extend: 'excel',
          //   text: 'Excel',
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
        ],
      },

      stateSave: true,
      stateDuration: 0,
      fixedFooter: true,
      fixedHeader: {
        header: true,
      },
      scrollCollapse: true,
      // searchPanes: {
      //   initCollapsed: true,
      //   cascadePanes: true,
      //   clear: true,
      // },
      columnDefs: [
        {
          targets: '_all',
          defaultContent: '-',
          // className: 'select-checkbox',
        },
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
      ],
      // language: {
      //   searchPanes: {
      //     count: '{total} found',
      //     countFiltered: '{shown} / {total}',
      //   },
      // },
    };
    this.clearAllSearches();
  }

  clearAllSearches() {
    if (this.dtElements != null && this.dtElements.length > 0)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.rows('.selected').deselect();
              // dtInstance.search('').draw()
              dtInstance
                .search('')
                .column(0)
                .search('')
                .column(1)
                .search('')
                .column(2)
                .search('')
                .column(3)
                .search('')
                .column(4)
                .search('')
                .column(5)
                .search('')
                .column(6)
                .search('')
                .draw();
              // dtInstance.search('').draw()
              dtInstance.page(this.dt_ats_current_page).draw(false);
            });
          } else {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.rows('.selected').deselect();
              dtInstance
                .search('')
                .column(0)
                .search('')
                .column(1)
                .search('')
                .column(2)
                .search('')
                .column(3)
                .search('')
                .column(4)
                .search('')
                .column(5)
                .search('')
                .column(6)
                .search('')
                .draw();
            });
          }
        }
      );
  }

  addSelectEvent(that: any, dtInstance: any, dt: any, indexes: any) {
    if (that.restricted) {
      that.dt_ats_current_page = dt.page();
      var rowData = dtInstance.rows(indexes).data().toArray();

      that.core_input_2 = rowData[0].branch;
      that.qbs_input_2
        = rowData[0].branch;

      that.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              console.log('to search: ' + rowData[0].branch);
              dtInstance
                .column(1)
                .search(rowData[0].amount)
                .column(2)
                .search(rowData[0].branch)
                .draw();
            });
          } else {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance
                .column(1)
                .search(rowData[0].amount)
                .column(2)
                .search(rowData[0].branch)
                .draw();
            });
            console.log('searched...');
          }
        }
      );
    }
  }

  ngAfterViewInit(): void {
    var that = this;

    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if (index == 0) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.on('select', function (e, dt, type, indexes) {
            that.addSelectEvent(that, dtInstance, dt, indexes);
          });
          dtInstance.columns().every(function () {
            $('input', this.footer()).on('keyup change', function () {
              if (this['id'] == '0') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '1') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '2') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '3') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '4') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '5') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '6') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              }
              // else {
              //   console.log('it is two to search')
              //   if (this['id'] != '') {
              //     if (
              //       dtInstance.column(this['id']).search() !==
              //       (this as HTMLInputElement).value
              //     ) {
              //       dtInstance
              //         .column(this['id'])
              //         .search((this as HTMLInputElement).value)
              //         .draw();
              //     }
              //   }
              // }
            });
          });
        });
      } else if (index == 1) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.columns().every(function () {
            $('input', this.footer()).on('keyup change', function () {
              if (this['id'] == '0') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '1') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '2') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '3') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '4') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '5') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              } else if (this['id'] == '6') {
                console.log('it is one to search');
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  dtInstance.column(this['id']).search((this as HTMLInputElement).value).draw();
                }
              }
              // else {
              //   console.log('it is two to search')
              //   if (this['id'] != '') {
              //     if (
              //       dtInstance.column(this['id']).search() !==
              //       (this as HTMLInputElement).value
              //     ) {
              //       dtInstance
              //         .column(this['id'])
              //         .search((this as HTMLInputElement).value)
              //         .draw();
              //     }
              //   }
              // }
            });
          });
        });

      }
    });
    that.clearAllSearches();
    // $('#edit_transaction_modal').on('hidden.bs.modal', function (e) {
    //   that.editForm.reset();
    //   that.submitted = false;
    //   // that.editForm.controls['type'].setValue('cr');
    // });
  }

  matchAllTransactions() {
    console.log('match all transactions')

    var data_1_id: any[] = [];
    var data_2_id: any[] = [];
    var data_1_branch:any[]=[];
    var data_2_branch:any[]=[];
    var data_1_amount:any[]=[];
    var data_2_amount:any[]=[];
    // var data_1_type: any[] = [];
    var data_1_qbs_id: any[] = [];
    var data_1_amount_sum: number = 0;
    var data_2_amount_sum: number = 0;
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if (index == 0) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
          console.log('first data: ' + JSON.stringify(rowData[0], null, 4))
          for (let i = 0; i < rowData.length; i++) {
            data_1_amount_sum += Number(
              JSON.stringify(rowData[i].amount, null, 4)
            );
            data_1_id.push(rowData[i].id);
            // data_1_type.push(rowData[i].value_date_type);
            data_1_qbs_id.push(rowData[i].core_id);
            data_1_branch.push(rowData[i].branch);
            data_1_amount.push(rowData[i].amount);
            // data_1_id.push(rowData[i].id)
            // data_1_id.push(rowData[i].id)
            // data_1_id.push(rowData[i].id)
          }
        });
      } else {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
          for (let i = 0; i < rowData.length; i++) {
            // data_2.push(rowData[i])
            data_2_amount_sum += Number(
              JSON.stringify(rowData[i].amount, null, 4)
            );
            data_2_id.push(rowData[i].id);
            data_2_branch.push(rowData[i].additional_information);
            data_2_amount.push(rowData[i].amount);
            // data_2_id.push(rowData[i].id)
          }
          //console.log(this.selections);


          console.log(data_1_id);
          console.log(data_2_id);
          console.log(data_1_branch);
          console.log(data_2_branch);
          console.log(data_1_amount);
          console.log(data_2_amount);
          // if (data_1_id.length == data_2_id.length) {
            if (data_1_id.length == 0 || data_2_id.length == 0) {
              Swal.hideLoading();
              Swal.close();
              this.showSelectionEmpty()
            }
            else {
              this.issueAccountService
                .matchAllTransactions(
                  data_1_id.toString(),
                  data_2_id.toString(),
                  data_1_branch.toString(),
                  data_2_branch.toString(),
                  data_1_amount.toString(),
                  data_2_amount.toString(),
                  // data_1_qbs_id.toString(),
                  // data_1_type.toString()
                  //formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US')
                )
                .subscribe(
                  (data: any) => {
                    if (data == true) {
                      Swal.hideLoading();
                      Swal.close();
                      this.showMatchSuccess();
                      this.dtElements.forEach(
                        (dtElement: DataTableDirective, index: number) => {
                          console.log('index: ' + index);
                          if (index == 0) {
                            dtElement.dtInstance.then(
                              (dtInstance: DataTables.Api) => {
                                dtInstance
                                  .rows({ search: 'applied' })
                                  .remove()
                                  .draw();
                              }
                            );
                            this.clearAllSearches();
                          }
                          else {
                            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                              dtInstance.rows({ search: 'applied' }).remove().draw();
                            });
                            this.clearAllSearches();
                          }
                        }
                      );
                      console.log('match success: ' + data);
                    } else {
                      Swal.hideLoading();
                      Swal.close();
                      this.showMatchFail()
                      console.log('ret: ' + JSON.stringify(data, null, 5));
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
                              this.issueAccountService
                                .matchAllTransactions(
                                  data_1_id.toString(),
                                  data_2_id.toString(),
                                  data_1_branch.toString(),
                                  data_2_branch.toString(),
                                  data_1_amount.toString(),
                                  data_2_amount.toString(),
                                  // data_1_qbs_id.toString(),
                                  //data_1_type.toString(),
                                  // formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US')
                                )
                                .subscribe(
                                  (data: any) => {
                                    if (data == true) {
                                      Swal.hideLoading();
                                      Swal.close();
                                      this.showMatchSuccess();
                                      this.dtElements.forEach(
                                        (dtElement: DataTableDirective, index: number) => {
                                          console.log('index: ' + index);
                                          if (index == 0) {
                                            dtElement.dtInstance.then(
                                              (dtInstance: DataTables.Api) => {
                                                dtInstance
                                                  .rows({ search: 'applied' })
                                                  .remove()
                                                  .draw();
                                              }
                                            );
                                            this.clearAllSearches();
                                          }
                                          else {
                                            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                                              dtInstance.rows({ search: 'applied' }).remove().draw();
                                            });
                                            this.clearAllSearches();
                                          }
                                        }
                                      );
                                      console.log('match success: ' + data);
                                    } else {
                                      Swal.hideLoading();
                                      Swal.close();
                                      this.showMatchFail()
                                      console.log('ret: ' + JSON.stringify(data, null, 5));
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
                  }
                );
            }
          // // }
          // else{
          // this.UnequalTransaction();
          // }

          // }

        });
      }
    });
  }

  showMatchFail() {
    this.toast.error({ detail: 'ERROR', summary: 'Matching failed!' });
  }

  showClearSelection() {
    this.toast.error({ 
      detail: 'ERROR',
      summary: 'Please clear selection and try again. click `Reset` button.',
    });
  }
  UnequalTransaction() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'Automatically not match, because the data size of the two tables difference Please check it ? ',
    });
  }

  matchTransactions() {
    var data_1_id: any[] = [];
    var data_2_id: any[] = [];
    var rowData1: any[] = [];
    var data_1_amount_sum: number = 0;
    var data_2_amount_sum: number = 0;
    if (this.restricted) {
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
              var rowData = dtInstance
                .rows({ selected: true })
                .data()
                .toArray();
              if (rowData.length > 0) {
                rowData1 = rowData;
                // date = rowData[0].value_date_type;
                for (let i = 0; i < rowData.length; i++) {
                  data_1_amount_sum += Number(
                    JSON.stringify(rowData[i].amount, null, 4)
                  );
                  data_1_id.push(rowData[i].id);
                }
              }
            });
          } else {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              var rowData = dtInstance
                .rows({ selected: true })
                .data()
                .toArray();
              for (let i = 0; i < rowData.length; i++) {
                data_2_amount_sum += Number(
                  JSON.stringify(rowData[i].amount, null, 4)
                );
                data_2_id.push(rowData[i].id);
              }
              if (data_1_id.length != 0 && data_2_id.length != 0) {
                console.log(data_1_id);
                console.log(data_2_id);
                if (data_1_amount_sum == data_2_amount_sum) {
                  this.issueAccountService
                    .matchTransactions(
                      data_1_id.toString(),
                      data_2_id.toString()
                    )
                    .subscribe(
                      (data: any) => {
                        if (data == true) {
                          this.showMatchSuccess();
                          this.dtElements.forEach(
                            (dtElement: DataTableDirective, index: Number) => {
                              console.log('index: ' + index);
                              if (index == 0) {
                                dtElement.dtInstance.then(
                                  (dtInstance: DataTables.Api) => {
                                    dtInstance
                                      .rows({ search: 'applied' })
                                      .remove()
                                      .draw();
                                  }
                                );
                              } else if (index == 1) {
                                dtElement.dtInstance.then(
                                  (dtInstance: DataTables.Api) => {
                                    dtInstance
                                      .rows({ search: 'applied' })
                                      .remove()
                                      .draw();
                                  }
                                );
                                this.clearAllSearches();
                              }
                              // else {
                              //   // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                              //   //   dtInstance.rows({ search: 'applied' }).remove().draw();
                              //   // });
                              //   this.clearAllSearches();
                              // }
                            }
                          );
                          console.log('match success: ' + data);
                        } else
                          console.log('ret: ' + JSON.stringify(data, null, 5));
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
                                  this.issueAccountService
                                    .matchTransactions(
                                      data_1_id.toString(),
                                      data_2_id.toString()
                                    )
                                    .subscribe(
                                      (data: any) => {
                                        if (data == true) {
                                          this.showMatchSuccess();
                                          this.dtElements.forEach(
                                            (
                                              dtElement: DataTableDirective,
                                              index: Number
                                            ) => {
                                              console.log('index: ' + index);
                                              if (index == 0) {
                                                dtElement.dtInstance.then(
                                                  (
                                                    dtInstance: DataTables.Api
                                                  ) => {
                                                    dtInstance
                                                      .rows({
                                                        search: 'applied',
                                                      })
                                                      .remove()
                                                      .draw();
                                                  }
                                                );
                                              } else if (index == 1) {
                                                dtElement.dtInstance.then(
                                                  (
                                                    dtInstance: DataTables.Api
                                                  ) => {
                                                    dtInstance
                                                      .rows({
                                                        search: 'applied',
                                                      })
                                                      .remove()
                                                      .draw();
                                                  }
                                                );
                                                this.clearAllSearches();
                                              }
                                              // else {
                                              //   // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                                              //   //   dtInstance.rows({ search: 'applied' }).remove().draw();
                                              //   // });
                                              //   this.clearAllSearches();
                                              // }
                                            }
                                          );
                                          console.log('match success: ' + data);
                                        } else
                                          console.log(
                                            'ret: ' +
                                            JSON.stringify(data, null, 5)
                                          );
                                      },
                                      (error: any) => {
                                        if (
                                          error.error.text ===
                                          'access-token-expired'
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
                        }
                      }
                    );
                } else {
                  Swal.fire({
                    title: 'Amount Difference!',
                    icon: 'warning',
                    text: 'There is an amount difference between transactions, please disable restricted mode and try matching again.',
                  });
                }
              } else {
                this.showSelectionEmpty();
              }
            });
          }
        }
      );
    } else {
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
              var rowData = dtInstance
                .rows({ selected: true })
                .data()
                .toArray();
              if (rowData.length > 0) {
                rowData1 = rowData;
                // date = rowData[0].value_date_type;
                for (let i = 0; i < rowData.length; i++) {
                  data_1_amount_sum += Number(
                    JSON.stringify(rowData[i].amount, null, 4)
                  );
                  data_1_id.push(rowData[i].id);
                }
              }
            });
          } else {
            dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
              var rowData = dtInstance
                .rows({ selected: true })
                .data()
                .toArray();
              for (let i = 0; i < rowData.length; i++) {
                data_2_amount_sum += Number(
                  JSON.stringify(rowData[i].amount, null, 4)
                );
                data_2_id.push(rowData[i].id);
              }
              if (data_1_id.length != 0 && data_2_id.length != 0) {
                console.log(data_1_id);
                console.log(data_2_id);
                if (
                  data_1_amount_sum != data_2_amount_sum ||
                  !rowData[0].additional_information.includes(
                    rowData1[0].branch
                  )
                ) {
                  // dtInstance
                  // .column(1)
                  // .search(rowData[0].amount)
                  // .column(2)
                  // .search(rowData[0].branch)
                  // .draw();
                  const { value: text } = await Swal.fire({
                    input: 'textarea',
                    inputLabel: 'Reason',
                    inputPlaceholder: 'Type your reason here...',
                    inputAttributes: {
                      'aria-label': 'Type your reason here',
                    },
                    title:
                      (!rowData[0].additional_information.includes(
                        rowData1[0].branch
                      )
                        ? 'Branch '
                        : '') +
                      (data_1_amount_sum != data_2_amount_sum &&
                        !rowData[0].additional_information.includes(
                          rowData1[0].branch
                        )
                        ? 'and '
                        : '') +
                      (data_1_amount_sum != data_2_amount_sum
                        ? 'Amount '
                        : '') +
                      'Difference',
                    text: "It seems there is a branch or amount difference between the selected transactions. If you are sure, state your reason and click 'Match anyways'.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Match anyways',
                  });
                  if (text == '') {
                    Swal.fire({
                      title: 'Can not match. No reason found.',
                      icon: 'error',
                    });
                  } else if (text) {
                    // var type = 'reference';
                    console.log(data_1_id);
                    console.log(data_2_id);
                    this.issueAccountService
                      .matchTransactionsComment(
                        data_1_id.toString(),
                        data_2_id.toString(),
                        text
                      )
                      .subscribe(
                        (data: any) => {
                          if (data == true) {
                            this.showMatchSuccess();
                            this.dtElements.forEach(
                              (
                                dtElement: DataTableDirective,
                                index: Number
                              ) => {
                                console.log('index: ' + index);
                                if (index == 0) {
                                  dtElement.dtInstance.then(
                                    (dtInstance: DataTables.Api) => {
                                      dtInstance
                                        .rows({ selected: true })
                                        .remove()
                                        .draw();
                                    }
                                  );
                                } else if (index == 1) {
                                  dtElement.dtInstance.then(
                                    (dtInstance: DataTables.Api) => {
                                      dtInstance
                                        .rows({ selected: true })
                                        .remove()
                                        .draw();
                                    }
                                  );
                                  this.clearAllSearches();
                                }
                                // else {
                                //   // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                                //   //   dtInstance.rows({ search: 'applied' }).remove().draw();
                                //   // });
                                //   this.clearAllSearches();
                                // }
                              }
                            );
                            console.log('match success: ' + data);
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Permission',
                              text: 'You are not permitted to perform this action!',
                            });
                            console.log(
                              'ret: ' + JSON.stringify(data, null, 5)
                            );
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
                                    this.issueAccountService
                                      .matchTransactionsComment(
                                        data_1_id.toString(),
                                        data_2_id.toString(),
                                        text
                                        // type
                                      )
                                      .subscribe(
                                        (data: any) => {
                                          if (data == true) {
                                            this.showMatchSuccess();
                                            this.dtElements.forEach(
                                              (
                                                dtElement: DataTableDirective,
                                                index: Number
                                              ) => {
                                                console.log('index: ' + index);
                                                if (index == 0) {
                                                  dtElement.dtInstance.then(
                                                    (
                                                      dtInstance: DataTables.Api
                                                    ) => {
                                                      dtInstance
                                                        .rows({
                                                          selected: true,
                                                        })
                                                        .remove()
                                                        .draw();
                                                    }
                                                  );
                                                } else if (index == 1) {
                                                  dtElement.dtInstance.then(
                                                    (
                                                      dtInstance: DataTables.Api
                                                    ) => {
                                                      dtInstance
                                                        .rows({
                                                          selected: true,
                                                        })
                                                        .remove()
                                                        .draw();
                                                    }
                                                  );
                                                  this.clearAllSearches();
                                                }
                                                // else {
                                                //   // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                                                //   //   dtInstance.rows({ search: 'applied' }).remove().draw();
                                                //   // });
                                                //   this.clearAllSearches();
                                                // }
                                              }
                                            );
                                            console.log(
                                              'match success: ' + data
                                            );
                                          } else
                                            console.log(
                                              'ret: ' +
                                              JSON.stringify(data, null, 5)
                                            );
                                        },
                                        (error) => {
                                          if (
                                            error.error.text ===
                                            'access-token-expired'
                                          ) {
                                            console.log(
                                              'refresh token expired.'
                                            );
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
                                    JSON.stringify(
                                      error.error.apierror,
                                      null,
                                      2
                                    )
                                  );
                                }
                              );
                              this.localStorageService.store(
                                'refresh_token_requested',
                                true
                              );
                            }
                          }
                        }
                      );
                  }
                } else {
                  this.issueAccountService
                    .matchTransactions(
                      data_1_id.toString(),
                      data_2_id.toString()
                    )
                    .subscribe(
                      (data: any) => {
                        if (data == true) {
                          this.showMatchSuccess();
                          this.dtElements.forEach(
                            (dtElement: DataTableDirective, index: Number) => {
                              console.log('index: ' + index);
                              if (index == 0) {
                                dtElement.dtInstance.then(
                                  (dtInstance: DataTables.Api) => {
                                    dtInstance
                                      .rows({ selected: true })
                                      .remove()
                                      .draw();
                                  }
                                );
                              } else if (index == 1) {
                                dtElement.dtInstance.then(
                                  (dtInstance: DataTables.Api) => {
                                    dtInstance
                                      .rows({ selected: true })
                                      .remove()
                                      .draw();
                                  }
                                );
                                this.clearAllSearches();
                              }
                              // else {
                              //   // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                              //   //   dtInstance.rows({ search: 'applied' }).remove().draw();
                              //   // });
                              //   this.clearAllSearches();
                              // }
                            }
                          );
                          console.log('match success: ' + data);
                        } else
                          console.log('ret: ' + JSON.stringify(data, null, 5));
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
                                  this.issueAccountService
                                    .matchTransactions(
                                      data_1_id.toString(),
                                      data_2_id.toString()
                                    )
                                    .subscribe(
                                      (data: any) => {
                                        if (data == true) {
                                          this.showMatchSuccess();
                                          this.dtElements.forEach(
                                            (
                                              dtElement: DataTableDirective,
                                              index: Number
                                            ) => {
                                              console.log('index: ' + index);
                                              if (index == 0) {
                                                dtElement.dtInstance.then(
                                                  (
                                                    dtInstance: DataTables.Api
                                                  ) => {
                                                    dtInstance
                                                      .rows({ selected: true })
                                                      .remove()
                                                      .draw();
                                                  }
                                                );
                                              } else if (index == 1) {
                                                dtElement.dtInstance.then(
                                                  (
                                                    dtInstance: DataTables.Api
                                                  ) => {
                                                    dtInstance
                                                      .rows({ selected: true })
                                                      .remove()
                                                      .draw();
                                                  }
                                                );
                                                this.clearAllSearches();
                                              }
                                              // else {
                                              //   // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                                              //   //   dtInstance.rows({ search: 'applied' }).remove().draw();
                                              //   // });
                                              //   this.clearAllSearches();
                                              // }
                                            }
                                          );
                                          console.log('match success: ' + data);
                                        } else
                                          console.log(
                                            'ret: ' +
                                            JSON.stringify(data, null, 5)
                                          );
                                      },
                                      (error: any) => {
                                        if (
                                          error.error.text ===
                                          'access-token-expired'
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
                        }
                      }
                    );
                }
              } else {
                this.showSelectionEmpty();
              }
            });
          }
        }
      );
    }
  }

  showSelectionEmpty() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'Please select transaction to Match.',
    });
  }

  showErrormessage(message: string) {
    this.toast.error({
      detail: 'ERROR',
      summary: message,
    });
  }

  showMatchSuccess() {
    this.toast.success({ detail: 'SUCCESS', summary: 'Matched successfully!' });
  }

  restrictedChange() { }

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
        console.log('Error: ' + JSON.stringify(error, null, 2));
      }
    );
  }
}
