// import {
//   Component,
//   QueryList,
//   Renderer2,
//   ViewChild,
//   ViewChildren,
// } from '@angular/core';
// import { Router } from '@angular/router';
// import { DataTableDirective } from 'angular-datatables';
// import { LocalStorageService } from 'ngx-webstorage';
// import { UtilService } from 'src/app/services/util-service/util.service';
// import { ReconManualFixedAssetService } from '../../service/recon-manual-fixed-asset.service';
// import Swal from 'sweetalert2';
// import { formatDate } from '@angular/common';
// import { NgToastService } from 'ng-angular-popup';
// import {
//   FormBuilder,
// } from '@angular/forms';

// import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
// import { AuthService } from 'src/app/services/auth-service.service';
// declare var window: any;
// @Component({
//   selector: 'app-recon-manual-fixed-asset',
//   templateUrl: './recon-manual-fixed-asset.component.html',
//   styleUrls: ['./recon-manual-fixed-asset.component.css']
// })
// export class ReconManualFixedAssetComponent {
//   @ViewChild('SwalSessionExpired')
//   public readonly SwalSessionExpired!: SwalComponent;

//   @ViewChildren(DataTableDirective)
//   dtElements!: QueryList<DataTableDirective>;

//   initialDateValue = new Date();
//   refresh_token_requested = false;
//   reload_checker: boolean = true;

//   dtOptions_mms: any;
//   dtOptions_core: any;

//   restricted: boolean = true;

//   //mms inits

//   mms_first_column_title = '-ID-';
//   mms_second_column_title = 'Giv Number';
//   mms_third_column_title = 'Grv Number';
//   mms_fourth_column_title = 'Original_cost';
//   mms_fifth_column_title = 'Main_pg';
//   mms_seventh_column_title = 'Tag_number';
//   mms_eighth_column_title = 'Created_Date';
//   mms_ninth_column_title = 'Branch_name';
//   mms_tenth_column_title = 'Asset_Description';
//   // mms_eleventh_column_title = 'BBF';
//   // mms_twelfth_column_title = 'Tran Code';
//   // mms_thirteenth_column_title = 'Main Page';
//   // mms_fourteenth_column_title = 'Store Name';
//   // mms_fifteenth_column_title = 'Category Description';
//   // mms_sixteenth_column_title = 'Action';


//   mms_input_0!: any;
//   mms_input_1!: any;
//   mms_input_2!: any;
//   mms_input_3!: any;
//   mms_input_4!: any;
//   mms_input_5!: any;
//   mms_input_6!: any;
//   mms_input_7!: any;
//   mms_input_8!: any;
//   mms_input_9!: any;
//   // mms_input_10!: any;
//   // mms_input_11!: any;
//   // mms_input_12!: any;
//   // mms_input_13!: any;

//   mms_first_column_id = '0';
//   mms_second_column_id = '1';
//   mms_third_column_id = '2';
//   mms_fourth_column_id = '3';
//   mms_fifth_column_id = '4';
//   mms_sixth_column_id = '5';
//   mms_seventh_column_id = '6';
//   mms_eighth_column_id = '7';
//   mms_ninth_column_id = '8';
//   mms_tenth_column_id = '9';
//   // mms_eleventh_column_id = '10';
//   // mms_twelfth_column_id = '11';
//   // mms_thirteenth_column_id = '12';
//   // mms_fourteenth_column_id = '13'
//   // mms_fifteenth_column_id = '14'



//   //core inits

//   core_first_column_title = '-ID-';
//   core_second_column_title = 'Narration';
//   core_third_column_title = 'Credit';
//   core_fourth_column_title = 'Debit';
//   core_fifth_column_title = 'Reference';
//   core_sixth_column_title = 'Account Number';
//   core_seventh_column_title = 'Transaction Date';
//   core_eighth_column_title = 'Posting Date';
//   core_ninth_column_title = 'Value Date';
//   core_tenth_column_title = 'Branch Code';
//   core_eleventh_column_title = 'Account Description';
//   core_twelfth_column_title = 'Account Name';
//   core_thirteenth_column_title = 'Action';


//   core_input_0!: any;
//   core_input_1!: any;
//   core_input_2!: any;
//   core_input_3!: any;
//   core_input_4!: any;
//   core_input_5!: any;
//   core_input_6!: any;
//   core_input_7!: any;
//   core_input_8!: any;
//   core_input_9!: any;
//   core_input_10!: any;
//   core_input_11!: any;



//   core_first_column_id = '0';
//   core_second_column_id = '1';
//   core_third_column_id = '2';
//   core_fourth_column_id = '3';
//   core_fifth_column_id = '4';
//   core_sixth_column_id = '5';
//   core_seventh_column_id = '6';
//   core_eighth_column_id = '7';
//   core_ninth_column_id = '8';
//   core_tenth_column_id = '9';
//   core_eleventh_column_id = '10';
//   core_twelfth_column_id = '11';



//   refAll: string = '';
//   grv_no: string='';
//   dt_mms_current_page: number = 0;
//   empty_provider: string = '';
//   empty_provider_string: string =
//     '2l210k3j5h8g5f4d7r7e7s4w5a6q5t4y1u3i1o7p8m9n6b5v4cx1z__)())((';


//   mms_debit_credit_list: any[] = [];
//   total_mms_amount: number = 0;

//   core_debit_credit_list: any[] = [];
//   total_core_amount: number = 0;


//   constructor(
//     private renderer: Renderer2,
//     private router: Router,
//     private utilService: UtilService,
//     private authService: AuthService,
//     private localStorageService: LocalStorageService,
//     private reconManualFixedAssetService: ReconManualFixedAssetService,
//     private toast: NgToastService,
//     private formBuilder: FormBuilder
//   ) {
//   }


//   onReconDateChange(value: Date): void {
//     this.initialDateValue = new Date(value);
//     this.localStorageService.store(
//       'recon_current_date_fixed_asset_manual',
//       this.initialDateValue
//     );
//     if (!this.reload_checker)
//       this.dtElements.forEach(
//         (dtElement: DataTableDirective, index: number) => {
//           if (index == 0) {
//             dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//               dtInstance.ajax.reload((data) => { }, false);
//             });
//           }
//         }
//       );
//     this.reload_checker = false;
//   }

//   someFilterFromAts(info: any): void { }
//   autoMatchTransactions() {
//     console.log('auto match transaction');
//   }

