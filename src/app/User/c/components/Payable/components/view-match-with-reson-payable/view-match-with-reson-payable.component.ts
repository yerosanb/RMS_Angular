import { formatDate } from '@angular/common';
import { Component, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgToastService } from 'ng-angular-popup';
import { LocalStorageService } from 'ngx-webstorage';
import { ReconViewService } from 'src/app/User/services/recon-view.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/services/auth-service.service';
import { ReconcileService } from 'src/app/User/services/reconcile.service';

@Component({
  selector: 'app-view-match-with-reson-payable',
  templateUrl: './view-match-with-reson-payable.component.html',
  styleUrls: ['./view-match-with-reson-payable.component.css']
})
export class ViewMatchWithResonPayableComponent {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  initialDateValue = new Date();

  reload_checker: boolean = true;

  dtOptions_Payable_credit_match_reason: any;
  dtOptions_Payable_debit_match_reason: any;
  //core inits
  core_first_column_title = '-ID-';
  core_second_column_title = 'Add..-Info';
  core_third_column_title = 'Amount';
  core_fourth_column_title = 'Value Date';
  core_fifth_column_title = 'Upload Date';
  core_sixth_column_title = 'Branch Code';
  core_seventh_column_title = 'Type';
  core_eighth_column_title = 'Posting Date';
  core_ninth_column_title = 'Transaction Reference';
  core_tenth_column_title = 'Match Id';
  core_eleventh_column_title = 'Match date';
  core_tewelefth_column_title = 'Matched by';

  core_input_0!: any;
  core_input_1!: any;
  core_input_2!: any;
  core_input_3!: any;
  core_input_4!: any;
  core_input_5!: any;
  core_input_6!: any;
  core_input_7!: any;
  core_input_8!: any;
  core_input_9!: any;
  core_input_10!: any;
  core_input_11!: any;
  core_input_12!: any;

  core_first_column_id = '0';
  core_second_column_id = '1';
  core_third_column_id = '2';
  core_fourth_column_id = '3';
  core_fifth_column_id = '4';
  core_sixth_column_id = '5';
  core_seventh_column_id = '6';
  core_eighth_column_id = '7';
  core_ninth_column_id = '8';
  core_tenth_column_id = '9';
  core_eleventh_column_id = '10';
  core_tewelfth_column_id = '11';


  // dtElement!: DataTableDirective;
  // dtInstance!: Promise<DataTables.Api>;

