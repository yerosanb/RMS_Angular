import { formatDate } from '@angular/common';
import {
  Component,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { NgToastService } from 'ng-angular-popup';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { ReconcileService } from 'src/app/User/services/reconcile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-partial-matched',
  templateUrl: './partial-matched.component.html',
  styleUrls: ['./partial-matched.component.css'],
})
export class PartialMatchedComponent implements OnInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;
  refresh_token_requested = false;
  initialDateValue = new Date();

  reload_checker: boolean = true;

  dtOptions_ats: any;
  dtOptions_core: any;
  //ats inits
  ats_first_column_title = '-ID-';
  ats_second_column_title = 'Reference';
  ats_third_column_title = 'Amount';
  ats_fourth_column_title = 'Value Date-type';
  // ats_fifth_column_title = 'Sender';
  // ats_sixth_column_title = 'Receiver';
  ats_seventh_column_title = 'Type';
  ats_eighth_column_title = 'Upload Date';
  ats_ninth_column_title = 'Additional Information';
  // ats_tenth_column_title = 'Action';

  ats_input_0!: any;
  ats_input_1!: any;
  ats_input_2!: any;
  ats_input_3!: any;
  // ats_input_4!: any;
  // ats_input_5!: any;
  ats_input_6!: any;
  ats_input_7!: any;
  ats_input_8!: any;

  ats_first_column_id = '0';
  ats_second_column_id = '1';
  ats_third_column_id = '2';
  ats_fourth_column_id = '3';
  // ats_fifth_column_id = '4';
  // ats_sixth_column_id = '5';
  ats_seventh_column_id = '6';
  ats_eighth_column_id = '7';
  ats_ninth_column_id = '8';
  ats_tenth_column_id = '8';

  // ats_tenth_column_id = '9';

  //core inits
  core_first_column_title = '-ID-';
  core_second_column_title = 'Add..-Info';
  core_third_column_title = 'Amount';
  core_fourth_column_title = 'Value Date';
  core_fifth_column_title = 'Upload Date';
  // core_sixth_column_title = 'Branch Code';
  core_seventh_column_title = 'Type';
  // core_eighth_column_title = 'Posting Date';
  // core_ninth_column_title = 'Transaction Reference';
  // core_tenth_column_title = 'Action';

  core_input_0!: any;
  core_input_1!: any;
  core_input_2!: any;
  core_input_3!: any;
  core_input_4!: any;
  // core_input_5!: any;
  core_input_6!: any;
  // core_input_7!: any;
  // core_input_8!: any;

  core_first_column_id = '0';
  core_second_column_id = '1';
  core_third_column_id = '2';
  core_fourth_column_id = '3';
  core_fifth_column_id = '4';
  // core_sixth_column_id = '5';
  core_seventh_column_id = '6';
  // core_eighth_column_id = '7';
  // core_ninth_column_id = '8';
  // core_tenth_column_id = '9';

  // dtElement!: DataTableDirective;
  // dtInstance!: Promise<DataTables.Api>;

  refAll: string = '';
  selections: number = 0;
  dt_ats_current_page: number = 0;

  is_os_filtered: boolean;
  ercaFiltered: boolean;
  b2b_filtered: boolean;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService,
    private reconcileService: ReconcileService,
    private toast: NgToastService
  ) {
    this.ercaFiltered = false;
    this.b2b_filtered = false;
    this.is_os_filtered = false;
  }

  someFilterFromAts(info: any): void {}

  onReconDateChange(value: Date): void {
    this.initialDateValue = new Date(value);
    this.localStorageService.store(
      'recon_current_date_rtgs_partially',
      this.initialDateValue
    );
    if (!this.reload_checker)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          // if (index == 0) {
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload((data) => {}, false);
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
      this.localStorageService.retrieve('recon_current_date_rtgs_partially') ==
      null
    ) {
      this.initialDateValue = new Date();
      this.localStorageService.store(
        'recon_current_date_rtgs_partially',
        this.initialDateValue
      );
    } else
      this.initialDateValue = new Date(
        this.localStorageService.retrieve('recon_current_date_rtgs_partially')
      );
    try {
      this.dtOptions_ats = {
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
          this.reconcileService.getAtsForReconPartial().subscribe(
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
                        this.reconcileService.getAtsForReconPartial().subscribe(
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
            title: this.ats_first_column_title,
            data: 'id',
          },
          {
            title: 'State',
            render: function (data: any, type: any, full: any) {
              console.log('request status: ' + full.request_status);
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button');
              if (full.match_status == 1)
                return '<span class="badge bg-danger">Old</span>';
              else return '<span class="badge bg-success">New</span>';
            },
          },
          {
            title: this.ats_second_column_title,
            data: 'reference',
          },
          {
            title: this.ats_third_column_title,
            data: 'amount',
          },
          {
            title: this.ats_fourth_column_title,
            data: 'value_date_type',
          },
          // {
          //   title: this.ats_fifth_column_title,
          //   data: 'sender',
          // },
          // {
          //   title: this.ats_sixth_column_title,
          //   data: 'receiver',
          // },
          {
            title: this.ats_seventh_column_title,
            data: 'dr_cr',
          },
          {
            title: this.ats_eighth_column_title,
            data: 'upload_date',
          },
          {
            title: this.ats_ninth_column_title,
            data: 'additional_information',
          },
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
              exportOptions:{
                format: {
                  body: function(data:any, row:any, column:any, node:any) {
                    if (column === 2) {
                      var regex = /^\d+$/;
                      if(regex.test(data) && data.length > 15){
                        return '\'' + data;
                      }
                    } 
                    return data;
                  }
                },
              }
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
        pageLength: 10,
        lengthMenu: [5, 10, 20, 50, 100, 200, 500],
        select: true,
        // ajax: '../../../../assets/data/data.json',
        ajax: (dataTablesParameters: any, callback: any) => {
          this.reconcileService.getCoreForReconPartial().subscribe(
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
                        this.reconcileService
                          .getCoreForReconPartial()
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
            title: 'State',
            render: function (data: any, type: any, full: any) {
              console.log('request status: ' + full.request_status);
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button');
              if (full.match_status == 1)
                return '<span class="badge bg-danger">Old</span>';
              else return '<span class="badge bg-success">New</span>';
            },
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
          // {
          //   title: this.core_sixth_column_title,
          //   data: 'branch_code',
          // },
          {
            title: this.core_seventh_column_title,
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
                if (col.title == that.ats_first_column_title) {
                  that.ats_first_column_id = c.toString();
                } else if (col.title == that.ats_second_column_title) {
                  that.ats_second_column_id = c.toString();
                } else if (col.title == that.ats_third_column_title) {
                  that.ats_third_column_id = c.toString();
                } else if (col.title == that.ats_fourth_column_title) {
                  that.ats_fourth_column_id = c.toString();
                  // } else if (col.title == that.ats_fifth_column_title) {
                  //   that.ats_fifth_column_id = c.toString();
                  // } else if (col.title == that.ats_sixth_column_title) {
                  //   that.ats_sixth_column_id = c.toString();
                } else if (col.title == that.ats_seventh_column_title) {
                  that.ats_seventh_column_id = c.toString();
                } else if (col.title == that.ats_eighth_column_title) {
                  that.ats_eighth_column_id = c.toString();
                } else if (col.title == that.ats_ninth_column_title) {
                  that.ats_ninth_column_id = c.toString();
                  // } else if (col.title == that.ats_tenth_column_title) {
                  //   that.ats_tenth_column_id = c.toString();
                }
                c++;
              }
            }
          );
          // dtInstance.on('column-reorder', function (e, settings, details) {
          //   var c = 0;
          //   for (let col of settings.aoColumns) {
          //     if (col.title == that.ats_first_column_title) {
          //       that.ats_first_column_id = c.toString();
          //     } else if (col.title == that.ats_second_column_title) {
          //       that.ats_second_column_id = c.toString();
          //     } else if (col.title == that.ats_third_column_title) {
          //       that.ats_third_column_id = c.toString();
          //     } else if (col.title == that.ats_fourth_column_title) {
          //       that.ats_fourth_column_id = c.toString();
          //     // } else if (col.title == that.ats_fifth_column_title) {
          //     //   that.ats_fifth_column_id = c.toString();
          //     // } else if (col.title == that.ats_sixth_column_title) {
          //     //   that.ats_sixth_column_id = c.toString();
          //     } else if (col.title == that.ats_seventh_column_title) {
          //       that.ats_seventh_column_id = c.toString();
          //     } else if (col.title == that.ats_eighth_column_title) {
          //       that.ats_eighth_column_id = c.toString();
          //     } else if (col.title == that.ats_ninth_column_title) {
          //       that.ats_ninth_column_id = c.toString();
          //     // } else if (col.title == that.ats_tenth_column_title) {
          //     //   that.ats_tenth_column_id = c.toString();
          //     }
          //     c++;
          //   }
          // });
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
                  // } else if (col.title == that.core_sixth_column_title) {
                  //   that.core_sixth_column_id = c.toString();
                } else if (col.title == that.core_seventh_column_title) {
                  that.core_seventh_column_id = c.toString();
                  // } else if (col.title == that.core_eighth_column_title) {
                  //   that.core_eighth_column_id = c.toString();
                  // } else if (col.title == that.core_ninth_column_title) {
                  //   that.core_ninth_column_id = c.toString();
                  // } else if (col.title == that.core_tenth_column_title) {
                  //   that.core_tenth_column_id = c.toString();
                }
                c++;
              }
            }
          );
        });
      }
    });
    that.clearAllSearches();
    console.log('selectionsssssssssssssssssssss: ' + that.selections);
  }
  addSelectEvent(that: any, dtInstance: any, dt: any, indexes: any) {
    // that.dt_ats_current_page = dt.page();
    // var rowData = dtInstance.rows(indexes).data().toArray();
    // if (
    //   rowData[0].value_date_type != null &&
    //   rowData[0].value_date_type.toLowerCase().endsWith('202')
    // ) {
    //   that.refAll = rowData[0].reference;
    //   that.ats_input_1 = that.refAll;
    //   var ats_dt_instance: DataTables.Api;
    //   if (!this.b2b_filtered)
    //     that.dtElements.forEach(
    //       (dtElement: DataTableDirective, index: number) => {
    //         this.b2b_filtered = true;
    //         if (index == 0) {
    //           that.selections++;
    //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //             ats_dt_instance = dtInstance;
    //           });
    //           console.log('to search: ' + that.refAll);
    //         } else {
    //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //             var intVal = function (i: any) {
    //               return typeof i === 'string'
    //                 ? Number(i.replace(/[\$,]/g, '')) * 1
    //                 : typeof i === 'number'
    //                 ? i
    //                 : 0;
    //             };
    //             var core_b2b_data_amount = dtInstance
    //               .column(2)
    //               .search(
    //                 that.refAll
    //                   .split(' ')[0]
    //                   .replace('"', '')
    //                   .substring(1, that.refAll.length)
    //               )
    //               .column(3, { search: 'applied' })
    //               .data();
    //             if (
    //               (core_b2b_data_amount.length > 0
    //                 ? core_b2b_data_amount.reduce(function (a, b) {
    //                     return intVal(a) + intVal(b);
    //                   })
    //                 : 0) == 50
    //             ) {
    //               var ats_rows = ats_dt_instance.rows().data().toArray();
    //               console.log('ats_rows.length: ' + ats_rows.length)
    //               console.log('ref to search: ' + that.refAll)
    //               console.log('ref to search: ' +                             that.refAll
    //               .split(' ')[0]
    //               .replace('"', '')
    //               .substring(1, that.refAll.length))
    //               var ch = false;
    //               for (let c = 0; c < ats_rows.length; c++) {
    //                 ch = true;
    //                 if (
    //                   ats_dt_instance
    //                     .column(2)
    //                     .search(
    //                       that.refAll
    //                         // .split(' ')[0]
    //                         // .replace('"', '')
    //                         // .substring(1, that.refAll.length)
    //                     )
    //                     .column(7, { search: 'applied' })
    //                     .data()
    //                     .toArray()[0]
    //                     .includes(ats_rows[c].reference)
    //                 ) {
    //                   console.log('the here')
    //                   ats_dt_instance
    //                     .column(2)
    //                     .search(
    //                       that.refAll+
    //                         '|' +
    //                         ats_rows[c].reference,
    //                       true,
    //                       false
    //                     )
    //                     .draw();
    //                   break;
    //                 }
    //               }
    //               if(ch){
    //                 ats_dt_instance
    //                     .column(2)
    //                     .search(
    //                       that.refAll,
    //                       true,
    //                       false
    //                     )
    //                     .draw();
    //               }
    //             } else {
    //               ats_dt_instance
    //                 .column(2)
    //                 .search(
    //                   that.refAll
    //                     .split(' ')[0]
    //                     .replace('"', '')
    //                     .substring(1, that.refAll.length)
    //                 )
    //                 .draw();
    //             }
    //             dtInstance
    //               .column(2)
    //               .search(
    //                 that.refAll
    //                   .split(' ')[0]
    //                   .replace('"', '')
    //                   .substring(1, that.refAll.length)
    //               )
    //               .draw();
    //           });
    //         }
    //       }
    //     );
    // }
    // // else if (
    // //   rowData[0].value_date_type != null &&
    // //   rowData[0].value_date_type.toLowerCase().includes('298smt') &&
    // //   rowData[0].additional_information != null &&
    // //   rowData[0].additional_information.toLowerCase().includes('sid')
    // // ) {
    // //   var date: string;
    // //   if (!this.is_os_filtered)
    // //     that.dtElements.forEach(
    // //       (dtElement: DataTableDirective, index: number) => {
    // //         if (index == 0) {
    // //           that.selections++;
    // //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // //             dtInstance
    // //               .column(3)
    // //               .search('298smt')
    // //               .column(8)
    // //               .search('sid')
    // //               .draw();
    // //             var rowData = dtInstance
    // //               .rows({ search: 'applied' })
    // //               .data()
    // //               .toArray();
    // //             for (let i = 0; i < rowData.length; i++) {
    // //               console.log('amount: ' + rowData[i].amount);
    // //               // this.totalAmount += rowData[i].amount;
    // //               this.is_os_Amounts.push(rowData[i].amount);
    // //             }
    // //             if (rowData[0] != null) date = rowData[0].value_date_type;
    // //           });
    // //         } else {
    // //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // //             var intVal = function (i: any) {
    // //               return typeof i === 'string'
    // //                 ? Number(i.replace(/[\$,]/g, '')) * 1
    // //                 : typeof i === 'number'
    // //                 ? i
    // //                 : 0;
    // //             };
    // //             // this.sKey2_is = 'is';
    // //             // this.sKey2_os = 'os';
    // //             // this.empty_provider = '';
    // //             this.date_is = new Date(
    // //               date.substring(0, 4) +
    // //                 '/' +
    // //                 date.substring(4, 6) +
    // //                 '/' +
    // //                 date.substring(6, 8)
    // //             );
    // //             this.date_os.setDate(this.date_is.getDate() + 1);
    // //             var total_is_data = dtInstance
    // //               .column(1)
    // //               .search('^is', true, false)
    // //               .column(3)
    // //               .search(
    // //                 this.date_is.getFullYear().toString() +
    // //                   ((this.date_is.getMonth() + 1).toString().length == 1
    // //                     ? '0' + (this.date_is.getMonth() + 1)
    // //                     : this.date_is.getMonth() + 1) +
    // //                   (this.date_is.getDate().toString().length == 1
    // //                     ? '0' + this.date_is.getDate().toString()
    // //                     : this.date_is.getDate().toString())
    // //               )
    // //               .column(2, { search: 'applied' })
    // //               .data();
    // //             // if(total_is_data)
    // //             var total_is =
    // //               total_is_data.length > 0
    // //                 ? total_is_data.reduce(function (a, b) {
    // //                     return intVal(a) + intVal(b);
    // //                   })
    // //                 : 0;
    // //             var total_os_data = dtInstance
    // //               .column(1)
    // //               .search('^os', true, false)
    // //               .column(3)
    // //               .search(
    // //                 this.date_os.getFullYear().toString() +
    // //                   ((this.date_os.getMonth() + 1).toString().length == 1
    // //                     ? '0' + (this.date_os.getMonth() + 1)
    // //                     : this.date_os.getMonth() + 1) +
    // //                   (this.date_os.getDate().toString().length == 1
    // //                     ? '0' + this.date_os.getDate().toString()
    // //                     : this.date_os.getDate().toString())
    // //               )
    // //               .column(2, { search: 'applied' })
    // //               .data();
    // //             var total_os =
    // //               total_os_data.length > 0
    // //                 ? total_os_data.reduce(function (a, b) {
    // //                     return intVal(a) + intVal(b);
    // //                   })
    // //                 : 0;
    // //             // \\\\\\\\\\\\\\\\\\\\\\\\\\\\
    // //             // var total = dtInstance.column(1).search('^os', true, false)
    // //             //   .column(2, { search: 'applied' })
    // //             //   .data()
    // //             //   .reduce(function (a, b) {
    // //             //     return intVal(a) + intVal(b);
    // //             //   });
    // //             var rowData11 = dtInstance
    // //               .rows({ search: 'applied' })
    // //               .data()
    // //               .toArray();
    // //             this.is_os_diff_amount = Math.abs(total_is - total_os);
    // //             this.totalAmount =
    // //               this.is_os_Amounts.length > 0
    // //                 ? this.is_os_Amounts.reduce(function (a, b) {
    // //                     return intVal(a) + intVal(b);
    // //                   })
    // //                 : 0;
    // //             var a = this.totalAmount;
    // //             console.log('length: ' + rowData11.length);
    // //             console.log('total_is_data.length: ' + total_is_data.length);
    // //             console.log('total_os_data.length: ' + total_os_data.length);
    // //             console.log('amount_is sum: ' + total_is.toFixed(2));
    // //             console.log('amount_os sum: ' + total_os.toFixed(2));
    // //             console.log('amount ats: ' + a);
    // //             console.log('amount diff: ' + this.is_os_diff_amount);
    // //             this.is_os_diff_amount == a
    // //               ? console.log('true')
    // //               : console.log('false');
    // //             this.sKey2_is = 'is';
    // //             this.sKey2_os = 'os';
    // //             this.empty_provider = this.empty_provider_string;
    // //             dtInstance
    // //               .column(1)
    // //               .search('')
    // //               .column(2)
    // //               .search('')
    // //               .column(3)
    // //               .search('')
    // //               .draw();
    // //             this.is_os_filtered = true;
    // //             this.sKey2_is = '';
    // //             this.sKey2_os = '';
    // //             this.empty_provider = '';
    // //             // =====================================================================================
    // //             // console.log(
    // //             //   'the new date: ' +
    // //             //     'erca ' +
    // //             //     (d.getDate().toString().length == 1
    // //             //       ? '0' + d.getDate().toString()
    // //             //       : d.getDate().toString()) +
    // //             //     '.' +
    // //             //     (d.getMonth().toString().length == 1
    // //             //       ? '0' + d.getMonth()
    // //             //       : d.getMonth()) +
    // //             //     '.' +
    // //             //     d.getFullYear()
    // //             // );
    // //           });
    // //         }
    // //       }
    // //     );
    // //   // }
    // // } else if (
    // //   rowData[0].value_date_type != null &&
    // //   rowData[0].value_date_type.endsWith('204') &&
    // //   rowData[0].additional_information != null &&
    // //   rowData[0].additional_information.toLowerCase().includes('.') &&
    // //   rowData[0].additional_information.toLowerCase().includes('value') &&
    // //   rowData[0].additional_information.toLowerCase().includes('erca')
    // // ) {
    // //   if (!this.ercaFiltered) {
    // //     this.ercaFiltered = true;
    // //     that.refAll = rowData[0].reference;
    // //     that.ats_input_1 = that.refAll;
    // //     that.dtElements.forEach(
    // //       (dtElement: DataTableDirective, index: number) => {
    // //         if (index == 0) {
    // //           that.selections++;
    // //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // //             dtInstance
    // //               .column(3)
    // //               .search('204')
    // //               .column(6)
    // //               .search('. value erca')
    // //               .draw();
    // //             var rowData = dtInstance
    // //               .rows({ search: 'applied' })
    // //               .data()
    // //               .toArray();
    // //             for (let i = 0; i < rowData.length; i++) {
    // //               console.log('amount: ' + rowData[i].amount);
    // //               this.totalAmount += rowData[i].amount;
    // //             }
    // //             console.log('total amount: ' + this.totalAmount);
    // //           });
    // //         } else {
    // //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // //             dtInstance
    // //               .column(1)
    // //               .search('erca')
    // //               .column(2)
    // //               .search('' + this.totalAmount)
    // //               .draw();
    // //           });
    // //         }
    // //       }
    // //     );
    // //   } else {
    // //     console.log('already filtered: ' + this.ercaFiltered);
    // //   }
    // // }
    // else {
    //   console.log(this.b2b_filtered);
    //   console.log('it is in else');
    //   that.refAll = rowData[0].reference;
    //   that.ats_input_1 = that.refAll;
    //   if (!this.b2b_filtered)
    //     that.dtElements.forEach(
    //       (dtElement: DataTableDirective, index: number) => {
    //         // console.log('index: ' + index);
    //         if (index == 0) {
    //           // console.log(info.reference);
    //           // that.refAll = rowData[0].reference
    //           that.selections++;
    //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //             dtInstance
    //               .column(2)
    //               .search(
    //                 that.refAll
    //                   .split(' ')[0]
    //                   .replace('"', '')
    //                   .substring(1, that.refAll.length)
    //               )
    //               .draw();
    //           });
    //           console.log('to search: ' + that.refAll);
    //           // console.log('selectionsssssssssssssssst: ' + that.selections);
    //         } else {
    //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //             dtInstance
    //               .column(2)
    //               .search(
    //                 that.refAll
    //                   .split(' ')[0]
    //                   .replace('"', '')
    //                   .substring(1, that.refAll.length)
    //               )
    //               .draw();
    //           });
    //         }
    //       }
    //     );
    // }

    // if (that.restricted) {
    that.dt_ats_current_page = dt.page();
    var rowData = dtInstance.rows(indexes).data().toArray();
    if (
      rowData[0].value_date_type != null &&
      rowData[0].value_date_type.toLowerCase().endsWith('202')
    ) {
      that.refAll = rowData[0].reference;
      that.ats_input_1 = that.refAll;
      var ats_dt_instance: DataTables.Api;
      if (!this.b2b_filtered)
        that.dtElements.forEach(
          (dtElement: DataTableDirective, index: number) => {
            this.b2b_filtered = true;
            if (index == 0) {
              that.selections++;
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                ats_dt_instance = dtInstance;
              });
              console.log('to search: ' + that.refAll);
            } else {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                var intVal = function (i: any) {
                  return typeof i === 'string'
                    ? Number(i.replace(/[\$,]/g, '')) * 1
                    : typeof i === 'number'
                    ? i
                    : 0;
                };
                var core_b2b_data_amount = dtInstance
                  .column(2)
                  .search(that.refAll)
                  .column(3, { search: 'applied' })
                  .data();
                if (
                  (core_b2b_data_amount.length > 0
                    ? core_b2b_data_amount.reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                      })
                    : 0) == 50
                ) {
                  var ch = true;
                  var ats_rows = ats_dt_instance.rows().data().toArray();

                  console.log('ats rows length: ' + ats_rows.length);
                  for (let c = 0; c < ats_rows.length; c++) {
                    if (
                      ats_dt_instance
                        .column(2)
                        .search(that.refAll)
                        .column(7, { search: 'applied' })
                        .data()
                        .toArray()[0]
                        .includes(ats_rows[c].reference)
                    ) {
                      console.log('innn');
                      ch = false;
                      ats_dt_instance
                        .column(2)
                        .search(
                          that.refAll
                            .split(' ')[0]
                            .replace('"', '')
                            .substring(1, that.refAll.length) +
                            '|' +
                            ats_rows[c].reference,
                          true,
                          false
                        )
                        .draw();
                      break;
                    }
                  }
                  if (ch) {
                    ats_dt_instance
                      .column(2)
                      .search(that.refAll, true, false)
                      .draw();
                  }
                } else {
                  ats_dt_instance

                    .column(2)
                    .search(
                      that.refAll
                        .split(' ')[0]
                        .replace('"', '')
                        .substring(1, that.refAll.length)
                    )
                    .draw();
                }
                dtInstance
                  .column(2)
                  .search(
                    that.refAll
                      .split(' ')[0]
                      .replace('"', '')
                      .substring(1, that.refAll.length)
                  )
                  .draw();
              });
            }
          }
        );
      // } else if (
      //   rowData[0].value_date_type != null &&
      //   rowData[0].value_date_type.toLowerCase().includes('298smt') &&
      //   rowData[0].additional_information != null &&
      //   rowData[0].additional_information.toLowerCase().includes('sid')
      // ) {
      //   var date: string;
      //   if (!this.is_os_filtered)
      //     that.dtElements.forEach(
      //       (dtElement: DataTableDirective, index: number) => {
      //         if (index == 0) {
      //           that.selections++;
      //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //             dtInstance
      //               .column(3)
      //               .search('298smt')
      //               .column(8)
      //               .search('sid')
      //               .draw();
      //             var rowData = dtInstance
      //               .rows({ search: 'applied' })
      //               .data()
      //               .toArray();

      //             for (let i = 0; i < rowData.length; i++) {
      //               console.log('amount: ' + rowData[i].amount);
      //               // this.totalAmount += rowData[i].amount;
      //               this.is_os_Amounts.push(rowData[i].amount);
      //             }
      //             if (rowData[0] != null) date = rowData[0].value_date_type;
      //           });
      //         } else {
      //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //             var intVal = function (i: any) {
      //               return typeof i === 'string'
      //                 ? Number(i.replace(/[\$,]/g, '')) * 1
      //                 : typeof i === 'number'
      //                 ? i
      //                 : 0;
      //             };

      //             // this.sKey2_is = 'is';
      //             // this.sKey2_os = 'os';
      //             // this.empty_provider = '';
      //             this.date_is = new Date(
      //               date.substring(0, 4) +
      //                 '/' +
      //                 date.substring(4, 6) +
      //                 '/' +
      //                 date.substring(6, 8)
      //             );
      //             this.date_os.setDate(this.date_is.getDate() + 1);

      //             var total_is_data = dtInstance
      //               .column(1)
      //               .search('^is', true, false)
      //               .column(3)
      //               .search(
      //                 this.date_is.getFullYear().toString() +
      //                   ((this.date_is.getMonth() + 1).toString().length == 1
      //                     ? '0' + (this.date_is.getMonth() + 1)
      //                     : this.date_is.getMonth() + 1) +
      //                   (this.date_is.getDate().toString().length == 1
      //                     ? '0' + this.date_is.getDate().toString()
      //                     : this.date_is.getDate().toString())
      //               )
      //               .column(2, { search: 'applied' })
      //               .data();
      //             // if(total_is_data)
      //             var total_is =
      //               total_is_data.length > 0
      //                 ? total_is_data.reduce(function (a, b) {
      //                     return intVal(a) + intVal(b);
      //                   })
      //                 : 0;
      //             var total_os_data = dtInstance
      //               .column(1)
      //               .search('^os', true, false)
      //               .column(3)
      //               .search(
      //                 this.date_os.getFullYear().toString() +
      //                   ((this.date_os.getMonth() + 1).toString().length == 1
      //                     ? '0' + (this.date_os.getMonth() + 1)
      //                     : this.date_os.getMonth() + 1) +
      //                   (this.date_os.getDate().toString().length == 1
      //                     ? '0' + this.date_os.getDate().toString()
      //                     : this.date_os.getDate().toString())
      //               )
      //               .column(2, { search: 'applied' })
      //               .data();
      //             var total_os =
      //               total_os_data.length > 0
      //                 ? total_os_data.reduce(function (a, b) {
      //                     return intVal(a) + intVal(b);
      //                   })
      //                 : 0;
      //             // \\\\\\\\\\\\\\\\\\\\\\\\\\\\
      //             // var total = dtInstance.column(1).search('^os', true, false)
      //             //   .column(2, { search: 'applied' })
      //             //   .data()
      //             //   .reduce(function (a, b) {
      //             //     return intVal(a) + intVal(b);
      //             //   });

      //             var rowData11 = dtInstance
      //               .rows({ search: 'applied' })
      //               .data()
      //               .toArray();
      //             this.is_os_diff_amount = Math.abs(total_is - total_os);

      //             this.totalAmount =
      //               this.is_os_Amounts.length > 0
      //                 ? this.is_os_Amounts.reduce(function (a, b) {
      //                     return intVal(a) + intVal(b);
      //                   })
      //                 : 0;
      //             var a = this.totalAmount;

      //             console.log('length: ' + rowData11.length);
      //             console.log('total_is_data.length: ' + total_is_data.length);
      //             console.log('total_os_data.length: ' + total_os_data.length);
      //             console.log('amount_is sum: ' + total_is.toFixed(2));
      //             console.log('amount_os sum: ' + total_os.toFixed(2));
      //             console.log('amount ats: ' + a);
      //             console.log('amount diff: ' + this.is_os_diff_amount);
      //             this.is_os_diff_amount == a
      //               ? console.log('true')
      //               : console.log('false');

      //             this.sKey2_is = 'is';
      //             this.sKey2_os = 'os';
      //             this.empty_provider = this.empty_provider_string;
      //             dtInstance
      //               .column(1)
      //               .search('')
      //               .column(2)
      //               .search('')
      //               .column(3)
      //               .search('')
      //               .draw();
      //             this.is_os_filtered = true;
      //             this.sKey2_is = '';
      //             this.sKey2_os = '';
      //             this.empty_provider = '';
      //             // =====================================================================================
      //             // console.log(
      //             //   'the new date: ' +
      //             //     'erca ' +
      //             //     (d.getDate().toString().length == 1
      //             //       ? '0' + d.getDate().toString()
      //             //       : d.getDate().toString()) +
      //             //     '.' +
      //             //     (d.getMonth().toString().length == 1
      //             //       ? '0' + d.getMonth()
      //             //       : d.getMonth()) +
      //             //     '.' +
      //             //     d.getFullYear()
      //             // );
      //           });
      //         }
      //       }
      //     );
      //   // }
      // }
      // else if (
      //   rowData[0].value_date_type != null &&
      //   rowData[0].value_date_type.endsWith('204') &&
      //   rowData[0].additional_information != null &&
      //   rowData[0].additional_information.toLowerCase().includes('.') &&
      //   rowData[0].additional_information.toLowerCase().includes('value') &&
      //   rowData[0].additional_information.toLowerCase().includes('erca')
      // ) {
      //   if (!this.ercaFiltered) {
      //     this.ercaFiltered = true;
      //     that.refAll = rowData[0].reference;
      //     that.ats_input_1 = that.refAll;
      //     that.dtElements.forEach(
      //       (dtElement: DataTableDirective, index: number) => {
      //         if (index == 0) {
      //           that.selections++;
      //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //             dtInstance
      //               .column(3)
      //               .search('204')
      //               .column(6)
      //               .search('. value erca')
      //               .draw();
      //             var rowData = dtInstance
      //               .rows({ search: 'applied' })
      //               .data()
      //               .toArray();
      //             for (let i = 0; i < rowData.length; i++) {
      //               console.log('amount: ' + rowData[i].amount);
      //               this.totalAmount += rowData[i].amount;
      //             }
      //             console.log('total amount: ' + this.totalAmount);
      //           });
      //         } else {
      //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //             dtInstance
      //               .column(1)
      //               .search('erca')
      //               .column(2)
      //               .search('' + this.totalAmount)
      //               .draw();
      //           });
      //         }
      //       }
      //     );
      //   } else {
      //     console.log('already filtered: ' + this.ercaFiltered);
      //   }
    } else {
      console.log(this.b2b_filtered);
      console.log('it is in else');
      that.refAll = rowData[0].reference;
      that.ats_input_1 = that.refAll;
      if (!this.b2b_filtered)
        that.dtElements.forEach(
          (dtElement: DataTableDirective, index: number) => {
            // console.log('index: ' + index);
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
                      .substring(1, that.refAll.length)
                  )
                  .draw();
              });
              console.log('to search: ' + that.refAll);
              // console.log('selectionsssssssssssssssst: ' + that.selections);
            } else {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // dtInstance;
                dtInstance
                  .column(1)
                  .search(
                    that.refAll
                      .split(' ')[0]
                      .replace('"', '')
                      .substring(1, that.refAll.length)
                  )
                  .draw();
              });
              console.log('searched...');
            }
          }
        );
    }
    // }
  }
  clearAllSearches() {
    // this.dtElements.forEach(
    //   (dtElement: DataTableDirective, index: number) => {
    //       dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //         dtInstance.search('').draw()
    //       });

    //   }
    // );
    this.is_os_filtered = false;
    this.ercaFiltered = false;
    this.b2b_filtered = false;
    // this.totalAmount = 0;
    // this.is_os_Amounts = [];
    if (this.dtElements != null && this.dtElements.length > 0)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          // this.totalAmount = 0;
          // this.type_ats = 'unknown';
          // this.type_core = 'unknown';
          // this.sKey1 = '';
          // this.sKey2_is = '';
          // this.sKey2_os = '';
          // this.empty_provider = '';
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
                .column(7)
                .search('')
                .column(8)
                .search('')
                .draw();
            });
          }
        }
      );
  }
  // matchTransactions() {
  //   var data_1_id: any[] = [];
  //   var data_2_id: any[] = [];
  //   var data_1_amount_sum: number = 0;
  //   var data_2_amount_sum: number = 0;
  //   this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
  //     if (index == 0) {
  //       dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //         var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
  //         for (let i = 0; i < rowData.length; i++) {
  //           // data_1.push(rowData[i])
  //           // console.log(JSON.stringify(rowData[i], null, 4))
  //           // console.log('amount: ' + JSON.stringify(rowData[i].amount, null, 4))
  //           data_1_amount_sum += Number(
  //             JSON.stringify(rowData[i].amount, null, 4)
  //           );
  //           data_1_id.push(rowData[i].id);
  //           // data_1_id.push(rowData[i].id)
  //           // data_1_id.push(rowData[i].id)
  //           // data_1_id.push(rowData[i].id)
  //         }
  //       });
  //     } else {
  //       dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //         var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
  //         for (let i = 0; i < rowData.length; i++) {
  //           // data_2.push(rowData[i])
  //           data_2_amount_sum += Number(
  //             JSON.stringify(rowData[i].amount, null, 4)
  //           );
  //           data_2_id.push(rowData[i].id);
  //           // data_2_id.push(rowData[i].id)
  //         }
  //         console.log(this.selections);
  //         if (this.selections > 0) {
  //           console.log(
  //             'amounts:::::::::::::::::::::::::::::::::: ' + data_1_amount_sum
  //           );
  //           console.log(
  //             'amounts:::::::::::::::::::::::::::::::::: ' + data_2_amount_sum
  //           );
  //           if (data_1_amount_sum != data_2_amount_sum) {
  //             Swal.fire({
  //               title: 'Amount Difference: ',
  //               text: 'It seems there is an amount difference between the selected transactions.',
  //               icon: 'warning',
  //               showCancelButton: false,
  //               confirmButtonColor: '#0acf97',
  //               cancelButtonColor: '#3085d6',
  //               confirmButtonText: 'Ok',
  //             }).then((result) => {
  //               if (result.isConfirmed) {
  //                 console.log('partial match');
  //                 // const sw = Swal.fire({
  //                 //   title: 'Please wait !',
  //                 //   allowOutsideClick: false,
  //                 //   // timer: 4000,
  //                 //   showConfirmButton: false,
  //                 //   showCancelButton: false,
  //                 //   showCloseButton: false,
  //                 //   showDenyButton: false,
  //                 //   didOpen: () => {
  //                 //     Swal.showLoading(Swal.getDenyButton()!);
  //                 //   },

  //                 // this.datatableElement.dtInstance.then(
  //                 //   (dtInstance: DataTables.Api) => {
  //                 //     dtInstance.ajax.reload((data) => {
  //                 //       // alert(data);
  //                 //       Swal.hideLoading();
  //                 //       Swal.close();
  //                 //       Swal.fire({
  //                 //         icon: 'success',
  //                 //         title: 'Success',
  //                 //         text: 'User deleted successfully!',
  //                 //       });
  //                 //     }, false);
  //                 //   }
  //                 // );
  //               } else {
  //                 console.log('canceled');
  //               }
  //             });
  //           } else {
  //             console.log(data_1_id);
  //             console.log(data_2_id);
  //             this.reconcileService
  //               .matchTransactions(data_1_id.toString(), data_2_id.toString())
  //               .subscribe(
  //                 (data: any) => {
  //                   if (data == true) {
  //                     this.showMatchSuccess();
  //                     this.dtElements.forEach(
  //                       (dtElement: DataTableDirective, index: number) => {
  //                         console.log('index: ' + index);
  //                         if (index == 0) {
  //                           dtElement.dtInstance.then(
  //                             (dtInstance: DataTables.Api) => {
  //                               dtInstance
  //                                 .rows({ search: 'applied' })
  //                                 .remove()
  //                                 .draw();
  //                             }
  //                           );
  //                         } else if (index == 1) {
  //                           dtElement.dtInstance.then(
  //                             (dtInstance: DataTables.Api) => {
  //                               dtInstance
  //                                 .rows({ search: 'applied' })
  //                                 .remove()
  //                                 .draw();
  //                             }
  //                           );
  //                           this.clearAllSearches();
  //                         }
  //                         // else {
  //                         //   // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //                         //   //   dtInstance.rows({ search: 'applied' }).remove().draw();
  //                         //   // });
  //                         //   this.clearAllSearches();
  //                         // }
  //                       }
  //                     );
  //                     console.log('match success: ' + data);
  //                   } else console.log('ret: ' + JSON.stringify(data, null, 5));
  //                 },
  //                 (error: any) => {
  //                   console.log('ret: ' + JSON.stringify(error, null, 5));
  //                 }
  //               );
  //           }
  //         } else {
  //           this.showSelectionEmpty();
  //         }
  //       });
  //     }
  //   });
  // }
  // matchAllTransactions() {
  //   var data_1_id: any[] = [];
  //   var data_2_id: any[] = [];
  //   var data_1_amount_sum: number = 0;
  //   var data_2_amount_sum: number = 0;
  //   this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
  //     if (index == 0) {
  //       dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //         var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
  //         for (let i = 0; i < rowData.length; i++) {
  //           // data_1.push(rowData[i])
  //           // console.log(JSON.stringify(rowData[i], null, 4))
  //           // console.log('amount: ' + JSON.stringify(rowData[i].amount, null, 4))
  //           data_1_amount_sum += Number(
  //             JSON.stringify(rowData[i].amount, null, 4)
  //           );
  //           data_1_id.push(rowData[i].id);
  //           // data_1_id.push(rowData[i].id)
  //           // data_1_id.push(rowData[i].id)
  //           // data_1_id.push(rowData[i].id)
  //         }
  //       });
  //     } else {
  //       dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //         var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
  //         for (let i = 0; i < rowData.length; i++) {
  //           // data_2.push(rowData[i])
  //           data_2_amount_sum += Number(
  //             JSON.stringify(rowData[i].amount, null, 4)
  //           );
  //           data_2_id.push(rowData[i].id);
  //           // data_2_id.push(rowData[i].id)
  //         }
  //         console.log(this.selections);
  //         if (this.selections <= 0) {
  //           // if (data_1_amount_sum != data_2_amount_sum) {
  //           //   Swal.fire({
  //           //     title: 'Amount Difference: ',
  //           //     text: 'It seems there is an amount difference between the selected transactions. Do you want to match them as Partial?',
  //           //     icon: 'warning',
  //           //     showCancelButton: true,
  //           //     confirmButtonColor: '#0acf97',
  //           //     cancelButtonColor: '#3085d6',
  //           //     confirmButtonText: 'Partial match',
  //           //   }).then((result) => {
  //           //     if (result.isConfirmed) {
  //           //       console.log('partial match');
  //           //       // const sw = Swal.fire({
  //           //       //   title: 'Please wait !',
  //           //       //   allowOutsideClick: false,
  //           //       //   // timer: 4000,
  //           //       //   showConfirmButton: false,
  //           //       //   showCancelButton: false,
  //           //       //   showCloseButton: false,
  //           //       //   showDenyButton: false,
  //           //       //   didOpen: () => {
  //           //       //     Swal.showLoading(Swal.getDenyButton()!);
  //           //       //   },

  //           //       // this.datatableElement.dtInstance.then(
  //           //       //   (dtInstance: DataTables.Api) => {
  //           //       //     dtInstance.ajax.reload((data) => {
  //           //       //       // alert(data);
  //           //       //       Swal.hideLoading();
  //           //       //       Swal.close();
  //           //       //       Swal.fire({
  //           //       //         icon: 'success',
  //           //       //         title: 'Success',
  //           //       //         text: 'User deleted successfully!',
  //           //       //       });
  //           //       //     }, false);
  //           //       //   }
  //           //       // );
  //           //     } else {
  //           //       console.log('canceled');
  //           //     }
  //           //   });
  //           // } else {
  //           console.log(data_1_id);
  //           console.log(data_2_id);
  //           this.reconcileService
  //             .matchAllTransactions(
  //               data_1_id.toString(),
  //               data_2_id.toString(),
  //               formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US')
  //             )
  //             .subscribe(
  //               (data: any) => {
  //                 if (data == true) {
  //                   this.showMatchSuccess();
  //                   this.dtElements.forEach(
  //                     (dtElement: DataTableDirective, index: number) => {
  //                       console.log('index: ' + index);
  //                       if (index == 0) {
  //                         dtElement.dtInstance.then(
  //                           (dtInstance: DataTables.Api) => {
  //                             dtInstance
  //                               .rows({ search: 'applied' })
  //                               .remove()
  //                               .draw();
  //                           }
  //                         );
  //                         this.clearAllSearches();
  //                       }
  //                       // else {
  //                       //   // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //                       //   //   dtInstance.rows({ search: 'applied' }).remove().draw();
  //                       //   // });
  //                       //   this.clearAllSearches();
  //                       // }
  //                     }
  //                   );
  //                   console.log('match success: ' + data);
  //                 } else console.log('ret: ' + JSON.stringify(data, null, 5));
  //               },
  //               (error: any) => {
  //                 console.log('ret: ' + JSON.stringify(error, null, 5));
  //               }
  //             );
  //           // }
  //         } else {
  //           this.showClearSelection();
  //         }
  //       });
  //     }
  //   });
  // }
  matchTransactions() {
    console.log('match transaction');
    var data_1_id: any[] = [];
    var data_1_type: any[] = [];
    var data_2_id: any[] = [];
    var data_2_id: any[] = [];
    var ammount_difference: any;
    var description: any;
    var data_1_amount_sum: number = 0;
    var data_1_amount_b2b: number = 0;
    var data_2_amount_sum: number = 0;

    var data_1_reference: String = '';
    var data_2_additional_data: String = '';

    var rowData1: any[] = [];
    // var data_2_amount_sum: number = 0;
    var date: string;
    // if (this.restricted) {
    var type_b2b = false;
    var b2b_old_ids_ats: any[] = [];
    var b2b_new_ids_ats: any[] = [];
    var b2b_old_ids_core: any[] = [];
    var b2b_new_ids_core: any[] = [];
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if (index == 0) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
          var rowData = dtInstance.rows({ selected: true }).data().toArray();
          if (rowData.length > 0) {
            rowData1 = rowData;
            date = rowData[0].value_date_type;
            for (let i = 0; i < rowData.length; i++) {
              data_1_amount_sum += Number(
                JSON.stringify(rowData[i].amount, null, 4)
              );
              if (
                rowData[i].value_date_type != null &&
                rowData[i].value_date_type.toLowerCase().endsWith('202')
              )
                data_1_amount_b2b += Number(
                  JSON.stringify(rowData[i].amount, null, 4)
                );
              else
                data_1_amount_b2b -= Number(
                  JSON.stringify(rowData[i].amount, null, 4)
                );
              if (
                rowData[i].match_status != null &&
                rowData[i].match_status == 1
              )
                b2b_old_ids_ats.push(rowData[i].id);
              else b2b_new_ids_ats.push(rowData[i].id);

              if (
                rowData[i].value_date_type != null &&
                rowData[i].value_date_type.toLowerCase().endsWith('202')
              ) {
                type_b2b = true;
              }
              data_1_id.push(rowData[i].id);
              data_1_type.push(rowData[i].value_date_type);
              if (i == 0) data_1_reference = rowData[i].reference;

              // if (this.type_ats == 'unknown' || this.type_ats == 'erca')
              // if (
              //   rowData[0].value_date_type != null &&
              //   rowData[0].value_date_type.endsWith('204') &&
              //   rowData[0].additional_information != null &&
              //   rowData[0].additional_information
              //     .toLowerCase()
              //     .includes('.') &&
              //   rowData[0].additional_information
              //     .toLowerCase()
              //     .includes('value') &&
              //   rowData[0].additional_information
              //     .toLowerCase()
              //     .includes('erca')
              // ) {
              //   console.log('erca-ats');
              //   this.type_ats = 'erca';
              // } else {
              //   this.type_ats = 'no';
              //   console.log('nooo-ats');
              // }
            }
          }
        });
      } else {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          var rowData = dtInstance.rows({ selected: true }).data().toArray();
          for (let i = 0; i < rowData.length; i++) {
            data_2_amount_sum += Number(
              JSON.stringify(rowData[i].amount, null, 4)
            );
            data_2_id.push(rowData[i].id);
            if (i == 0)
              data_2_additional_data = rowData[i].additional_information;
              if (
                rowData[i].match_status != null &&
                rowData[i].match_status == 1
              )
                b2b_old_ids_core.push(rowData[i].id);
              else b2b_new_ids_core.push(rowData[i].id);
          }
          if (data_1_id.length != 0 && data_2_id.length != 0) {
            console.log('match transaction2: ' + type_b2b);
            if (type_b2b) {
              console.log('1: ' + data_1_amount_sum);
              console.log('2: ' + data_2_amount_sum);
              console.log('diff: ' + data_1_amount_b2b);
              if (Math.abs(data_1_amount_b2b) != data_2_amount_sum) {
                this.showAmountDifference();
              } else {
                console.log('b2b_new_ids_ats: ' + b2b_new_ids_ats);
                console.log('b2b_old_ids_ats: ' + b2b_old_ids_ats);
                console.log('b2b_new_ids_core: ' + b2b_new_ids_core);
                console.log('b2b_old_ids_core: ' + b2b_old_ids_core);
                // console.log('ids: ' + data_2_id);
                this.reconcileService
                .matchPartialToFullTransactions(
                  b2b_new_ids_ats.toString(),
                  b2b_old_ids_ats.toString(),
                  b2b_new_ids_core.toString(),
                  b2b_old_ids_core.toString(),
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
                              this.reconcileService
                              .matchPartialToFullTransactions(
                                b2b_new_ids_ats.toString(),
                                b2b_old_ids_ats.toString(),
                                b2b_new_ids_core.toString(),
                                b2b_old_ids_core.toString(),
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
            }
          } else {
            this.showSelectionEmpty();
          }
        });
      }
    });
    // }
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
  showAmountDifference() {
    this.toast.error({
      detail: 'ERROR',
      summary: ' Selected transactions to  to have amount differenece.',
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