//   ngOnInit(): void {
//     var that = this;
//     if (
//       this.localStorageService.retrieve('recon_current_date_fixed_asset_manual') ==
//       null
//     ) {
//       this.initialDateValue = new Date();
//       this.localStorageService.store(
//         'recon_current_date_fixed_asset_manual',
//         this.initialDateValue
//       );
//     } else
//       this.initialDateValue = new Date(
//         this.localStorageService.retrieve('recon_current_date_fixed_asset_manual')
//       );
//     try {
//       this.dtOptions_mms = {
//         serverSide: false,
//         scrollX: true,
//         searching: true,
//         // lengthMenu: 'ten',
//         lengthChange: true,
//         ordering: true,
//         paging: true,
//         // scrollY: 400,
//         pagingType: 'full_numbers',
//         pageLength: 10,
//         lengthMenu: [5, 10, 20, 50, 100, 200, 500],
//         select: true,
//         // ajax: '../../../../assets/data/data.json',
//         rowCallback: (row: Node, data: any[] | Object, index: number) => {
//           const self = this;
//           $('td', row).off('click');
//           $('td', row).on('click', () => {
//             self.someFilterFromAts(data);
//           });
//           return row;
//         },
//         ajax: (dataTablesParameters: any, callback: any) => {
//           this.reconManualFixedAssetService
//             .get_raw_fixed_mms_for_recon(
//               formatDate(this.initialDateValue, 'yyyy-MM-dd', 'en-US')
//             )
//             .subscribe(
//               async (resp: any) => {
//                 if (resp != null) {
//                   console.log(
//                     'response for table: ' + JSON.stringify(resp, null, 2)
//                   );
//                   // data: resp
//                   callback({
//                     recordsTotal: resp.recordsTotal,
//                     recordsFiltered: resp.recordsFiltered,
//                     data: resp,
//                   });
//                   console.log(
//                     'records total: ' + JSON.stringify(resp.recordsTotal)
//                   );
//                 } else {
//                   Swal.fire({
//                     icon: 'error',
//                     title: 'Permission',
//                     text: 'You are not permitted to perform this action!',
//                   });
//                 }
//               },
//               (error: any) => {
//                 if (error.error.text === 'access-token-expired') {
//                   console.log(
//                     'Access-token-expired requesting refresh token...'
//                   );
//                   if (
//                     this.localStorageService.retrieve(
//                       'refresh_token_requested'
//                     ) == null
//                   ) {
//                     this.utilService.refreshToken().subscribe(
//                       (data) => {
//                         if (data === true) {
//                           console.log(
//                             'refresh token success re-requesting the actual request'
//                           );
//                           this.localStorageService.clear(
//                             'refresh_token_requested'
//                           );
//                           //================================================================================
//                           this.reconManualFixedAssetService
//                             .get_raw_fixed_mms_for_recon(
//                               formatDate(
//                                 this.initialDateValue,
//                                 'yyyy-MM-dd',
//                                 'en-US'
//                               )
//                             )
//                             .subscribe(
//                               async (resp: any) => {
//                                 if (resp != null) {
//                                   console.log(
//                                     'response for table: ' +
//                                     JSON.stringify(resp, null, 2)
//                                   );
//                                   // data: resp
//                                   callback({
//                                     recordsTotal: resp.recordsTotal,
//                                     recordsFiltered: resp.recordsFiltered,
//                                     data: resp,
//                                   });
//                                   console.log(
//                                     'records total: ' +
//                                     JSON.stringify(resp.recordsTotal)
//                                   );
//                                 } else {
//                                   Swal.fire({
//                                     icon: 'error',
//                                     title: 'Permission',
//                                     text: 'You are not permitted to perform this action!',
//                                   });
//                                 }
//                               },
//                               (error: any) => {
//                                 if (
//                                   error.error.text === 'access-token-expired'
//                                 ) {
//                                   console.log('refresh token expired.');
//                                   this.SwalSessionExpired.fire();
//                                   this._refreshTokenExpired();
//                                 } else {
//                                   Swal.fire({
//                                     icon: 'error',
//                                     title: 'Oops...',
//                                     text: 'Something went wrong!',
//                                   });
//                                   console.log(
//                                     JSON.stringify(
//                                       error.error.apierror,
//                                       null,
//                                       2
//                                     )
//                                   );
//                                 }
//                               }
//                             );
//                           //================================================================================
//                         } else {
//                           console.log('refresh token expired.');
//                           this.SwalSessionExpired.fire();
//                           this._refreshTokenExpired();
//                         }
//                       },
//                       (error: any) => {
//                         console.log('error refreshing access token');
//                         Swal.fire({
//                           icon: 'error',
//                           title: 'Oops...',
//                           text: 'Something went wrong!',
//                         });
//                         console.log(
//                           JSON.stringify(error.error.apierror, null, 2)
//                         );
//                       }
//                     );
//                     this.localStorageService.store(
//                       'refresh_token_requested',
//                       true
//                     );
//                   }
//                 } else {
//                   Swal.fire({
//                     icon: 'error',
//                     title: 'Oops...',
//                     text: 'Something went wrong!',
//                   });
//                   console.log(JSON.stringify(error.error.apierror, null, 2));
//                 }
//               }
//             );
//         },
//         columns: [
//           {
//             title: this.mms_first_column_title,
//             data: 'id',
//           },
//           {
//             title: this.mms_second_column_title,
//             data: 'giv_number',
//           },
//           {
//             title: this.mms_third_column_title,
//             data: 'grv_number',
//           },
//           {
//             title: this.mms_fourth_column_title,
//             data: 'original_cost',
//           },
//           {
//             title: this.mms_fifth_column_title,
//             data: 'main_pg',
//           },
//           {
//             title: this.mms_seventh_column_title,
//             data: 'tag_number',
//           },
//           {
//             title: this.mms_eighth_column_title,
//             data: 'created_date',
//           },
//           {
//             title: this.mms_ninth_column_title,
//             data: 'branch_name',
//           },
//           {
//             title: this.mms_tenth_column_title,
//             data: 'asset_description',
//           },


//         ],
//         dom: "<'row mb-1 my-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",

//         buttons: {
//           buttons: [
//             'colvis',
//             {
//               text: 'Reload',
//               action: function (e: any, dt: any, node: any, config: any) {
//                 dt.ajax.reload();
//               },
//             },

//             {
//               extend: 'selected',
//               text: 'Sum',
//               action: function (e: any, dt: any, node: any, config: any) {
//                 var rows = dt.rows({ selected: true }).data().toArray();
//                 if (rows.length < 2) {
//                   Swal.fire({
//                     icon: 'warning',
//                     text: 'Please select more than one row to sum up their amount.',
//                   });
//                 } else {
//                   var sum = 0;
//                   var original_cost=0;
                 
//                   for (let i = 0; i < rows.length; i++) {
//                     original_cost+=rows[i].original_cost;
                                   
//                    }
//                    if(original_cost>0 ){
//                     sum = original_cost;
//                    }
//                    else if(original_cost=0)
//                    {
//                     sum=sum;
//                    }
                 
                
//                   Swal.fire({
//                     text: 'The sum of selected amounts is ' + sum.toFixed(2),
//                   });
//                 }
//               },
//             },
            
//             {
//               extend: 'selected',
//               text: 'Delete',
//               action: async function (e: any, dt: any, node: any, config: any) {
//                 var rows = dt.rows({ selected: true }).data().toArray();
//                 const { value: text } = await Swal.fire({
//                   input: 'textarea',
//                   inputLabel: 'Reason',
//                   inputPlaceholder: 'Type your reason here...',
//                   inputAttributes: {
//                     'aria-label': 'Type your reason here',
//                   },
//                   title: 'Delete Warning: ',
//                   text: 'You are trying to delete a transaction. If you are sure please state your reason.',
//                   icon: 'warning',
//                   showCancelButton: true,
//                   confirmButtonColor: '#d33',
//                   cancelButtonColor: '#3085d6',
//                   confirmButtonText: 'Delete anyways',
//                 });
//                 if (text == '') {
//                   Swal.fire({
//                     title: 'Delete failed. No reason found.',
//                     icon: 'error',
//                   });
//                 } else if (text) {
//                   var ids: any[] = [];
//                   for (let i = 0; i < rows.length; i++) {
//                     ids.push(rows[i].id);
//                   }
//                   that.reconManualFixedAssetService
//                     .deleteTransactions(text, ids, 'mms')
//                     .subscribe(
//                       (data: any) => {
//                         console.log(JSON.stringify(data, null, 3));
//                         Swal.fire({
//                           title: 'Delete Success!',
//                           text: 'You have Deleted the transaction successfully.',
//                           icon: 'success',
//                         });
//                          that.clearAllSearches();
//                         that.dtElements.forEach(
//                           (dtElement: DataTableDirective, index: number) => {
//                             if (index == 0) {
//                               dtElement.dtInstance.then(
//                                 (dtInstance: DataTables.Api) => {
//                                   dtInstance.ajax.reload((data) => {
//                                     console.log('data reload 00');
//                                   }, false);
//                                 }
//                               );
//                             }
//                           }
//                         );
                        