  matchId: string = '';
  selections: number = 0;
  dt_ats_current_page: number = 0;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private utilService: UtilService,
    private localStorageService: LocalStorageService,
    private reconViewService: ReconViewService,
    private toast: NgToastService,
    private authService: AuthService,
    private reconcileService: ReconcileService
  ) { }

  someFilterFromAts(info: any): void { }

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

  ngOnInit(): void {
    if (this.localStorageService.retrieve('matched_current_date') == null) {
      this.initialDateValue = new Date();
      this.localStorageService.store(
        'matched_current_date',
        this.initialDateValue
      );
    } else
      this.initialDateValue = new Date(
        this.localStorageService.retrieve('matched_current_date')
      );
    try {
      this.dtOptions_Payable_credit_match_reason = {
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
        select: true,
        // ajax: '../../../../assets/data/data.json',
        ajax: (dataTablesParameters: any, callback: any) => {
          this.reconcileService.getAllPayableCreditMatchWithReason().subscribe(
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
                        this.reconcileService.getAllPayableCreditMatchWithReason().subscribe(
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
            title: this.core_second_column_title,
            data: 'additional_information',
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
            title: this.core_fifth_column_title,
            data: 'upload_date',
          },
          {
            title: this.core_sixth_column_title,
            data: 'branch_code',
          },
          {
            title: this.core_seventh_column_title,
            data: 'dr_cr',
          },
          {
            title: this.core_eighth_column_title,
            data: 'posting_date',
          },
          {
            title: this.core_ninth_column_title,
            data: 'transaction_reference',
          },
          {
            title: this.core_tenth_column_title,
            data: 'match_id',
          },
          {
            title: this.core_eleventh_column_title,
            data: 'match_date',
          },
          {
            title: this.core_tewelefth_column_title,
            render: function (data: any, type: any, full: any) {

              return (full.firstname + " " + full.lastname)
            },
          },
          {
            title: 'Reason',
            data: 'reason',
          },
          // {
          //   title: this.core_tenth_column_title,
          //   render: function (data: any, type: any, full: any) {
          //     document
          //       .getElementsByClassName('datatable-buttons')[0]
          //       ?.classList.remove('dt-button');
          //     // if (full.status == 1)
          //     return '<button class="btn btn-primary">Active</button>';

          //     // return '<span class="badge bg-danger rounded-pill">Inactive</span>';
          //   },
          // },
        ],
        dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-2'Q>",
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


            'print',
            {
              extend: 'pdf',
              text: 'Pdf',
            },

            {
              extend: 'excel',
              text: 'Excel',
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
      // console.log('height of navbar: ' + $('#navbar-custom-id_').outerHeight);
    } catch (ex) {
      console.log('Exception: ' + JSON.stringify(ex));
    }
    try {
      this.dtOptions_Payable_debit_match_reason = {
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
        select: true,
        // ajax: '../../../../assets/data/data.json',
        ajax: (dataTablesParameters: any, callback: any) => {
          this.reconcileService.getAllPayableDebitMatchWithReason().subscribe(
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
                        this.reconcileService.getAllPayableDebitMatchWithReason().subscribe(
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
            title: this.core_second_column_title,
            data: 'additional_information',
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
            title: this.core_fifth_column_title,
            data: 'upload_date',
          },
          {
            title: this.core_sixth_column_title,
            data: 'branch_code',
          },
          {
            title: this.core_seventh_column_title,
            data: 'dr_cr',
          },
          {
            title: this.core_eighth_column_title,
            data: 'posting_date',
          },
          {
            title: this.core_ninth_column_title,
            data: 'transaction_reference',
          },
          {
            title: this.core_tenth_column_title,
            data: 'match_id',
          },
          {
            title: this.core_eleventh_column_title,
            data: 'match_date',
          },
          {
            title: this.core_tewelefth_column_title,
            render: function (data: any, type: any, full: any) {

              return (full.firstname + " " + full.lastname)
            },
          },
          {
            title: 'Reason',
            data: 'reason',
          },
          // {
          //   title: this.core_tenth_column_title,
          //   render: function (data: any, type: any, full: any) {
          //     document
          //       .getElementsByClassName('datatable-buttons')[0]
          //       ?.classList.remove('dt-button');
          //     // if (full.status == 1)
          //     return '<button class="btn btn-primary">Active</button>';

          //     // return '<span class="badge bg-danger rounded-pill">Inactive</span>';
          //   },
          // },
        ],
        dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-2'Q>",
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


            'print',
            {
              extend: 'pdf',
              text: 'Pdf',
            },

            {
              extend: 'excel',
              text: 'Excel',
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
      // console.log('height of navbar: ' + $('#navbar-custom-id_').outerHeight);
    } catch (ex) {
      console.log('Exception: ' + JSON.stringify(ex));
    }
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
            that.core_input_9 = that.matchId;
            that.dtElements.forEach(
              (dtElement: DataTableDirective, index: number) => {
                console.log('index: ' + index);
                if (index == 0) {
                  // console.log(info.reference);
                  // that.refAll = rowData[0].reference
                  that.selections++;
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance
                      .column(9)
                      .search(
                        that.matchId
                          .split(' ')[0]
                          .replace('"', '')
                          .substring(1, that.matchId.length - 1)
                      )
                      .draw();
                  });
                  console.log('to search: ' + that.matchId);
                  console.log('selectionsssssssssssssssst: ' + that.selections);
                } else {
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance;
                    dtInstance
                      .column(9)
                      .search(
                        that.matchId
                          .split(' ')[0]
                          .replace('"', '')
                          .substring(1, that.matchId.length - 1)
                      )
                      .draw();
                  });
                  console.log(' searched...');
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
              that.core_input_1 = '';
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
            }
          );

          dtInstance.on('column-reorder', function (e, settings, details) {
            var c = 0;

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
    var data_2_id: any[] = [];
    var match_id_ats: string;
    var match_id_core: string;
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if (index == 0) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          var rowData = dtInstance.rows({ selected: true }).data().toArray();
          //var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
          for (let i = 0; i < rowData.length; i++) {
            match_id_ats = (
              JSON.stringify(rowData[i].match_id, null, 4)
            );
            data_1_id.push(rowData[i].id);
            // this.count_ats_selected_data ++;
            //count_core_selected_data:number=0
          }
        });
      } else {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //  var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
          var rowData = dtInstance.rows({ selected: true }).data().toArray();
          for (let i = 0; i < rowData.length; i++) {
            // data_2.push(rowData[i])
            match_id_core = (
              JSON.stringify(rowData[i].match_id, null, 4)
            );
            data_2_id.push(rowData[i].id);
            // this.count_core_selected_data ++;
          }
          console.log(this.selections)
          if (this.selections > 0) {
            if (match_id_ats == match_id_core) {


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
                  console.log(data_2_id);
                  this.reconViewService
                    .unmatchPayableTransactions(data_1_id.toString(), data_2_id.toString())
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
                                      .rows({ search: 'applied' })
                                      .remove()
                                      .draw();
                                  }
                                );

                              }
                              else if (index == 1) {
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
                                  this.reconViewService
                                    .unmatchPayableTransactions(data_1_id.toString(), data_2_id.toString())
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
                                                      .rows({ search: 'applied' })
                                                      .remove()
                                                      .draw();
                                                  }
                                                );

                                              }
                                              else if (index == 1) {
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
        });
      }
    });
    // for(let i = 0; i<data_1.length; i++){
    //   data_1_amount_sum += Number(JSON.stringify(data_1[i].amount, null, 4))
    // }
    // for(let i = 0; i<data_2.length; i++){
    //   data_2_amount_sum += Number(JSON.stringify(data_2[i].amount, null, 4))
    //}
  }
  showMatchSuccess() {
    this.toast.success({ detail: 'SUCCESS', summary: 'UnMatched successfully!' });
  }
  showSelectionEmpty() {
    this.toast.error({ detail: 'ERROR', summary: 'Please select transaction to UnMatch.' });
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

