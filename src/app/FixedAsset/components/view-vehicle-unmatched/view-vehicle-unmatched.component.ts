import { formatDate } from '@angular/common';
import { Component, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { NgToastService } from 'ng-angular-popup';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { ReconViewService } from 'src/app/User/services/recon-view.service';
import Swal from 'sweetalert2';
import { FixedViewService } from '../../garama/services/fixed-view.service';

@Component({
  selector: 'app-view-vehicle-unmatched',
  templateUrl: './view-vehicle-unmatched.component.html',
  styleUrls: ['./view-vehicle-unmatched.component.css']
})
export class ViewVehicleUnmatchedComponent {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
 
  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  initialDateValue = new Date();

  reload_checker: boolean = true;

  dtOptions_mms: any;
  dtOptions_core: any;

  //ats inits
  ats_first_column_title = '-ID-';
  ats_second_column_title = 'Created-date';
  ats_third_column_title = 'Asset-id';
  ats_fourth_column_title = 'Asset-description';
  ats_fifth_column_title = 'Tag-number';
  ats_sixth_column_title = 'Branch-name';
  ats_seventh_column_title = 'Quantity';
  ats_eighth_column_title = 'Grv-number';
  ats_ninth_column_title = 'Giv-number';
  ats_tenth_column_title = 'Original-cost';
  ats_eleventh_column_title = 'Book-value';
  ats_twelvth_column_title = 'main_pg';
  ats_thirteenth_column_title = 'old_main_pg';

  ats_input_0!: any;
  ats_input_1!: any;
  ats_input_2!: any;
  ats_input_3!: any;
  ats_input_4!: any;
  ats_input_5!: any;
  ats_input_6!: any;
  ats_input_7!: any;
  ats_input_8!: any;
  ats_input_9!: any;
  ats_input_10!: any;
  ats_input_11!: any;
  ats_input_12!: any;

  ats_first_column_id = '0';
  ats_second_column_id = '1';
  ats_third_column_id = '2';
  ats_fourth_column_id = '3';
  ats_fifth_column_id = '4';
  ats_sixth_column_id = '5';
  ats_seventh_column_id = '6';
  ats_eighth_column_id = '7';
  ats_ninth_column_id = '8';
  ats_tenth_column_id = '9';
  ats_eleventh_column_id = '10';
  ats_twelvth_column_id = '11';
  ats_thirteenth_column_id = '12';

  //core inits
  core_first_column_title = '-ID-';
  core_second_column_title = 'Account Number';
  core_third_column_title = 'Transaction Date';
  core_fourth_column_title = 'Posting Date';
  core_fifth_column_title = 'Value Date';
  core_sixth_column_title = 'Credit';
  core_seventh_column_title = 'Debit';
  core_eighth_column_title = 'Branch Code';
  core_ninth_column_title = 'Reference';
  core_tenth_column_title = 'Narration';
  core_eleventh_column_title = 'Account Description';
  core_twelveth_column_title = 'Account Name';

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
  core_input_13!: any;
  core_input_14!: any;

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
  core_thirteenth_column_id = '12';
  core_fourteenth_column_id = '13';
  core_fifteenth_column_id = '14';

  // dtElement!: DataTableDirective;
  // dtInstance!: Promise<DataTables.Api>;

  refAll: string = '';
  selections: number = 0;
  dt_ats_current_page: number = 0;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private utilService: UtilService,
    private localStorageService: LocalStorageService,
    private viewService: FixedViewService,
    private authService: AuthService,
    private toast: NgToastService
  ) {}

  someFilterFromAts(info: any): void {}

  onReconDateChange(value: Date): void {
    this.initialDateValue = new Date(value);
    this.localStorageService.store('recon_current_date', this.initialDateValue);
    if (!this.reload_checker)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.ajax.reload((data) => {}, false);
            });
          }
        }
      );
    this.reload_checker = false;
  }

  ngOnInit(): void {
    if (this.localStorageService.retrieve('recon_current_date') == null) {
      this.initialDateValue = new Date();
      this.localStorageService.store(
        'recon_current_date',
        this.initialDateValue
      );
    } else
      this.initialDateValue = new Date(
        this.localStorageService.retrieve('recon_current_date')
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
          this.viewService.getVehicleMMsUnmatchedForView(
              formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US')
            )
            .subscribe(
              async (resp: any) => {
                if (resp != null) {
                  console.log(
                    //'response for table: ' + JSON.stringify(resp, null, 2)
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
                          this.viewService
                            .getVehicleMMsUnmatchedForView(
                              formatDate(
                                this.initialDateValue,
                                'yyyy-MM-dd',
                                'en-US'
                              )
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
            title: this.ats_first_column_title,
            data: 'id',
          },
          {
            title: this.ats_second_column_title,
            data: 'created_date',
          },
          {
            title: this.ats_third_column_title,
            data: 'asset_id',
          },
          {
            title: this.ats_fourth_column_title,
            data: 'asset_description',
          },
          {
            title: this.ats_fifth_column_title,
            data: 'tag_number',
          },
          {
            title: this.ats_sixth_column_title,
            data: 'branch_name',
          },
          {
            title: this.ats_seventh_column_title,
            data: 'quantity',
          },
          {
            title: this.ats_eighth_column_title,
            data: 'grv_number',
          },
          {
            title: this.ats_ninth_column_title,
            data: 'giv_number',
          },
          {
            title: this.ats_tenth_column_title,
            data: 'original_cost',
          },
          {
            title: this.ats_eleventh_column_title,
            data: 'book_value',
          },
          {
            title: this.ats_twelvth_column_title,
            data: 'main_pg',
          },
          {
            title: this.ats_thirteenth_column_title,
            data: 'old_main_pg',
          },
         
          // {
          //   title: this.ats_tenth_column_title,
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
        dom: "<'row mb-1 my-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
        // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
        colReorder: {
          order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          // fixedColumnsLeft: 1,
          action: function (e: any, dt: any, node: any, config: any) {},
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
        select: false,
        lengthMenu: [5, 10, 20, 50, 100, 200, 500],
        // ajax: '../../../../assets/data/data.json',
        ajax: (dataTablesParameters: any, callback: any) => {
          this.viewService.getVehicleCoreUnmatchedForView(formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US')).subscribe(
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
                        //=====================================================================================

                        this.viewService.getVehicleCoreUnmatchedForView(formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US')).subscribe(
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
            data: 'account_number',
          },
          {
            title: this.core_third_column_title,
            data: 'transaction_date',
          },
          {
            title: this.core_fourth_column_title,
            data: 'posting_date',
          },
          {
            title: this.core_fifth_column_title,
            data: 'value_date',
          },
          {
            title: this.core_sixth_column_title,
            data: 'credit',
          },
          {
            title: this.core_seventh_column_title,
            data: 'debit',
          },
          {
            title: this.core_eighth_column_title,
            data: 'branch_code',
          },
          {
            title: this.core_ninth_column_title,
            data: 'reference',
          },
          {
            title: this.core_tenth_column_title,
            data: 'naration',
          },
          {
            title: this.core_eleventh_column_title,
            data: 'account_description',
          },
          {
            title: this.core_twelveth_column_title,
            data: 'account_name',
          },
        ],
        dom: "<'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-2'Q>",
        // dom: "<'row mb-1'Q><'row mb-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1'P>",
        colReorder: {
          order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          // fixedColumnsLeft: 1,
          action: function (e: any, dt: any, node: any, config: any) {},
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
            that.refAll = rowData[0].reference;
            that.ats_input_1 = that.refAll;
            that.dtElements.forEach(
              (dtElement: DataTableDirective, index: number) => {
                console.log('index: ' + index);
                if (index == 0) {
                  // console.log(info.reference);
                  // that.refAll = rowData[0].reference
                  that.selections++;
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance
                      .column(1)
                      .search(
                        that.refAll
                          .split(' ')[0]
                          .replace('"', '')
                          .substring(1, that.refAll.length - 1)
                      )
                      .draw();
                  });
                  console.log('to search: ' + that.refAll);
                  console.log('selectionsssssssssssssssst: ' + that.selections);
                } else {
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance;
                    dtInstance
                      .column(1)
                      .search(
                        that.refAll
                          .split(' ')[0]
                          .replace('"', '')
                          .substring(1, that.refAll.length - 1)
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
              that.ats_input_1 = '';
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
                if (col.title == that.ats_first_column_title) {
                  that.ats_first_column_id = c.toString();
                } else if (col.title == that.ats_second_column_title) {
                  that.ats_second_column_id = c.toString();
                } else if (col.title == that.ats_third_column_title) {
                  that.ats_third_column_id = c.toString();
                } else if (col.title == that.ats_fourth_column_title) {
                  that.ats_fourth_column_id = c.toString();
                } else if (col.title == that.ats_fifth_column_title) {
                  that.ats_fifth_column_id = c.toString();
                } else if (col.title == that.ats_sixth_column_title) {
                  that.ats_sixth_column_id = c.toString();
                } else if (col.title == that.ats_seventh_column_title) {
                  that.ats_seventh_column_id = c.toString();
                } else if (col.title == that.ats_eighth_column_title) {
                  that.ats_eighth_column_id = c.toString();
                } else if (col.title == that.ats_ninth_column_title) {
                  that.ats_ninth_column_id = c.toString();
                } else if (col.title == that.ats_tenth_column_title) {
                  that.ats_tenth_column_id = c.toString();
                }
                c++;
              }
            }
          );

          dtInstance.on('column-reorder', function (e, settings, details) {
            var c = 0;
            for (let col of settings.aoColumns) {
              if (col.title == that.ats_first_column_title) {
                that.ats_first_column_id = c.toString();
              } else if (col.title == that.ats_second_column_title) {
                that.ats_second_column_id = c.toString();
              } else if (col.title == that.ats_third_column_title) {
                that.ats_third_column_id = c.toString();
              } else if (col.title == that.ats_fourth_column_title) {
                that.ats_fourth_column_id = c.toString();
              } else if (col.title == that.ats_fifth_column_title) {
                that.ats_fifth_column_id = c.toString();
              } else if (col.title == that.ats_sixth_column_title) {
                that.ats_sixth_column_id = c.toString();
              } else if (col.title == that.ats_seventh_column_title) {
                that.ats_seventh_column_id = c.toString();
              } else if (col.title == that.ats_eighth_column_title) {
                that.ats_eighth_column_id = c.toString();
              } else if (col.title == that.ats_ninth_column_title) {
                that.ats_ninth_column_id = c.toString();
              } else if (col.title == that.ats_tenth_column_title) {
                that.ats_tenth_column_id = c.toString();
              }
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
                if (col.title == that.ats_first_column_title) {
                  that.ats_first_column_id = c.toString();
                } else if (col.title == that.ats_second_column_title) {
                  that.ats_second_column_id = c.toString();
                } else if (col.title == that.ats_third_column_title) {
                  that.ats_third_column_id = c.toString();
                } else if (col.title == that.ats_fourth_column_title) {
                  that.ats_fourth_column_id = c.toString();
                } else if (col.title == that.ats_fifth_column_title) {
                  that.ats_fifth_column_id = c.toString();
                } else if (col.title == that.ats_sixth_column_title) {
                  that.ats_sixth_column_id = c.toString();
                } else if (col.title == that.ats_seventh_column_title) {
                  that.ats_seventh_column_id = c.toString();
                } else if (col.title == that.ats_eighth_column_title) {
                  that.ats_eighth_column_id = c.toString();
                } else if (col.title == that.ats_ninth_column_title) {
                  that.ats_ninth_column_id = c.toString();
                } else if (col.title == that.ats_tenth_column_title) {
                  that.ats_tenth_column_id = c.toString();
                }
                c++;
              }
            }
          );
          dtInstance.on('column-reorder', function (e, settings, details) {
            var c = 0;
            for (let col of settings.aoColumns) {
              if (col.title == that.ats_first_column_title) {
                that.ats_first_column_id = c.toString();
              } else if (col.title == that.ats_second_column_title) {
                that.ats_second_column_id = c.toString();
              } else if (col.title == that.ats_third_column_title) {
                that.ats_third_column_id = c.toString();
              } else if (col.title == that.ats_fourth_column_title) {
                that.ats_fourth_column_id = c.toString();
              } else if (col.title == that.ats_fifth_column_title) {
                that.ats_fifth_column_id = c.toString();
              } else if (col.title == that.ats_sixth_column_title) {
                that.ats_sixth_column_id = c.toString();
              } else if (col.title == that.ats_seventh_column_title) {
                that.ats_seventh_column_id = c.toString();
              } else if (col.title == that.ats_eighth_column_title) {
                that.ats_eighth_column_id = c.toString();
              } else if (col.title == that.ats_ninth_column_title) {
                that.ats_ninth_column_id = c.toString();
              } else if (col.title == that.ats_tenth_column_title) {
                that.ats_tenth_column_id = c.toString();
              }
              c++;
            }
          });
        });
      }
    });
    that.clearAllSearches();
    console.log('selectionsssssssssssssssssssss: ' + that.selections);
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
              JSON.stringify(rowData[i].amount, null, 4)
            );
            data_2_id.push(rowData[i].id);
            // data_2_id.push(rowData[i].id)
          }
          console.log(this.selections)
          if(this.selections > 0){
          if (data_1_amount_sum != data_2_amount_sum) {
            Swal.fire({
              title: 'Amount Difference: ',
              text: 'It seems there is an amount difference between the selected transactions. Do you want to match them as Partial?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#0acf97',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Partial match',
            }).then((result) => {
              if (result.isConfirmed) {
                console.log('partial match');
                // const sw = Swal.fire({
                //   title: 'Please wait !',
                //   allowOutsideClick: false,
                //   // timer: 4000,
                //   showConfirmButton: false,
                //   showCancelButton: false,
                //   showCloseButton: false,
                //   showDenyButton: false,
                //   didOpen: () => {
                //     Swal.showLoading(Swal.getDenyButton()!);
                //   },

                // this.datatableElement.dtInstance.then(
                //   (dtInstance: DataTables.Api) => {
                //     dtInstance.ajax.reload((data) => {
                //       // alert(data);
                //       Swal.hideLoading();
                //       Swal.close();
                //       Swal.fire({
                //         icon: 'success',
                //         title: 'Success',
                //         text: 'User deleted successfully!',
                //       });
                //     }, false);
                //   }
                // );
              } else {
                console.log('canceled');
              }
            });
          }
          //  else {
          //   console.log(data_1_id);
          //   console.log(data_2_id);
          //   this.reconcileService
          //     .matchTransactions(data_1_id.toString(), data_2_id.toString())
          //     .subscribe(
          //       (data: any) => {
          //         if (data == true) {
          //           this.showMatchSuccess();
          //           this.dtElements.forEach(
          //             (dtElement: DataTableDirective, index: number) => {
          //               console.log('index: ' + index);
          //               if (index == 0) {
          //                 dtElement.dtInstance.then(
          //                   (dtInstance: DataTables.Api) => {
          //                     dtInstance
          //                       .rows({ search: 'applied' })
          //                       .remove()
          //                       .draw();
          //                   }
          //                 );
          //                 this.clearAllSearches();
          //               }
          //               // else {
          //               //   // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //               //   //   dtInstance.rows({ search: 'applied' }).remove().draw();
          //               //   // });
          //               //   this.clearAllSearches();
          //               // }
          //             }
          //           );
          //           console.log('match success: ' + data);
          //         } else console.log('ret: ' + JSON.stringify(data, null, 5));
          //       },
          //       (error: any) => {
          //         console.log('ret: ' + JSON.stringify(error, null, 5));
          //       }
          //     );
          // }
        }
        else{
          this.showSelectionEmpty()
        }
        });
      }
    });
    // for(let i = 0; i<data_1.length; i++){
    //   data_1_amount_sum += Number(JSON.stringify(data_1[i].amount, null, 4))
    // }
    // for(let i = 0; i<data_2.length; i++){
    //   data_2_amount_sum += Number(JSON.stringify(data_2[i].amount, null, 4))
    // }
  }
  showMatchSuccess() {
    this.toast.success({ detail: 'SUCCESS', summary: 'Matched successfully!' });
  }
  showSelectionEmpty() {
    this.toast.error({ detail: 'ERROR', summary: 'Please select transaction to Match.' });
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