//                       },
//                       (error) => {
//                         if (error.error.text === 'access-token-expired') {
//                           console.log(
//                             'Access-token-expired requesting refresh token...'
//                           );
//                           if (
//                             that.localStorageService.retrieve(
//                               'refresh_token_requested'
//                             ) == null
//                           ) {
//                             that.utilService.refreshToken().subscribe(
//                               (data) => {
//                                 if (data === true) {
//                                   console.log(
//                                     'refresh token success re-requesting the actual request'
//                                   );
//                                   that.localStorageService.clear(
//                                     'refresh_token_requested'
//                                   );
//                                   //================================================================================
//                                   that.reconManualFixedAssetService
//                                     .deleteTransactions(text, ids, 'mms')
//                                     .subscribe(
//                                       (data: any) => {
//                                         console.log(
//                                           JSON.stringify(data, null, 3)
//                                         );
//                                         Swal.fire({
//                                           title: 'Delete Success!',
//                                           text: 'You have Deleted the transaction successfully.',
//                                           icon: 'success',
//                                         });
//                                         that.clearAllSearches();
//                                         that.dtElements.forEach(
//                                           (
//                                             dtElement: DataTableDirective,
//                                             index: number
//                                           ) => {
//                                             if (index == 0) {
//                                               dtElement.dtInstance.then(
//                                                 (
//                                                   dtInstance: DataTables.Api
//                                                 ) => {
//                                                   dtInstance.ajax.reload(
//                                                     (data) => {
//                                                       console.log(
//                                                         'data reload 00'
//                                                       );
//                                                     },
//                                                     false
//                                                   );
//                                                 }
//                                               );
//                                             }
//                                           }
//                                         );
//                                       },
//                                       (error: any) => {
//                                         if (
//                                           error.error.text ===
//                                           'access-token-expired'
//                                         ) {
//                                           console.log('refresh token expired.');
//                                           that.SwalSessionExpired.fire();
//                                           that._refreshTokenExpired();
//                                         } else {
//                                           Swal.fire({
//                                             icon: 'error',
//                                             title: 'Oops...',
//                                             text: 'Something went wrong!',
//                                           });
//                                           console.log(
//                                             JSON.stringify(
//                                               error.error.apierror,
//                                               null,
//                                               2
//                                             )
//                                           );
//                                         }
//                                       }
//                                     );

//                                   //================================================================================
//                                 } else {
//                                   console.log('refresh token expired.');
//                                   that.SwalSessionExpired.fire();
//                                   that._refreshTokenExpired();
//                                 }
//                               },
//                               (error: any) => {
//                                 console.log('error refreshing access token');
//                                 Swal.fire({
//                                   icon: 'error',
//                                   title: 'Oops...',
//                                   text: 'Something went wrong!',
//                                 });
//                                 console.log(
//                                   JSON.stringify(error.error.apierror, null, 2)
//                                 );
//                               }
//                             );
//                             that.localStorageService.store(
//                               'refresh_token_requested',
//                               true
//                             );
//                           }
//                         }
//                       }
//                     );
//                 }
//               },
//             },
//             {
//               extend: 'excel',
//               text: 'excel',
//             },
//             {
//               extend: 'collection',
//               text: 'Header',
//               autoClose: true,
//               background: true,
//               dropup: false,
//               collectionTitle: '',
//               buttons: [
//                 {
//                   text: 'Enable fixed header',
//                   key: '1',
//                   action: function (e: any, dt: any, node: any, config: any) {
//                     dt.fixedHeader.enable();
//                   },
//                 },
//                 {
//                   text: 'Disable fixed header',
//                   key: '1',
//                   action: function (e: any, dt: any, node: any, config: any) {
//                     dt.fixedHeader.disable();
//                   },
//                 },
//               ],
//               fade: true,
//             },
//           ],
//         },

//         stateSave: true,
//         stateDuration: 0,
//         fixedFooter: true,
//         fixedHeader: {
//           header: true,
//         },
//         scrollCollapse: true,

//         columnDefs: [
//           {
//             targets: '_all',
//             defaultContent: '-',
//           },
//         ],
//       };
//     } catch (ex) {
//       console.log('Exception: ' + JSON.stringify(ex));
//     }
//     try {
//       this.dtOptions_core = {
//         serverSide: false,
//         scrollX: true,
//         searching: true,
//         lengthChange: true,
//         ordering: true,
//         paging: true,
//         pagingType: 'full_numbers',
//         pageLength: 10,
//         lengthMenu: [5, 10, 20, 50, 100, 200, 500],
//         select: true,
//         ajax: (dataTablesParameters: any, callback: any) => {
//           this.reconManualFixedAssetService.get_raw_fixed_core_for_recon().subscribe(
//             async (resp: any) => {
//               if (resp != null) {
//                 callback({
//                   recordsTotal: resp.recordsTotal,
//                   recordsFiltered: resp.recordsFiltered,
//                   data: resp,
//                 });
//                 console.log(
//                   'records total: ' + JSON.stringify(resp.recordsTotal)
//                 );
//               } else {
//                 Swal.fire({
//                   icon: 'error',
//                   title: 'Permission',
//                   text: 'You are not permitted to perform this action!',
//                 });
//               }
//             },
//             (error: any) => {
//               if (error.error.text === 'access-token-expired') {
//                 console.log('Access-token-expired requesting refresh token...');
//                 if (
//                   this.localStorageService.retrieve(
//                     'refresh_token_requested'
//                   ) == null
//                 ) {
//                   this.utilService.refreshToken().subscribe(
//                     (data) => {
//                       if (data === true) {
//                         console.log(
//                           'refresh token success re-requesting the actual request'
//                         );
//                         this.localStorageService.clear(
//                           'refresh_token_requested'
//                         );
//                         //================================================================================
//                         this.reconManualFixedAssetService.get_raw_fixed_core_for_recon().subscribe(
//                           async (resp: any) => {
//                             if (resp != null) {
//                               console.log(
//                                 'response for table: ' +
//                                 JSON.stringify(resp, null, 2)
//                               );
//                               // data: resp
//                               callback({
//                                 recordsTotal: resp.recordsTotal,
//                                 recordsFiltered: resp.recordsFiltered,
//                                 data: resp,
//                               });
//                               console.log(
//                                 'records total: ' +
//                                 JSON.stringify(resp.recordsTotal)
//                               );
//                             } else {
//                               Swal.fire({
//                                 icon: 'error',
//                                 title: 'Permission',
//                                 text: 'You are not permitted to perform this action!',
//                               });
//                             }
//                           },
//                           (error: any) => {
//                             if (error.error.text === 'access-token-expired') {
//                               console.log('refresh token expired.');
//                               this.SwalSessionExpired.fire();
//                               this._refreshTokenExpired();
//                             } else {
//                               Swal.fire({
//                                 icon: 'error',
//                                 title: 'Oops...',
//                                 text: 'Something went wrong!',
//                               });
//                               console.log(
//                                 JSON.stringify(error.error.apierror, null, 2)
//                               );
//                             }
//                           }
//                         );
//                         //================================================================================
//                       } else {
//                         console.log('refresh token expired.');
//                         this.SwalSessionExpired.fire();
//                         this._refreshTokenExpired();
//                       }
//                     },
//                     (error: any) => {
//                       console.log('error refreshing access token');
//                       Swal.fire({
//                         icon: 'error',
//                         title: 'Oops...',
//                         text: 'Something went wrong!',
//                       });
//                       console.log(
//                         JSON.stringify(error.error.apierror, null, 2)
//                       );
//                     }
//                   );
//                   this.localStorageService.store(
//                     'refresh_token_requested',
//                     true
//                   );
//                 }
//               } else {
//                 Swal.fire({
//                   icon: 'error',
//                   title: 'Oops...',
//                   text: 'Something went wrong!',
//                 });
//                 console.log(JSON.stringify(error.error.apierror, null, 2));
//               }
//             }
//           );
//         },
//         columns: [
//           {
//             title: this.core_first_column_title,
//             data: 'id',
//           },
//           {
//             title: this.core_second_column_title,
//             data: 'naration',
//           },
//           {
//             title: this.core_third_column_title,
//             data: 'credit',
//           },
//           {
//             title: this.core_fourth_column_title,
//             data: 'debit',
//           },

//           {
//             title: this.core_fifth_column_title,
//             data: 'reference',
//           },
//           {
//             title: this.core_sixth_column_title,
//             data: 'account_number',
//           },
//           {
//             title: this.core_seventh_column_title,
//             data: 'transaction_date',
//           },
//           {
//             title: this.core_eighth_column_title,
//             data: 'posting_date',
//           },
//           {
//             title: this.core_ninth_column_title,
//             data: 'value_date',
//           },
//           {
//             title: this.core_tenth_column_title,
//             data: 'branch_code',
//           },
//           {
//             title: this.core_eleventh_column_title,
//             data: 'account_description',
//           },
//           {
//             title: this.core_twelfth_column_title,
//             data: 'account_name',
//           },
//         ],
//         dom: "<'row mb-1 my-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
//         buttons: {
//           buttons: [
//             'colvis',
//             {
//               text: 'Reload',
//               action: function (e: any, dt: any, node: any, config: any) {
//                 dt.ajax.reload();
//               },
//             },

