import {
  Component,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { LocalStorageService } from 'ngx-webstorage';
import { UtilService } from 'src/app/services/util-service/util.service';
import { ReconcileService } from 'src/app/User/services/reconcile.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { skLocale } from 'ngx-bootstrap/chronos';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { createPasswordMatchValidator } from 'src/app/utils_/validators/password_match_validator';
import { createPasswordStrengthValidator } from 'src/app/utils_/validators/validator_password_strength';
import { greaterThan0Validator } from 'src/app/utils_/validators/greater_than_0_validator';
import { cr_dr_validator } from 'src/app/utils_/validators/cd_cr_validator';
import { RtgsAts } from 'src/app/User/payloads/recon/rtgs-ats';
import { EditTransactionPayload } from 'src/app/User/payloads/edit-transaction-payload/edit-transaction-payload';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/services/auth-service.service';
declare var window: any;
@Component({
  selector: 'app-payable-reconcile',
  templateUrl: './payable-reconcile.component.html',
  styleUrls: ['./payable-reconcile.component.css']
})
export class PayableReconcileComponent implements OnInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  initialDateValue = new Date();
  refresh_token_requested = false;
  reload_checker: boolean = true;

  dtOptions_credit: any;
  dtOptions_debit: any;

  restricted: boolean = true;

  //core inits
  core_first_column_title = '-ID-';
  core_second_column_title = 'Add..-Info';
  core_third_column_title = 'Amount';
  core_fourth_column_title = 'Value Date';
  core_fifth_column_title = 'Upload Date';
  core_sixth_column_title = 'Branch Code';
  core_seventh_column_title = 'Type';
  // core_eighth_column_title = 'Posting Date';
  // core_ninth_column_title = 'Transaction Reference';
  // core_tenth_column_title = 'Action';

  core_input_0!: any;
  core_input_1!: any;
  core_input_2!: any;
  core_input_3!: any;
  core_input_4!: any;
  core_input_5!: any;
  core_input_6!: any;
  // core_input_7!: any;
  // core_input_8!: any;

  core_first_column_id = '0';
  core_second_column_id = '1';
  core_third_column_id = '2';
  core_fourth_column_id = '3';
  core_fifth_column_id = '4';
  core_sixth_column_id = '5';
  core_seventh_column_id = '6';
  // core_eighth_column_id = '7';
  // core_ninth_column_id = '8';
  // core_tenth_column_id = '9';

  refAll: string = '';
  amountfAll: any;
  // selections: number = 0;
  dt_ats_current_page: number = 0;
  totalAmount: number = 0;
  editModal: any;

  type_ats: string = 'unknown';
  type_core: string = 'unknown';

  // edit form
  editForm: FormGroup;
  submitted: boolean = false;
  editPayload: EditTransactionPayload;
  edit_core: boolean;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private utilService: UtilService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private reconcileService: ReconcileService,
    private toast: NgToastService,
    private formBuilder: FormBuilder

  ) {
    this.edit_core = false;
    this.editForm = this.formBuilder.group(

      {
        reason: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
        ]),
        reference: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(24),
        ]),
        amount: new FormControl(0, [
          // Validators.required,
          // Validators.minLength(1),
          // Validators.pattern('/^-?(0|[1-9]\d*)?$/')
        ]),
        value_date: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(24),
        ]),
        type: new FormControl('', [Validators.required]),
        upload_date: new FormControl('', [
          Validators.required,
          Validators.min(20000000),
          Validators.max(21000000),
        ]),

        additional_information: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
        ]),
      },
      {
        validators: [
          greaterThan0Validator.GreaterThan0Validator,
          cr_dr_validator.cr_dr_validator,
        ],
      }
    );
    this.editPayload = {
      id: 0,
      amount: 0,
      upload_date: 0,
      reference: '',
      value_date_type: '',
      type: '',
      dr_cr: '',
      additional_information: '',
    };
  }
  onEditSubmit() {
    if (
      this.edit_core &&
      this.editForm.controls['reason'].valid &&
      this.editForm.controls['amount'].valid &&
      this.editForm.controls['value_date'].valid &&
      this.editForm.controls['type'].valid &&
      this.editForm.controls['upload_date'].valid &&
      this.editForm.controls['additional_information'].valid
    ) {
      this.editForm.controls['value_date'].setValue(
        this.editForm.get('value_date')?.value.toString().replace('\n', ' ')
      );
      console.log("--------------------------------------------------- payable")
      this.editPayload = this.editForm.value;
      this.editPayload.dr_cr = this.editForm.controls['type']?.value;
      this.editPayload.id = Number($('#lalksdf6a5s4d6ffas').text());
      this.editPayload.value_date_type =
        this.editForm.controls['value_date']?.value;
      this.editPayload.type = "payable"
      // console.log(JSON.stringify(this.editPayload, null, 3));
      this.reconcileService.updateTransaction(this.editPayload).subscribe(
        (data: any) => {
          console.log(JSON.stringify(data, null, 3));
          this.closeModal();
          Swal.fire({
            title: 'Update Success!',
            text: 'You have updated the transaction successfully.',
            icon: 'success',
          });

          this.dtElements.forEach(
            (dtElement: DataTableDirective, index: number) => {
              if (index == 1) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance.ajax.reload((data) => {
                    console.log('data reload 00');
                  }, false);

                });
              }
            }
          );
          this.editForm.reset();
          // this.editForm.controls['type'].setValue('cr');
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
                    this.reconcileService.updateTransaction(this.editPayload).subscribe(
                      (data: any) => {
                        console.log(JSON.stringify(data, null, 3));
                        this.closeModal();
                        Swal.fire({
                          title: 'Update Success!',
                          text: 'You have updated the transaction successfully.',
                          icon: 'success',
                        });

                        this.dtElements.forEach(
                          (dtElement: DataTableDirective, index: number) => {
                            if (index == 1) {
                              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                                dtInstance.ajax.reload((data) => {
                                  console.log('data reload 00');
                                }, false);

                              });
                            }
                          }
                        );
                        this.editForm.reset();
                        // this.editForm.controls['type'].setValue('cr');
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
    } else {
      console.log('form is not valid.');
      this.submitted = true;
    }
  }

  someFilterFromAts(info: any): void { }
  autoMatchTransactions() {
    console.log('auto match transaction');
  }
  openModal() {
    this.editModal.show();
  }
  closeModal() {
    this.editModal.hide();
  }
  ngOnInit(): void {
    var that = this;
    this.editModal = new window.bootstrap.Modal(
      document.getElementById('edit_transaction_modal')
    );

    try {
      this.dtOptions_credit = {
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
          this.reconcileService.getPayableCreditForReconcilation().subscribe(
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
                        this.reconcileService.getPayableCreditForReconcilation().subscribe(
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
              extend: 'selected',
              text: 'Sum',
              action: function (e: any, dt: any, node: any, config: any) {
                var rows = dt.rows({ selected: true }).data().toArray();
                if (rows.length < 2) {
                  Swal.fire({
                    icon: 'warning',
                    text: "Please select more than one row to sum up their amount.",
                  });
                } else {
                  var sum = 0;
                  for (let i = 0; i < rows.length; i++) {
                    sum += rows[i].amount;
                  }
                  Swal.fire({
                    text: "The sum of selected amounts is " + sum.toFixed(2),
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
                  that.edit_core = true;
                  // that.editForm.controls['reference'].setValue(
                  //   rows[0].reference
                  // );
                  that.editForm.controls['amount'].setValue(rows[0].amount);
                  that.editForm.controls['value_date'].setValue(
                    rows[0].value_date
                  );
                  that.editForm.controls['upload_date'].setValue(
                    rows[0].upload_date
                  );
                  that.editForm.controls['additional_information'].setValue(
                    rows[0].additional_information
                  );
                  that.editForm.controls['type'].setValue(rows[0].dr_cr);
                  $('#lalksdf6a5s4d6ffas').html(rows[0].id);
                  that.openModal();
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
                  that.reconcileService
                    .deleteTransactions(text, ids, 'payable')
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
                            if (index == 0) {
                              dtElement.dtInstance.then(
                                (dtInstance: DataTables.Api) => {
                                  dtInstance
                                  .rows({selected: true})
                                  .remove()
                                  .draw();
                                }
                              );
                            }
                          }
                        );
                      },
                      (error) => {
                        if (error.error.text === 'access-token-expired') {
                          console.log('Access-token-expired requesting refresh token...');
                          if (
                            that.localStorageService.retrieve('refresh_token_requested') == null
                          ) {
                            that.utilService.refreshToken().subscribe(
                              (data) => {
                                if (data === true) {
                                  console.log(
                                    'refresh token success re-requesting the actual request'
                                  );
                                  that.localStorageService.clear('refresh_token_requested');
                                  //================================================================================
                                  that.reconcileService
                                    .deleteTransactions(text, ids, 'payable')
                                    .subscribe(
                                      (data: any) => {
                                        console.log(JSON.stringify(data, null, 3));
                                        Swal.fire({
                                          title: 'Delete Success!',
                                          text: 'You have Deleted the transaction successfully.',
                                          icon: 'success',
                                        });
                                        //$('payable-credit').DataTable().ajax.reload();
                                        that.dtElements.forEach(
                                          (dtElement: DataTableDirective, index: number) => {
                                            if (index == 0) {
                                              dtElement.dtInstance.then(
                                                (dtInstance: DataTables.Api) => {
                                                  dtInstance
                                                  .rows({selected: true})
                                                  .remove()
                                                  .draw();
                                                }
                                              );
                                            }
                                          }
                                        );
                                      },
                                      (error) => {
                                        if (error.error.text === 'access-token-expired') {
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
                                            JSON.stringify(error.error.apierror, null, 2)
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
                                console.log(JSON.stringify(error.error.apierror, null, 2));
                              }
                            );
                            that.localStorageService.store('refresh_token_requested', true);
                          }
                        }
                      }
                    );
                }
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
      this.dtOptions_debit = {
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
          this.reconcileService.getPayableDebitForReconcilation().subscribe(
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
                        this.reconcileService.getPayableDebitForReconcilation().subscribe(
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
              extend: 'selected',
              text: 'Sum',
              action: function (e: any, dt: any, node: any, config: any) {
                var rows = dt.rows({ selected: true }).data().toArray();
                if (rows.length < 2) {
                  Swal.fire({
                    icon: 'warning',
                    text: "Please select more than one row to sum up their amount.",
                  });
                } else {
                  var sum = 0;
                  for (let i = 0; i < rows.length; i++) {
                    sum += rows[i].amount;
                  }
                  Swal.fire({
                    text: "The sum of selected amounts is " + sum.toFixed(2),
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
                  that.edit_core = true;
                  // that.editForm.controls['reference'].setValue(
                  //   rows[0].reference
                  // );
                  that.editForm.controls['amount'].setValue(rows[0].amount);
                  that.editForm.controls['value_date'].setValue(
                    rows[0].value_date
                  );
                  that.editForm.controls['upload_date'].setValue(
                    rows[0].upload_date
                  );
                  that.editForm.controls['additional_information'].setValue(
                    rows[0].additional_information
                  );
                  that.editForm.controls['type'].setValue(rows[0].dr_cr);
                  $('#lalksdf6a5s4d6ffas').html(rows[0].id);
                  that.openModal();
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
                  that.reconcileService
                    .deleteTransactions(text, ids, 'payable')
                    .subscribe(
                      (data: any) => {
                        console.log(JSON.stringify(data, null, 3));
                        Swal.fire({
                          title: 'Delete Success!',
                          text: 'You have Deleted the transaction successfully.',
                          icon: 'success',
                        });
                      // $('payable-debit').DataTable().ajax.reload();
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
                          console.log('Access-token-expired requesting refresh token...');
                          if (
                            that.localStorageService.retrieve('refresh_token_requested') == null
                          ) {
                            that.utilService.refreshToken().subscribe(
                              (data) => {
                                if (data === true) {
                                  console.log(
                                    'refresh token success re-requesting the actual request'
                                  );
                                  that.localStorageService.clear('refresh_token_requested');
                                  //================================================================================
                                  that.reconcileService
                                    .deleteTransactions(text, ids, 'payable')
                                    .subscribe(
                                      (data: any) => {
                                        console.log(JSON.stringify(data, null, 3));
                                        Swal.fire({
                                          title: 'Delete Success!',
                                          text: 'You have Deleted the transaction successfully.',
                                          icon: 'success',
                                        });
                                        //$('payable-debit').DataTable().ajax.reload();
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
                                            JSON.stringify(error.error.apierror, null, 2)
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
                                console.log(JSON.stringify(error.error.apierror, null, 2));
                              }
                            );
                            that.localStorageService.store('refresh_token_requested', true);
                          }
                        }
                      }
                    );
                }
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
    this.clearAllSearches();
  }
  restrictedChange() { }
  addSelectEvent(that: any, dtInstance: any, dt: any, indexes: any) {
    if (that.restricted) {
      that.dt_ats_current_page = dt.page();
      var rowData = dtInstance.rows(indexes).data().toArray();
      that.refAll = rowData[0].additional_information;
      that.amountfAll = rowData[0].amount;
      that.core_input_1 = that.refAll;
      that.core_input_2 = that.amountfAll;
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
                .column(2)
                .search(
                  that.amountfAll
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
                .column(2)
                .search(
                  that.amountfAll
                )
                .draw();
            });
            console.log('searched...');
          }
        }
      );
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
    $('#edit_transaction_modal').on('hidden.bs.modal', function (e) {
      that.editForm.reset();
      that.submitted = false;
      // that.editForm.controls['type'].setValue('cr');
    });
  }
  clearAllSearches() {

    if (this.dtElements != null && this.dtElements.length > 0)
      this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
        this.totalAmount = 0;
        this.type_ats = 'unknown';
        this.type_core = 'unknown';
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
    var data_1_type: any[] = [];
    var data_2_id: any[] = [];
    var data_1_amount_sum: number = 0;
    var data_2_amount_sum: number = 0;
    var data_1_description: any = [];
    var data_2_description: any = [];
    var data_1_size: number;
    var data_2_size: number;
    var data_1_reference: String = '';
    var rowData1: any[] = [];
    // var data_2_amount_sum: number = 0;
    var date: string;
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
                for (let i = 0; i < rowData.length; i++) {
                  data_1_size = rowData.length;
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
                data_2_size = rowData.length;
                data_2_amount_sum += Number(
                  JSON.stringify(rowData[i].amount, null, 4)
                );
                data_2_id.push(rowData[i].id);
              }
              if (data_1_id.length != 0 && data_2_id.length != 0) {
                if (data_1_size == data_2_size && data_1_amount_sum == data_2_amount_sum) {
                  console.log(data_1_id);
                  console.log(data_2_id);
                  this.reconcileService
                    .matchPayableTransactions(
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
                                      .rows({selected: true})
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
                          console.log('ret: ' + JSON.stringify(data, null, 5));
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
                                    .matchPayableTransactions(
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
                                                      .rows({selected: true })
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
                                          console.log('ret: ' + JSON.stringify(data, null, 5));
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
                else {
                  this.showSelectionmismatch();
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
                date = rowData[0].value_date_type;
                for (let i = 0; i < rowData.length; i++) {
                  data_1_amount_sum += Number(
                    JSON.stringify(rowData[i].amount, null, 4)
                  );
                  data_1_id.push(rowData[i].id);
                  // data_1_type.push(rowData[i].value_date_type);
                  // if (i == 0) data_1_reference = rowData[i].reference;
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
                // if (i == 0)
                //   data_2_additional_data = rowData[i].additional_information;


              }
              if (data_1_id.length != 0 && data_2_id.length != 0) {
                if (data_1_amount_sum != data_2_amount_sum) {
                  Swal.fire({
                    title: 'Amount Difference: ',
                    text: "It seems there is an amount difference between the selected transactions. Do you want to match with reason Click on Match With Reason button otherwise click on  Don't Match button?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#0acf97',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: ' Match With Reason',
                    cancelButtonText: "Don't Match",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      const { value: text } = await Swal.fire({
                        input: 'textarea',
                        inputLabel:
                          'State why you are matching transactions with different amount.',
                        inputPlaceholder: 'Type your reason here...',
                        inputAttributes: {
                          'aria-label': 'Type your reason here',
                        },
                        showCancelButton: true,
                      });
                      if (text == '') {
                        Swal.fire({
                          title: 'Can not match. No reason found.',
                          icon: 'error',
                        });
                      } else if (text) {
                        var type = 'amount';
                        console.log(data_1_id);
                        console.log(data_2_id);
                        this.reconcileService
                          .matchPayableTransactionsWithComment(
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
                                          .matchPayableTransactionsWithComment(
                                            data_1_id.toString(),
                                            data_2_id.toString(),
                                            text
                                            //type
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
                                                      // $('payable-credit').DataTable().ajax.reload();
                                                      // $('payable-debit').DataTable().ajax.reload();
                                                    }
                                                  }
                                                );
                                                console.log('match success: ' + data);
                                                $('payable-credit').DataTable().ajax.reload();
                                                $('payable-debit').DataTable().ajax.reload();
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
                  });
                } else if (data_1_amount_sum == data_2_amount_sum) {
                  console.log(data_1_id);
                  console.log(data_2_id);
                  this.reconcileService
                    .matchPayableTransactions(
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

                            }
                          );
                          console.log('match success: ' + data);
                        } else
                          console.log('ret: ' + JSON.stringify(data, null, 5));
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
                                    .matchPayableTransactions(
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

                                            }
                                          );
                                          console.log('match success: ' + data);
                                        } else
                                          console.log('ret: ' + JSON.stringify(data, null, 5));
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
        }
      );
    }

  }
  showMatchSuccess() {
    this.toast.success({ detail: 'SUCCESS', summary: 'Matched successfully!' });
  }
  showSelectionEmpty() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'Please select transaction to Match.',
    });
  }
  showSelectionmismatch() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'Please  reselect transaction  both sides,because mismatch selection (amount difference happen).',
    });
  }
  showErrormessage(message: string) {
    this.toast.error({
      detail: 'ERROR',
      summary: message,
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
          'Error: ' + JSON.stringify(error, null, 2)
        );
      }
    );
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function draw() {
  throw new Error('Function not implemented.');
}
