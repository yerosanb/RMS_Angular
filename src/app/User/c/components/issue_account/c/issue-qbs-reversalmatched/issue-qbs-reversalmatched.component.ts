import { formatDate } from '@angular/common';
import {
  Component,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgToastService } from 'ng-angular-popup';
import { LocalStorageService } from 'ngx-webstorage';
import { ReconcileService } from 'src/app/User/services/reconcile.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { IssueAccountService } from '../../services/issue-account.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ReconViewService } from 'src/app/User/services/recon-view.service';

@Component({
  selector: 'app-issue-qbs-reversalmatched',
  templateUrl: './issue-qbs-reversalmatched.component.html',
  styleUrls: ['./issue-qbs-reversalmatched.component.css']
})
export class IssueQbsReversalmatchedComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  dt_ats_current_page: number = 0;

  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  restricted: boolean = true;
  dtOptions_qbs: any;
  dtOptions_core: any;
  matchId: string = '';
  selections: number = 0;
  initialDateValue = new Date();
  initialMinDateValue = new Date();
  initialMaxDateValue = new Date();
  reload_checker: boolean = true;
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
  core_tenth_column_title = 'Matched date';
  core_eleventh_column_title = 'Matched by';
  core_twelfth_column_title = 'Matched ID';

  core_input_0!: any;
  core_input_1!: any;
  core_input_2!: any;
  core_input_3!: any;
  // core_input_4!: any;
  // core_input_5!: any;
  core_input_6!: any;
  core_input_7!: any;
  core_input_8!: any;
  core_input_9!: any;
  core_input_10!: any;
  core_input_11!: any;
  core_first_column_id = '0';
  core_second_column_id = '1';
  core_third_column_id = '2';
  core_fourth_column_id = '3';
  // core_fifth_column_id = '4';
  // core_sixth_column_id = '5';
  core_seventh_column_id = '6';
  core_eighth_column_id = '7';
  core_ninth_column_id = '8';
  core_tenth_column_id = '9';
  core_eleventh_column_id = '10';
  core_twelfth_column_id = '11';

  //qbs inits
  qbs_first_column_title = '-ID-';
  qbs_second_column_title = 'Additional Information';
  qbs_third_column_title = 'Amount';
  qbs_fourth_column_title = 'Value Date';
  // qbs_fifth_column_title = 'Sender';
  // qbs_sixth_column_title = 'Receiver';
  qbs_fifth_column_title = 'Upload Date';
  qbs_sixth_column_title = 'Branch';
  qbs_seventh_column_title = 'Type';
  qbs_tenth_column_title = 'Match Date';
  qbs_eleventh_column_title = 'Matched by';
  qbs_twelfth_column_title = 'Matched Id';

  qbs_input_0!: any;
  qbs_input_1!: any;
  qbs_input_2!: any;
  qbs_input_3!: any;
  qbs_input_4!: any;
  qbs_input_5!: any;
  qbs_input_6!: any;
  // qbs_input_7!: any;
  // qbs_input_8!: any;
  qbs_input_9!: any;
  qbs_input_10!: any;
  qbs_input_11!: any;
  qbs_first_column_id = '0';
  qbs_second_column_id = '1';
  qbs_third_column_id = '2';
  qbs_fourth_column_id = '3';
  qbs_fifth_column_id = '4';
  qbs_sixth_column_id = '5';
  qbs_seventh_column_id = '6';
  // qbs_eighth_column_id = '7';
  // qbs_ninth_column_id = '8';
  qbs_tenth_column_id = '9';
  qbs_eleventh_column_id = '10';
  qbs_twelfth_column_id = '11';
  constructor(
    private router: Router,
    private utilService: UtilService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private issueAccountService: IssueAccountService,
    private toast: NgToastService,
    private formBuilder: FormBuilder,
    private reconViewService: ReconViewService,
  ) { }
  onReconDateChange(value: Date): void {
    this.initialDateValue = new Date(value);
    this.localStorageService.store('matched_current_date', this.initialDateValue);
    if (!this.reload_checker)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {

          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload((data) => { }, false);
          });

        }
      );
    this.reload_checker = false;
  }
  onMinMatchDateChange(value: Date): void {
    this.initialMinDateValue = new Date(value);
    this.localStorageService.store('min_matched_current_date_issue_qbs_reversal', this.initialMinDateValue);
    if (!this.reload_checker)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {

          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload((data) => { }, false);
          });

        }
      );
    this.reload_checker = false;
  }
  onMaxMatchDateChange(value: Date): void {
    this.initialMaxDateValue = new Date(value);
    this.localStorageService.store('_mamaxtched_current_date_issue_qbs_reversal', this.initialMaxDateValue);
    if (!this.reload_checker)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {

          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload((data) => { }, false);
          });

        }
      );
    this.reload_checker = false;
  }
  ngOnInit() {

    if (this.localStorageService.retrieve('min_matched_current_date_issue_qbs_reversal') == null) {
      this.initialMinDateValue = new Date();
      this.localStorageService.store(
        'min_matched_current_date_issue_qbs_reversal',
        this.initialMinDateValue
      );
    } else
      this.initialMinDateValue = new Date(
        this.localStorageService.retrieve('min_matched_current_date_issue_qbs_reversal')
      );
    if (this.localStorageService.retrieve('max_matched_current_date_issue_qbs_reversal') == null) {
      this.initialMaxDateValue = new Date();
      this.localStorageService.store(
        'max_matched_current_date_issue_qbs_reversal',
        this.initialMaxDateValue
      );
    } else
      this.initialMaxDateValue = new Date(
        this.localStorageService.retrieve('max_matched_current_date_issue_qbs_reversal')
      );
    this.dtOptions_core = {
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
        this.issueAccountService.getQbsIssueForeViewreversal(formatDate(this.initialMinDateValue, 'yyyy-MM-dd', 'en-US').toString(),
          formatDate(this.initialMaxDateValue, 'yyyy-MM-dd', 'en-US').toString()).subscribe(
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
                          .getQbsIssueForeViewreversal(formatDate(this.initialMinDateValue, 'yyyy-MM-dd', 'en-US').toString(),
                            formatDate(this.initialMaxDateValue, 'yyyy-MM-dd', 'en-US').toString())
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
        {
          title: this.core_tenth_column_title,
          data: 'match_date',
        },
        // {
        //   title: this.core_eleventh_column_title,
        //   render: function (data: any, type: any, full: any) {

        //     // if (full.status == 1)
        //     return (

        //       full.firstname +
        //       ' ' +
        //       full.lastname

        //     );

        //     // return '<span class="badge bg-danger rounded-pill">Inactive</span>';
        //   },
        // },
        {
          title: this.core_twelfth_column_title,
          data: 'match_id',
        },
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
            extend: 'excel',
            text: 'Excel',
          },
          {
            text: 'Reload',
            action: function (e: any, dt: any, node: any, config: any) {
              dt.ajax.reload();
              // alert('reload success');
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

    // this.dtOptions_qbs = {
    //   serverSide: false,
    //   scrollX: true,
    //   searching: true,
    //   // lengthMenu: 'ten',
    //   lengthChange: true,
    //   ordering: true,
    //   paging: true,
    //   // scrollY: 400,
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   lengthMenu: [5, 10, 20, 50, 100, 200, 500],
    //   select: true,
    //   // ajax: '../../../../assets/data/data.json',
    //   ajax: (dataTablesParameters: any, callback: any) => {
    //     console.log('in ajax call 2');
    //     this.issueAccountService.getQbsIssueForeViewMatched(formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US')).subscribe(
    //       async (resp: any) => {
    //         if (resp != null) {
    //           console.log(
    //             'response for table: ' + JSON.stringify(resp, null, 2)
    //           );
    //           // data: resp
    //           callback({
    //             recordsTotal: resp.recordsTotal,
    //             recordsFiltered: resp.recordsFiltered,
    //             data: resp,
    //           });
    //           console.log(
    //             'records total: ' + JSON.stringify(resp.recordsTotal)
    //           );
    //         } else {
    //           Swal.fire({
    //             icon: 'error',
    //             title: 'Permission',
    //             text: 'You are not permitted to perform this action!',
    //           });
    //         }
    //       },
    //       (error: any) => {
    //         if (error.error.text === 'access-token-expired') {
    //           console.log('Access-token-expired requesting refresh token...');
    //           if (
    //             this.localStorageService.retrieve('refresh_token_requested') ==
    //             null
    //           ) {
    //             this.utilService.refreshToken().subscribe(
    //               (data) => {
    //                 if (data === true) {
    //                   console.log(
    //                     'refresh token success re-requesting the actual request'
    //                   );
    //                   this.localStorageService.clear('refresh_token_requested');
    //                   //================================================================================
    //                   this.issueAccountService.getQbsIssueForeViewMatched(formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US')).subscribe(
    //                     async (resp: any) => {
    //                       if (resp != null) {
    //                         console.log(
    //                           'response for table: ' +
    //                           JSON.stringify(resp, null, 2)
    //                         );
    //                         // data: resp
    //                         callback({
    //                           recordsTotal: resp.recordsTotal,
    //                           recordsFiltered: resp.recordsFiltered,
    //                           data: resp,
    //                         });
    //                         console.log(
    //                           'records total: ' +
    //                           JSON.stringify(resp.recordsTotal)
    //                         );
    //                       } else {
    //                         Swal.fire({
    //                           icon: 'error',
    //                           title: 'Permission',
    //                           text: 'You are not permitted to perform this action!',
    //                         });
    //                       }
    //                     },
    //                     (error: any) => {
    //                       if (error.error.text === 'access-token-expired') {
    //                         console.log('refresh token expired.');
    //                         this.SwalSessionExpired.fire();
    //                         this._refreshTokenExpired();
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
    //                   this.SwalSessionExpired.fire();
    //                   this._refreshTokenExpired();
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
    //             this.localStorageService.store('refresh_token_requested', true);
    //           }
    //         } else {
    //           Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             text: 'Something went wrong!',
    //           });
    //           console.log(JSON.stringify(error.error.apierror, null, 2));
    //         }
    //       }
    //     );
    //   },
    //   columns: [
    //     {
    //       title: this.qbs_first_column_title,
    //       data: 'id',
    //     },
    //     {
    //       title: this.qbs_third_column_title,
    //       data: 'amount',
    //     },
    //     {
    //       title: this.qbs_second_column_title,
    //       data: 'additional_information',
    //     },
    //     {
    //       title: this.qbs_fourth_column_title,
    //       data: 'value_date',
    //     },
    //     {
    //       title: this.qbs_fifth_column_title,
    //       data: 'upload_date',
    //     },
    //     {
    //       title: this.qbs_sixth_column_title,
    //       data: 'branch',
    //     },
    //     {
    //       title: this.qbs_seventh_column_title,
    //       data: 'dr_cr',
    //     },
    //     {
    //       title: this.qbs_tenth_column_title,
    //       data: 'match_date',
    //     },
    //     {
    //       title: this.qbs_eleventh_column_title,
    //       render: function (data: any, type: any, full: any) {

    //         // if (full.status == 1)
    //         return (

    //           full.firstname +
    //           ' ' +
    //           full.lastname

    //         );

    //         // return '<span class="badge bg-danger rounded-pill">Inactive</span>';
    //       },
    //     },
    //     {
    //       title: this.qbs_twelfth_column_title,
    //       data: 'match_id',
    //     },
    //     // {
    //     //   title: this.qbs_eighth_column_title,
    //     //   data: 'posting_date',
    //     // },
    //     // {
    //     //   title: this.qbs_ninth_column_title,
    //     //   data: 'transaction_reference',
    //     // },
    //     // {
    //     //   title: this.qbs_tenth_column_title,
    //     //   render: function (data: any, type: any, full: any) {
    //     //     document
    //     //       .getElementsByClassName('datatable-buttons')[0]
    //     //       ?.classList.remove('dt-button');
    //     //     // if (full.status == 1)
    //     //     // return '<button class="btn btn-primary">Active</button>';
    //     //     return (
    //     //       '<i class="mdi mdi-18px mdi-delete text-danger" style="cursor: pointer; margin-left: 4px;" ' +
    //     //       'user-name="' +
    //     //       full.firstname +
    //     //       ' ' +
    //     //       full.lastname +
    //     //       '" delete-user="' +
    //     //       full.id +
    //     //       '"></i>'
    //     //     );
    //     //     // return '<span class="badge bg-danger rounded-pill">Inactive</span>';
    //     //   },
    //     // },
    //   ],
    //   dom: "<'row mb-1 my-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
    //   // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
    //   // colReorder: {
    //   //   order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    //   //   // fixedColumnsLeft: 1,
    //   //   action: function (e: any, dt: any, node: any, config: any) {},
    //   // },
    //   buttons: {
    //     buttons: [
    //       'colvis',
    //       ,
    //       // {
    //       //   extend: 'fixedColumns',
    //       //   text: 'FixedColumns',
    //       //   config: {
    //       //     left: 1,
    //       //   },
    //       // },
    //       {
    //         text: 'Reload',
    //         action: function (e: any, dt: any, node: any, config: any) {
    //           dt.ajax.reload();
    //           // alert('reload success');
    //         },
    //       },



    //       {
    //         extend: 'collection',
    //         text: 'Header',
    //         autoClose: true,
    //         background: true,
    //         dropup: false,
    //         collectionTitle: '',
    //         buttons: [
    //           {
    //             text: 'Enable fixed header',
    //             key: '1',
    //             action: function (e: any, dt: any, node: any, config: any) {
    //               dt.fixedHeader.enable();
    //             },
    //           },
    //           {
    //             text: 'Disable fixed header',
    //             key: '1',
    //             action: function (e: any, dt: any, node: any, config: any) {
    //               dt.fixedHeader.disable();
    //             },
    //           },
    //         ],
    //         fade: true,
    //       },
    //     ],
    //   },

    //   stateSave: true,
    //   stateDuration: 0,
    //   fixedFooter: true,
    //   fixedHeader: {
    //     header: true,
    //   },
    //   scrollCollapse: true,
    //   // searchPanes: {
    //   //   initCollapsed: true,
    //   //   cascadePanes: true,
    //   //   clear: true,
    //   // },
    //   columnDefs: [
    //     {
    //       targets: '_all',
    //       defaultContent: '-',
    //       // className: 'select-checkbox',
    //     },
    //     //   {
    //     //     searchPanes: {
    //     //       show: true,
    //     //     },
    //     //     targets: [0, 1, 4, 5, 8],
    //     //   },
    //     //   {
    //     //     searchPanes: {
    //     //       show: false,
    //     //     },
    //     //     targets: [2, 3, 6, 7, 9, 10, 11],
    //     //   },
    //   ],
    //   // language: {
    //   //   searchPanes: {
    //   //     count: '{total} found',
    //   //     countFiltered: '{shown} / {total}',
    //   //   },
    //   // },
    // };
    this.clearAllSearches();
  }

  //FOOTER SEARCH AND BUTTON ON CLICK
  ngAfterViewInit(): void {
    var that = this;

    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if (index == 0) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.on('select', function (e, dt, type, indexes) {
            console.log('current page: ' + dt.page());
            that.dt_ats_current_page = dt.page();
            var rowData = dtInstance.rows(indexes).data().toArray();
            console.log(JSON.stringify(rowData[0].reference, null, 4));
            // this.selections ++

            that.matchId = rowData[0].match_id;
            that.core_input_11 = that.matchId;
            that.dtElements.forEach(
              (dtElement: DataTableDirective, index: number) => {
                console.log('index: ' + index);
                if (index == 0) {
                  // console.log(info.reference);
                  // that.refAll = rowData[0].reference
                  that.selections++;
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance
                      .column(8)
                      .search(
                        that.matchId

                      )
                      .draw();
                  });
                  // that.count_ats_selected_data ++;
                  console.log('to search: ' + that.matchId);
                  console.log('selectionsssssssssssssssst: ' + that.selections);
                }
              }
            );
          });
          dtInstance.on('deselect', function (e, dt, type, indexes) {
            console.log('deselect');
            console.log('current page: ' + dt.page());
            // var rowData = dtInstance.rows( indexes ).data().toArray();
            // var events = ''
            // events = ( '<div><b>'+type+' <i>de</i>selection</b> - '+JSON.stringify( rowData )+'</div>' );
            // console.log('events: ' + events)
            console.log('selections: ' + that.selections);
            if (that.selections <= 1) {
              that.matchId = '';
              // that.ats_input_1 = '';
              that.clearAllSearches();
            } else that.selections--;
            // that.clearAllSearches();
            // dt.page(that.dt_ats_current_page).draw(false)
            console.log('done going to page.' + that.dt_ats_current_page);
          });
          dtInstance.columns().every(function () {
            $('input', this.footer()).on('keyup change', function () {
              if (this['id'] == '1') {
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  that.matchId = (this as HTMLInputElement).value;
                  dtInstance.column(this['id']).search(that.matchId).draw();
                }
              } else {
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
                }
              }
            });
          });
          dtInstance.on(
            'draw stateRestore-change',
            function (e, settings, details) {
              var c = 0;
              // for (let col of settings.aoColumns) {
              //   if (col.title == that.ats_first_column_title) {
              //     that.ats_first_column_id = c.toString();
              //   } else if (col.title == that.ats_second_column_title) {
              //     that.ats_second_column_id = c.toString();
              //   } else if (col.title == that.ats_third_column_title) {
              //     that.ats_third_column_id = c.toString();
              //   } else if (col.title == that.ats_fourth_column_title) {
              //     that.ats_fourth_column_id = c.toString();
              //   } else if (col.title == that.ats_fifth_column_title) {
              //     that.ats_fifth_column_id = c.toString();
              //   } else if (col.title == that.ats_sixth_column_title) {
              //     that.ats_sixth_column_id = c.toString();
              //   } else if (col.title == that.ats_seventh_column_title) {
              //     that.ats_seventh_column_id = c.toString();
              //   } else if (col.title == that.ats_eighth_column_title) {
              //     that.ats_eighth_column_id = c.toString();
              //   } else if (col.title == that.ats_ninth_column_title) {
              //     that.ats_ninth_column_id = c.toString();
              //   } else if (col.title == that.ats_tenth_column_title) {
              //     that.ats_tenth_column_id = c.toString();
              //   }
              //   c++;
              // }
            }
          );

          dtInstance.on('column-reorder', function (e, settings, details) {
            var c = 0;
            // for (let col of settings.aoColumns) {
            //   if (col.title == that.ats_first_column_title) {
            //     that.ats_first_column_id = c.toString();
            //   } else if (col.title == that.ats_second_column_title) {
            //     that.ats_second_column_id = c.toString();
            //   } else if (col.title == that.ats_third_column_title) {
            //     that.ats_third_column_id = c.toString();
            //   } else if (col.title == that.ats_fourth_column_title) {
            //     that.ats_fourth_column_id = c.toString();
            //   } else if (col.title == that.ats_fifth_column_title) {
            //     that.ats_fifth_column_id = c.toString();
            //   } else if (col.title == that.ats_sixth_column_title) {
            //     that.ats_sixth_column_id = c.toString();
            //   } else if (col.title == that.ats_seventh_column_title) {
            //     that.ats_seventh_column_id = c.toString();
            //   } else if (col.title == that.ats_eighth_column_title) {
            //     that.ats_eighth_column_id = c.toString();
            //   } else if (col.title == that.ats_ninth_column_title) {
            //     that.ats_ninth_column_id = c.toString();
            //   } else if (col.title == that.ats_tenth_column_title) {
            //     that.ats_tenth_column_id = c.toString();
            //   }
            //   c++;
            // }
          });
        });
      } else if (index == 1) {
        // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //   dtInstance.columns().every(function () {
        //     $('input', this.footer()).on('keyup change', function () {
        //       if (this['id'] == '1') {
        //         if (
        //           dtInstance.column(this['id']).search() !==
        //           (this as HTMLInputElement).value
        //         ) {
        //           that.refAll = (this as HTMLInputElement).value;
        //           dtInstance.column(this['id']).search(that.refAll).draw();
        //         }
        //       } else {
        //         if (this['id'] != '') {
        //           if (
        //             dtInstance.column(this['id']).search() !==
        //             (this as HTMLInputElement).value
        //           ) {
        //             dtInstance
        //               .column(this['id'])
        //               .search((this as HTMLInputElement).value)
        //               .draw();
        //           }
        //         }
        //       }
        //     });
        //   });
        //   dtInstance.on(
        //     'draw stateRestore-change',
        //     function (e, settings, details) {
        //       var c = 0;
        //       for (let col of settings.aoColumns) {
        //         if (col.title == that.ats_first_column_title) {
        //           that.ats_first_column_id = c.toString();
        //         } else if (col.title == that.ats_second_column_title) {
        //           that.ats_second_column_id = c.toString();
        //         } else if (col.title == that.ats_third_column_title) {
        //           that.ats_third_column_id = c.toString();
        //         } else if (col.title == that.ats_fourth_column_title) {
        //           that.ats_fourth_column_id = c.toString();
        //         } else if (col.title == that.ats_fifth_column_title) {
        //           that.ats_fifth_column_id = c.toString();
        //         } else if (col.title == that.ats_sixth_column_title) {
        //           that.ats_sixth_column_id = c.toString();
        //         } else if (col.title == that.ats_seventh_column_title) {
        //           that.ats_seventh_column_id = c.toString();
        //         } else if (col.title == that.ats_eighth_column_title) {
        //           that.ats_eighth_column_id = c.toString();
        //         } else if (col.title == that.ats_ninth_column_title) {
        //           that.ats_ninth_column_id = c.toString();
        //         } else if (col.title == that.ats_tenth_column_title) {
        //           that.ats_tenth_column_id = c.toString();
        //         }
        //         c++;
        //       }
        //     }
        //   );
        //   dtInstance.on('column-reorder', function (e, settings, details) {
        //     var c = 0;
        //     for (let col of settings.aoColumns) {
        //       if (col.title == that.ats_first_column_title) {
        //         that.ats_first_column_id = c.toString();
        //       } else if (col.title == that.ats_second_column_title) {
        //         that.ats_second_column_id = c.toString();
        //       } else if (col.title == that.ats_third_column_title) {
        //         that.ats_third_column_id = c.toString();
        //       } else if (col.title == that.ats_fourth_column_title) {
        //         that.ats_fourth_column_id = c.toString();
        //       } else if (col.title == that.ats_fifth_column_title) {
        //         that.ats_fifth_column_id = c.toString();
        //       } else if (col.title == that.ats_sixth_column_title) {
        //         that.ats_sixth_column_id = c.toString();
        //       } else if (col.title == that.ats_seventh_column_title) {
        //         that.ats_seventh_column_id = c.toString();
        //       } else if (col.title == that.ats_eighth_column_title) {
        //         that.ats_eighth_column_id = c.toString();
        //       } else if (col.title == that.ats_ninth_column_title) {
        //         that.ats_ninth_column_id = c.toString();
        //       } else if (col.title == that.ats_tenth_column_title) {
        //         that.ats_tenth_column_id = c.toString();
        //       }
        //       c++;
        //     }
        //   });
        // });
      }
    });
    that.clearAllSearches();
    console.log('selectionsssssssssssssssssssss: ' + that.selections);
  }
  clearAllSearches() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      console.log('index: ' + index);
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
            .column(7)
            .search('')
            .column(8)
            .search('')
            .column(9)
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
            .column(7)
            .search('')
            .column(8)
            .search('')
            .column(9)
            .search('')
            .draw();
        });
      }
    })
  }
  UnmatchTransactions() {
    var data_1_id: any[] = [];
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if (index == 0) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //  var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
          var rowData = dtInstance.rows({ selected: true }).data().toArray();
          if (rowData.length == 2) {
            data_1_id.push(rowData[0].id);
            data_1_id.push(rowData[1].id);
            if (rowData[0].match_id == rowData[1].match_id) {
              Swal.fire({
                title: 'Unmatch transaction: ',
                text: 'are you sure to  unmatch for matched transaction?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0acf97',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'ok',
              }).then((result) => {
                if (result.isConfirmed) {
                  // console.log('unmatch transaction'+this.count_ats_selected_data+"==="+this.count_ats_selected_data+"==="+ rowData.length );
                  console.log(data_1_id);
                  this.issueAccountService
                    .unmatchIssueQBSReversalTransactions(data_1_id.toString())
                    .subscribe(
                      (data: any) => {
                        if (data == true) {
                          this.showMatchSuccess();
                          this.dtElements.forEach(
                            (dtElement: DataTableDirective, index: number) => {
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

                              }
                            }
                          );
                          console.log('match success: ' + data);
                        } else console.log('ret: ' + JSON.stringify(data, null, 5));
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
                              (data: any) => {
                                if (data === true) {
                                  console.log(
                                    'refresh token success re-requesting the actual request'
                                  );
                                  this.localStorageService.clear(
                                    'refresh_token_requested'
                                  );
                                  //================================================================================
                                  this.issueAccountService
                                    .unmatchIssueQBSReversalTransactions(data_1_id.toString())
                                    .subscribe(
                                      (data: any) => {
                                        if (data == true) {
                                          this.showMatchSuccess();
                                          this.dtElements.forEach(
                                            (dtElement: DataTableDirective, index: number) => {
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

                                              }
                                            }
                                          );
                                          console.log('match success: ' + data);
                                        } else console.log('ret: ' + JSON.stringify(data, null, 5));
                                      },
                                      (error: any) => {
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
                }
                else {
                  console.log('canceled');
                }
              });
            }
            else {
              this.showSelectionEmpty()
            }

          }
          else {
            this.showSelectionmiss();
          }
        });
      }
    });
  }
  showMatchSuccess() {
    this.toast.success({ detail: 'SUCCESS', summary: 'UnMatched successfully!' });
  }
  showSelectionEmpty() {
    this.toast.error({ detail: 'ERROR', summary: 'Please select transaction to UnMatch.' });
  }
  showSelectionmiss() {
    this.toast.error({ detail: 'ERROR', summary: 'Please select two reversal matched transactions.' });
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
// dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//   dtInstance.page(this.dt_ats_current_page).draw(false)
// });