//             {
//               extend: 'selected',
//               text: 'Sum',
//               action: function (e: any, dt: any, node: any, config: any) {
//                 var rows = dt.rows({ selected: true }).data().toArray();
//                 if (rows.length < 2) {
//                   Swal.fire({
//                     icon: 'warning',
//                     text: 'Please select more than one row to sum up their amount.',
//                   });
//                 } else {
//                   var sum = 0;
//                   var debit=0;
//                   var credit=0;
//                   for (let i = 0; i < rows.length; i++) {
//                     debit+=rows[i].debit;
//                     credit+=rows[i].credit;                 
//                    }
//                    if(debit>0 && credit>0){
//                     sum = (credit-debit);
//                    }
//                    else if(debit>0 && credit==0)
//                    {
//                     sum=debit;
//                    }
//                    else
//                    sum=credit;
                
//                   Swal.fire({
//                     text: 'The sum of selected amounts is ' + sum.toFixed(2),
//                   });
//                 }
//               },
//             },

//             {
//               extend: 'selected',
//               text: 'Delete',
//               action: async function (e: any, dt: any, node: any, config: any) {
//                 var rows = dt.rows({ selected: true }).data().toArray();
//                 const { value: text } = await Swal.fire({
//                   input: 'textarea',
//                   inputLabel: 'Reason',
//                   inputPlaceholder: 'Type your reason here...',
//                   inputAttributes: {
//                     'aria-label': 'Type your reason here',
//                   },
//                   title: 'Delete Warning: ',
//                   text: 'You are trying to delete a transaction. If you are sure please state your reason.',
//                   icon: 'warning',
//                   showCancelButton: true,
//                   confirmButtonColor: '#d33',
//                   cancelButtonColor: '#3085d6',
//                   confirmButtonText: 'Delete anyways',
//                 });
//                 if (text == '') {
//                   Swal.fire({
//                     title: 'Delete failed. No reason found.',
//                     icon: 'error',
//                   });
//                 } else if (text) {
//                   var ids: any[] = [];
//                   for (let i = 0; i < rows.length; i++) {
//                     ids.push(rows[i].id);
//                   }
//                   that.reconManualFixedAssetService
//                     .deleteTransactions(text, ids, 'core')
//                     .subscribe(
//                       (data: any) => {
//                         console.log(JSON.stringify(data, null, 3));
//                         Swal.fire({
//                           title: 'Delete Success!',
//                           text: 'You have Deleted the transaction successfully.',
//                           icon: 'success',
//                         });

//                         that.dtElements.forEach(
//                           (dtElement: DataTableDirective, index: number) => {
//                             if (index == 1) {
//                               dtElement.dtInstance.then(
//                                 (dtInstance: DataTables.Api) => {
//                                   dtInstance.ajax.reload((data) => {
//                                     console.log('data reload 00');
//                                   }, false);
//                                 }
//                               );
//                             }
//                           }
//                         );
//                       },
//                       (error) => {
//                         if (error.error.text === 'access-token-expired') {
//                           console.log(
//                             'Access-token-expired requesting refresh token...'
//                           );
//                           if (
//                             that.localStorageService.retrieve(
//                               'refresh_token_requested'
//                             ) == null
//                           ) {
//                             that.utilService.refreshToken().subscribe(
//                               (data) => {
//                                 if (data === true) {
//                                   console.log(
//                                     'refresh token success re-requesting the actual request'
//                                   );
//                                   that.localStorageService.clear(
//                                     'refresh_token_requested'
//                                   );
//                                   //================================================================================
//                                   that.reconManualFixedAssetService
//                                     .deleteTransactions(text, ids, 'core')
//                                     .subscribe(
//                                       (data: any) => {
//                                         console.log(
//                                           JSON.stringify(data, null, 3)
//                                         );
//                                         Swal.fire({
//                                           title: 'Delete Success!',
//                                           text: 'You have Deleted the transaction successfully.',
//                                           icon: 'success',
//                                         });

//                                         that.dtElements.forEach(
//                                           (
//                                             dtElement: DataTableDirective,
//                                             index: number
//                                           ) => {
//                                             if (index == 1) {
//                                               dtElement.dtInstance.then(
//                                                 (
//                                                   dtInstance: DataTables.Api
//                                                 ) => {
//                                                   dtInstance.ajax.reload(
//                                                     (data) => {
//                                                       console.log(
//                                                         'data reload 00'
//                                                       );
//                                                     },
//                                                     false
//                                                   );
//                                                 }
//                                               );
//                                             }
//                                           }
//                                         );
//                                       },
//                                       (error: any) => {
//                                         if (
//                                           error.error.text ===
//                                           'access-token-expired'
//                                         ) {
//                                           console.log('refresh token expired.');
//                                           that.SwalSessionExpired.fire();
//                                           that._refreshTokenExpired();
//                                         } else {
//                                           Swal.fire({
//                                             icon: 'error',
//                                             title: 'Oops...',
//                                             text: 'Something went wrong!',
//                                           });
//                                           console.log(
//                                             JSON.stringify(
//                                               error.error.apierror,
//                                               null,
//                                               2
//                                             )
//                                           );
//                                         }
//                                       }
//                                     );

//                                   //================================================================================
//                                 } else {
//                                   console.log('refresh token expired.');
//                                   that.SwalSessionExpired.fire();
//                                   that._refreshTokenExpired();
//                                 }
//                               },
//                               (error: any) => {
//                                 console.log('error refreshing access token');
//                                 Swal.fire({
//                                   icon: 'error',
//                                   title: 'Oops...',
//                                   text: 'Something went wrong!',
//                                 });
//                                 console.log(
//                                   JSON.stringify(error.error.apierror, null, 2)
//                                 );
//                               }
//                             );
//                             that.localStorageService.store(
//                               'refresh_token_requested',
//                               true
//                             );
//                           }
//                         }
//                       }
//                     );
//                 }
//               },
//             },
            
//             {
//               extend: 'excel',
//               text: 'excel',
//             },

//             {
//               extend: 'collection',
//               text: 'Header',
//               autoClose: true,
//               background: true,
//               dropup: false,
//               collectionTitle: '',
//               buttons: [
//                 {
//                   text: 'Enable fixed header',
//                   key: '1',
//                   action: function (e: any, dt: any, node: any, config: any) {
//                     dt.fixedHeader.enable();
//                   },
//                 },
//                 {
//                   text: 'Disable fixed header',
//                   key: '1',
//                   action: function (e: any, dt: any, node: any, config: any) {
//                     dt.fixedHeader.disable();
//                   },
//                 },
//               ],
//               fade: true,
//             },
//           ],
//         },

//         stateSave: true,
//         stateDuration: 0,
//         fixedFooter: true,
//         fixedHeader: {
//           header: true,
//         },
//         scrollCollapse: true,
//         columnDefs: [
//           {
//             targets: '_all',
//             defaultContent: '-',
//           },
//         ],
//       };
//     } catch (ex) {
//       console.log('Exception: ' + JSON.stringify(ex));
//     }
//     this.clearAllSearches();
//   }

//   // the logic behind proposing the transactions via restricted mode
//   restrictedChange() { }
//   addSelectEvent(that: any, dtInstance: any, dt: any, indexes: any) {
//     if (that.restricted) {
//       that.dt_mms_current_page = dt.page();
//       var rowData = dtInstance.rows(indexes).data().toArray();
//       if (
//         rowData[0].giv_number!= null &&
//         //rowData[0].reference.includes('GIV') &&
//         rowData[0].original_cost!= null 
//         // rowData[0].debit != null
//       ) {
//         that.refAll = rowData[0].giv_number;
//         that.grv_no= rowData[0].grv_number
//         that.dtElements.forEach(
//           (dtElement: DataTableDirective, index: number) => {
//             if (index == 0) {
//               that.selections++;
//               dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//                 dtInstance
//                   .column(1)
//                   .search(that.refAll)
//                   .draw();
//                 var rowData = dtInstance
//                   .rows({ search: 'applied' })
//                   .data()
//                   .toArray();

//                 for (let i = 0; i < rowData.length; i++) {
//                   this.total_mms_amount += rowData[i].original_cost;
//                 }
//               });
//             } else {
//               dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//                 var total_core_data_credit = dtInstance
//                   .column(1)
//                   .search(that.refAll)
//                   .column(2, { search: 'applied' })
//                   .data();

