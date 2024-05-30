import { formatDate } from '@angular/common';
import { Component, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { NgToastService } from 'ng-angular-popup';
import { LocalStorageService } from 'ngx-webstorage';
import { ReconManualFixedAssetService } from 'src/app/FixedAsset/Abebayehu/service/recon-manual-fixed-asset.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { StockService } from '../../Services/stock.service';

@Component({
  selector: 'app-stock-manual',
  templateUrl: './stock-manual.component.html',
  styleUrls: ['./stock-manual.component.css']
})
export class StockManualComponent {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  initialDateValue = new Date();
  refresh_token_requested = false;
  reload_checker: boolean = true;

  dtOptions_mms: any;
  dtOptions_core: any;

  restricted: boolean = true;

  //mms inits
  mms_first_column_title = '-ID-';
  mms_second_column_title = 'Reference';
  mms_third_column_title = 'Account Segment';
  mms_fourth_column_title = 'Amount';
  mms_fifth_column_title = 'Main_pg';
  mms_seventh_column_title = 'DR_CR';
  mms_eighth_column_title = 'Transaction Date';
  mms_ninth_column_title = 'Store Name';
  mms_tenth_column_title = 'Category Description';
  // mms_eleventh_column_title = 'BBF';
  // mms_twelfth_column_title = 'Tran Code';
  // mms_thirteenth_column_title = 'Main Page';
  // mms_fourteenth_column_title = 'Store Name';
  // mms_fifteenth_column_title = 'Category Description';
  // mms_sixteenth_column_title = 'Action';


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
  // mms_input_10!: any;
  // mms_input_11!: any;
  // mms_input_12!: any;
  // mms_input_13!: any;

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
  // mms_twelfth_column_id = '11';
  // mms_thirteenth_column_id = '12';
  // mms_fourteenth_column_id = '13'
  // mms_fifteenth_column_id = '14'
  //core inits

  core_first_column_title = '-ID-';
  core_second_column_title = 'Description';
  core_third_column_title = 'Amount';
  core_fourth_column_title = 'Account Number';
  core_fifth_column_title = 'DR_CR';
  core_sixth_column_title = 'Transaction Date';
  // core_seventh_column_title = 'Balance';
  core_eighth_column_title = 'Source Branch';
  core_ninth_column_title = 'Branch Name';
  core_tenth_column_title = 'Posting Date';
  core_eleventh_column_title = 'Transaction Reference';
  core_twelveth_column_title = 'Value Date';


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
  core_twelfth_column_id = '11';


  refAll: string = '';
  account: string = '';
  dt_mms_current_page: number = 0;
  empty_provider: string = '';
  empty_provider_string: string =
    '2l210k3j5h8g5f4d7r7e7s4w5a6q5t4y1u3i1o7p8m9n6b5v4cx1z__)())((';


  mms_debit_credit_list: any[] = [];
  total_mms_amount: number = 0;
  type:any;
  core_debit_credit_list: any[] = [];
  total_core_amount: number = 0;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private utilService: UtilService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private reconManualFixedAssetService: ReconManualFixedAssetService,
    private stockServices: StockService,
    private toast: NgToastService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.type = this.route.snapshot.params['type'];
    $('#mms_stock_table').DataTable().ajax.reload();
    $('#core_stock_table').DataTable().ajax.reload();
  }

  onReconDateChange(value: Date): void {
    this.initialDateValue = new Date(value);
    this.localStorageService.store(
      'recon_current_date_fixed_stock_manual',
      this.initialDateValue
    );
    if (!this.reload_checker)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.ajax.reload((data) => { }, false);
            });
          }
        }
      );
    this.reload_checker = false;
  }

  someFilterFromAts(info: any): void { }
  autoMatchTransactions() {
    console.log('auto match transaction');
  }

  ngOnInit(): void {
    var that = this;
    if (
      this.localStorageService.retrieve('recon_current_date_fixed_stock_manual') ==
      null
    ) {
      this.initialDateValue = new Date();
      this.localStorageService.store(
        'recon_current_date_fixed_stock_manual',
        this.initialDateValue
      );
    } else
      this.initialDateValue = new Date(
        this.localStorageService.retrieve('recon_current_date_fixed_stock_manual')
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
        pageLength: 10,
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
          this.stockServices
            .get_raw_stock_mms_for_recon(
              formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US'),this.type
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
                          .get_raw_stock_mms_for_recon(
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


        ],
        dom: "<'row mb-1 my-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",

        buttons: {
          buttons: [
            'colvis',
            {
              text: 'Reload',
              action: function (e: any, dt: any, node: any, config: any) {
                dt.ajax.reload();
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
                  var debit = 0;
                  var credit = 0;
                  for (let i = 0; i < rows.length; i++) {
                    if(rows[i].dr_cr=='CR')
                    credit += rows[i].amount;
                  else
                  debit += rows[i].amount;
                  }
                  if (debit > 0 && credit > 0) {
                    sum = (credit - debit);
                  }
                  else if (debit > 0 && credit == 0) {
                    sum = debit;
                  }
                  else
                    sum = credit;

                  Swal.fire({
                    text: 'The sum of selected amounts is ' + sum.toFixed(2),
                  });
                }
              },
            },
            {
              extend: 'selected',
              text: 'Delete',
              action: async function (e: any, dt: any, node: any, config: any) {
                var rows = dt.rows({ selected: true }).data().toArray();
                const { value: text } = await Swal.fire({
                  input: 'textarea',
                  inputLabel: 'Reason',
                  inputPlaceholder: 'Type your reason here...',
                  inputAttributes: {
                    'aria-label': 'Type your reason here',
                  },
                  title: 'Delete Warning: ',
                  text: 'You are trying to delete a transaction. If you are sure please state your reason.',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#d33',
                  cancelButtonColor: '#3085d6',
                  confirmButtonText: 'Delete anyways',
                });
                if (text == '') {
                  Swal.fire({
                    title: 'Delete failed. No reason found.',
                    icon: 'error',
                  });
                } else if (text) {
                  var ids: any[] = [];
                  for (let i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                  }
                  that.stockServices
                    .deleteTransactions(text, ids, 'mms_stock')
                    .subscribe(
                      (data: any) => {
                        console.log(JSON.stringify(data, null, 3));
                        Swal.fire({
                          title: 'Delete Success!',
                          text: 'You have Deleted the transaction successfully.',
                          icon: 'success',
                        });
                        that.clearAllSearches();
                        that.dtElements.forEach(
                          (dtElement: DataTableDirective, index: number) => {
                            if (index == 0) {
                              dtElement.dtInstance.then(
                                (dtInstance: DataTables.Api) => {
                                  dtInstance.ajax.reload((data) => {
                                    console.log('data reload 00');
                                  }, false);
                                }
                              );
                            }
                          }
                        );

                      },
                      (error) => {
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
                                  that.stockServices
                                    .deleteTransactions(text, ids, 'mms_stock')
                                    .subscribe(
                                      (data: any) => {
                                        console.log(
                                          JSON.stringify(data, null, 3)
                                        );
                                        Swal.fire({
                                          title: 'Delete Success!',
                                          text: 'You have Deleted the transaction successfully.',
                                          icon: 'success',
                                        });
                                        that.clearAllSearches();
                                        that.dtElements.forEach(
                                          (
                                            dtElement: DataTableDirective,
                                            index: number
                                          ) => {
                                            if (index == 0) {
                                              dtElement.dtInstance.then(
                                                (
                                                  dtInstance: DataTables.Api
                                                ) => {
                                                  dtInstance.ajax.reload(
                                                    (data) => {
                                                      console.log(
                                                        'data reload 00'
                                                      );
                                                    },
                                                    false
                                                  );
                                                }
                                              );
                                            }
                                          }
                                        );
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
                        }
                      }
                    );
                }
              },
            },
            {
              extend: 'excel',
              text: 'excel',
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

        columnDefs: [
          {
            targets: '_all',
            defaultContent: '-',
          },
        ],
      };
    } catch (ex) {
      console.log('Exception: ' + JSON.stringify(ex));
    }
    try {
      this.dtOptions_core = {
        serverSide: false,
        scrollX: true,
        searching: true,
        lengthChange: true,
        ordering: true,
        paging: true,
        pagingType: 'full_numbers',
        pageLength: 10,
        lengthMenu: [5, 10, 20, 50, 100, 200, 500],
        select: true,
        ajax: (dataTablesParameters: any, callback: any) => {
          this.stockServices.get_raw_stock_core_for_recon(formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US'),this.type).subscribe(
            async (resp: any) => {
              if (resp != null) {
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
                        this.stockServices.get_raw_stock_core_for_recon(formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US'),this.type).subscribe(
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
            data: 'description',
          },
          {
            title: this.core_third_column_title,
            data: 'amount',
          },
          {
            title: this.core_fourth_column_title,
            data: 'account',
          },
          {
            title: this.core_fifth_column_title,
            data: 'dr_cr',
          },
          // {
          //   title: this.core_sixth_column_title,
          //   data: 'amount',dr_cr
          // },
          // {
          //   title: this.core_seventh_column_title,
          //   data: 'balance',
          // },
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
            data: 'value_date',
          },
        ],
        dom: "<'row mb-1 my-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
        buttons: {
          buttons: [
            'colvis',
            {
              text: 'Reload',
              action: function (e: any, dt: any, node: any, config: any) {
                dt.ajax.reload();
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
                  var debit = 0;
                  var credit = 0;
                  console.log('length----'+rows.length)
                  for (let i = 0; i < rows.length; i++) {
                    console.log('ttttttt----'+rows[i].amount)
                    if(rows[i].dr_cr=='CR')
                    credit += rows[i].amount;
                  else
                  debit += rows[i].amount;
                  }
                  if (debit > 0 && credit > 0) {
                    sum = (credit - debit);
                  }
                  else if (debit > 0 && credit == 0) {
                    sum = debit;
                  }
                  else
                    sum = credit;

                  Swal.fire({
                    text: 'The sum of selected amounts is ' + sum.toFixed(2),
                  });
                }
              },
            },

            {
              extend: 'selected',
              text: 'Delete',
              action: async function (e: any, dt: any, node: any, config: any) {
                var rows = dt.rows({ selected: true }).data().toArray();
                const { value: text } = await Swal.fire({
                  input: 'textarea',
                  inputLabel: 'Reason',
                  inputPlaceholder: 'Type your reason here...',
                  inputAttributes: {
                    'aria-label': 'Type your reason here',
                  },
                  title: 'Delete Warning: ',
                  text: 'You are trying to delete a transaction. If you are sure please state your reason.',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#d33',
                  cancelButtonColor: '#3085d6',
                  confirmButtonText: 'Delete anyways',
                });
                if (text == '') {
                  Swal.fire({
                    title: 'Delete failed. No reason found.',
                    icon: 'error',
                  });
                } else if (text) {
                  var ids: any[] = [];
                  for (let i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                  }
                  that.stockServices
                    .deleteTransactions(text, ids, 'core_stock')
                    .subscribe(
                      (data: any) => {
                        console.log(JSON.stringify(data, null, 3));
                        Swal.fire({
                          title: 'Delete Success!',
                          text: 'You have Deleted the transaction successfully.',
                          icon: 'success',
                        });

                        that.dtElements.forEach(
                          (dtElement: DataTableDirective, index: number) => {
                            if (index == 1) {
                              dtElement.dtInstance.then(
                                (dtInstance: DataTables.Api) => {
                                  dtInstance.ajax.reload((data) => {
                                    console.log('data reload 00');
                                  }, false);
                                }
                              );
                            }
                          }
                        );
                      },
                      (error) => {
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
                                  that.stockServices
                                    .deleteTransactions(text, ids, 'core_stock')
                                    .subscribe(
                                      (data: any) => {
                                        console.log(
                                          JSON.stringify(data, null, 3)
                                        );
                                        Swal.fire({
                                          title: 'Delete Success!',
                                          text: 'You have Deleted the transaction successfully.',
                                          icon: 'success',
                                        });

                                        that.dtElements.forEach(
                                          (
                                            dtElement: DataTableDirective,
                                            index: number
                                          ) => {
                                            if (index == 1) {
                                              dtElement.dtInstance.then(
                                                (
                                                  dtInstance: DataTables.Api
                                                ) => {
                                                  dtInstance.ajax.reload(
                                                    (data) => {
                                                      console.log(
                                                        'data reload 00'
                                                      );
                                                    },
                                                    false
                                                  );
                                                }
                                              );
                                            }
                                          }
                                        );
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
                        }
                      }
                    );
                }
              },
            },

            {
              extend: 'excel',
              text: 'excel',
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
        columnDefs: [
          {
            targets: '_all',
            defaultContent: '-',
          },
        ],
      };
    } catch (ex) {
      console.log('Exception: ' + JSON.stringify(ex));
    }
    this.clearAllSearches();
  }

  // the logic behind proposing the transactions via restricted mode
  restrictedChange() { }
  addSelectEvent(that: any, dtInstance: any, dt: any, indexes: any) {
    if (that.restricted) {
      that.dt_mms_current_page = dt.page();
      var rowData = dtInstance.rows(indexes).data().toArray();
      if (
        rowData[0].reference != null &&
        //rowData[0].reference.includes('GIV') &&
        rowData[0].amount!= null
        // rowData[0].debit != null
      ) {
        that.refAll = rowData[0].reference;
        that.account = rowData[0].account
        that.dtElements.forEach(
          (dtElement: DataTableDirective, index: number) => {
            if (index == 0) {
              that.selections++;
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance
                  .column(1)
                  .search(that.refAll)
                  .draw();
                var rowData = dtInstance
                  .rows({ search: 'applied' })
                  .data()
                  .toArray();

                for (let i = 0; i < rowData.length; i++) {
                  this.total_mms_amount += rowData[i].amount;
                }
              });
            } else {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                var total_core_data = dtInstance
                  .column(1)
                  .search(that.refAll)
                  .column(2, { search: 'applied' })
                  .data();

                // var total_core_data_debit = dtInstance
                //   .column(1)
                //   .search(that.refAll)
                //   .column(3, { search: 'applied' })
                //   .data();

                var total_core_amount =
                  total_core_data.length > 0
                    ? total_core_data.reduce(function (a, b) {
                      return a + b;
                    })
                    : 0;

                // var total_core_debit_amount =
                //   total_core_data_debit.length > 0
                //     ? total_core_data_debit.reduce(function (a, b) {
                //       return a + b;
                //     })
                //     : 0;
                this.total_core_amount = total_core_amount;
                if (this.total_mms_amount.toFixed(2) == this.total_core_amount.toFixed(2)) {
                  dtInstance
                    .column(1)
                    .search(that.refAll)
                    .draw();
                }
                else {
                  dtInstance
                    .column(1)
                    .search(that.refAll)
                    .draw();
                }
              });
            }
          }
        );
      };
    }
  }

  //FOOTER SEARCH AND BUTTON ON CLICK
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
                } else if (col.title == that.mms_seventh_column_title) {
                  that.mms_seventh_column_id = c.toString();
                } else if (col.title == that.mms_eighth_column_title) {
                  that.mms_eighth_column_id = c.toString();
                } else if (col.title == that.mms_ninth_column_title) {
                  that.mms_ninth_column_id = c.toString();
                } else if (col.title == that.mms_tenth_column_title) {
                  that.mms_tenth_column_id = c.toString();
                }
                c++;
              }
            }
          );
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
                } 
                // else if (col.title == that.core_seventh_column_title) {
                //   that.core_seventh_column_id = c.toString();
                // } 
                else if (col.title == that.core_eighth_column_title) {
                  that.core_eighth_column_id = c.toString();
                } else if (col.title == that.core_ninth_column_title) {
                  that.core_ninth_column_id = c.toString();
                } else if (col.title == that.core_tenth_column_title) {
                  that.core_tenth_column_id = c.toString();
                }
                else if (col.title == that.core_eleventh_column_title) {
                  that.core_eleventh_column_id = c.toString();
                }
                else if (col.title == that.core_twelveth_column_title) {
                  that.core_twelfth_column_id = c.toString();
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

    this.total_core_amount = 0;
    this.total_mms_amount = 0;
    this.core_debit_credit_list = [];
    this.mms_debit_credit_list = [];

    if (this.dtElements != null && this.dtElements.length > 0)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          this.empty_provider = '';
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.rows('.selected').deselect();
              for (let i = 0; i < 15; i++) {
                if (i == 5) {
                  continue;
                }
                dtInstance
                  .search('')
                  .column(i)
                  .search('')
                if (i == 14) {
                  dtInstance.draw();
                }
              }
              dtInstance.page(this.dt_mms_current_page).draw(false);
            });
          } else {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.rows('.selected').deselect();
              for (let i = 0; i < 11; i++) {
                dtInstance
                  .search('')
                  .column(i)
                  .search('')
                if (i == 10) {
                  dtInstance.draw();
                }
              }
            });
          }
        }
      );
  }

  showMatchSuccess() {
    this.toast.success({ detail: 'SUCCESS', summary: 'Matched  successfully!' });
  }
  showSelectionEmpty() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'Please select atleast  transactions  to  match.',
    });
  }
  IncorrectSelection() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'Please select correct reversal transaction .',
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
        console.log('Error: ' + JSON.stringify(error, null, 2));
      }
    );
  }

  showErrormessage(message: string) {
    this.toast.error({
      detail: 'ERROR',
      summary: message,
    });
  }
  reversal_matchTransactions() {
    var data_core_id_list: any[] = [];
    var data_core_amount_sum: number = 0;
    this.dtElements.forEach(
      (dtElement: DataTableDirective, index: number) => {
        if (index == 0) {
          // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   var rowData = dtInstance.rows({ selected: true }).data().toArray();
          //   mms_number_of_rows = rowData.length;
          //   if (rowData.length > 0) {
          //     for (let i = 0; i < rowData.length; i++) {
          //       data_mms_amount_sum += rowData[i].amount;
          //       data_mms_id_list.push(rowData[i].id);
          //       data_mms_reference.push(rowData[i].reference);
          //     }
          //   }
          // });
        } else {
          dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
            var rowData = dtInstance.rows({ selected: true }).data().toArray();
            if (rowData.length > 0) {
              for (let i = 0; i < rowData.length; i++) {
                if (rowData[i].dr_cr == 'CR') {
                  data_core_amount_sum += rowData[i].amount;
                }
                else {
                  data_core_amount_sum -= rowData[i].amount;
                }
                data_core_id_list.push(rowData[i].id);

              }
            }

            if (rowData.length == 0) {
              this.showSelectionEmpty();
            }
            else {
              // if (data_core_amount_sum == 0 && rowData[0].branch_code == rowData[1].branch_code && rowData[0].account_number == rowData[1].account_number) {
              if (data_core_amount_sum == 0) {
                this.stockServices
                  .ReversalCoreStockTransactions(
                    data_core_id_list
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
                              // dtElement.dtInstance.then(
                              //   (dtInstance: DataTables.Api) => {
                              //     dtInstance
                              //       .rows({ selected: true })
                              //       .remove()
                              //       .draw();
                              //   }
                              // );
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
                          }
                        );
                        console.log('match success: ' + data);
                      } else
                        console.log(
                          'ret: ' + JSON.stringify(data, null, 5)
                        );
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
                                this.stockServices
                                  .ReversalCoreStockTransactions(
                                    data_core_id_list
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
                                            console.log(
                                              'index: ' + index
                                            );
                                            if (index == 0) {
                                              // dtElement.dtInstance.then(
                                              //   (
                                              //     dtInstance: DataTables.Api
                                              //   ) => {
                                              //     dtInstance
                                              //       .rows({
                                              //         search: 'applied',
                                              //       })
                                              //       .remove()
                                              //       .draw();
                                              //   }
                                              // );
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
                              } else {
                                console.log('refresh token expired.');
                                this.SwalSessionExpired.fire();
                                this._refreshTokenExpired();
                              }
                            },
                            (error: any) => {
                              console.log(
                                'error refreshing access token'
                              );
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
              else
                this.IncorrectSelection();
            }
          });
        }
      })

  }
  matchTransactions() {
    var data_mms_id_list: any[] = [];
    var data_core_id_list: any[] = [];
    var data_mms_amount_sum: number = 0;
    var data_core_amount_sum: number = 0;



    var data_mms_reference: String[] = [];
    var data_core_description: String[] = [];


    var mms_number_of_rows: number = 0;

    if (this.restricted) {
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              var rowData = dtInstance.rows({ selected: true }).data().toArray();
              mms_number_of_rows = rowData.length;
              if (rowData.length > 0) {
                data_mms_reference.push(rowData[0].reference);
                for (let i = 0; i < rowData.length; i++) {
                  if (data_mms_reference.includes(rowData[i].reference)) {
                    data_mms_amount_sum += rowData[i].amount;
                    data_mms_id_list.push(rowData[i].id);
                  }
                }
              }
            });
          } else {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              var rowData = dtInstance.rows({ selected: true }).data().toArray();
              if (rowData.length > 0) {
                data_core_description = rowData[0].description;
                for (let i = 0; i < rowData.length; i++) {
                  if (rowData[i].description.includes(data_mms_reference[0])) {
                    data_core_amount_sum += rowData[i].amount;
                    data_core_id_list.push(rowData[i].id);
                  }
                }
              }
              console.log('mms sum is---'+data_mms_amount_sum)
              console.log('core sum is---'+data_core_amount_sum)
              console.log('mms sum is---'+data_mms_amount_sum.toFixed(2))
              console.log('core sum is---'+data_core_amount_sum.toFixed(2))
              // if (mms_number_of_rows == data_mms_id_list.length && rowData.length == data_core_id_list.length) {
              if (
                Math.abs(data_mms_amount_sum).toFixed(2) == Math.abs(data_core_amount_sum).toFixed(2) && (rowData.length > 0 && mms_number_of_rows > 0)
              ) {
                this.stockServices
                  .matchTransaction(
                    data_mms_id_list,
                    data_core_id_list
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
                          }
                        );
                        console.log('match success: ' + data);
                      } else
                        console.log(
                          'ret: ' + JSON.stringify(data, null, 5)
                        );
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
                                this.stockServices
                                  .matchTransaction(
                                    data_mms_id_list,
                                    data_core_id_list
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
                                            console.log(
                                              'index: ' + index
                                            );
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
                              } else {
                                console.log('refresh token expired.');
                                this.SwalSessionExpired.fire();
                                this._refreshTokenExpired();
                              }
                            },
                            (error: any) => {
                              console.log(
                                'error refreshing access token'
                              );
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
              } else if (
                data_mms_amount_sum.toFixed(2) == data_core_amount_sum.toFixed(2) && (rowData.length > 0 && mms_number_of_rows == 0 )
              ) {
                this.showErrormessage('The selected transactions  from one table. so please  off right top  Ristricted button  and check the transaction match reversaly.');
              }
              else if (
                 (rowData.length == 0 && mms_number_of_rows > 0 )
              ) {
                this.showErrormessage(' Please select the equivalent transaction from right side table.');
              }else {
                this.showErrormessage('There is an amount difference.');
              }
              // }
              // else{

              // }
            })
          }
        })
    }
    else {//3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              var rowData = dtInstance.rows({ selected: true }).data().toArray();
              mms_number_of_rows = rowData.length;
              if (rowData.length > 0) {
                for (let i = 0; i < rowData.length; i++) {
                  data_mms_amount_sum += rowData[i].amount;
                  data_mms_id_list.push(rowData[i].id);
                  data_mms_reference.push(rowData[i].reference);
                }
              }
            });
          } else {
            dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
              var rowData = dtInstance.rows({ selected: true }).data().toArray();
              if (rowData.length > 0) {
                // data_core_description = rowData[0].description;
                for (let i = 0; i < rowData.length; i++) {
                  data_core_amount_sum += rowData[i].amount;
                  data_core_id_list.push(rowData[i].id);
                  data_core_description.push(rowData[i].description);
                }
              }

              var is_reference_similar: boolean = true;
              var mms_reference: any = data_mms_reference[0]
              for (let i = 0; i < data_mms_reference.length; i++) {
                if (!data_mms_reference[i].includes(mms_reference)) {
                  is_reference_similar = false;
                }
              }

              var is_reference_contained: boolean = true;
              for (let i = 0; i < data_core_description.length; i++) {
                if (!data_core_description[i].includes(mms_reference)) {
                  is_reference_contained = false;
                }
              }

              if (mms_number_of_rows == 0 || rowData.length == 0) {
                this.showSelectionEmpty();
              }
              else {
                if (is_reference_similar && is_reference_contained) {
                  if (
                    data_mms_amount_sum.toFixed(2) == data_core_amount_sum.toFixed(2)
                  ) {
                    this.stockServices
                      .matchTransaction(
                        data_mms_id_list,
                        data_core_id_list
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
                              }
                            );
                            console.log('match success: ' + data);
                          } else
                            console.log(
                              'ret: ' + JSON.stringify(data, null, 5)
                            );
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
                                    this.stockServices
                                      .matchTransaction(
                                        data_mms_id_list,
                                        data_core_id_list
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
                                                console.log(
                                                  'index: ' + index
                                                );
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
                                  } else {
                                    console.log('refresh token expired.');
                                    this.SwalSessionExpired.fire();
                                    this._refreshTokenExpired();
                                  }
                                },
                                (error: any) => {
                                  console.log(
                                    'error refreshing access token'
                                  );
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
                  } else {
                    //  this.showErrormessage('There is an amount difference.');
                    const { value: text } = await Swal.fire({
                      input: 'textarea',
                      inputLabel: 'Reason',
                      inputPlaceholder: 'Type your reason here...',
                      inputAttributes: {
                        'aria-label': 'Type your reason here',
                      },
                      title: 'Amount Difference: ',
                      text: "It seems there is amount difference between the selected transactions. If you are sure, state your reason and click 'Match anyways'.",
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
                      console.log("")
                      var type = 'amount_difference';
                      this.stockServices
                        .matchTransactionsWithComment(
                          data_mms_id_list,
                          data_core_id_list,
                          text,
                          type
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
                                }
                              );
                              console.log('match success: ' + data);
                            } else
                              console.log(
                                'ret: ' + JSON.stringify(data, null, 5)
                              );
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
                                      this.stockServices
                                        .matchTransactionsWithComment(
                                          data_mms_id_list,
                                          data_core_id_list,
                                          text,
                                          type
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

                  }
                }
                else {
                  const { value: text } = await Swal.fire({
                    input: 'textarea',
                    inputLabel: 'Reason',
                    inputPlaceholder: 'Type your reason here...',
                    inputAttributes: {
                      'aria-label': 'Type your reason here',
                    },
                    title: 'Reference Difference: ',
                    text: "It seems there is a reference difference between the selected transactions. If you are sure, state your reason and click 'Match anyways'.",
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
                    var type = 'reference';
                    console.log("I am here referencereferencereferencereferencereferencereferencere   " + data_core_id_list);
                    this.stockServices
                      .matchTransactionsWithComment(
                        data_mms_id_list,
                        data_core_id_list,
                        text,
                        type
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
                              }
                            );
                            console.log('match success: ' + data);
                          } else
                            console.log(
                              'ret: ' + JSON.stringify(data, null, 5)
                            );
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
                                    this.stockServices
                                      .matchTransactionsWithComment(
                                        data_mms_id_list,
                                        data_core_id_list,
                                        text,
                                        type
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
                }
              }
            });
          }
        })
    }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


