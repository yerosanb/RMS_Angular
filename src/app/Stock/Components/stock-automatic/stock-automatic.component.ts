import { formatDate } from '@angular/common';
import {
  Component,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { NgToastService } from 'ng-angular-popup';
import { LocalStorageService } from 'ngx-webstorage';
import { FixedReconAutomaticService } from 'src/app/FixedAsset/garama/services/fixed-recon-automatic.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { ReconcileService } from 'src/app/User/services/reconcile.service';
import Swal from 'sweetalert2';
import { StockService } from '../../Services/stock.service';
import { StockReconTabComponent } from '../stock-recon-tab/stock-recon-tab.component';
@Component({
  selector: 'app-stock-automatic',
  templateUrl: './stock-automatic.component.html',
  styleUrls: ['./stock-automatic.component.css']
})
export class StockAutomaticComponent {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;
  @ViewChild(StockReconTabComponent)
  stockReconTab!: StockReconTabComponent;
  uploadStatus_title = 'Matching Transactions...';
  refresh_token_requested = false;
  initialDateValue = new Date();
  type: any;
  reload_checker: boolean = true;

  dtOptions_mms: any;
  dtOptions_core: any;
  //ats inits

  mms_input_0!: any;
  mms_input_1!: any;
  mms_input_2!: any;
  mms_input_3!: any;
  mms_input_4!: any;
  mms_input_5!: any;
  mms_input_6!: any;
  mms_input_7!: any;
  mms_input_8!: any;
  mms_input_9!: any;
  mms_input_10!: any;
  mms_input_11!: any;
  mms_input_12!: any;
  mms_input_13!: any;
  mms_input_14!: any;
  mms_input_15!: any;

  mms_first_column_id = '0';
  mms_second_column_id = '1';
  mms_third_column_id = '2';
  mms_fourth_column_id = '3';
  mms_fifth_column_id = '4';
  mms_sixth_column_id = '5';
  mms_seventh_column_id = '6';
  mms_eighth_column_id = '7';
  mms_ninth_column_id = '8';
  mms_tenth_column_id = '9';
  // mms_eleventh_column_id = '10';
  // mms_twelevth_column_id = '11';
  // mms_thirteenth_column_id = '12';
  // mms_fourteenth_column_id = '13';
  // mms_fifteenth_column_id = '14';

  //core inits
  core_first_column_title = '-ID-';
  core_second_column_title = 'Description';
  core_third_column_title = 'Transaction Date';
  core_fourth_column_title = 'Account Number';
  core_fifth_column_title = 'Value Date';
  core_sixth_column_title = 'Amount';
  core_seventh_column_title = 'Balance';
  core_eighth_column_title = 'Source Branch';
  core_ninth_column_title = 'Branch Name';
  core_tenth_column_title = 'Posting Date';
  core_eleventh_column_title = 'Transaction Reference';
  core_twelveth_column_title = 'DR_CR';
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
  core_twelveth_column_id = '11';
  core_thirteen_column_id = '13';

  // dtElement!: DataTableDirective;
  // dtInstance!: Promise<DataTables.Api>;

  refAll: string = '';
  amountAll: any;
  selections: number = 0;
  dt_ats_current_page: number = 0;
  mms_first_column_title = '-ID-';
  mms_second_column_title = 'Reference';
  mms_third_column_title = 'Account Segment';
  mms_fourth_column_title = 'Amount';
  mms_fifth_column_title = 'Main_pg';
  mms_seventh_column_title = 'DR_CR';
  mms_eighth_column_title = 'Transaction Date';
  mms_ninth_column_title = 'Store Name';
  mms_tenth_column_title = 'Category Description';
  // mms_twelveth_column_title='Transaction Code';
  // mms_eleventh_column_title='bbf';
  // mms_thirteenth_column_title='Main PG';
  // mms_fourteenth_column_title='Store Name';
  // mms_fifteenth_column_title='Category Desc..';

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private utilService: UtilService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private stockServices: StockService,
    private toast: NgToastService,
    private route: ActivatedRoute
  ) {
    this.type = this.route.snapshot.params['type'];
    $('#stock_core_matched').DataTable().ajax.reload();
    $('#stock_mms_matched').DataTable().ajax.reload();
  }

  someFilterFromAts(info: any): void { }

  onReconDateChange(value: Date): void {
    this.initialDateValue = new Date(value);
    this.localStorageService.store(
      'recon_current_date_fixed_automatic',
      this.initialDateValue
    );
    if (!this.reload_checker)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          // if (index == 0) {
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload((data) => { }, false);
          });
          // }
          // if (index == 0) {
          //   dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //     dtInstance.ajax.reload((data) => {}, false);
          //   });
          // }
        }
      );
    this.reload_checker = false;
  }
  ngOnInit(): void {
    if (
      this.localStorageService.retrieve('recon_current_date_fixed_automatic') ==
      null
    ) {
      this.initialDateValue = new Date();
      this.localStorageService.store(
        'recon_current_date_fixed_automatic',
        this.initialDateValue
      );
    } else
      this.initialDateValue = new Date(
        this.localStorageService.retrieve('recon_current_date_fixed_automatic')
      );

    try {
      this.dtOptions_mms = {
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
        lengthMenu: [5, 10, 20, 50, 100, 200, 500],
        select: true,
        // ajax: '../../../../assets/data/data.json',
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          const self = this;
          $('td', row).off('click');
          $('td', row).on('click', () => {
            self.someFilterFromAts(data);
          });
          return row;
        },
        ajax: (dataTablesParameters: any, callback: any) => {
          this.stockServices.getStockMMSForReconAuto(
            formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US'), this.type
          )
            .subscribe(
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
                          this.stockServices
                            .getStockMMSForReconAuto(
                              formatDate(
                                this.initialDateValue,
                                'yyyy-MM-dd',
                                'en-US'
                              ), this.type
                            )
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
            title: this.mms_first_column_title,
            data: 'id',
          },
          {
            title: this.mms_second_column_title,
            data: 'reference',
          },
          {
            title: this.mms_third_column_title,
            data: 'account_segment',
          },
          {
            title: this.mms_fourth_column_title,
            data: 'amount',
          },
          {
            title: this.mms_fifth_column_title,
            data: 'main_pg',
          },
          {
            title: this.mms_seventh_column_title,
            data: 'dr_cr',
          },
          {
            title: this.mms_eighth_column_title,
            data: 'date',
          },
          {
            title: this.mms_ninth_column_title,
            data: 'store_name',
          },
          {
            title: this.mms_tenth_column_title,
            data: 'category_description',
          },

          // {
          //   title: 'Core Id',
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
        dom: "<'row mb-1 mt-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
        // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
        colReorder: {
          order: [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          // fixedColumnsLeft: 1,
          action: function (e: any, dt: any, node: any, config: any) { },
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
      // console.log('height of navbar: ' + $('#navbar-custom-id_').outerHeight);
    } catch (ex) {
      console.log('Exception: ' + JSON.stringify(ex));
    }
    try {
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
        pageLength: 7,
        lengthMenu: [5, 10, 20, 50, 100, 200, 500],
        select: true,
        // ajax: '../../../../assets/data/data.json',
        ajax: (dataTablesParameters: any, callback: any) => {
          this.stockServices
            .getFixedCoreForReconAutoAccessory(
              formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US'), this.type
            )
            .subscribe(
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
                          this.stockServices
                            .getFixedCoreForReconAutoAccessory(
                              formatDate(
                                this.initialDateValue,
                                'yyyy-MM-dd',
                                'en-US'
                              ), this.type
                            )
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
            title: this.core_second_column_title,
            data: 'description',
          },
          // {
          //   title: this.core_third_column_title,
          //   data: 'date',
          // },
          {
            title: this.core_fourth_column_title,
            data: 'account',
          },
          {
            title: this.core_fifth_column_title,
            data: 'value_date',
          },
          {
            title: this.core_sixth_column_title,
            data: 'amount',
          },
          {
            title: this.core_seventh_column_title,
            data: 'balance',
          },
          {
            title: this.core_eighth_column_title,
            data: 'source_branch',
          },
          {
            title: this.core_ninth_column_title,
            data: 'branch_name',
          },
          {
            title: this.core_tenth_column_title,
            data: 'posting_date',
          },
          {
            title: this.core_eleventh_column_title,
            data: 'transaction_reference',
          },
          {
            title: this.core_twelveth_column_title,
            data: 'dr_cr',
          },
          // {
          //   title: this.core_eighth_column_title,
          //   data: 'posting_date',
          // },
          // {
          //   title: this.core_ninth_column_title,
          //   data: 'transaction_reference',
          // },
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
        dom: "<'row mb-1 mt-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-2'Q>",
        // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
        colReorder: {
          order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          // fixedColumnsLeft: 1,
          action: function (e: any, dt: any, node: any, config: any) { },
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
            if (rowData[0].reference
              .startsWith('STOV')) {
              that.refAll = "STOV";
              if ((Math.floor(rowData[0].amount) == Math.round(rowData[0].amount))) {
                that.amountAll = Math.round(rowData[0].amount);
              } else if (Math.floor(rowData[0].amount) != Math.round(rowData[0].amount)) {
                that.amountAll = Math.floor(rowData[0].amount);
              } else if ((Math.floor(rowData[0].amount) == Math.round(rowData[0].amount)) == rowData[0].amount.toFixed(1)) {
                that.amountAll = rowData[0].amount.toFixed(1);
              } else if ((Math.floor(rowData[0].amount) == Math.round(rowData[0].amount)) == rowData[0].amount.toFixed(1) == rowData[0].amount.toFixed(2)) {
                that.amountAll = rowData[0].amount.toFixed(2);
              }
              // that.amountAll = rowData[0].amount.toFixed(0);
              // that.amountAll = that.amountAll.slice(0, -1); l
            } else {
              that.refAll = rowData[0].reference;
              that.amountAll = '';
            }
            that.mms_input_1 = that.refAll;
            that.mms_input_3 = that.amountAll;
            that.core_input_1 = that.refAll.replace("STOV", 'STIV');
            that.core_input_5 = that.amountAll;
            that.dtElements.forEach(
              (dtElement: DataTableDirective, index: number) => {
                console.log('index: ' + index);
                if (index == 0) {
                  // console.log(info.reference);
                  // that.refAll = rowData[0].reference
                  console.log('reference value: ' + that.refAll)
                  that.selections++;
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance
                      .column(1)
                      .search(
                        that.refAll
                        // .split(' ')[0]
                        // .replace('"', '')
                        // .substring(1, that.refAll.length)
                      ).column(3)
                      .search(
                        that.amountAll.toString()
                      )
                      .draw();
                  });
                  console.log('to search: ' + that.refAll);
                  console.log('selectionsssssssssssssssst: ' + that.selections);
                } else {
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance
                      .column(1)
                      .search(
                        that.refAll.replace("STOV", "STIV")
                        // .split(' ')[0]
                        // .replace('"', '')
                        // .substring(1, that.refAll.length - 1)
                      ).column(4)
                      .search(
                        that.amountAll.toString()
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
              that.refAll = '';
              that.mms_input_1 = '';
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
                  that.refAll = (this as HTMLInputElement).value;
                  dtInstance.column(this['id']).search(that.refAll).draw();
                }
              } else {
                if (this['id'] != '') {
                  if (
                    dtInstance.column(this['id']).search() !== (this as HTMLInputElement).value
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
              for (let col of settings.aoColumns) {
                if (col.title == that.mms_first_column_title) {
                  that.mms_first_column_id = c.toString();
                } else if (col.title == that.mms_second_column_title) {
                  that.mms_second_column_id = c.toString();
                } else if (col.title == that.mms_third_column_title) {
                  that.mms_third_column_id = c.toString();
                } else if (col.title == that.mms_fourth_column_title) {
                  that.mms_fourth_column_id = c.toString();
                } else if (col.title == that.mms_fifth_column_title) {
                  that.mms_fifth_column_id = c.toString();
                }
                // else if (col.title == that.mms_sixth_column_title) {
                //   that.mms_sixth_column_id = c.toString();
                // }
                else if (col.title == that.mms_seventh_column_title) {
                  that.mms_seventh_column_id = c.toString();
                } else if (col.title == that.mms_eighth_column_title) {
                  that.mms_eighth_column_id = c.toString();
                } else if (col.title == that.mms_ninth_column_title) {
                  that.mms_ninth_column_id = c.toString();
                } else if (col.title == that.mms_tenth_column_title) {
                  that.mms_tenth_column_id = c.toString();
                }
                //    else if (col.title == that.mms_eleventh_column_title) {
                //     that.mms_tenth_column_id = c.toString();
                //   } else if (col.title == that.mms_twelveth_column_title) {
                //     that.mms_eleventh_column_id = c.toString();
                //   } else if (col.title == that.mms_thirteenth_column_title) {
                //     that.mms_twelevth_column_id = c.toString();
                //   }
                //  else if (col.title == that.mms_fourteenth_column_title) {
                //   that.mms_thirteenth_column_id = c.toString();
                // } else if (col.title == that.mms_fifteenth_column_title) {
                //   that.mms_fourteenth_column_id = c.toString();
                // }
                c++;
              }
            }
          );
          dtInstance.on('column-reorder', function (e, settings, details) {
            var c = 0;
            for (let col of settings.aoColumns) {
              if (col.title == that.mms_first_column_title) {
                that.mms_first_column_id = c.toString();
              } else if (col.title == that.mms_second_column_title) {
                that.mms_second_column_id = c.toString();
              } else if (col.title == that.mms_third_column_title) {
                that.mms_third_column_id = c.toString();
              } else if (col.title == that.mms_fourth_column_title) {
                that.mms_fourth_column_id = c.toString();
              } else if (col.title == that.mms_fifth_column_title) {
                that.mms_fifth_column_id = c.toString();
              }
              // else if (col.title == that.mms_sixth_column_title) {
              //   that.mms_sixth_column_id = c.toString();
              // } 
              else if (col.title == that.mms_seventh_column_title) {
                that.mms_seventh_column_id = c.toString();
              } else if (col.title == that.mms_eighth_column_title) {
                that.mms_eighth_column_id = c.toString();
              } else if (col.title == that.mms_ninth_column_title) {
                that.mms_ninth_column_id = c.toString();
                // } else if (col.title == that.ats_tenth_column_title) {
                //   that.ats_tenth_column_id = c.toString();
              } else if (col.title == that.mms_tenth_column_title) {
                that.mms_tenth_column_id = c.toString();
              }
              //     else if (col.title == that.mms_eleventh_column_title) {
              //       that.mms_tenth_column_id = c.toString();
              //     } else if (col.title == that.mms_twelveth_column_title) {
              //       that.mms_eleventh_column_id = c.toString();
              //     } else if (col.title == that.mms_thirteenth_column_title) {
              //       that.mms_twelevth_column_id = c.toString();
              //     }
              //   else if (col.title == that.mms_fourteenth_column_title) {
              //     that.mms_thirteenth_column_id = c.toString();
              //   } else if (col.title == that.mms_fifteenth_column_title) {
              //     that.mms_fourteenth_column_id = c.toString();
              //  }
              c++;
            }
          });
        });
      } else if (index == 1) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.columns().every(function () {
            $('input', this.footer()).on('keyup change', function () {
              if (this['id'] == '1') {
                if (
                  dtInstance.column(this['id']).search() !==
                  (this as HTMLInputElement).value
                ) {
                  that.refAll = (this as HTMLInputElement).value;
                  dtInstance.column(this['id']).search(that.refAll).draw();
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
              for (let col of settings.aoColumns) {
                if (col.title == that.core_first_column_title) {
                  that.core_first_column_id = c.toString();
                } else if (col.title == that.core_second_column_title) {
                  that.core_second_column_id = c.toString();
                } else if (col.title == that.core_third_column_title) {
                  that.core_third_column_id = c.toString();
                } else if (col.title == that.core_fourth_column_title) {
                  that.core_fourth_column_id = c.toString();
                } else if (col.title == that.core_fifth_column_title) {
                  that.core_fifth_column_id = c.toString();
                } else if (col.title == that.core_sixth_column_title) {
                  that.core_sixth_column_id = c.toString();
                } else if (col.title == that.core_seventh_column_title) {
                  that.core_seventh_column_id = c.toString();
                } else if (col.title == that.core_eighth_column_title) {
                  that.core_eighth_column_id = c.toString();
                } else if (col.title == that.core_ninth_column_title) {
                  that.core_ninth_column_id = c.toString();
                } else if (col.title == that.core_tenth_column_title) {
                  that.core_tenth_column_id = c.toString();
                }
                else if (col.title == that.core_eleventh_column_title) {
                  that.core_eleventh_column_id = c.toString();
                } else if (col.title == that.core_twelveth_column_title) {
                  that.core_twelveth_column_id = c.toString();
                }
                c++;
              }
            }
          );
        });
      }
    });
    that.clearAllSearches();
  }
  clearAllSearches() {

    if (this.dtElements != null && this.dtElements.length > 0)
      this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
        if (index == 0) {
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows('.selected').deselect();
            for (let i = 0; i < dtInstance.columns().count(); i++) {
              dtInstance.column(i).search("");
              if (i < dtInstance.columns().count()) {
                continue;
              }
            }
            dtInstance.draw();
            dtInstance.page(this.dt_ats_current_page).draw(false);
          });
        } else {
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows('.selected').deselect();
            for (let i = 0; i < dtInstance.columns().count(); i++) {
              dtInstance.column(i).search("");
              if (i < dtInstance.columns().count()) {
                continue;
              }
            }
            dtInstance.draw();
          });
        }
      });
  }
  matchTransactions() {
    var data_1_id: any[] = [];
    var data_2_id: any[] = [];
    var data_1_amount_sum: number = 0;
    var data_2_amount_sum: number = 0;
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if (index == 0) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
          for (let i = 0; i < rowData.length; i++) {
            // data_1.push(rowData[i])
            // console.log(JSON.stringify(rowData[i], null, 4))
            // console.log('amount: ' + JSON.stringify(rowData[i].amount, null, 4))
            data_1_amount_sum += Number(
              JSON.stringify(rowData[i].amount, null, 4)
            );
            data_1_amount_sum.toFixed(2);
            data_1_id.push(rowData[i].id);
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
              JSON.stringify(rowData[i].amount, null, 4));
            data_2_id.push(rowData[i].id);
            // data_2_id.push(rowData[i].id)
          }
          console.log(this.selections);
          if (this.selections > 0) {
            console.log(
              'amounts:::::::::::::::::::::::::::::::::: ' + data_1_amount_sum
            );
            console.log(
              'amounts:::::::::::::::::::::::::::::::::: ' + data_2_amount_sum
            );
            if (((data_1_amount_sum - data_2_amount_sum) || (data_2_amount_sum - data_1_amount_sum)) > 0.05) {
              // Swal.fire({
              //   title: 'Amount Difference: ',
              //   text: 'It seems there is an little amount difference between the selected transactions. Do you want to match ?',
              //   icon: 'warning',
              //   showCancelButton: true,
              //   confirmButtonColor: '#0acf97',
              //   cancelButtonColor: '#3085d6',
              //   confirmButtonText: ' match',
              // }).then((result) => {
              //   if (result.isConfirmed) {


              //   } else {
              //     console.log('canceled');
              //   }
              // });
            } else {
              console.log(data_1_id);
              console.log(data_2_id);
              this.stockServices
                .matchTransactions(data_1_id.toString(), data_2_id.toString())
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
                            this.clearAllSearches();
                          }
                          else {

                            $('#fixed_core_table').DataTable().ajax.reload()
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
                    } else console.log('ret: ' + JSON.stringify(data, null, 5));
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
                              this.stockServices
                                .matchTransactions(data_1_id.toString(), data_2_id.toString())
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
                                    } else console.log('ret: ' + JSON.stringify(data, null, 5));
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
          } else {
            this.showSelectionEmpty();
          }
        });
      }
    });
  }

  matchAllTransaction() {

    Swal.fire({
      text:
        'You are matching all transactions automatically. Are you sure? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0acf97',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {

        let timerInterval
        const sw = Swal.fire({
          // title: '<span></span>',
          allowOutsideClick: false,
          // timer: 4000,
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: false,
          showDenyButton: false,
          html: '<kk>' + this.uploadStatus_title + '</kk>' + ' <span><b></b></span>',
          // text: this.progress + '',
          didOpen: () => {
            Swal.showLoading(Swal.getDenyButton()!);
            //const b = Swal.getHtmlContainer()!.querySelector('b')
            // const t = Swal.getHtmlContainer()!.querySelector('span')
            //const kk = Swal.getHtmlContainer()!.querySelector('kk')
            timerInterval = setInterval(() => {
              this.uploadStatus_title = 'matching...'
            })
          },
        });
        this.matchAllTransactions();

      } else {
      }
    });
  }
  matchAllTransactions() {
    var data_1_id: any[] = [];
    var data_2_id: any[] = [];
    var data_1_dr_cr: any[] = [];
    var data_2_dr_cr: any[] = [];
    var data_1_amount: Number[] = [];
    var data_2_amount: Number[] = [];
    var data_1_reference: any[] = [];
    var data_2_reference: any[] = [];
    var data_1_account: any[] = [];
    var data_2_account: any[] = [];
    var data_1_type: any[] = [];
    var data_1_core_id: any[] = [];
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
            data_1_amount_sum.toFixed(2);
            data_1_id.push(rowData[i].id);
            data_1_dr_cr.push(rowData[i].dr_cr);
            data_1_amount.push(rowData[i].amount);
            data_1_reference.push(rowData[i].reference);
            data_1_account.push(rowData[i].account_segment);
            data_1_type.push(rowData[i].value_date_type);
            data_1_core_id.push(rowData[i].core_id);
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
            data_2_amount_sum += Number(JSON.stringify(rowData[i].ammount, null, 4));
            data_2_id.push(rowData[i].id);
            data_2_dr_cr.push(rowData[i].dr_cr);
            data_2_amount.push(rowData[i].amount);
            data_2_reference.push(rowData[i].description.replace(',', ''));
            data_2_account.push(rowData[i].account);
            // data_2_id.push(rowData[i].id)
          }
          console.log(this.selections);
          if (this.selections <= 0) {

            console.log(data_1_id);
            console.log(data_2_id);
            console.log(data_1_amount);
            console.log(data_2_amount);
            console.log(data_1_dr_cr);
            console.log(data_2_dr_cr);
            console.log(data_1_reference);
            console.log(data_2_reference);
            console.log(data_1_account);
            console.log(data_2_account);

            if (data_1_id.length == 0 || data_2_id.length == 0) {
              Swal.hideLoading();
              Swal.close();
              this.showDataEmpty()
            }
            else {
              this.stockServices
                .matchAllTransactions(
                  data_1_id.toString(),
                  data_2_id.toString(),
                  data_1_core_id.toString(),
                  data_1_type.toString(),
                  formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US'),
                  data_1_amount.toString(),
                  data_2_amount.toString(),
                  data_1_dr_cr.toString(),
                  data_2_dr_cr.toString(),
                  data_1_reference.toString(),
                  data_2_reference.toString(),
                  data_1_account.toString(),
                  data_2_account.toString()
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
                              this.stockServices
                                .matchAllTransactions(
                                  data_1_id.toString(),
                                  data_2_id.toString(),
                                  data_1_core_id.toString(),
                                  data_1_type.toString(),
                                  formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US'),
                                  data_1_amount.toString(),
                                  data_2_amount.toString(),
                                  data_1_dr_cr.toString(),
                                  data_2_dr_cr.toString(),
                                  data_1_reference.toString(),
                                  data_2_reference.toString(),
                                  data_1_account.toString(),
                                  data_2_account.toString()
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
            // }
          } else {
            this.showClearSelection();
          }
        });
      }
    });
  }
  showMatchSuccess() {
    this.toast.success({ detail: 'SUCCESS', summary: 'Matched successfully!' });
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
  showSelectionEmpty() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'Please select transaction to Match.',
    });
  }

  showDataEmpty() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'There is no transaction that can be automatically mathed.',
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