//                 var total_core_data_debit = dtInstance
//                   .column(1)
//                   .search(that.refAll)
//                   .column(3, { search: 'applied' })
//                   .data();

//                 var total_core_credit_amount =
//                   total_core_data_credit.length > 0
//                     ? total_core_data_credit.reduce(function (a, b) {
//                       return a + b;
//                     })
//                     : 0;

//                 var total_core_debit_amount =
//                   total_core_data_debit.length > 0
//                     ? total_core_data_debit.reduce(function (a, b) {
//                       return a + b;
//                     })
//                     : 0;
//                 this.total_core_amount = total_core_credit_amount + total_core_debit_amount;
//                 if (this.total_mms_amount.toFixed(2) == this.total_core_amount.toFixed(2)) {
//                   dtInstance
//                     .column(1)
//                     .search(that.refAll)
//                     .draw();
//                 }
//                 else
//                 {
//                   dtInstance
//                     .column(1)
//                     .search(that.refAll)
//                     .draw();
//                 }
//               });
//             }
//           }
//         );
//       };
//     }
//   }

//   //FOOTER SEARCH AND BUTTON ON CLICK
//   ngAfterViewInit(): void {
//     var that = this;
//     this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
//       if (index == 0) {
//         dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//           dtInstance.on('select', function (e, dt, type, indexes) {
//             that.addSelectEvent(that, dtInstance, dt, indexes);
//           });
//           dtInstance.columns().every(function () {
//             $('input', this.footer()).on('keyup change', function () {
//               if (this['id'] == '1') {
//                 if (
//                   dtInstance.column(this['id']).search() !==
//                   (this as HTMLInputElement).value
//                 ) {
//                   that.refAll = (this as HTMLInputElement).value;
//                   dtInstance.column(this['id']).search(that.refAll).draw();
//                 }
//               } else {
//                 if (this['id'] != '') {
//                   if (
//                     dtInstance.column(this['id']).search() !==
//                     (this as HTMLInputElement).value
//                   ) {
//                     dtInstance
//                       .column(this['id'])
//                       .search((this as HTMLInputElement).value)
//                       .draw();
//                   }
//                 }
//               }
//             });
//           });
//           dtInstance.on(
//             'draw stateRestore-change',
//             function (e, settings, details) {
//               var c = 0;
//               for (let col of settings.aoColumns) {
//                 if (col.title == that.mms_first_column_title) {
//                   that.mms_first_column_id = c.toString();
//                 } else if (col.title == that.mms_second_column_title) {
//                   that.mms_second_column_id = c.toString();
//                 } else if (col.title == that.mms_third_column_title) {
//                   that.mms_third_column_id = c.toString();
//                 } else if (col.title == that.mms_fourth_column_title) {
//                   that.mms_fourth_column_id = c.toString();
//                 } else if (col.title == that.mms_fifth_column_title) {
//                   that.mms_fifth_column_id = c.toString();
//                 } else if (col.title == that.mms_seventh_column_title) {
//                   that.mms_seventh_column_id = c.toString();
//                 } else if (col.title == that.mms_eighth_column_title) {
//                   that.mms_eighth_column_id = c.toString();
//                 } else if (col.title == that.mms_ninth_column_title) {
//                   that.mms_ninth_column_id = c.toString();
//                 } else if (col.title == that.mms_tenth_column_title) {
//                   that.mms_tenth_column_id = c.toString();
//                 }
//                 c++;
//               }
//             }
//           );
//         });
//       } else if (index == 1) {
//         dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//           dtInstance.columns().every(function () {
//             $('input', this.footer()).on('keyup change', function () {
//               if (this['id'] == '1') {
//                 if (
//                   dtInstance.column(this['id']).search() !==
//                   (this as HTMLInputElement).value
//                 ) {
//                   that.refAll = (this as HTMLInputElement).value;
//                   dtInstance.column(this['id']).search(that.refAll).draw();
//                 }
//               } else {
//                 if (this['id'] != '') {
//                   if (
//                     dtInstance.column(this['id']).search() !==
//                     (this as HTMLInputElement).value
//                   ) {
//                     dtInstance
//                       .column(this['id'])
//                       .search((this as HTMLInputElement).value)
//                       .draw();
//                   }
//                 }
//               }
//             });
//           });
//           dtInstance.on(
//             'draw stateRestore-change',
//             function (e, settings, details) {
//               var c = 0;
//               for (let col of settings.aoColumns) {
//                 if (col.title == that.core_first_column_title) {
//                   that.core_first_column_id = c.toString();
//                 } else if (col.title == that.core_second_column_title) {
//                   that.core_second_column_id = c.toString();
//                 } else if (col.title == that.core_third_column_title) {
//                   that.core_third_column_id = c.toString();
//                 } else if (col.title == that.core_fourth_column_title) {
//                   that.core_fourth_column_id = c.toString();
//                 } else if (col.title == that.core_fifth_column_title) {
//                   that.core_fifth_column_id = c.toString();
//                 } else if (col.title == that.core_sixth_column_title) {
//                   that.core_sixth_column_id = c.toString();
//                 } else if (col.title == that.core_seventh_column_title) {
//                   that.core_seventh_column_id = c.toString();
//                 } else if (col.title == that.core_eighth_column_title) {
//                   that.core_eighth_column_id = c.toString();
//                 } else if (col.title == that.core_ninth_column_title) {
//                   that.core_ninth_column_id = c.toString();
//                 } else if (col.title == that.core_tenth_column_title) {
//                   that.core_tenth_column_id = c.toString();
//                 }
//                 else if (col.title == that.core_eleventh_column_title) {
//                   that.core_eleventh_column_id = c.toString();
//                 }
//                 else if (col.title == that.core_twelfth_column_title) {
//                   that.core_twelfth_column_id = c.toString();
//                 }
//                 c++;
//               }
//             }
//           );
//         });
//       }
//     });
//     that.clearAllSearches();
//   }

//   clearAllSearches() {

//     this.total_core_amount = 0;
//     this.total_mms_amount = 0;
//     this.core_debit_credit_list = [];
//     this.mms_debit_credit_list = [];

//     if (this.dtElements != null && this.dtElements.length > 0)
//       this.dtElements.forEach(
//         (dtElement: DataTableDirective, index: number) => {
//           this.empty_provider = '';
//           if (index == 0) {
//             dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//               dtInstance.rows('.selected').deselect();
//               for (let i = 0; i < 15; i++) {
//                 if (i == 5) {
//                   continue;
//                 }
//                 dtInstance
//                   .search('')
//                   .column(i)
//                   .search('')
//                 if (i == 14) {
//                   dtInstance.draw();
//                 }
//               }
//               dtInstance.page(this.dt_mms_current_page).draw(false);
//             });
//           } else {
//             dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//               dtInstance.rows('.selected').deselect();
//               for (let i = 0; i < 11; i++) {
//                 dtInstance
//                   .search('')
//                   .column(i)
//                   .search('')
//                 if (i == 10) {
//                   dtInstance.draw();
//                 }
//               }
//             });
//           }
//         }
//       );
//   }

//   showMatchSuccess() {
//     this.toast.success({ detail: 'SUCCESS', summary: 'Matched successfully!' });
//   }
//   showSelectionEmpty() {
//     this.toast.error({
//       detail: 'ERROR',
//       summary: 'Please select transaction to Match.',
//     });
//   }

//   _refreshTokenExpired() {
//     console.log('logging out');

//     this.authService.clearCookies().subscribe(
//       (data) => {
//         if (data) {
//           console.log(data);
//           delay(3500);
//           this.router.navigateByUrl('/login');
//           this.localStorageService.clear('user');
//           this.localStorageService.clear('roles');
//         } else {
//           console.log('login failed 001');
//         }
//       },
//       (error) => {
//         console.log('Error: ' + JSON.stringify(error, null, 2));
//       }
//     );
//   }

//   showErrormessage(message: string) {
//     this.toast.error({
//       detail: 'ERROR',
//       summary: message,
//     });
//   }

//   matchTransactions() {
//     var data_mms_id_list: any[] = [];
//     var data_core_id_list: any[] = [];


