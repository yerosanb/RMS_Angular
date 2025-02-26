import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { LocalStorageService } from 'ngx-webstorage';
import { EditTransactionPayload } from 'src/app/User/payloads/edit-transaction-payload/edit-transaction-payload';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { ReceivableServiceService } from '../recon-receivable/service/receivable-service.service';
import { NgToastService } from 'ng-angular-popup';
import { greaterThan0Validator } from 'src/app/utils_/validators/greater_than_0_validator';
import { cr_dr_validator } from 'src/app/utils_/validators/cd_cr_validator';
import Swal from 'sweetalert2';
declare var window: any;
@Component({
  selector: 'app-receivable-unmatch',
  templateUrl: './receivable-unmatch.component.html',
  styleUrls: ['./receivable-unmatch.component.css']
})
export class ReceivableUnmatchComponent implements OnInit {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;
 
  restricted: boolean = true;
  dtOptions_cr: any;
  dtOptions_db: any;
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

  credit_input_0!: any;
  credit_input_1!: any;
  credit_input_2!: any;
  credit_input_3!: any;
  core_input_4!: any;
  core_input_5!: any;
  credit_input_6!: any;
  credit_input_7!: any;
  credit_input_8!: any;

  debit_input_0!: any;
  debit_input_1!: any;
  debit_input_2!: any;
  debit_input_3!: any;
  // core_input_4!: any;
  // core_input_5!: any;
  debit_input_6!: any;
  debit_input_7!: any;
  debit_input_8!: any;

  core_first_column_id = '0';
  core_second_column_id = '1';
  core_third_column_id = '2';
  core_fourth_column_id = '3';
  core_fifth_column_id = '4';
  core_sixth_column_id = '5';
  core_seventh_column_id = '6';
  core_eighth_column_id = '7';
  core_ninth_column_id = '8';

  dt_credit_current_page: number = 0;
  refAll: string = '';

