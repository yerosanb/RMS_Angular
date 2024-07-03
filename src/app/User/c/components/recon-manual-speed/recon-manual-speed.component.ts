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
  selector: 'app-recon-manual-speed',
  templateUrl: './recon-manual-speed.component.html',
  styleUrls: ['./recon-manual-speed.component.css'],
})
export class ReconManualSpeedComponent implements OnInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  initialDateValue = new Date();
  refresh_token_requested = false;
  reload_checker: boolean = true;

  dtOptions_ats: any;
  dtOptions_core: any;

  restricted: boolean = true;

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
  ats_tenth_column_id = '9';

  // ats_tenth_column_id = '9';

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
  // selections: number = 0;
  dt_ats_current_page: number = 0;

  sKey2_is: string = '';
  sKey2_os: string = '';
  sKey1: string = '';
  empty_provider: string = '';
  empty_provider_string: string =
    '2l210k3j5h8g5f4d7r7e7s4w5a6q5t4y1u3i1o7p8m9n6b5v4cx1z__)())((';

  date_is = new Date();
  date_os = new Date();

  totalAmount: number = 0;
  is_os_Amounts: any[] = [];
  is_os_diff_amount: number = 0;
  is_os_filtered: boolean;
  ercaFiltered: boolean;
  b2b_filtered: boolean;
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
    this.ercaFiltered = false;
    this.b2b_filtered = false;
    this.is_os_filtered = false;
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
    console.log(this.edit_core);
    if (!this.edit_core && this.editForm.valid) {
      console.log('form is valid');
      // console.log('value date: ' + this.editForm.get('value_date')?.value.toString().replace('\n', ' '))
      this.editForm.controls['value_date'].setValue(
        this.editForm.get('value_date')?.value.toString().replace('\n', ' ')
      );
      this.editPayload = this.editForm.value;
      this.editPayload.dr_cr = this.editForm.controls['type']?.value;
      this.editPayload.id = Number($('#lalksdf6a5s4d6ffas').text());
      this.editPayload.value_date_type =
        this.editForm.controls['value_date']?.value;
      this.editPayload.type = 'ATS';
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
              if (index == 0) {
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
                    this.reconcileService
                      .updateTransaction(this.editPayload)
                      .subscribe(
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
    } else if (
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
      this.editPayload = this.editForm.value;
      this.editPayload.dr_cr = this.editForm.controls['type']?.value;
      this.editPayload.id = Number($('#lalksdf6a5s4d6ffas').text());
      this.editPayload.value_date_type =
        this.editForm.controls['value_date']?.value;
      this.editPayload.type = 'CORE';
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
                    this.reconcileService
                      .updateTransaction(this.editPayload)
                      .subscribe(
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

  someFilterFromAts(info: any): void {}
  autoMatchTransactions() {
    console.log('auto match transaction');
  }
  onReconDateChange(value: Date): void {
    this.initialDateValue = new Date(value);
    this.localStorageService.store(
      'recon_current_date_rtgs_manual',
      this.initialDateValue
    );
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
    this.customFilter();
    if (
      this.localStorageService.retrieve('recon_current_date_rtgs_manual') ==
      null
    ) {
      this.initialDateValue = new Date();
      this.localStorageService.store(
        'recon_current_date_rtgs_manual',
        this.initialDateValue
      );
    } else
      this.initialDateValue = new Date(
        this.localStorageService.retrieve('recon_current_date_rtgs_manual')
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
          this.reconcileService
            .getAtsForRecon(
              formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US')
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
                          this.reconcileService
                            .getAtsForRecon(
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
                  that.edit_core = false;
                  // console.log('the type is: ' + JSON.stringify(rows[0].dr_cr,null, 4))
                  that.editForm.controls['reference'].setValue(
                    rows[0].reference
                  );
                  that.editForm.controls['amount'].setValue(rows[0].amount);
                  that.editForm.controls['value_date'].setValue(
                    rows[0].value_date_type
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
                    .deleteTransactions(text, ids, 'ats')
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
                                  that.reconcileService
                                    .deleteTransactions(text, ids, 'ats')
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
            {
              extend: 'excel',
              text: 'excel',
              // className: 'dt-button export-all',
              exportOptions: {
                format: {
                  body: function (data: any, row: any, column: any, node: any) {
                    if (column === 1) {
                      var regex = /^\d+$/;
                      if (regex.test(data) && data.length > 15) {
                        data +=
                          '                                                                                      ';
                        return data + " '";
                      }
                    }
                    return data;
                  },
                },
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
        // fixedFooter: true,
        fixedHeader: {
          header: true,
          // footer: true
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
          this.reconcileService.getCoreForRecon().subscribe(
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
                        this.reconcileService.getCoreForRecon().subscribe(
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
                    text: 'Please select more than one row to sum up their amount.',
                  });
                } else {
                  var sum = 0;
                  var cr = 0;
                  var dr = 0;
                  for (let i = 0; i < rows.length; i++) {
                    if (rows[i].dr_cr.toLowerCase().startsWith('cr'))
                      sum += rows[i].amount;
                    else sum = sum - rows[i].amount;
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
                    .deleteTransactions(text, ids, 'core')
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
                                  that.reconcileService
                                    .deleteTransactions(text, ids, 'core')
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
                                      (error) => {
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
        // fixedFooter: true,
        fixedHeader: {
          header: true,
          // footer: true
        },
        scrollCollapse: false,
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
  restrictedChange() {}
  addSelectEvent(that: any, dtInstance: any, dt: any, indexes: any) {
    if (that.restricted) {
      that.dt_ats_current_page = dt.page();
      var rowData = dtInstance.rows(indexes).data().toArray();
      if (
        rowData[0].value_date_type != null &&
        rowData[0].value_date_type.toLowerCase().endsWith('202') &&
        false
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
                    .column(1)
                    .search(
                      that.refAll
                        .split(' ')[0]
                        .replace('"', '')
                        .substring(1, that.refAll.length)
                    )
                    .column(2, { search: 'applied' })
                    .data();
                  if (
                    (core_b2b_data_amount.length > 0
                      ? core_b2b_data_amount.reduce(function (a, b) {
                          return intVal(a) + intVal(b);
                        })
                      : 0) == 50
                  ) {
                    var ats_rows = ats_dt_instance.rows().data().toArray();
                    for (let c = 0; c < ats_rows.length; c++) {
                      if (
                        ats_dt_instance
                          .column(1)
                          .search(
                            that.refAll
                              .split(' ')[0]
                              .replace('"', '')
                              .substring(1, that.refAll.length)
                          )
                          .column(6, { search: 'applied' })
                          .data()
                          .toArray()[0]
                          .includes(ats_rows[c].reference)
                      ) {
                        ats_dt_instance
                          .column(1)
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
                  } else {
                    ats_dt_instance

                      .column(1)
                      .search(
                        that.refAll
                          .split(' ')[0]
                          .replace('"', '')
                          .substring(1, that.refAll.length)
                      )
                      .draw();
                  }
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
              }
            }
          );
      } else if (
        rowData[0].value_date_type != null &&
        rowData[0].value_date_type.toLowerCase().includes('298smt') &&
        rowData[0].additional_information != null &&
        rowData[0].additional_information.toLowerCase().includes('sid')
      ) {
        var date: string;
        if (!this.is_os_filtered)
          that.dtElements.forEach(
            (dtElement: DataTableDirective, index: number) => {
              if (index == 0) {
                that.selections++;
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance
                    .column(3)
                    .search('298smt')
                    .column(6)
                    .search('sid')
                    .draw();
                  var rowData = dtInstance
                    .rows({ search: 'applied' })
                    .data()
                    .toArray();

                  for (let i = 0; i < rowData.length; i++) {
                    console.log('amount: ' + rowData[i].amount);
                    // this.totalAmount += rowData[i].amount;
                    this.is_os_Amounts.push(rowData[i].amount);
                  }
                  if (rowData[0] != null) date = rowData[0].value_date_type;
                });
              } else {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  var dtdt = dtInstance;
                  var intVal = function (i: any) {
                    return typeof i === 'string'
                      ? Number(i.replace(/[\$,]/g, '')) * 1
                      : typeof i === 'number'
                      ? i
                      : 0;
                  };

                  // this.sKey2_is = 'is';
                  // this.sKey2_os = 'os';
                  // this.empty_provider = '';
                  this.date_is = new Date(
                    date.substring(0, 4) +
                      '/' +
                      date.substring(4, 6) +
                      '/' +
                      date.substring(6, 8)
                  );
                  this.date_os.setFullYear(this.date_is.getFullYear());
                  this.date_os.setMonth(this.date_is.getMonth());
                  this.date_os.setDate(this.date_is.getDate() + 1);

                  var total_is_data = dtInstance
                    .column(1)
                    .search(
                      '^is:00000000' +
                        this.date_is.getFullYear().toString() +
                        ((this.date_is.getMonth() + 1).toString().length == 1
                          ? '0' + (this.date_is.getMonth() + 1)
                          : this.date_is.getMonth() + 1) +
                        (this.date_is.getDate().toString().length == 1
                          ? '0' + this.date_is.getDate().toString()
                          : this.date_is.getDate().toString()),
                      true,
                      false
                    )

                    .column(2, { search: 'applied' })
                    .data();
                  // if(total_is_data)
                  var total_is =
                    total_is_data.length > 0
                      ? total_is_data.reduce(function (a, b) {
                          return intVal(a) + intVal(b);
                        })
                      : 0;

                  // var arr = dtdt.column(1)
                  // .search('^os', true, false).data().toArray()
                  // console.log('this is the array' + JSON.stringify(arr, null, 6))

                  // var tt =
                  var total_os_data = dtdt
                    .column(1)
                    .search(
                      '^OS:00000000' +
                        this.date_os.getFullYear().toString() +
                        ((this.date_os.getMonth() + 1).toString().length == 1
                          ? '0' + (this.date_os.getMonth() + 1)
                          : this.date_os.getMonth() + 1) +
                        (this.date_os.getDate().toString().length == 1
                          ? '0' + this.date_os.getDate().toString()
                          : this.date_os.getDate().toString()),
                      true,
                      false
                    )
                    .column(2, { search: 'applied' })
                    .data();

                  // console.log('is date: ' + this.date_is)
                  console.log(
                    'is date: ' +
                      this.date_is.getFullYear().toString() +
                      ((this.date_is.getMonth() + 1).toString().length == 1
                        ? '0' + (this.date_is.getMonth() + 1)
                        : this.date_is.getMonth() + 1) +
                      (this.date_is.getDate().toString().length == 1
                        ? '0' + this.date_is.getDate().toString()
                        : this.date_is.getDate().toString())
                  );

                  console.log(
                    'os date: ' +
                      this.date_os.getFullYear().toString() +
                      ((this.date_os.getMonth() + 1).toString().length == 1
                        ? '0' + (this.date_os.getMonth() + 1)
                        : this.date_os.getMonth() + 1) +
                      (this.date_os.getDate().toString().length == 1
                        ? '0' + this.date_os.getDate().toString()
                        : this.date_os.getDate().toString())
                  );
                  console.log('os length: ' + total_os_data.length);
                  var total_os =
                    total_os_data.length > 0
                      ? total_os_data.reduce(function (a, b) {
                          return intVal(a) + intVal(b);
                        })
                      : 0;
                  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\
                  // var total = dtInstance.column(1).search('^os', true, false)
                  //   .column(2, { search: 'applied' })
                  //   .data()
                  //   .reduce(function (a, b) {
                  //     return intVal(a) + intVal(b);
                  //   });

                  var rowData11 = dtInstance
                    .rows({ search: 'applied' })
                    .data()
                    .toArray();
                  this.is_os_diff_amount = Math.abs(total_is - total_os);

                  this.totalAmount =
                    this.is_os_Amounts.length > 0
                      ? this.is_os_Amounts.reduce(function (a, b) {
                          return intVal(a) + intVal(b);
                        })
                      : 0;
                  var a = this.totalAmount;

                  console.log('length: ' + rowData11.length);
                  console.log('total_is_data.length: ' + total_is_data.length);
                  console.log('total_os_data.length: ' + total_os_data.length);
                  console.log('amount_is sum: ' + total_is.toFixed(2));
                  console.log('amount_os sum: ' + total_os.toFixed(2));
                  console.log('amount ats: ' + a);
                  console.log('amount diff: ' + this.is_os_diff_amount);
                  this.is_os_diff_amount.toFixed(2) == a.toFixed(2)
                    ? console.log('true')
                    : console.log('false');

                  this.sKey2_is = 'is';
                  this.sKey2_os = 'os';
                  this.empty_provider = this.empty_provider_string;
                  dtInstance
                    .column(1)
                    .search('')
                    .column(2)
                    .search('')
                    .column(3)
                    .search('')
                    .draw();
                  this.is_os_filtered = true;
                  this.sKey2_is = '';
                  this.sKey2_os = '';
                  this.empty_provider = '';
                  // =====================================================================================
                  // console.log(
                  //   'the new date: ' +
                  //     'erca ' +
                  //     (d.getDate().toString().length == 1
                  //       ? '0' + d.getDate().toString()
                  //       : d.getDate().toString()) +
                  //     '.' +
                  //     (d.getMonth().toString().length == 1
                  //       ? '0' + d.getMonth()
                  //       : d.getMonth()) +
                  //     '.' +
                  //     d.getFullYear()
                  // );
                });
              }
            }
          );
        // }
      } else if (
        rowData[0].value_date_type != null &&
        rowData[0].value_date_type.endsWith('204') &&
        rowData[0].additional_information != null &&
        rowData[0].additional_information.toLowerCase().includes('.') &&
        rowData[0].additional_information.toLowerCase().includes('value') &&
        rowData[0].additional_information.toLowerCase().includes('erca')
      ) {
        if (!this.ercaFiltered) {
          this.ercaFiltered = true;
          that.refAll = rowData[0].reference;
          that.ats_input_1 = that.refAll;
          that.dtElements.forEach(
            (dtElement: DataTableDirective, index: number) => {
              if (index == 0) {
                that.selections++;
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance
                    .column(3)
                    .search('204')
                    .column(6)
                    .search('. value erca')
                    .draw();
                  var rowData = dtInstance
                    .rows({ search: 'applied' })
                    .data()
                    .toArray();
                  for (let i = 0; i < rowData.length; i++) {
                    console.log('amount: ' + rowData[i].amount);
                    this.totalAmount += rowData[i].amount;
                  }
                  console.log('total amount: ' + this.totalAmount);
                });
              } else {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance
                    .column(1)
                    .search('erca')
                    .column(2)
                    .search('' + this.totalAmount.toFixed(2))
                    .draw();
                });
              }
            }
          );
        } else {
          console.log('already filtered: ' + this.ercaFiltered);
        }
      } else {
        // console.log(this.b2b_filtered);
        // console.log('it is in else');
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
    $('#edit_transaction_modal').on('hidden.bs.modal', function (e) {
      that.editForm.reset();
      that.submitted = false;
      // that.editForm.controls['type'].setValue('cr');
    });
  }
  customFilter() {
    $.fn['dataTable'].ext.search.push(
      (settings: any, data: any, dataIndex: any) => {
        // console.log('id: ' + settings.nTable.id)
        if (settings.nTable.id == 'ats_table') {
          if (data[1].toLowerCase().startsWith(this.sKey1)) {
            return true;
          }
        } else if (settings.nTable.id == 'core_table') {
          if (
            !this.is_os_filtered &&
            (this.sKey2_is == '' || this.sKey2_os == '')
          ) {
            // console.log('  here');
            // if (
            //   (data[1].toLowerCase().startsWith('') &&
            //     data[3].toLowerCase().startsWith('')) ||
            //   // data[3] == this.date_is.toString().substring(0, 8)) ||
            //   (data[1].toLowerCase().startsWith('') &&
            //     data[3].toLowerCase().startsWith(''))
            // )
            return true;
          } else {
            // console.log('not here');
            // console.log('boolean: ' + (this.totalAmount == this.is_os_diff_amount))
            console.log('value total: ' + this.totalAmount);
            console.log(
              'value is os difference: ' + this.is_os_diff_amount.toFixed(2)
            );
            if (
              this.totalAmount.toFixed(2) == this.is_os_diff_amount.toFixed(2)
            )
              if (
                (data[1].toLowerCase().startsWith(this.sKey2_is) &&
                  data[1].includes(
                    this.date_is.getFullYear().toString() +
                      ((this.date_is.getMonth() + 1).toString().length == 1
                        ? '0' + (this.date_is.getMonth() + 1)
                        : this.date_is.getMonth() + 1) +
                      (this.date_is.getDate().toString().length == 1
                        ? '0' + this.date_is.getDate().toString()
                        : this.date_is.getDate().toString())
                  )) ||
                // data[3] == this.date_is.toString().substring(0, 8)) ||
                (data[1].toLowerCase().startsWith(this.sKey2_os) &&
                  data[1].includes(
                    this.date_os.getFullYear().toString() +
                      ((this.date_os.getMonth() + 1).toString().length == 1
                        ? '0' + (this.date_os.getMonth() + 1)
                        : this.date_os.getMonth() + 1) +
                      (this.date_os.getDate().toString().length == 1
                        ? '0' + this.date_os.getDate().toString()
                        : this.date_os.getDate().toString())
                  ))
              )
                return true;

            if (data[1].toLowerCase().startsWith(this.empty_provider))
              return true;
            else {
              // console.log('empty provider');
              return false;
            }
          }
        }
        return true;
      }
    );
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
    this.totalAmount = 0;
    this.is_os_Amounts = [];

    if (this.dtElements != null && this.dtElements.length > 0)
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          this.totalAmount = 0;
          this.type_ats = 'unknown';
          this.type_core = 'unknown';
          this.sKey1 = '';
          this.sKey2_is = '';
          this.sKey2_os = '';
          this.empty_provider = '';
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

  matchReversalTransactions() {
    // var data_1_id: any[] = [];
    var data_2_id: any[] = [];
    var data_2_amount_sum: number = 0;
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if (index == 0) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
          // var rowData = dtInstance
          //   .rows({ selected: true })
          //   .data()
          //   .toArray();
          // if (rowData.length > 0) {
          //   rowData1 = rowData;
          //   date = rowData[0].value_date_type;
          //   for (let i = 0; i < rowData.length; i++) {
          //     data_1_amount_sum += Number(
          //       JSON.stringify(rowData[i].amount, null, 4)
          //     );
          //     data_1_id.push(rowData[i].id);
          //     data_1_type.push(rowData[i].value_date_type);
          //     if (i == 0) data_1_reference = rowData[i].reference;
          //     if (this.type_ats == 'unknown' || this.type_ats == 'erca')
          //       if (
          //         rowData[0].value_date_type != null &&
          //         rowData[0].value_date_type.endsWith('204') &&
          //         rowData[0].additional_information != null &&
          //         rowData[0].additional_information
          //           .toLowerCase()
          //           .includes('.') &&
          //         rowData[0].additional_information
          //           .toLowerCase()
          //           .includes('value') &&
          //         rowData[0].additional_information
          //           .toLowerCase()
          //           .includes('erca')
          //       ) {
          //         console.log('erca-ats');
          //         this.type_ats = 'erca';
          //       } else {
          //         this.type_ats = 'no';
          //         console.log('nooo-ats');
          //       }
          //   }
          // }
        });
      } else {
        dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
          var rowData = dtInstance.rows({ selected: true }).data().toArray();
          for (let i = 0; i < rowData.length; i++) {
            console.warn(rowData[i].dr_cr + ' : ' + rowData[i].amount);
            if (rowData[i].dr_cr.toLowerCase().startsWith('cr'))
              data_2_amount_sum =
                Number(data_2_amount_sum.toFixed(2)) +
                Number(JSON.stringify(rowData[i].amount, null, 4));
            else
              data_2_amount_sum =
                Number(data_2_amount_sum.toFixed(2)) -
                Number(JSON.stringify(rowData[i].amount, null, 4));
            data_2_id.push(rowData[i].id);
            console.warn('added : ' + data_2_amount_sum);
          }
          console.warn('final : ' + data_2_amount_sum);
          if (data_2_amount_sum == 0) {
            //-----------------------------------------------------------------------
            this.reconcileService
              .matchTransactionsReversal(data_2_id.toString())
              .subscribe(
                (data: any) => {
                  if (data == true) {
                    this.showMatchSuccess();
                    this.dtElements.forEach(
                      (dtElement: DataTableDirective, index: Number) => {
                        console.log('index: ' + index);
                        if (index == 0) {
                          // dtElement.dtInstance.then(
                          //   (dtInstance: DataTables.Api) => {
                          //     dtInstance
                          //       .rows({ search: 'applied' })
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
                  } else console.log('ret: ' + JSON.stringify(data, null, 5));
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
                            this.reconcileService
                              .matchTransactionsReversal(data_2_id.toString())
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
                                            (dtInstance: DataTables.Api) => {
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
                                    console.log('match success: ' + data);
                                  } else
                                    console.log(
                                      'ret: ' + JSON.stringify(data, null, 5)
                                    );
                                },
                                (error) => {
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
                  }
                }
              );
            //---------------------------------------------------------------------
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Amount Difference',
              text: 'Credit and Debit amount Difference. Please check selected transaction ',
            });
          }
        });
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }
  matchTransactions() {
    var data_1_id: any[] = [];
    var data_1_type: any[] = [];
    var data_2_id: any[] = [];
    var data_2_id: any[] = [];
    var ammount_difference: any;
    var description: any;
    var data_1_amount_sum: number = 0;
    var data_2_amount_sum: number = 0;
    var data_1_reference: String = '';
    var data_2_additional_data: String = '';
    var rowData1: any[] = [];
    // var data_2_amount_sum: number = 0;
    var date: string;
    var checker_DR_CR: number = 0;
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
                date = rowData[0].value_date_type;
                for (let i = 0; i < rowData.length; i++) {
                  data_1_amount_sum += Number(
                    JSON.stringify(rowData[i].amount, null, 4)
                  );
                  data_1_id.push(rowData[i].id);
                  data_1_type.push(rowData[i].value_date_type);
                  if (i == 0) data_1_reference = rowData[i].reference;

                  if (this.type_ats == 'unknown' || this.type_ats == 'erca')
                    if (
                      rowData[0].value_date_type != null &&
                      rowData[0].value_date_type.endsWith('204') &&
                      rowData[0].additional_information != null &&
                      rowData[0].additional_information
                        .toLowerCase()
                        .includes('.') &&
                      rowData[0].additional_information
                        .toLowerCase()
                        .includes('value') &&
                      rowData[0].additional_information
                        .toLowerCase()
                        .includes('erca')
                    ) {
                      console.log('erca-ats');
                      this.type_ats = 'erca';
                    } else {
                      this.type_ats = 'no';
                      console.log('nooo-ats');
                    }
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
                if (i == 0)
                  data_2_additional_data = rowData[i].additional_information;

                if (this.type_core == 'unknown' || this.type_core == 'erca')
                  if (this.type_ats == 'unknown' || this.type_ats == 'erca') {
                    var d = new Date(
                      date.substring(0, 4) +
                        '/' +
                        date.substring(4, 6) +
                        '/' +
                        date.substring(6, 8)
                    );
                    d.setDate(d.getDate() + 1);

                    if (
                      'erca ' +
                      (d.getDate().toString().length == 1
                        ? '0' + d.getDate().toString()
                        : d.getDate().toString()) +
                      '.' +
                      (d.getMonth().toString().length == 1
                        ? '0' + d.getMonth()
                        : d.getMonth()) +
                      '.' +
                      d.getFullYear()
                    ) {
                      console.log('erca-core');
                      this.type_core = 'erca';
                    } else {
                      this.type_core = 'no';
                      console.log('nooo-core');
                    }
                  }
              }
              if (data_1_id.length != 0 && data_2_id.length != 0) {
                if (
                  rowData[0].value_date_type != null &&
                  rowData[0].value_date_type.toLowerCase().endsWith('202')
                ) {
                } else if (
                  rowData1[0].value_date_type != null &&
                  rowData1[0].value_date_type
                    .toLowerCase()
                    .includes('298smt') &&
                  rowData1[0].additional_information != null &&
                  rowData1[0].additional_information
                    .toLowerCase()
                    .includes('sid')
                ) {
                  var rows = dtInstance
                    .rows({ selected: true })
                    .data()
                    .toArray();
                  if (rowData1.length < 1 || rows.length < 1) {
                    this.showSelectionEmpty();
                  } else {
                    var is_amount_sum = 0;
                    var os_amount_sum = 0;
                    for (let k = 0; k < rows.length; k++)
                      if (
                        rows[k].additional_information
                          .toLowerCase()
                          .startsWith('is')
                      )
                        is_amount_sum += rows[k].amount;
                      else if (
                        rows[k].additional_information
                          .toLowerCase()
                          .startsWith('os')
                      )
                        os_amount_sum += rows[k].amount;
                    console.log('ats amounts: ' + rowData1[0].amount);
                    console.log('is amounts: ' + is_amount_sum);
                    console.log('os amounts: ' + os_amount_sum);
                    console.log(
                      'diff amounts: ' + Math.abs(is_amount_sum - os_amount_sum)
                    );

                    if (
                      rowData1[0].amount ==
                      Math.abs(is_amount_sum - os_amount_sum).toFixed(2)
                    ) {
                      this.reconcileService
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
                                      this.reconcileService
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
                                      //================================================================================
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
                      this.showErrormessage('There is an amount difference.');
                    }
                  }
                } else if (
                  this.type_ats == 'erca' &&
                  this.type_core == 'erca'
                ) {
                  console.log('new amount ats: ' + data_1_amount_sum);
                  console.log('new amount core: ' + data_2_amount_sum);
                  if (
                    data_1_amount_sum.toFixed(2) == data_2_amount_sum.toFixed(2)
                  ) {
                    console.log('it is erca');
                    // dtInstance.rows({ selected: true }).data().toArray();
                    dtInstance.rows({ selected: true }).remove().draw();
                    this.reconcileService
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
                                    this.reconcileService
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
                  } else {
                    this.showErrormessage('There is an amount difference.');
                  }
                } else if (
                  data_1_id.length == 1 &&
                  data_2_id.length == 1 &&
                  !data_2_additional_data.includes(data_1_reference.toString())
                ) {
                  if (
                    (rowData1[0].dr_cr.toLowerCase().startsWith('cr') &&
                      rowData[0].dr_cr.toLowerCase().startsWith('cr')) ||
                    (rowData1[0].dr_cr.toLowerCase().startsWith('dr') &&
                      rowData[0].dr_cr.toLowerCase().startsWith('dr'))
                  ) {
                    this.showSelectionError();
                  } else {
                    Swal.fire({
                      title: 'Reference Difference: ',
                      text: 'It seems there is a reference difference between the selected transactions. Turn off the restricted mode to reconcile with reference difference.',
                      icon: 'warning',
                      // showCancelButton: true,
                      // confirmButtonColor: '#0acf97',
                      cancelButtonColor: '#3085d6',
                      // confirmButtonText: 'Partial match',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        console.log('partial match');

                        const formData = new FormData();

                        for (const id_1 of data_1_id) {
                          formData.append('data_1_id', id_1);
                        }
                        for (const id_2 of data_2_id) {
                          formData.append('data_2_id', id_2);
                        }
                        console.log(
                          'float value to append on formdata: ' +
                            ammount_difference
                        );
                        formData.append(
                          'amount_difference',
                          ammount_difference
                        );
                        formData.append('description', description);

                        this.reconcileService
                          .matchPartialTransactions(formData)
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
                                        this.reconcileService
                                          .matchPartialTransactions(formData)
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
                                                    JSON.stringify(
                                                      data,
                                                      null,
                                                      5
                                                    )
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
                        console.log('canceled');
                      }
                    });
                  }
                } else if (data_1_amount_sum != data_2_amount_sum) {
                  if (data_1_amount_sum > data_2_amount_sum) {
                    ammount_difference = data_1_amount_sum - data_2_amount_sum;
                    description =
                      'Transaction is matched partially because total ammount at ATS is ' +
                      data_1_amount_sum +
                      ' and total amount at core is' +
                      data_2_amount_sum +
                      ' ' +
                      'with the same reference' +
                      ' ' +
                      this.refAll;
                  } else {
                    ammount_difference = data_2_amount_sum - data_1_amount_sum;
                    description =
                      'Transaction is matched partially because total ammount at ATS is ' +
                      data_1_amount_sum +
                      ' and total amount at core is' +
                      data_2_amount_sum +
                      ' ' +
                      'with the same reference' +
                      ' ' +
                      this.refAll;
                  }

                  console.log(
                    'amount differenceeeeeeeeeeeeeeeeee' +
                      ammount_difference +
                      description
                  );
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

                      const formData = new FormData();

                      for (const id_1 of data_1_id) {
                        formData.append('data_1_id', id_1);
                      }
                      for (const id_2 of data_2_id) {
                        formData.append('data_2_id', id_2);
                      }
                      console.log(
                        'amount difference is: ' + ammount_difference
                      );
                      formData.append('amount_difference', ammount_difference);
                      formData.append('description', description);

                      this.reconcileService
                        .matchPartialTransactions(formData)
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
                                      this.reconcileService
                                        .matchPartialTransactions(formData)
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
                      console.log('canceled');
                    }
                  });
                } else {
                  console.log(data_1_id);
                  console.log(data_2_id);
                  this.reconcileService
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
                                  this.reconcileService
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
                                      (error) => {
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
    } else {
      //----------------------------------------------------------------------------------------------
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          if (index == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // var rowData = dtInstance.rows({ search: 'applied' }).data().toArray();
              var rowData = dtInstance
                .rows({ selected: true })
                .data()
                .toArray();
              var dr_cr = rowData[0].dr_cr;
              if (rowData.length > 0) {
                rowData1 = rowData;
                date = rowData[0].value_date_type;
                for (let i = 0; i < rowData.length; i++) {
                  if (dr_cr == rowData[i].dr_cr) {
                    checker_DR_CR += 0;
                  } else {
                    checker_DR_CR += 1;
                  }
                  
                  if (rowData[i].dr_cr.toLowerCase().startsWith('cr'))
                    data_1_amount_sum =
                      Number(data_1_amount_sum.toFixed(2)) +
                      Number(JSON.stringify(rowData[i].amount, null, 4))
                      
                  else
                  data_1_amount_sum = 
                    Number(data_1_amount_sum.toFixed(2)) -
                    Number(JSON.stringify(rowData[i].amount, null, 4))
                    

                  

                  // data_1_amount_sum += Number(
                  //   JSON.stringify(rowData[i].amount, null, 4)
                  // );
                  data_1_id.push(rowData[i].id);
                  data_1_type.push(rowData[i].value_date_type);
                  if (i == 0) data_1_reference = rowData[i].reference;

                  if (this.type_ats == 'unknown' || this.type_ats == 'erca')
                    if (
                      rowData[0].value_date_type != null &&
                      rowData[0].value_date_type.endsWith('204') &&
                      rowData[0].additional_information != null &&
                      rowData[0].additional_information
                        .toLowerCase()
                        .includes('.') &&
                      rowData[0].additional_information
                        .toLowerCase()
                        .includes('value') &&
                      rowData[0].additional_information
                        .toLowerCase()
                        .includes('erca')
                    ) {
                      console.log('erca-ats');
                      this.type_ats = 'erca';
                    } else {
                      this.type_ats = 'no';
                      console.log('nooo-ats');
                    }
                }
              }
              data_1_amount_sum = Math.abs(Number(data_1_amount_sum))
            });
          } else {
            dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
              var rowData = dtInstance
                .rows({ selected: true })
                .data()
                .toArray();
              for (let i = 0; i < rowData.length; i++) {

                if (rowData[i].dr_cr.toLowerCase().startsWith('cr'))
                  data_2_amount_sum = 
                    Number(data_2_amount_sum.toFixed(2)) +
                    Number(JSON.stringify(rowData[i].amount, null, 4))
                    
                else 
                data_2_amount_sum = 
                  Number(data_2_amount_sum.toFixed(2)) -
                  Number(JSON.stringify(rowData[i].amount, null, 4))
             
                // data_2_amount_sum += Number(
                //   JSON.stringify(rowData[i].amount, null, 4)
                // );
                data_2_id.push(rowData[i].id);
                if (i == 0)
                  data_2_additional_data = rowData[i].additional_information;

                if (this.type_core == 'unknown' || this.type_core == 'erca')
                  if (this.type_ats == 'unknown' || this.type_ats == 'erca') {
                    var d = new Date(
                      date.substring(0, 4) +
                        '/' +
                        date.substring(4, 6) +
                        '/' +
                        date.substring(6, 8)
                    );
                    d.setDate(d.getDate() + 1);

                    if (
                      'erca ' +
                      (d.getDate().toString().length == 1
                        ? '0' + d.getDate().toString()
                        : d.getDate().toString()) +
                      '.' +
                      (d.getMonth().toString().length == 1
                        ? '0' + d.getMonth()
                        : d.getMonth()) +
                      '.' +
                      d.getFullYear()
                    ) {
                      console.log('erca-core');
                      this.type_core = 'erca';
                    } else {
                      this.type_core = 'no';
                      console.log('nooo-core');
                    }
                  }
              }
              data_2_amount_sum = Math.abs(Number(data_2_amount_sum));
              console.log("here the amounttttttttt: 1 "  + data_1_amount_sum) 
              console.log("here the amounttttttttt: 2 "  + data_2_amount_sum) 
              if (data_1_id.length != 0 && data_2_id.length != 0) {
                if (
                  (data_1_id.length > 1 &&data_2_id.length == 1)||
                  (data_1_id.length == 1 &&data_2_id.length > 1) &&
                  data_1_amount_sum == data_2_amount_sum
                ) {
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
                      console.log(data_1_id);
                      console.log(data_2_id);
                      this.reconcileService
                        .matchTransactionsWithComment(
                          data_1_id.toString(),
                          data_2_id.toString(),
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
                                      this.reconcileService
                                        .matchTransactionsWithComment(
                                          data_1_id.toString(),
                                          data_2_id.toString(),
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
                  
                } else if (
                  rowData1[0].value_date_type != null &&
                  rowData1[0].value_date_type
                    .toLowerCase()
                    .includes('298smt') &&
                  rowData1[0].additional_information != null &&
                  rowData1[0].additional_information
                    .toLowerCase()
                    .includes('sid') &&
                  (await this.sidExceptionAlert())
                ) {
                  var rows = dtInstance
                    .rows({ selected: true })
                    .data()
                    .toArray();
                  if (rowData1.length < 1 || rows.length < 1) {
                    this.showSelectionEmpty();
                  } else {
                    var is_amount_sum = 0;
                    var os_amount_sum = 0;
                    for (let k = 0; k < rows.length; k++)
                      if (
                        rows[k].additional_information
                          .toLowerCase()
                          .startsWith('is') ||
                        (rows[k].dr_cr.toLowerCase().startsWith('cr') &&
                          !rows[k].additional_information
                            .toLowerCase()
                            .startsWith('is'))
                      )
                        is_amount_sum += Math.abs(rows[k].amount);
                      else if (
                        rows[k].additional_information
                          .toLowerCase()
                          .startsWith('os') ||
                        (rows[k].dr_cr.toLowerCase().startsWith('dr') &&
                          !rows[k].additional_information
                            .toLowerCase()
                            .startsWith('os'))
                      )
                        os_amount_sum += Math.abs(rows[k].amount);
                    console.log('ats amounts: ' + rowData1[0].amount);
                    console.log('is amounts: ' + is_amount_sum);
                    console.log('os amounts: ' + os_amount_sum);
                    console.log(
                      'diff amounts: ' + Math.abs(is_amount_sum - os_amount_sum)
                    );

                    if (
                      rowData1[0].amount ==
                      Math.abs(is_amount_sum - os_amount_sum).toFixed(2)
                    ) {
                      this.reconcileService
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
                                      this.reconcileService
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
                                      //================================================================================
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
                      this.showErrormessage('There is an amount difference.');
                    }
                  }
                } else if (
                  this.type_ats == 'erca' &&
                  this.type_core == 'erca' &&
                  false
                ) {
                  console.log('new amount ats: ' + data_1_amount_sum);
                  console.log('new amount core: ' + data_2_amount_sum);
                  if (data_1_amount_sum == data_2_amount_sum) {
                    console.log('it is erca');
                    // dtInstance.rows({ selected: true }).data().toArray();
                    dtInstance.rows({ selected: true }).remove().draw();
                    this.reconcileService
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
                            console.log(
                              'ret: ' + JSON.stringify(data, null, 5)
                            );
                        },
                        (error: any) => {
                          console.log('ret: ' + JSON.stringify(error, null, 5));
                        }
                      );
                  } else {
                    this.showErrormessage('There is an amount difference.');
                  }
                } else if (
                  data_1_id.length == 1 && 
                  data_2_id.length == 1 &&
                  data_1_amount_sum == data_2_amount_sum &&
                  !data_2_additional_data.includes(data_1_reference.toString())
                ) {
                  if (
                    (rowData1[0].dr_cr.toLowerCase().startsWith('cr') &&
                      rowData[0].dr_cr.toLowerCase().startsWith('cr')) ||
                    (rowData1[0].dr_cr.toLowerCase().startsWith('dr') &&
                      rowData[0].dr_cr.toLowerCase().startsWith('dr'))
                  ) {
                    this.showSelectionError();
                  } else {
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
                      console.log(data_1_id);
                      console.log(data_2_id);
                      this.reconcileService
                        .matchTransactionsWithComment(
                          data_1_id.toString(),
                          data_2_id.toString(),
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
                                      this.reconcileService
                                        .matchTransactionsWithComment(
                                          data_1_id.toString(),
                                          data_2_id.toString(),
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
                  }
                } else if (data_1_amount_sum != data_2_amount_sum) {
                  if (data_1_amount_sum > data_2_amount_sum) {
                    ammount_difference = data_1_amount_sum - data_2_amount_sum;
                    description =
                      'Transaction is matched partially because total ammount at ATS is ' +
                      data_1_amount_sum +
                      ' and total amount at core is' +
                      data_2_amount_sum +
                      'with the reference' +
                      this.refAll;
                  } else {
                    ammount_difference = data_2_amount_sum - data_1_amount_sum;
                    description =
                      'Transaction is matched partially because total ammount at ATS is ' +
                      data_1_amount_sum +
                      ' and total amount at core is' +
                      data_2_amount_sum +
                      this.refAll;
                  }

                  console.log(
                    'amount differenceeeeeeeeeeeeeeeeee' +
                      ammount_difference +
                      description
                  );
                  Swal.fire({
                    title: 'Amount Difference: ',
                    text: 'It seems there is an amount difference between the selected transactions. Do you want to match them as Partial?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#0acf97',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Partial Match',
                    showDenyButton: true,
                    denyButtonText: 'Full Match',
                    cancelButtonText: "Don't Match",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      console.log('partial match');

                      const formData = new FormData();

                      for (const id_1 of data_1_id) {
                        formData.append('data_1_id', id_1);
                      }
                      for (const id_2 of data_2_id) {
                        formData.append('data_2_id', id_2);
                      }
                      formData.append('amount_difference', ammount_difference);
                      formData.append('description', description);

                      this.reconcileService
                        .matchPartialTransactions(formData)
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
                                      this.reconcileService
                                        .matchPartialTransactions(formData)
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
                    } else if (result.isDenied) {
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
                          .matchTransactionsWithComment(
                            data_1_id.toString(),
                            data_2_id.toString(),
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
                                        this.reconcileService
                                          .matchTransactionsWithComment(
                                            data_1_id.toString(),
                                            data_2_id.toString(),
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
                                                    JSON.stringify(
                                                      data,
                                                      null,
                                                      5
                                                    )
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
                    }
                  });
                } else {
                  console.log(data_1_id);
                  console.log(data_2_id);
                  this.reconcileService
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
                                  this.reconcileService
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
                                      (error) => {
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
    // for(let i = 0; i<data_1.length; i++){
    //   data_1_amount_sum += Number(JSON.stringify(data_1[i].amount, null, 4))
    // }
    // for(let i = 0; i<data_2.length; i++){
    //   data_2_amount_sum += Number(JSON.stringify(data_2[i].amount, null, 4))
    // }
  }
  // sidExceptionAlert(): Boolean {
  //   Swal.fire({
  //     text: 'Do you want us to calculate and verify the IS/OS as default?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#0acf97',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Yes calculate and verify',
  //     cancelButtonText: 'No I have calculated it myself'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // }
  async sidExceptionAlert(): Promise<Boolean> {
    return new Promise<Boolean>((resolve) => {
      Swal.fire({
        text: 'Do you want us to calculate and verify the IS/OS as default?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0acf97',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes calculate and verify',
        cancelButtonText: 'No I have calculated it myself',
      }).then((result) => {
        resolve(result.isConfirmed);
      });
    });
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
  showSelectionError() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'Both transactons are similar(credit-credit or debit-debit).',
    });
  }

  showSelectionErrorOnATS() {
    this.toast.error({
      detail: 'ERROR',
      summary:
        'Selected transactins on NBE Ats has Different DR_CR. can not sum up .',
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
        console.log('Error: ' + JSON.stringify(error, null, 2));
      }
    );
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