//     var data_mms_amount_sum: number = 0;
//     var data_core_amount_sum: number = 0;



//     var data_mms_reference: String[] = [];
//     var data_core_narration: String[] = [];


//     var mms_number_of_rows: number = 0;

//     if (this.restricted) {
//       this.dtElements.forEach(
//         (dtElement: DataTableDirective, index: number) => {
//           if (index == 0) {
//             dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//               var rowData = dtInstance.rows({ selected: true }).data().toArray();
//               mms_number_of_rows = rowData.length;
//               if (rowData.length > 0) {
//                 data_mms_reference.push(rowData[0].giv_number);
//                 for (let i = 0; i < rowData.length; i++) {
//                   if (data_mms_reference.includes(rowData[i].giv_number)) {
//                     data_mms_amount_sum += rowData[i].original_cost;
//                     data_mms_id_list.push(rowData[i].id);
//                   }
//                 }
//               }
//             });
//           } else {
//             dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//               var rowData = dtInstance.rows({ selected: true }).data().toArray();
//               if (rowData.length > 0) {
//                 data_core_narration = rowData[0].naration;
//                 for (let i = 0; i < rowData.length; i++) {
//                   if (rowData[i].naration.includes(data_mms_reference[0])) {
//                     data_core_amount_sum += rowData[i].debit + rowData[i].credit;
//                     data_core_id_list.push(rowData[i].id);
//                   }
//                 }
//               }
//               // if (mms_number_of_rows == data_mms_id_list.length && rowData.length == data_core_id_list.length) {
//               if (
//                 data_mms_amount_sum.toFixed(2) == data_core_amount_sum.toFixed(2)
//               ) {
//                 this.reconManualFixedAssetService
//                   .matchTransactions(
//                     data_mms_id_list,
//                     data_core_id_list
//                   )
//                   .subscribe(
//                     (data: any) => {
//                       if (data == true) {
//                         this.showMatchSuccess();
//                         this.dtElements.forEach(
//                           (
//                             dtElement: DataTableDirective,
//                             index: Number
//                           ) => {
//                             console.log('index: ' + index);
//                             if (index == 0) {
//                               dtElement.dtInstance.then(
//                                 (dtInstance: DataTables.Api) => {
//                                   dtInstance
//                                     .rows({ search: 'applied' })
//                                     .remove()
//                                     .draw();
//                                 }
//                               );
//                             } else if (index == 1) {
//                               dtElement.dtInstance.then(
//                                 (dtInstance: DataTables.Api) => {
//                                   dtInstance
//                                     .rows({ search: 'applied' })
//                                     .remove()
//                                     .draw();
//                                 }
//                               );
//                               this.clearAllSearches();
//                             }
//                           }
//                         );
//                         console.log('match success: ' + data);
//                       } else
//                         console.log(
//                           'ret: ' + JSON.stringify(data, null, 5)
//                         );
//                     },
//                     (error) => {
//                       if (error.error.text === 'access-token-expired') {
//                         console.log(
//                           'Access-token-expired requesting refresh token...'
//                         );
//                         if (
//                           this.localStorageService.retrieve(
//                             'refresh_token_requested'
//                           ) == null
//                         ) {
//                           this.utilService.refreshToken().subscribe(
//                             (data) => {
//                               if (data === true) {
//                                 console.log(
//                                   'refresh token success re-requesting the actual request'
//                                 );
//                                 this.localStorageService.clear(
//                                   'refresh_token_requested'
//                                 );
//                                 //================================================================================
//                                 this.reconManualFixedAssetService
//                                   .matchTransactions(
//                                     data_mms_id_list,
//                                     data_core_id_list
//                                   )
//                                   .subscribe(
//                                     (data: any) => {
//                                       if (data == true) {
//                                         this.showMatchSuccess();
//                                         this.dtElements.forEach(
//                                           (
//                                             dtElement: DataTableDirective,
//                                             index: Number
//                                           ) => {
//                                             console.log(
//                                               'index: ' + index
//                                             );
//                                             if (index == 0) {
//                                               dtElement.dtInstance.then(
//                                                 (
//                                                   dtInstance: DataTables.Api
//                                                 ) => {
//                                                   dtInstance
//                                                     .rows({
//                                                       search: 'applied',
//                                                     })
//                                                     .remove()
//                                                     .draw();
//                                                 }
//                                               );
//                                             } else if (index == 1) {
//                                               dtElement.dtInstance.then(
//                                                 (
//                                                   dtInstance: DataTables.Api
//                                                 ) => {
//                                                   dtInstance
//                                                     .rows({
//                                                       search: 'applied',
//                                                     })
//                                                     .remove()
//                                                     .draw();
//                                                 }
//                                               );
//                                               this.clearAllSearches();
//                                             }
//                                           }
//                                         );
//                                         console.log(
//                                           'match success: ' + data
//                                         );
//                                       } else
//                                         console.log(
//                                           'ret: ' +
//                                           JSON.stringify(data, null, 5)
//                                         );
//                                     },
//                                     (error) => {
//                                       if (
//                                         error.error.text ===
//                                         'access-token-expired'
//                                       ) {
//                                         console.log(
//                                           'refresh token expired.'
//                                         );
//                                         this.SwalSessionExpired.fire();
//                                         this._refreshTokenExpired();
//                                       } else {
//                                         Swal.fire({
//                                           icon: 'error',
//                                           title: 'Oops...',
//                                           text: 'Something went wrong!',
//                                         });
//                                         console.log(
//                                           JSON.stringify(
//                                             error.error.apierror,
//                                             null,
//                                             2
//                                           )
//                                         );
//                                       }
//                                     }
//                                   );
//                               } else {
//                                 console.log('refresh token expired.');
//                                 this.SwalSessionExpired.fire();
//                                 this._refreshTokenExpired();
//                               }
//                             },
//                             (error: any) => {
//                               console.log(
//                                 'error refreshing access token'
//                               );
//                               Swal.fire({
//                                 icon: 'error',
//                                 title: 'Oops...',
//                                 text: 'Something went wrong!',
//                               });
//                               console.log(
//                                 JSON.stringify(
//                                   error.error.apierror,
//                                   null,
//                                   2
//                                 )
//                               );
//                             }
//                           );
//                           this.localStorageService.store(
//                             'refresh_token_requested',
//                             true
//                           );
//                         }
//                       }
//                     }
//                   );
//               } else {
//                 this.showErrormessage('There is an amount difference.');
//               }
//               // }
//               // else{

//               // }
//             })
//           }
//         })
//     }
//     else {
//       this.dtElements.forEach(
//         (dtElement: DataTableDirective, index: number) => {
//           if (index == 0) {
//             dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//               var rowData = dtInstance.rows({ selected: true }).data().toArray();
//               mms_number_of_rows = rowData.length;
//               if (rowData.length > 0) {
//                 for (let i = 0; i < rowData.length; i++) {
//                   data_mms_amount_sum += rowData[i].original_cost;
//                   data_mms_id_list.push(rowData[i].id);
//                   data_mms_reference.push(rowData[i].giv_number);
//                 }
//               }
//             });
//           } else {
//             dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
//               var rowData = dtInstance.rows({ selected: true }).data().toArray();
//               if (rowData.length > 0) {
//                 // data_core_narration = rowData[0].naration;
//                 for (let i = 0; i < rowData.length; i++) {
//                   data_core_amount_sum += rowData[i].debit + rowData[i].credit;
//                   data_core_id_list.push(rowData[i].id);
//                   data_core_narration.push(rowData[i].naration);
//                 }
//               }

//               var is_reference_similar: boolean = true;
//               var mms_reference: any = data_mms_reference[0]
//               for (let i = 0; i < data_mms_reference.length; i++) {
//                 if (!data_mms_reference[i].includes(mms_reference)) {
//                   is_reference_similar = false;
//                 }
//               }

//               var is_reference_contained: boolean = true;
//               for (let i = 0; i < data_core_narration.length; i++) {
//                 if (!data_core_narration[i].includes(mms_reference)) {
//                   is_reference_contained = false;
//                 }
//               }