  editForm!: FormGroup;
  submitted: boolean = false;
  editPayload!: EditTransactionPayload;
  edit_core!: boolean;
  editModal: any;
  constructor(
    private router: Router,
    private utilService: UtilService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private receivableService: ReceivableServiceService,
    private toast: NgToastService,
    private formBuilder: FormBuilder
  )   {
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

  // onEditSubmit() {
  //   console.log(this.edit_core);
  //   if (!this.edit_core && this.editForm.valid) {
  //     console.log('form is valid');
  //     // console.log('value date: ' + this.editForm.get('value_date')?.value.toString().replace('\n', ' '))
  //     this.editForm.controls['value_date'].setValue(
  //       this.editForm.get('value_date')?.value.toString().replace('\n', ' ')
  //     );
  //     this.editPayload = this.editForm.value;
  //     this.editPayload.dr_cr = this.editForm.controls['type']?.value;
  //     this.editPayload.id = Number($('#lalksdf6a5s4d6ffas').text());
  //     this.editPayload.value_date_type =
  //       this.editForm.controls['value_date']?.value;
  //     // console.log(JSON.stringify(this.editPayload, null, 3));
  //     this.receivableService.updateTransaction(this.editPayload).subscribe(
  //       (data: any) => {
  //         console.log(JSON.stringify(data, null, 3));
  //         this.closeModal();
  //         Swal.fire({
  //           title: 'Update Success!',
  //           text: 'You have updated the transaction successfully.',
  //           icon: 'success',
  //         });

  //         this.dtElements.forEach(
  //           (dtElement: DataTableDirective, index: number) => {
  //             if (index == 0) {
  //               dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //                 dtInstance.ajax.reload((data) => {
  //                   console.log('data reload 00');
  //                 }, false);
                  
  //               });
  //             }
  //           }
  //         );
  //         this.editForm.reset();
  //         // this.editForm.controls['type'].setValue('cr');
  //       },
  //       (error) => {
  //         if (error.error.text === 'access-token-expired') {
  //           console.log('Access-token-expired requesting refresh token...');
  //           if (
  //             this.localStorageService.retrieve('refresh_token_requested') == null
  //           ) {
  //             this.utilService.refreshToken().subscribe(
  //               (data) => {
  //                 if (data === true) {
  //                   console.log(
  //                     'refresh token success re-requesting the actual request'
  //                   );
  //                   this.localStorageService.clear('refresh_token_requested');
  //                   //================================================================================
  //                   this.receivableService.updateTransaction(this.editPayload).subscribe(
  //                     (data: any) => {
  //                       console.log(JSON.stringify(data, null, 3));
  //                       this.closeModal();
  //                       Swal.fire({
  //                         title: 'Update Success!',
  //                         text: 'You have updated the transaction successfully.',
  //                         icon: 'success',
  //                       });
              
  //                       this.dtElements.forEach(
  //                         (dtElement: DataTableDirective, index: number) => {
  //                           if (index == 0) {
  //                             dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //                               dtInstance.ajax.reload((data) => {
  //                                 console.log('data reload 00');
  //                               }, false);
                                
  //                             });
  //                           }
  //                         }
  //                       );
  //                       this.editForm.reset();
  //                       // this.editForm.controls['type'].setValue('cr');
  //                     },
  //                     (error) => {
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
  //         }
  //       }
  //     );
  //   }
  //    else if (
  //     this.edit_core &&
  //     this.editForm.controls['reason'].valid &&
  //     this.editForm.controls['amount'].valid &&
  //     this.editForm.controls['value_date'].valid &&
  //     this.editForm.controls['type'].valid &&
  //     this.editForm.controls['upload_date'].valid &&
  //     this.editForm.controls['additional_information'].valid
  //   ) {
  //     this.editForm.controls['value_date'].setValue(
  //       this.editForm.get('value_date')?.value.toString().replace('\n', ' ')
  //     );
  //     this.editPayload = this.editForm.value;
  //     this.editPayload.dr_cr = this.editForm.controls['type']?.value;
  //     this.editPayload.id = Number($('#lalksdf6a5s4d6ffas').text());
  //     this.editPayload.value_date_type =
  //       this.editForm.controls['value_date']?.value;
  //     // console.log(JSON.stringify(this.editPayload, null, 3));
  //     this.receivableService.updateTransaction(this.editPayload).subscribe(
  //       (data: any) => {
  //         console.log(JSON.stringify(data, null, 3));
  //         this.closeModal();
  //         Swal.fire({
  //           title: 'Update Success!',
  //           text: 'You have updated the transaction successfully.',
  //           icon: 'success',
  //         });

  //         this.dtElements.forEach(
  //           (dtElement: DataTableDirective, index: number) => {
  //             if (index == 1) {
  //               dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //                 dtInstance.ajax.reload((data) => {
  //                   console.log('data reload 00');
  //                 }, false);
                  
  //               });
  //             }
  //           }
  //         );
  //         this.editForm.reset();
  //         // this.editForm.controls['type'].setValue('cr');
  //       },
  //       (error) => {
  //         if (error.error.text === 'access-token-expired') {
  //           console.log('Access-token-expired requesting refresh token...');
  //           if (
  //             this.localStorageService.retrieve('refresh_token_requested') == null
  //           ) {
  //             this.utilService.refreshToken().subscribe(
  //               (data) => {
  //                 if (data === true) {
  //                   console.log(
  //                     'refresh token success re-requesting the actual request'
  //                   );
  //                   this.localStorageService.clear('refresh_token_requested');
  //                   //================================================================================
  //                   this.receivableService.updateTransaction(this.editPayload).subscribe(
  //                     (data: any) => {
  //                       console.log(JSON.stringify(data, null, 3));
  //                       this.closeModal();
  //                       Swal.fire({
  //                         title: 'Update Success!',
  //                         text: 'You have updated the transaction successfully.',
  //                         icon: 'success',
  //                       });
              
  //                       this.dtElements.forEach(
  //                         (dtElement: DataTableDirective, index: number) => {
  //                           if (index == 1) {
  //                             dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //                               dtInstance.ajax.reload((data) => {
  //                                 console.log('data reload 00');
  //                               }, false);
                                
  //                             });
  //                           }
  //                         }
  //                       );
  //                       this.editForm.reset();
  //                       // this.editForm.controls['type'].setValue('cr');
  //                     },
  //                     (error) => {
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
  //         }
  //       }
  //     );
  //   } else {
  //     console.log('form is not valid.');
  //     this.submitted = true;
  //   }
  // }

  // openModal() {
  //   this.editModal.show();
  // }
  // closeModal() {
  //   this.editModal.hide();
  // }

  ngOnInit() {
    var that = this;
    // this.editModal = new window.bootstrap.Modal(
    //   document.getElementById('edit_transaction')
    // );
    this.dtOptions_cr = {
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
        this.receivableService.getCredit().subscribe(
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
                      this.receivableService.getCredit()
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
          title: this.core_second_column_title,
          data: 'branch_code',
        },
        {
          title: this.core_third_column_title,
          data: 'amount',
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
          // {
          //   extend: 'selected',
          //   text: 'Edit',
          //   action: function (e: any, dt: any, node: any, config: any) {
          //     var rows = dt.rows({ selected: true }).data().toArray();
          //     if (rows.length > 1) {
          //       Swal.fire({
          //         icon: 'warning',
          //         title: 'Please select only one row.',
          //         text: "Select only one row to edit. you can't edit multiple rows at once.",
          //       });
          //     } else {
          //       that.edit_core = true;
          //       // that.editForm.controls['reference'].setValue(
          //       //   rows[0].reference
          //       // );
          //       that.editForm.controls['amount'].setValue(rows[0].amount);
          //       that.editForm.controls['value_date'].setValue(
          //         rows[0].value_date
          //       );
          //       that.editForm.controls['upload_date'].setValue(
          //         rows[0].upload_date
          //       );
          //       that.editForm.controls['additional_information'].setValue(
          //         rows[0].additional_information
          //       );
          //       that.editForm.controls['type'].setValue(rows[0].dr_cr);
          //       $('#lalksdf6a5s4d6ffas').html(rows[0].id);
          //       that.openModal();
          //     }
          //   },
          // },
          // {
          //   extend: 'selected',
          //   text: 'Delete',
          //   action: async function (e: any, dt: any, node: any, config: any) {
          //     var rows = dt.rows({ selected: true }).data().toArray();
          //     const { value: text } = await Swal.fire({
          //       input: 'textarea',
          //       inputLabel: 'Reason',
          //       inputPlaceholder: 'Type your reason here...',
          //       inputAttributes: {
          //         'aria-label': 'Type your reason here',
          //       },
          //       title: 'Delete Warning: ',
          //       text: 'You are trying to delete a transaction. If you are sure please state your reason.',
          //       icon: 'warning',
          //       showCancelButton: true,
          //       confirmButtonColor: '#d33',
          //       cancelButtonColor: '#3085d6',
          //       confirmButtonText: 'Delete anyways',
          //     });
          //     if (text == '') {
          //       Swal.fire({
          //         title: 'Delete failed. No reason found.',
          //         icon: 'error',
          //       });
          //     } else if (text) {
          //       var ids: any[] = [];
          //       for (let i = 0; i < rows.length; i++) {
          //         ids.push(rows[i].id);
          //       }
          //       that.receivableService
          //         .deleteTransactions(text, ids, 'credit')
          //         .subscribe(
          //           (data: any) => {
          //             console.log(JSON.stringify(data, null, 3));
          //             Swal.fire({
          //               title: 'Delete Success!',
          //               text: 'You have Deleted the transaction successfully.',
          //               icon: 'success',
          //             });
          //             that.dtElements.forEach(
          //               (dtElement: DataTableDirective, index: number) => {
          //                 if (index == 0) {
          //                   dtElement.dtInstance.then(
          //                     (dtInstance: DataTables.Api) => {
          //                       dtInstance.ajax.reload((data) => {
          //                         console.log('data reload 00');
          //                       }, false);
          //                     }
          //                   );
          //                 }
          //               }
          //             );
          //           },
          //           (error) => {
          //             if (error.error.text === 'access-token-expired') {
          //               console.log('Access-token-expired requesting refresh token...');
          //               if (
          //                 that.localStorageService.retrieve('refresh_token_requested') == null
          //               ) {
          //                 that.utilService.refreshToken().subscribe(
          //                   (data) => {
          //                     if (data === true) {
          //                       console.log(
          //                         'refresh token success re-requesting the actual request'
          //                       );
          //                       that.localStorageService.clear('refresh_token_requested');
          //                       //================================================================================
          //                       that.receivableService
          //                       .deleteTransactions(text, ids, 'ats')
          //                       .subscribe(
          //                         (data: any) => {
          //                           console.log(JSON.stringify(data, null, 3));
          //                           Swal.fire({
          //                             title: 'Delete Success!',
          //                             text: 'You have Deleted the transaction successfully.',
          //                             icon: 'success',
          //                           });
          //                           that.dtElements.forEach(
          //                             (dtElement: DataTableDirective, index: number) => {
          //                               if (index == 0) {
          //                                 dtElement.dtInstance.then(
          //                                   (dtInstance: DataTables.Api) => {
          //                                     dtInstance.ajax.reload((data) => {
          //                                       console.log('data reload 00');
          //                                     }, false);
          //                                   }
          //                                 );
          //                               }
          //                             }
          //                           );
          //                         },
          //                         (error: any) => {
          //                           if (error.error.text === 'access-token-expired') {
          //                             console.log('refresh token expired.');
          //                             that.SwalSessionExpired.fire();
          //                             that._refreshTokenExpired();
          //                           } else {
          //                             Swal.fire({
          //                               icon: 'error',
          //                               title: 'Oops...',
          //                               text: 'Something went wrong!',
          //                             });
          //                             console.log(
          //                               JSON.stringify(error.error.apierror, null, 2)
          //                             );
          //                           }
          //                         }
          //                       );
          //                       //================================================================================
          //                     } else {
          //                       console.log('refresh token expired.');
          //                       that.SwalSessionExpired.fire();
          //                       that._refreshTokenExpired();
          //                     }
          //                   },
          //                   (error: any) => {
          //                     console.log('error refreshing access token');
          //                     Swal.fire({
          //                       icon: 'error',
          //                       title: 'Oops...',
          //                       text: 'Something went wrong!',
          //                     });
          //                     console.log(JSON.stringify(error.error.apierror, null, 2));
          //                   }
          //                 );
          //                 that.localStorageService.store('refresh_token_requested', true);
          //               }
          //             }
          //           }
          //         );
          //     }
          //   },
          // },
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
    this.dtOptions_db = {
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
        this.receivableService.getDebit().subscribe(
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
                      this.receivableService.getDebit()
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
          title: this.core_second_column_title,
          data: 'branch_code',
        },
        {
          title: this.core_third_column_title,
          data: 'amount',
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

          // {
          //   extend: 'selected',
          //   text: 'Edit',
          //   action: function (e: any, dt: any, node: any, config: any) {
          //     var rows = dt.rows({ selected: true }).data().toArray();
          //     if (rows.length > 1) {
          //       Swal.fire({
          //         icon: 'warning',
          //         title: 'Please select only one row.',
          //         text: "Select only one row to edit. you can't edit multiple rows at once.",
          //       });
          //     } else {
          //       that.edit_core = true;
          //       // that.editForm.controls['reference'].setValue(
          //       //   rows[0].reference
          //       // );
          //       that.editForm.controls['amount'].setValue(rows[0].amount);
          //       that.editForm.controls['value_date'].setValue(
          //         rows[0].value_date
          //       );
          //       that.editForm.controls['upload_date'].setValue(
          //         rows[0].upload_date
          //       );
          //       that.editForm.controls['additional_information'].setValue(
          //         rows[0].additional_information
          //       );
          //       that.editForm.controls['type'].setValue(rows[0].dr_cr);
          //       $('#lalksdf6a5s4d6ffas').html(rows[0].id);
          //       that.openModal();
          //     }
          //   },
          // },
          // {
          //   extend: 'selected',
          //   text: 'Delete',
          //   action: async function (e: any, dt: any, node: any, config: any) {
          //     var rows = dt.rows({ selected: true }).data().toArray();
          //     const { value: text } = await Swal.fire({
          //       input: 'textarea',
          //       inputLabel: 'Reason',
          //       inputPlaceholder: 'Type your reason here...',
          //       inputAttributes: {
          //         'aria-label': 'Type your reason here',
          //       },
          //       title: 'Delete Warning: ',
          //       text: 'You are trying to delete a transaction. If you are sure please state your reason.',
          //       icon: 'warning',
          //       showCancelButton: true,
          //       confirmButtonColor: '#d33',
          //       cancelButtonColor: '#3085d6',
          //       confirmButtonText: 'Delete anyways',
          //     });
          //     if (text == '') {
          //       Swal.fire({
          //         title: 'Delete failed. No reason found.',
          //         icon: 'error',
          //       });
          //     } else if (text) {
          //       var ids: any[] = [];
          //       for (let i = 0; i < rows.length; i++) {
          //         ids.push(rows[i].id);
          //       }
          //       that.receivableService
          //         .deleteTransactions(text, ids, 'debit')
          //         .subscribe(
          //           (data: any) => {
          //             console.log(JSON.stringify(data, null, 3));
          //             Swal.fire({
          //               title: 'Delete Success!',
          //               text: 'You have Deleted the transaction successfully.',
          //               icon: 'success',
          //             });
          //             that.dtElements.forEach(
          //               (dtElement: DataTableDirective, index: number) => {
          //                 if (index == 1) {
          //                   dtElement.dtInstance.then(
          //                     (dtInstance: DataTables.Api) => {
          //                       dtInstance.ajax.reload((data) => {
          //                         console.log('data reload 00');
          //                       }, false);
          //                     }
          //                   );
          //                 }
          //               }
          //             );
          //           },
          //           (error) => {
          //             if (error.error.text === 'access-token-expired') {
          //               console.log('Access-token-expired requesting refresh token...');
          //               if (
          //                 that.localStorageService.retrieve('refresh_token_requested') == null
          //               ) {
          //                 that.utilService.refreshToken().subscribe(
          //                   (data) => {
          //                     if (data === true) {
          //                       console.log(
          //                         'refresh token success re-requesting the actual request'
          //                       );
          //                       that.localStorageService.clear('refresh_token_requested');
          //                       //================================================================================
          //                       that.receivableService
          //                       .deleteTransactions(text, ids, 'core')
          //                       .subscribe(
          //                         (data: any) => {
          //                           console.log(JSON.stringify(data, null, 3));
          //                           Swal.fire({
          //                             title: 'Delete Success!',
          //                             text: 'You have Deleted the transaction successfully.',
          //                             icon: 'success',
          //                           });
          //                           that.dtElements.forEach(
          //                             (dtElement: DataTableDirective, index: number) => {
          //                               if (index == 1) {
          //                                 dtElement.dtInstance.then(
          //                                   (dtInstance: DataTables.Api) => {
          //                                     dtInstance.ajax.reload((data) => {
          //                                       console.log('data reload 00');
          //                                     }, false);
          //                                   }
          //                                 );
          //                               }
          //                             }
          //                           );
          //                         },
          //                         (error) => {
          //                           if (error.error.text === 'access-token-expired') {
          //                             console.log('refresh token expired.');
          //                             that.SwalSessionExpired.fire();
          //                             that._refreshTokenExpired();
          //                           } else {
          //                             Swal.fire({
          //                               icon: 'error',
          //                               title: 'Oops...',
          //                               text: 'Something went wrong!',
          //                             });
          //                             console.log(
          //                               JSON.stringify(error.error.apierror, null, 2)
          //                             );
          //                           }
          //                         }
          //                       );
          //                       //================================================================================
          //                     } else {
          //                       console.log('refresh token expired.');
          //                       that.SwalSessionExpired.fire();
          //                       that._refreshTokenExpired();
          //                     }
          //                   },
          //                   (error: any) => {
          //                     console.log('error refreshing access token');
          //                     Swal.fire({
          //                       icon: 'error',
          //                       title: 'Oops...',
          //                       text: 'Something went wrong!',
          //                     });
          //                     console.log(JSON.stringify(error.error.apierror, null, 2));
          //                   }
          //                 );
          //                 that.localStorageService.store('refresh_token_requested', true);
          //               }
          //             }
          //           }
          //         );
          //     }
          //   },
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
  }

  restrictedChange() { }

  // addSelectEvent(that: any, dtInstance: any, dt: any, indexes: any) {
  //   if (that.restricted) {
  //     that.dt_credit_current_page = dt.page();
  //     var rowData = dtInstance.rows(indexes).data().toArray();
  //     that.amount = rowData[0].amount;
  //     that.credit_input_2 = that.amount;

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
  //                 that.amount


  //               )
  //               .draw();
  //           });
  //           console.log('to search: ' + that.amount);
  //           // console.log('selectionsssssssssssssssst: ' + that.selections);
  //         } else {
  //           dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //             // dtInstance;
  //             dtInstance
  //               .column(2)
  //               .search(
  //                 that.amount



  //               )
  //               .draw();
  //           });
  //           console.log('searched...');
  //         }
  //       }
  //     );
  //   }
  // }
  matchTransactions() {
    var data_1_id: any[] = [];
    var data_1_amount: any[] = [];
    var data_2_id: any[] = [];
    var data_2_amount: any[] = [];
    var amount1: number = 0;
    var amount2: number = 0;
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

                  data_1_id.push(rowData[i].id);
                  data_1_amount.push(rowData[i].amount);

                }
              }
            });
          } else {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              var rowData2 = dtInstance
                .rows({ selected: true })
                .data()
                .toArray();
              for (let i = 0; i < rowData2.length; i++) {
                data_2_id.push(rowData2[i].id);
                data_2_amount.push(rowData2[i].amount);
              }
              if (data_1_id.length != 0 && data_2_id.length != 0) {
                if (rowData1[0].amount != null && rowData1[0].dr_cr.toLowerCase().includes('cr')) {
                  if(rowData1[0].amount != rowData2[0].amount){
                    this.AmountDifference();
                  }
                  else {
                    console.log(data_1_id);
                    console.log(data_2_id);
                    this.receivableService
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
                                    this.receivableService
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
               rowData1=rowData
               // amount1 = rowData1[0].amount;
                for (let i = 0; i < rowData.length; i++) {
                  data_1_id.push(rowData[i].id);
                  data_1_amount.push(rowData[i].amount);
                }
              }
            });
          } else {
            dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
              var rowData2 = dtInstance
                .rows({ selected: true })
                .data()
                .toArray();
              for (let i = 0; i < rowData2.length; i++) {
                data_2_id.push(rowData2[i].id);
                data_2_amount.push(rowData2[i].amount);
              }
              if (data_1_id.length != 0 && data_2_id.length != 0) {
                console.log("amount 1--------------------------->"+rowData1[0].amount)
                console.log("amount 2--------------------------->"+rowData2[0].amount)
                if (data_1_id.length == 1 && data_2_id.length == 1 && rowData1[0].amount != rowData2[0].amount) {
                  const { value: text } = await Swal.fire({
                    input: 'textarea',
                    inputLabel: 'Reason',
                    inputPlaceholder: 'Type your reason here...',
                    inputAttributes: {
                      'aria-label': 'Type your reason here',
                    },
                    title: 'Amount Difference: ',
                    text: "It seems there is a amount difference between the selected transactions. If you are sure, state your reason and click 'Match anyways'.",
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
                    var type = 'amount';
                    console.log(data_1_id);
                    console.log(data_2_id);
                    this.receivableService
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
                                    this.receivableService
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
                // else if (data_1_id.length == 1 && data_2_id.length == 1 && rowData1[0].amount == rowData2[0].amount) {
                //   this.showSelectionMismatch()

                // }
                else if (data_1_id.length == 1 && data_2_id.length == 1 && rowData1[0].amount == rowData2[0].amount) {
                  console.log(data_1_id);
                  console.log(data_2_id);
                  this.receivableService
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
                                  this.receivableService
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
                  this.showSelectionEmpty();
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

  clearAllSearches() {
    if (this.dtElements != null && this.dtElements.length > 0)
      this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {

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
            dtInstance.page(this.dt_credit_current_page).draw(false);
          });
        }
        else {
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
      })
  }


  ngAfterViewInit(): void {
    var that = this;

    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if (index == 0) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // dtInstance.on('select', function (e, dt, type, indexes) {
          //   that.addSelectEvent(that, dtInstance, dt, indexes);
          // })
          dtInstance.columns().every(function () {
            $('input', this.footer()).on('keyup change', function () {
              if (this['id'] == '2') {
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
        });
      }
    }
    )
    that.clearAllSearches()
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

  AmountDifference() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'Amount Difference.',
    });
  }

  showSelectionMismatch() {
    this.toast.error({
      detail: 'ERROR',
      summary: 'Please select only one transactio on credit or debit side.',
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