//               if (mms_number_of_rows == 0 || rowData.length == 0) {
//                 this.showSelectionEmpty();
//               }
//               else{
//               if (is_reference_similar && is_reference_contained) {
//                 if (
//                   data_mms_amount_sum.toFixed(2) == data_core_amount_sum.toFixed(2)
//                 ) {
//                   this.reconManualFixedAssetService
//                     .matchTransactions(
//                       data_mms_id_list,
//                       data_core_id_list
//                     )
//                     .subscribe(
//                       (data: any) => {
//                         if (data == true) {
//                           this.showMatchSuccess();
//                           this.dtElements.forEach(
//                             (
//                               dtElement: DataTableDirective,
//                               index: Number
//                             ) => {
//                               console.log('index: ' + index);
//                               if (index == 0) {
//                                 dtElement.dtInstance.then(
//                                   (dtInstance: DataTables.Api) => {
//                                     dtInstance
//                                       .rows({ search: 'applied' })
//                                       .remove()
//                                       .draw();
//                                   }
//                                 );
//                               } else if (index == 1) {
//                                 dtElement.dtInstance.then(
//                                   (dtInstance: DataTables.Api) => {
//                                     dtInstance
//                                       .rows({ search: 'applied' })
//                                       .remove()
//                                       .draw();
//                                   }
//                                 );
//                                 this.clearAllSearches();
//                               }
//                             }
//                           );
//                           console.log('match success: ' + data);
//                         } else
//                           console.log(
//                             'ret: ' + JSON.stringify(data, null, 5)
//                           );
//                       },
//                       (error) => {
//                         if (error.error.text === 'access-token-expired') {
//                           console.log(
//                             'Access-token-expired requesting refresh token...'
//                           );
//                           if (
//                             this.localStorageService.retrieve(
//                               'refresh_token_requested'
//                             ) == null
//                           ) {
//                             this.utilService.refreshToken().subscribe(
//                               (data) => {
//                                 if (data === true) {
//                                   console.log(
//                                     'refresh token success re-requesting the actual request'
//                                   );
//                                   this.localStorageService.clear(
//                                     'refresh_token_requested'
//                                   );
//                                   //================================================================================
//                                   this.reconManualFixedAssetService
//                                     .matchTransactions(
//                                       data_mms_id_list,
//                                       data_core_id_list
//                                     )
//                                     .subscribe(
//                                       (data: any) => {
//                                         if (data == true) {
//                                           this.showMatchSuccess();
//                                           this.dtElements.forEach(
//                                             (
//                                               dtElement: DataTableDirective,
//                                               index: Number
//                                             ) => {
//                                               console.log(
//                                                 'index: ' + index
//                                               );
//                                               if (index == 0) {
//                                                 dtElement.dtInstance.then(
//                                                   (
//                                                     dtInstance: DataTables.Api
//                                                   ) => {
//                                                     dtInstance
//                                                       .rows({
//                                                         search: 'applied',
//                                                       })
//                                                       .remove()
//                                                       .draw();
//                                                   }
//                                                 );
//                                               } else if (index == 1) {
//                                                 dtElement.dtInstance.then(
//                                                   (
//                                                     dtInstance: DataTables.Api
//                                                   ) => {
//                                                     dtInstance
//                                                       .rows({
//                                                         search: 'applied',
//                                                       })
//                                                       .remove()
//                                                       .draw();
//                                                   }
//                                                 );
//                                                 this.clearAllSearches();
//                                               }
//                                             }
//                                           );
//                                           console.log(
//                                             'match success: ' + data
//                                           );
//                                         } else
//                                           console.log(
//                                             'ret: ' +
//                                             JSON.stringify(data, null, 5)
//                                           );
//                                       },
//                                       (error) => {
//                                         if (
//                                           error.error.text ===
//                                           'access-token-expired'
//                                         ) {
//                                           console.log(
//                                             'refresh token expired.'
//                                           );
//                                           this.SwalSessionExpired.fire();
//                                           this._refreshTokenExpired();
//                                         } else {
//                                           Swal.fire({
//                                             icon: 'error',
//                                             title: 'Oops...',
//                                             text: 'Something went wrong!',
//                                           });
//                                           console.log(
//                                             JSON.stringify(
//                                               error.error.apierror,
//                                               null,
//                                               2
//                                             )
//                                           );
//                                         }
//                                       }
//                                     );
//                                 } else {
//                                   console.log('refresh token expired.');
//                                   this.SwalSessionExpired.fire();
//                                   this._refreshTokenExpired();
//                                 }
//                               },
//                               (error: any) => {
//                                 console.log(
//                                   'error refreshing access token'
//                                 );
//                                 Swal.fire({
//                                   icon: 'error',
//                                   title: 'Oops...',
//                                   text: 'Something went wrong!',
//                                 });
//                                 console.log(
//                                   JSON.stringify(
//                                     error.error.apierror,
//                                     null,
//                                     2
//                                   )
//                                 );
//                               }
//                             );
//                             this.localStorageService.store(
//                               'refresh_token_requested',
//                               true
//                             );
//                           }
//                         }
//                       }
//                     );
//                 } else {
//                   //  this.showErrormessage('There is an amount difference.');
//                   const { value: text } = await Swal.fire({
//                     input: 'textarea',
//                     inputLabel: 'Reason',
//                     inputPlaceholder: 'Type your reason here...',
//                     inputAttributes: {
//                       'aria-label': 'Type your reason here',
//                     },
//                     title: 'Amount Difference: ',
//                     text: "It seems there is amount difference between the selected transactions. If you are sure, state your reason and click 'Match anyways'.",
//                     icon: 'warning',
//                     showCancelButton: true,
//                     confirmButtonColor: '#d33',
//                     cancelButtonColor: '#3085d6',
//                     confirmButtonText: 'Match anyways',
//                   });
//                   if (text == '') {
//                     Swal.fire({
//                       title: 'Can not match. No reason found.',
//                       icon: 'error',
//                     });
//                   } else if (text) {
//                     console.log("")
//                     var type = 'amount_difference';
//                     this.reconManualFixedAssetService
//                       .matchTransactionsWithComment(
//                         data_mms_id_list,
//                         data_core_id_list,
//                         text,
//                         type
//                       )
//                       .subscribe(
//                         (data: any) => {
//                           if (data == true) {
//                             this.showMatchSuccess();
//                             this.dtElements.forEach(
//                               (
//                                 dtElement: DataTableDirective,
//                                 index: Number
//                               ) => {
//                                 console.log('index: ' + index);
//                                 if (index == 0) {
//                                   dtElement.dtInstance.then(
//                                     (dtInstance: DataTables.Api) => {
//                                       dtInstance
//                                         .rows({ selected: true })
//                                         .remove()
//                                         .draw();
//                                     }
//                                   );
//                                 } else if (index == 1) {
//                                   dtElement.dtInstance.then(
//                                     (dtInstance: DataTables.Api) => {
//                                       dtInstance
//                                         .rows({ selected: true })
//                                         .remove()
//                                         .draw();
//                                     }
//                                   );
//                                   this.clearAllSearches();
//                                 }
//                               }
//                             );
//                             console.log('match success: ' + data);
//                           } else
//                             console.log(
//                               'ret: ' + JSON.stringify(data, null, 5)
//                             );
//                         },
//                         (error) => {
//                           if (error.error.text === 'access-token-expired') {
//                             console.log(
//                               'Access-token-expired requesting refresh token...'
//                             );
//                             if (
//                               this.localStorageService.retrieve(
//                                 'refresh_token_requested'
//                               ) == null
//                             ) {
//                               this.utilService.refreshToken().subscribe(
//                                 (data) => {
//                                   if (data === true) {
//                                     console.log(
//                                       'refresh token success re-requesting the actual request'
//                                     );
//                                     this.localStorageService.clear(
//                                       'refresh_token_requested'
//                                     );
//                                     //================================================================================
//                                     this.reconManualFixedAssetService
//                                       .matchTransactionsWithComment(
//                                         data_mms_id_list,
//                                         data_core_id_list,
//                                         text,
//                                         type
//                                       )
//                                       .subscribe(
//                                         (data: any) => {
//                                           if (data == true) {
//                                             this.showMatchSuccess();
//                                             this.dtElements.forEach(
//                                               (
//                                                 dtElement: DataTableDirective,
//                                                 index: Number
//                                               ) => {
//                                                 console.log('index: ' + index);
//                                                 if (index == 0) {
//                                                   dtElement.dtInstance.then(
//                                                     (
//                                                       dtInstance: DataTables.Api
//                                                     ) => {
//                                                       dtInstance
//                                                         .rows({
//                                                           selected: true,
//                                                         })
//                                                         .remove()
//                                                         .draw();
//                                                     }
//                                                   );
//                                                 } else if (index == 1) {
//                                                   dtElement.dtInstance.then(
//                                                     (
//                                                       dtInstance: DataTables.Api
//                                                     ) => {
//                                                       dtInstance
//                                                         .rows({
//                                                           selected: true,
//                                                         })
//                                                         .remove()
//                                                         .draw();
//                                                     }
//                                                   );
//                                                   this.clearAllSearches();
//                                                 }

//                                               }
//                                             );
//                                             console.log(
//                                               'match success: ' + data
//                                             );
//                                           } else
//                                             console.log(
//                                               'ret: ' +
//                                               JSON.stringify(data, null, 5)
//                                             );
//                                         },
//                                         (error) => {
//                                           if (
//                                             error.error.text ===
//                                             'access-token-expired'
//                                           ) {
//                                             console.log(
//                                               'refresh token expired.'
//                                             );
//                                             this.SwalSessionExpired.fire();
//                                             this._refreshTokenExpired();
//                                           } else {
//                                             Swal.fire({
//                                               icon: 'error',
//                                               title: 'Oops...',
//                                               text: 'Something went wrong!',
//                                             });
//                                             console.log(
//                                               JSON.stringify(
//                                                 error.error.apierror,
//                                                 null,
//                                                 2
//                                               )
//                                             );
//                                           }
//                                         }
//                                       );
//                                   } else {
//                                     console.log('refresh token expired.');
//                                     this.SwalSessionExpired.fire();
//                                     this._refreshTokenExpired();
//                                   }
//                                 },
//                                 (error: any) => {
//                                   console.log('error refreshing access token');
//                                   Swal.fire({
//                                     icon: 'error',
//                                     title: 'Oops...',
//                                     text: 'Something went wrong!',
//                                   });
//                                   console.log(
//                                     JSON.stringify(
//                                       error.error.apierror,
//                                       null,
//                                       2
//                                     )
//                                   );
//                                 }
//                               );
//                               this.localStorageService.store(
//                                 'refresh_token_requested',
//                                 true
//                               );
//                             }
//                           }
//                         }
//                       );
//                   }

//                 }
//               }
//               else {
//                 const { value: text } = await Swal.fire({
//                   input: 'textarea',
//                   inputLabel: 'Reason',
//                   inputPlaceholder: 'Type your reason here...',
//                   inputAttributes: {
//                     'aria-label': 'Type your reason here',
//                   },
//                   title: 'Reference Difference: ',
//                   text: "It seems there is a reference difference between the selected transactions. If you are sure, state your reason and click 'Match anyways'.",
//                   icon: 'warning',
//                   showCancelButton: true,
//                   confirmButtonColor: '#d33',
//                   cancelButtonColor: '#3085d6',
//                   confirmButtonText: 'Match anyways',
//                 });
//                 if (text == '') {
//                   Swal.fire({
//                     title: 'Can not match. No reason found.',
//                     icon: 'error',
//                   });
//                 } else if (text) {
//                   var type = 'reference';
//                   console.log("I am here referencereferencereferencereferencereferencereferencere   " + data_core_id_list);
//                   this.reconManualFixedAssetService
//                     .matchTransactionsWithComment(
//                       data_mms_id_list,
//                       data_core_id_list,
//                       text,
//                       type
//                     )
//                     .subscribe(
//                       (data: any) => {
//                         if (data == true) {
//                           this.showMatchSuccess();
//                           this.dtElements.forEach(
//                             (
//                               dtElement: DataTableDirective,
//                               index: Number
//                             ) => {
//                               console.log('index: ' + index);
//                               if (index == 0) {
//                                 dtElement.dtInstance.then(
//                                   (dtInstance: DataTables.Api) => {
//                                     dtInstance
//                                       .rows({ selected: true })
//                                       .remove()
//                                       .draw();
//                                   }
//                                 );
//                               } else if (index == 1) {
//                                 dtElement.dtInstance.then(
//                                   (dtInstance: DataTables.Api) => {
//                                     dtInstance
//                                       .rows({ selected: true })
//                                       .remove()
//                                       .draw();
//                                   }
//                                 );
//                                 this.clearAllSearches();
//                               }
//                             }
//                           );
//                           console.log('match success: ' + data);
//                         } else
//                           console.log(
//                             'ret: ' + JSON.stringify(data, null, 5)
//                           );
//                       },
//                       (error) => {
//                         if (error.error.text === 'access-token-expired') {
//                           console.log(
//                             'Access-token-expired requesting refresh token...'
//                           );
//                           if (
//                             this.localStorageService.retrieve(
//                               'refresh_token_requested'
//                             ) == null
//                           ) {
//                             this.utilService.refreshToken().subscribe(
//                               (data) => {
//                                 if (data === true) {
//                                   console.log(
//                                     'refresh token success re-requesting the actual request'
//                                   );
//                                   this.localStorageService.clear(
//                                     'refresh_token_requested'
//                                   );
//                                   //================================================================================
//                                   this.reconManualFixedAssetService
//                                     .matchTransactionsWithComment(
//                                       data_mms_id_list,
//                                       data_core_id_list,
//                                       text,
//                                       type
//                                     )
//                                     .subscribe(
//                                       (data: any) => {
//                                         if (data == true) {
//                                           this.showMatchSuccess();
//                                           this.dtElements.forEach(
//                                             (
//                                               dtElement: DataTableDirective,
//                                               index: Number
//                                             ) => {
//                                               console.log('index: ' + index);
//                                               if (index == 0) {
//                                                 dtElement.dtInstance.then(
//                                                   (
//                                                     dtInstance: DataTables.Api
//                                                   ) => {
//                                                     dtInstance
//                                                       .rows({
//                                                         selected: true,
//                                                       })
//                                                       .remove()
//                                                       .draw();
//                                                   }
//                                                 );
//                                               } else if (index == 1) {
//                                                 dtElement.dtInstance.then(
//                                                   (
//                                                     dtInstance: DataTables.Api
//                                                   ) => {
//                                                     dtInstance
//                                                       .rows({
//                                                         selected: true,
//                                                       })
//                                                       .remove()
//                                                       .draw();
//                                                   }
//                                                 );
//                                                 this.clearAllSearches();
//                                               }

//                                             }
//                                           );
//                                           console.log(
//                                             'match success: ' + data
//                                           );
//                                         } else
//                                           console.log(
//                                             'ret: ' +
//                                             JSON.stringify(data, null, 5)
//                                           );
//                                       },
//                                       (error) => {
//                                         if (
//                                           error.error.text ===
//                                           'access-token-expired'
//                                         ) {
//                                           console.log(
//                                             'refresh token expired.'
//                                           );
//                                           this.SwalSessionExpired.fire();
//                                           this._refreshTokenExpired();
//                                         } else {
//                                           Swal.fire({
//                                             icon: 'error',
//                                             title: 'Oops...',
//                                             text: 'Something went wrong!',
//                                           });
//                                           console.log(
//                                             JSON.stringify(
//                                               error.error.apierror,
//                                               null,
//                                               2
//                                             )
//                                           );
//                                         }
//                                       }
//                                     );
//                                 } else {
//                                   console.log('refresh token expired.');
//                                   this.SwalSessionExpired.fire();
//                                   this._refreshTokenExpired();
//                                 }
//                               },
//                               (error: any) => {
//                                 console.log('error refreshing access token');
//                                 Swal.fire({
//                                   icon: 'error',
//                                   title: 'Oops...',
//                                   text: 'Something went wrong!',
//                                 });
//                                 console.log(
//                                   JSON.stringify(
//                                     error.error.apierror,
//                                     null,
//                                     2
//                                   )
//                                 );
//                               }
//                             );
//                             this.localStorageService.store(
//                               'refresh_token_requested',
//                               true
//                             );
//                           }
//                         }
//                       }
//                     );
//                 }
//               }}
//             });
//           }
//         })
//     }
//   }
// }

// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

