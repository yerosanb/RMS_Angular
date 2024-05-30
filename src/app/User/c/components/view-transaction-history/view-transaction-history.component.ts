import { formatDate } from '@angular/common';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import { GeneralSearchPayload } from 'src/app/User/payloads/general-search-payload';
import { MatchDeatailPayload } from 'src/app/User/payloads/match-deatail-payload';
import { MatchDeatailPayloadCore } from 'src/app/User/payloads/match-deatail-payload-core';
import { BtbAts } from 'src/app/User/payloads/recon/btb-ats';
import { RtgsAts } from 'src/app/User/payloads/recon/rtgs-ats';
import { SpecificSearchPayload } from 'src/app/User/payloads/specific-search-payload';
import { CurrencyService } from 'src/app/User/services/currency.service';
import { TransactionHistoryViewService } from 'src/app/User/services/transaction-history-view.service';
import Swal from 'sweetalert2';
declare var window: any;

@Component({
  selector: 'app-view-transaction-history',
  templateUrl: './view-transaction-history.component.html',
  styleUrls: ['./view-transaction-history.component.css'],
})
export class ViewTransactionHistoryComponent {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  generalSearchForm: FormGroup;
  modal: any;
  submitted: boolean = false;
  check_min_amount: boolean = false;
  check_max_amount: boolean = false;
  dr_cr: any;
  checked_issue_core = false;
  checked_issue_qbs = false;
  //
  checked_fixed_asset_mms = false;
  checked_fixed_asset_core = false
  //===========================================================
  checked_stationary = false;
  checked_stockCore =false;
  checked_stockMMS =false ;
  //===========================================================
  //
  min_amount_greater_than_max_amount_true: boolean = false;
  min_am: any;
  max_am: any;
  clicked: boolean = false;
  generalSearchPayload: GeneralSearchPayload;
  rtgs!: BtbAts[]
  history_detail!: BtbAts

  MatchDeatail!: MatchDeatailPayload;
  core_detail!: MatchDeatailPayloadCore;
  viewMatchedAtsDetail!: FormGroup;

  // initialDateValue = new Date();

  reload_checker: boolean = true;
  checked_ats: boolean = false;
  checked_core: boolean = false;
  search_ats: boolean = false;
  //search_core:boolean=false;
  ats: boolean = true;
  core: boolean = false;
  issue: boolean = false;
  fixed_asset_mms: boolean = false;
  fixed_asset_core: boolean = false;
  //=============================here the stationary variables are added=================
  Stationary: boolean = false;
  tools: boolean = false;
  spares: boolean = false;
  uniform: boolean = false;
  accessory: boolean = false;
  check: boolean = false;
  sanitory: boolean = false;
  computer_stock: boolean = false;
  furniture_stock: boolean = false;
  equipment_stock: boolean = false;

  stockCore:boolean=false;
  stockMMS:boolean=false;
 
  //========================here endes===================
  ats_matched_detail: boolean = false;
  core_matched_detail: boolean = false;
  fixed_asset_mms_matched_detail: boolean = false;
  fixed_asset_core_matched_detail: boolean = false
  stock_mms_matched_detail: boolean = false;
  stock_core_matched_detail: boolean = false;
  dtOptions_ats: any;
  dtOptions_core: any;
  dtOptions_issue_core: any;
  dtOptions_issue_qbs: any;
  dtOptions_fixed_asset_core: any;
  dtOptions_fixed_asset_mms: any;
  dtOptions_stock_core: any;
  dtOptions_stock_mms: any;



  match_date: any = ''
  mached_by: any
  reconcilation_type: any
  branch_code: any
  amount: any
  additional_information: any

  core_match_date: any = '';
  core_value_date_type: any = '';
  core_mached_by: any = ''
  core_reconcilation_type: any = ''
  reference: any = ''
  source_branch: any=''
  core_amount: any = 0.0

  //ats inits
  ats_first_column_title = '-ID-';
  ats_second_column_title = 'Reference';
  ats_third_column_title = 'Amount';
  ats_fourth_column_title = 'Value Date-type';
  ats_fifth_column_title = 'Sender';
  ats_sixth_column_title = 'Receiver';
  ats_seventh_column_title = 'Cr/Dr';
  ats_eighth_column_title = 'Upload Date';
  ats_ninth_column_title = 'Additional Information';
  ats_tenth_column_title = 'Catagory';
  ats_eleventh_column_title = 'Uploaded by';
  fixed_second_column_title = 'Giv number';
  fixed_asset_core1_column_title = 'Grv number';
  fixed_asset_core2_column_title = 'Transaction Date';
  fixed_asset_core3_column_title = 'Period';
  fixed_asset_core4_column_title = 'Orginal cost';
  fixed_asset_core5_column_title = 'Book value';
  fixed_asset_core6_column_title = 'Main pg';
  fixed_asset_core9_column_title = "Branch name"
  fixed_asset_mms9_column_title = "Match Status"
  fixed_asset_core7_column_title = 'Tag number';
  fixed_asset_core8_column_title = 'Asset description';

  fixed_asset_value_date_column_title = " Value Date";
  fixed_core_posting_date_column_title = " Posting Date";

  fixed_coreaccount_number_column_title = "Account Number";

  fixed_core_account_name_column_title = "Account Name";
  
  fixed_asset_naration_column_title = "Naration";


  stock_first_column_title = '-ID-';
  stock_second_column_title = 'Reference';
  stock_third_column_title = 'Amount';
  stock_fourth_column_title = 'Branch Name';
  stock_fifth_column_title = 'Value Date';
  stock_sixth_column_title = 'Posting Date';
  stock_seventh_column_title = 'Cr/Dr';
  stock_eighth_column_title = 'Account';
  stock_ninth_column_title = 'Source Branch';
  stock_tenth_column_title = 'Category';
  stock_eleventh_column_title = 'GIV Number';

  stock_mms_first_column_title = '-ID-';
  stock_mms_second_column_title = 'Store Code';
  stock_mms_third_column_title = 'Account Segment';
  stock_mms_fourth_column_title = 'Date';
  stock_mms_fifth_column_title = 'Description';
  stock_mms_sixth_column_title = 'Period';
  stock_mms_seventh_column_title = 'Amount';
  stock_mms_eighth_column_title = 'Dr_CR';
  stock_mms_ninth_column_title = 'transaction Code';
  stock_mms_tenth_column_title = 'Store Name';
  stock_mms_eleventh_column_title = 'Category';
  stock_mms_twelvth_column_title = 'Category Description';
  stock_mms_thirteenth_column_title = 'Reference';

  

 

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

  core_first_column_title = '-ID-';
  core_second_column_title = 'Add..-Info';
  core_third_column_title = 'Amount';
  core_fourth_column_title = 'Value Date';
  core_fifth_column_title = 'Upload Date';
  core_sixth_column_title = 'Branch Code';
  issue_sixth_column_title = 'Branch name';
  core_seventh_column_title = 'Type';
  core_eighth_column_title = 'Posting Date';
  core_ninth_column_title = 'Transaction Reference';
  core_tenth_column_title = 'Catagory';
  core_eleventh_column_title = 'Uploaded by';
  core_tewolve_column_title = 'Account Name';
  core_thertin_column_title = 'Account Number';
  core_fixed_third_column_title = 'Debit';
  core_fixed_fourth_column_title = 'Cattegory Deskription';
  core_fixed_fifth_column_title = 'Credit ';

  core_input_0!: any;
  core_input_1!: any;
  core_input_2!: any;
  core_input_3!: any;
  core_input_4!: any;
  core_input_5!: any;
  core_input_6!: any;
  core_input_7!: any;
  core_input_8!: any;
  core_input_10!: any;

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
  issue_sixth_column_id = '5';
  userId: any;
  
  constructor(
    private service: TransactionHistoryViewService,
    private service2: CurrencyService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private adminService: AdminService,
    public authService: AuthService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.generalSearchPayload = {
      type: '',
      min_upload_date: '0',
      max_upload_date: '0',
      min_match_date: '0',
      max_match_date: '0',
      min_upload_date2: '0',
      max_upload_date2: '0',
      min_match_date2: '0',
      max_match_date2: '0',
      min_amount: '',
      max_amount: '',
      reference: '',
      value_date: '',
      branch_code: '',
      account_name: '',
      transaction_date: '',
      tag_number: '',
      category: '',
      description:'',
      source_branch:'',
      store_name:'',
      account:'',
      debit: '',
      credit: '',
      match_date: '',
      account_number: '',
      posting_date: '',
      value_date2: '',
      max_posting_date: '',
      max_value_date: '',
      categoryStockCore:'',
      categoryStockMMs: ''
    };

    this.core_detail = {
      match_date: '',
      firstname: '',
      lastname: '',
      reconciliation_type: '0',
      amount: 0,
      reference: '',
      value_date_type: '',
      value_date: '',
      additional_information: '',
      id: 0

    };
    this.viewMatchedAtsDetail = this.formBuilder.group({
      // match_date: new FormControl(
      //   '',
      // ),
      reconciliation_type: new FormControl(
        ''
        //  [
        //   Validators.required,
        //   Validators.minLength(2),
        //   Validators.maxLength(50),
        // ]
      ),
      additional_information: new FormControl(
        ''
        //  [Validators.required]
      ),
      anount: new FormControl(
        ''
        //  [Validators.required]
      ),
      branch_code: new FormControl(
        ''
        //  [Validators.required]
      ),
      firstname: new FormControl(
        ''
        //  [Validators.required]
      ),
      lastname: new FormControl(
        ''
        //  [Validators.required]
      ),
      accoun_name: new FormControl(
        ''
        //  [Validators.required]
      ),
      // transaction_date: new FormControl(
      //   ''
      //   //  [Validators.required]
      // ),
      account_number: new FormControl(
        ''
        //  [Validators.required]
      )
      



    });
    this.generalSearchForm = this.formBuilder.group({
      type: new FormControl(
        '',
        [
          Validators.required,

        ]
      ),
      min_upload_date: new FormControl(
        '', []
        //  [
        //   Validators.required,
        //   Validators.minLength(2),
        //   Validators.maxLength(50),
        // ]
      ),
      max_upload_date: new FormControl(
        '',
        //  [Validators.required]
        []
      ),
      min_match_date: new FormControl(
        ''
        //  [Validators.required]
      ),
      max_match_date: new FormControl(
        '', []
        //  [Validators.required]
      ),
      min_amount: new FormControl(
        '',
        []
        //  [Validators.required]
      ),
      max_amount: new FormControl(

        '', []
        //  [Validators.required]
      ),
      reference: new FormControl('', [
        // Validators.required,
        // Validators.minLength(2),
        // Validators.maxLength(50),
      ]),
      // min_upload_date
      branch_code: new FormControl('', [
        // Validators.required
      ]),
      value_date: new FormControl('', [
        // Validators.required
      ]),
      account_name: new FormControl('', [
        // Validators.required
      ])
      ,
      credit: new FormControl('', [
        // Validators.required
      ])
      ,
      debit: new FormControl('', [
        // Validators.required
      ]),
      tag_number: new FormControl('', [
        // Validators.required
      ]),
      category: new FormControl('', [
        // Validators.required
      ]),
      match_date: new FormControl('', [
        // Validators.required
      ]),
      account_number: new FormControl('', [
        // Validators.required
      ])
      ,
      posting_date: new FormControl('', [
        // Validators.required
      ])
      ,
      value_date2: new FormControl('', [
        // Validators.required
      ]),

      transaction_date: new FormControl('', [
        // Validators.required
      ]),
      source_branch: new FormControl('', [
        // Validators.required
      ]),
      store_name: new FormControl('', [
        // Validators.required
      ]),
      account: new FormControl('', [
        // Validators.required
      ]),
        categoryStockCore: new FormControl('', [
        // Validators.required
      ]),
        categoryStockMMs: new FormControl('', [
        // Validators.required
      ])





    });


    // console.log(this.specificSearchForm.type.value);
  }
  // dateChangeMinUpload(event: any) {
  //   console.log('change: ' + event);
  //   this.generalSearchPayload.min_upload_date = event;

  // }

  // dateChangeMaxUpload(event: any) {
  //   console.log('change: ' + event);
  //   this.generalSearchPayload.max_upload_date = event;

  // }
  // dateChangeMinMatch(event: any) {
  //   console.log('change: ' + event);
  //   this.generalSearchPayload.min_match_date = event;

  // }
  // dateChangeMaxMatch(event: any) {
  //   console.log('change: ' + event);
  //   this.generalSearchPayload.max_match_date = event;

  // }

  // ngOnInit(): void {
  //   // try {
  //   //   this.getAllCurrencies();
  //   // } catch (ex) {
  //   //   console.log('Exception: ' + JSON.stringify(ex));
  //   // }
  // }

  upload_check_date: boolean = false;

  onUploadDateValueChange(event: any) {
    this.upload_check_date = true

    if (event != undefined) {
      if (event[0] != null) {
        var a = new Date(event[0]);
        this.generalSearchPayload.min_upload_date = formatDate(a, 'yyyy-MM-dd', 'en-US')
        this.generalSearchPayload.transaction_date = formatDate(a, 'yyyy-MM-dd', 'en-US')
      } else {
        this.generalSearchPayload.min_upload_date = '0'
        this.generalSearchPayload.transaction_date = '0'

      }
      if (event[1] != null) {
        var b = new Date(event[1]);
        this.generalSearchPayload.max_upload_date = formatDate(b, 'yyyy-MM-dd', 'en-US')
      } else {
        this.generalSearchPayload.max_upload_date = '0'
      }
    } else {
      this.generalSearchPayload.min_upload_date = '0'
      this.generalSearchPayload.max_upload_date = '0'
    }
    console.log("min transaction date " + this.generalSearchPayload.transaction_date)
    console.log("min uploade date:" + this.generalSearchPayload.min_upload_date)
    console.log("min uploade date:" + event);

  }
  onMatchDateValueChange(event: any) {

    this.upload_check_date = true
    if (event != undefined) {
      if (event[0] != null) {

        var a = new Date(event[0]);
        this.generalSearchPayload.min_match_date = formatDate(a, 'yyyy-MM-dd', 'en-US')
        this.generalSearchPayload.match_date = formatDate(a, 'yyyy-MM-dd', 'en-US')

      } else {
        this.generalSearchPayload.min_match_date = '0'
        this.generalSearchPayload.match_date = ""
      }
      if (event[1] != null) {
        var b = new Date(event[1]);
        this.generalSearchPayload.max_match_date = formatDate(b, 'yyyy-MM-dd', 'en-US')
        // this.generalSearchPayload.max_match_date2 = formatDate(b, 'yyyy-MM-dd', 'en-US')


      } else {
        this.generalSearchPayload.max_match_date = '0'
      }
    } else {
      this.generalSearchPayload.min_match_date = '0'
      this.generalSearchPayload.max_match_date = '0'
      this.generalSearchPayload.match_date = ""
      // console.log("max_match_date"+this.generalSearchPayload)
    }
    console.log("match_date  " + this.generalSearchPayload.match_date)

    console.log("max match date" + this.generalSearchPayload.max_match_date)

  }

  onPostingDateValueChange(event: any) {
    this.upload_check_date = true
    if (event != undefined) {
      if (event[0] != null) {

        var a = new Date(event[0]);
        this.generalSearchPayload.posting_date = formatDate(a, 'yyyy-MM-dd', 'en-US')

      } else {
        this.generalSearchPayload.posting_date = ""
      }
      if (event[1] != null) {
        var b = new Date(event[1]);

        this.generalSearchPayload.max_posting_date = formatDate(b, 'yyyy-MM-dd', 'en-US')
      } else {
        this.generalSearchPayload.max_posting_date = '0'
      }
    } else {
      this.generalSearchPayload.max_posting_date = '0'
    }
  }

  onValueDateValueChange(event: any) {
    this.upload_check_date = true
    if (event != undefined) {
      if (event[0] != null) {

        var a = new Date(event[0]);
        this.generalSearchPayload.value_date2 = formatDate(a, 'yyyy-MM-dd', 'en-US')
        console.log("value date " + this.generalSearchPayload.value_date2)

      } else {
        this.generalSearchPayload.value_date2 = ""
      }
      if (event[1] != null) {
        var b = new Date(event[1]);
        this.generalSearchPayload.max_value_date = formatDate(b, 'yyyy-MM-dd', 'en-US')
        console.log("value date 2" + this.generalSearchPayload.max_value_date)
      } else {
        this.generalSearchPayload.max_value_date = '0'
      }
    } else {
      this.generalSearchPayload.max_value_date = '0'
    }
  }


  onTransactionDateValueChange(event: any) {

    this.upload_check_date = true
        
    if (event != undefined) {
      if (event[0] != null) {
        var a = new Date(event[0]);
        this.generalSearchPayload.min_upload_date = formatDate(a, 'yyyy-MM-dd', 'en-US')
        this.generalSearchPayload.transaction_date = formatDate(a, 'yyyy-MM-dd', 'en-US')
      } else {
        this.generalSearchPayload.min_upload_date = '0'
        this.generalSearchPayload.transaction_date = '0'
      
      }
      if (event[1] != null) {
        var b = new Date(event[1]);
        this.generalSearchPayload.max_upload_date = formatDate(b, 'yyyy-MM-dd', 'en-US')
      } else {
        this.generalSearchPayload.max_upload_date = '0'
      }
    } else {
      this.generalSearchPayload.min_upload_date = '0'
      this.generalSearchPayload.max_upload_date = '0'
      this.generalSearchPayload.transaction_date = ''
    }
    console.log("min transaction date " + this.generalSearchPayload.transaction_date)
    console.log("Max Transaction Date:" + this.generalSearchPayload.max_upload_date)
    console.log("min uploade date:" + event);

  }

  ngOnInit(): void {
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
        pageLength: 7,
        select: false, 

        // ajax: '../../../../assets/data/data.json',
        // rowCallback: (row: Node, data: any[] | Object, index: number) => {
        //   const self = this;
        //   $('td', row).off('click');
        //   $('td', row).on('click', () => {
        //     self.someFilterFromAts(data);
        //   });
        //   return row;
        // },
        ajax: (dataTablesParameters: any, callback: any, dt: any) => {
          // this.service.getAllAtsForView().subscribe(
          //   async (resp: any) => {
          //     console.log(
          //       'table1 ==========>: ' + JSON.stringify(resp, null, 2)
          //     );
          //     if (resp != null) {
          //       console.log(
          //         'response for table: ' + JSON.stringify(resp, null, 2)
          //       );
          //       // data: resp
          callback({
            //         recordsTotal: resp.recordsTotal,
            //         recordsFiltered: resp.recordsFiltered,
            data: this.rtgs,


          });
          // dt.ajax.reload()
          // dataTablesParameters.ajax.reload ()
          // window.location.reload();
          //       console.log(
          //         'records total: ' + JSON.stringify(resp.recordsTotal)
          //       );
          //     } else {
          //       Swal.fire({
          //         icon: 'error',
          //         title: 'Permission',
          //         text: 'You are not permitted to perform this action!',
          //       });
          //     }
          //   },
          //   (error: any) => {
          //     if (error.error.text === 'access-token-expired') {
          //       console.log('Access-token-expired requesting refresh token...');
          //       if (
          //         this.localStorageService.retrieve(
          //           'refresh_token_requested'
          //         ) == null
          //       ) {
          //         this.utilService.refreshToken().subscribe(
          //           (data) => {
          //             if (data === true) {
          //               console.log(
          //                 'refresh token success re-requesting the actual request'
          //               );
          //               this.localStorageService.clear(
          //                 'refresh_token_requested'
          //               );
          //               //================================================================================
          //               this.service.getAllAtsForView().subscribe(
          //                 async (resp: any) => {
          //                   if (resp != null) {
          //                     console.log(
          //                       'response for table: ' +
          //                         JSON.stringify(resp, null, 2)
          //                     );
          //                     // data: resp
          //                     callback({
          //                       recordsTotal: resp.recordsTotal,
          //                       recordsFiltered: resp.recordsFiltered,
          //                       data: resp,
          //                     });
          //                     console.log(
          //                       'records total: ' +
          //                         JSON.stringify(resp.recordsTotal)
          //                     );
          //                   } else {
          //                     Swal.fire({
          //                       icon: 'error',
          //                       title: 'Permission',
          //                       text: 'You are not permitted to perform this action!',
          //                     });
          //                   }
          //                 },
          //                 (error: any) => {
          //                   if (error.error.text === 'access-token-expired') {
          //                     console.log('refresh token expired.');
          //                     // this.SwalSessionExpired.fire();
          //                     // this._refreshTokenExpired();
          //                   } else {
          //                     Swal.fire({
          //                       icon: 'error',
          //                       title: 'Oops...',
          //                       text: 'Something went wrong!',
          //                     });
          //                     console.log(
          //                       JSON.stringify(error.error.apierror, null, 2)
          //                     );
          //                   }
          //                 }
          //               );
          //               //================================================================================
          //             } else {
          //               console.log('refresh token expired.');
          //               // this.SwalSessionExpired.fire();
          //               // this._refreshTokenExpired();
          //             }
          //           },
          //           (error: any) => {
          //             console.log('error refreshing access token');
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Oops...',
          //               text: 'Something went wrong!',
          //             });
          //             console.log(
          //               JSON.stringify(error.error.apierror, null, 2)
          //             );
          //           }
          //         );
          //         this.localStorageService.store(
          //           'refresh_token_requested',
          //           true
          //         );
          //       }
          //     } else {
          //       Swal.fire({
          //         icon: 'error',
          //         title: 'Oops...',
          //         text: 'Something went wrong!',
          //       });
          //       console.log(JSON.stringify(error.error.apierror, null, 2));
          //     }
          //   }
          // );
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
          {
            title: this.ats_fifth_column_title,
            data: 'sender',
          },
          {
            title: this.ats_sixth_column_title,
            data: 'receiver',
          },
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
                   {

            title: this.ats_tenth_column_title,
            render: function (data: any, type: any, full: any) {
              if (full.match_status == 1) {
                document
                  .getElementsByClassName('datatable-buttons')[0]
                  ?.classList.remove('dt-button')
                return (
                  '<button class="btn btn-outline-info btn-rounded" matched-id="' +
                  full.id + '" value-date="' + full.value_date_type + '">  Matched</button>'
                )
              }
              // else if (full.match_status == 2) {
              //   document
              //     .getElementsByClassName('datatable-buttons')[0]
              //     ?.classList.remove('dt-button')
              //   return (

              //     '<button class="btn btn-outline-success btn-rounded"partial-id="' +
              //     full.id +
              //     '"> Partially Matched</button>'



              //   )
              // }


              else {
                return ('umatched')

              }
            },

          },
          {
            title: this.ats_eleventh_column_title,
            render: function (data: any, type: any, full: any) {
              return full.firstname + ' ' + full.lastname;
            },
          },

        ],
        dom: "<'row mb-1 mt-4'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
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
              exportOptions: {
                format: {
                  body: function (data: any, row: any, column: any, node: any) {
                    if (column === 1) {
                      var regex = /^\d+$/;
                      if (regex.test(data) && data.length > 15) {
                        data += '                                                                                      ';
                        return data + ' \'';

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
        pageLength: 7,
        select: false,
        // ajax: '../../../../assets/data/data.json',
        ajax: (dataTablesParameters: any, callback: any) => {
          // this.service.postGeneralSearch(this.generalSearchPayload).subscribe(
          //   async (resp: any) => {
          //     if (resp != null) {
          //       console.log(
          //         'response for table: ' + JSON.stringify(resp, null, 2)
          //       );
          //       // 
          callback({
            data: this.rtgs,
          });
          //       dataTablesParameters.ajax.reload();

          //       console.log(
          //         'records total: ' + JSON.stringify(resp.recordsTotal)
          //       );
          //     } else {
          //       Swal.fire({
          //         icon: 'error',
          //         title: 'Permission',
          //         text: 'You are not permitted to perform this action!',
          //       });
          //     }
          //   },
          //   (error: any) => {
          //     if (error.error.text === 'access-token-expired') {
          //       console.log('Access-token-expired requesting refresh token...');
          //       if (
          //         this.localStorageService.retrieve(
          //           'refresh_token_requested'
          //         ) == null
          //       ) {
          //         this.utilService.refreshToken().subscribe(
          //           (data) => {
          //             if (data === true) {
          //               console.log(
          //                 'refresh token success re-requesting the actual request'
          //               );
          //               this.localStorageService.clear(
          //                 'refresh_token_requested'
          //               );
          //               //================================================================================
          //               this.service.getAllCoreForView().subscribe(
          //                 async (resp: any) => {
          //                   if (resp != null) {
          //                     console.log(
          //                       'response for table: ' +
          //                         JSON.stringify(resp, null, 2)
          //                     );
          //                     // data: resp
          //                     callback({
          //                       recordsTotal: resp.recordsTotal,
          //                       recordsFiltered: resp.recordsFiltered,
          //                       data: resp,
          //                     });
          //                     console.log(
          //                       'records total: ' +
          //                         JSON.stringify(resp.recordsTotal)
          //                     );
          //                   } else {
          //                     Swal.fire({
          //                       icon: 'error',
          //                       title: 'Permission',
          //                       text: 'You are not permitted to perform this action!',
          //                     });
          //                   }
          //                 },
          //                 (error: any) => {
          //                   if (error.error.text === 'access-token-expired') {
          //                     console.log('refresh token expired.');
          //                     // this.SwalSessionExpired.fire();
          //                     // this._refreshTokenExpired();
          //                   } else {
          //                     Swal.fire({
          //                       icon: 'error',
          //                       title: 'Oops...',
          //                       text: 'Something went wrong!',
          //                     });
          //                     console.log(
          //                       JSON.stringify(error.error.apierror, null, 2)
          //                     );
          //                   }
          //                 }
          //               );
          //               //================================================================================
          //             } else {
          //               console.log('refresh token expired.');
          //               // this.SwalSessionExpired.fire();
          //               // this._refreshTokenExpired();
          //             }
          //           },
          //           (error: any) => {
          //             console.log('error refreshing access token');
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Oops...',
          //               text: 'Something went wrong!',
          //             });
          //             console.log(
          //               JSON.stringify(error.error.apierror, null, 2)
          //             );
          //           }
          //         );
          //         this.localStorageService.store(
          //           'refresh_token_requested',
          //           true
          //         );
          //       }
          //     } else {
          //       Swal.fire({
          //         icon: 'error',
          //         title: 'Oops...',
          //         text: 'Something went wrong!',
          //       });
          //       console.log(JSON.stringify(error.error.apierror, null, 2));
          //     }
          //   }
          // );
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
            render: function (data: any, type: any, full: any) {
              // that.dr_cr = full.dr_cr;
              if (full.match_status == 1) {
                document
                  .getElementsByClassName('datatable-buttons')[0]
                  ?.classList.remove('dt-button')
                return (
                  
                  '<button class="btn btn-outline-info btn-rounded"  matched-core-id="' +
                  full.id + '"matched-core-cr-dr="' +
                  full.dr_cr + '"reference="' + full.additional_information + '">  Matched</button>'

                )

              }

              // else if (full.match_status == 2) {
              //   document
              //     .getElementsByClassName('datatable-buttons')[0]
              //     ?.classList.remove('dt-button')
              //   return (

              //     '<button class="btn btn-outline-success btn-rounded"partial-id="' +
              //     full.id +
              //     '"> Partially Matched</button>'



              //   )
              // }


              else {
                return ('umatched')

              }
            },

          },
          {
            title: this.ats_eleventh_column_title,
            render: function (data: any, type: any, full: any) {
              return full.firstname + ' ' + full.lastname;
            },
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
        dom: "<'row mb-1 mt-4'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
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
        ///======================================
        try {
      this.dtOptions_issue_core = {
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
        // ajax: '../../../../assets/data/data.json',
        ajax: (dataTablesParameters: any, callback: any) => {
          // this.service.postGeneralSearch(this.generalSearchPayload).subscribe(
          //   async (resp: any) => {
          //     if (resp != null) {
          //       console.log(
          //         'response for table: ' + JSON.stringify(resp, null, 2)
          //       );
          //       // 
          callback({
            data: this.rtgs,
          });
          //       dataTablesParameters.ajax.reload();

          //       console.log(
          //         'records total: ' + JSON.stringify(resp.recordsTotal)
          //       );
          //     } else {
          //       Swal.fire({
          //         icon: 'error',
          //         title: 'Permission',
          //         text: 'You are not permitted to perform this action!',
          //       });
          //     }
          //   },
          //   (error: any) => {
          //     if (error.error.text === 'access-token-expired') {
          //       console.log('Access-token-expired requesting refresh token...');
          //       if (
          //         this.localStorageService.retrieve(
          //           'refresh_token_requested'
          //         ) == null
          //       ) {
          //         this.utilService.refreshToken().subscribe(
          //           (data) => {
          //             if (data === true) {
          //               console.log(
          //                 'refresh token success re-requesting the actual request'
          //               );
          //               this.localStorageService.clear(
          //                 'refresh_token_requested'
          //               );
          //               //================================================================================
          //               this.service.getAllCoreForView().subscribe(
          //                 async (resp: any) => {
          //                   if (resp != null) {
          //                     console.log(
          //                       'response for table: ' +
          //                         JSON.stringify(resp, null, 2)
          //                     );
          //                     // data: resp
          //                     callback({
          //                       recordsTotal: resp.recordsTotal,
          //                       recordsFiltered: resp.recordsFiltered,
          //                       data: resp,
          //                     });
          //                     console.log(
          //                       'records total: ' +
          //                         JSON.stringify(resp.recordsTotal)
          //                     );
          //                   } else {
          //                     Swal.fire({
          //                       icon: 'error',
          //                       title: 'Permission',
          //                       text: 'You are not permitted to perform this action!',
          //                     });
          //                   }
          //                 },
          //                 (error: any) => {
          //                   if (error.error.text === 'access-token-expired') {
          //                     console.log('refresh token expired.');
          //                     // this.SwalSessionExpired.fire();
          //                     // this._refreshTokenExpired();
          //                   } else {
          //                     Swal.fire({
          //                       icon: 'error',
          //                       title: 'Oops...',
          //                       text: 'Something went wrong!',
          //                     });
          //                     console.log(
          //                       JSON.stringify(error.error.apierror, null, 2)
          //                     );
          //                   }
          //                 }
          //               );
          //               //================================================================================
          //             } else {
          //               console.log('refresh token expired.');
          //               // this.SwalSessionExpired.fire();
          //               // this._refreshTokenExpired();
          //             }
          //           },
          //           (error: any) => {
          //             console.log('error refreshing access token');
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Oops...',
          //               text: 'Something went wrong!',
          //             });
          //             console.log(
          //               JSON.stringify(error.error.apierror, null, 2)
          //             );
          //           }
          //         );
          //         this.localStorageService.store(
          //           'refresh_token_requested',
          //           true
          //         );
          //       }
          //     } else {
          //       Swal.fire({
          //         icon: 'error',
          //         title: 'Oops...',
          //         text: 'Something went wrong!',
          //       });
          //       console.log(JSON.stringify(error.error.apierror, null, 2));
          //     }
          //   }
          // );
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
            title: this.issue_sixth_column_title,
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

            title: this.core_tenth_column_title,
            render: function (data: any, type: any, full: any) {
              // that.dr_cr = full.dr_cr;
              if (full.match_status == 1) {
                document
                  .getElementsByClassName('datatable-buttons')[0]
                  ?.classList.remove('dt-button')
                return (

                  '<button class="btn btn-outline-info btn-rounded"  matched-core-id="' +
                  full.id + '"matched-core-cr-dr="' +
                  full.dr_cr + '">  Matched</button>'

                )


              }

              // else if (full.match_status == 2) {
              //   document
              //     .getElementsByClassName('datatable-buttons')[0]
              //     ?.classList.remove('dt-button')
              //   return (

              //     '<button class="btn btn-outline-success btn-rounded"partial-id="' +
              //     full.id +
              //     '"> Partially Matched</button>'



              //   )
              // }

              else {
                return ('umatched')

              }
            },

          },
          {
            title: this.ats_eleventh_column_title,
            render: function (data: any, type: any, full: any) {
              return full.firstname + ' ' + full.lastname;
            },
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
        dom: "<'row mb-1 mt-4'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
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
        // initCollapsed: true,
        // cascadePanes: true,
        // clear: true,
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
      this.dtOptions_issue_qbs = {
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
        // ajax: '../../../../assets/data/data.json',
        ajax: (dataTablesParameters: any, callback: any) => {
          // this.service.postGeneralSearch(this.generalSearchPayload).subscribe(
          //   async (resp: any) => {
          //     if (resp != null) {
          //       console.log(
          //         'response for table: ' + JSON.stringify(resp, null, 2)
          //       );
          //       // 
          callback({
            data: this.rtgs,
          });
          //       dataTablesParameters.ajax.reload();

          //       console.log(
          //         'records total: ' + JSON.stringify(resp.recordsTotal)
          //       );
          //     } else {
          //       Swal.fire({
          //         icon: 'error',
          //         title: 'Permission',
          //         text: 'You are not permitted to perform this action!',
          //       });
          //     }
          //   },
          //   (error: any) => {
          //     if (error.error.text === 'access-token-expired') {
          //       console.log('Access-token-expired requesting refresh token...');
          //       if (
          //         this.localStorageService.retrieve(
          //           'refresh_token_requested'
          //         ) == null
          //       ) {
          //         this.utilService.refreshToken().subscribe(
          //           (data) => {
          //             if (data === true) {
          //               console.log(
          //                 'refresh token success re-requesting the actual request'
          //               );
          //               this.localStorageService.clear(
          //                 'refresh_token_requested'
          //               );
          //               //================================================================================
          //               this.service.getAllCoreForView().subscribe(
          //                 async (resp: any) => {
          //                   if (resp != null) {
          //                     console.log(
          //                       'response for table: ' +
          //                         JSON.stringify(resp, null, 2)
          //                     );
          //                     // data: resp
          //                     callback({
          //                       recordsTotal: resp.recordsTotal,
          //                       recordsFiltered: resp.recordsFiltered,
          //                       data: resp,
          //                     });
          //                     console.log(
          //                       'records total: ' +
          //                         JSON.stringify(resp.recordsTotal)
          //                     );
          //                   } else {
          //                     Swal.fire({
          //                       icon: 'error',
          //                       title: 'Permission',
          //                       text: 'You are not permitted to perform this action!',
          //                     });
          //                   }
          //                 },
          //                 (error: any) => {
          //                   if (error.error.text === 'access-token-expired') {
          //                     console.log('refresh token expired.');
          //                     // this.SwalSessionExpired.fire();
          //                     // this._refreshTokenExpired();
          //                   } else {
          //                     Swal.fire({
          //                       icon: 'error',
          //                       title: 'Oops...',
          //                       text: 'Something went wrong!',
          //                     });
          //                     console.log(
          //                       JSON.stringify(error.error.apierror, null, 2)
          //                     );
          //                   }
          //                 }
          //               );
          //               //================================================================================
          //             } else {
          //               console.log('refresh token expired.');
          //               // this.SwalSessionExpired.fire();
          //               // this._refreshTokenExpired();
          //             }
          //           },
          //           (error: any) => {
          //             console.log('error refreshing access token');
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Oops...',
          //               text: 'Something went wrong!',
          //             });
          //             console.log(
          //               JSON.stringify(error.error.apierror, null, 2)
          //             );
          //           }
          //         );
          //         this.localStorageService.store(
          //           'refresh_token_requested',
          //           true
          //         );
          //       }
          //     } else {
          //       Swal.fire({
          //         icon: 'error',
          //         title: 'Oops...',
          //         text: 'Something went wrong!',
          //       });
          //       console.log(JSON.stringify(error.error.apierror, null, 2));
          //     }
          //   }
          // );
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

            title: this.core_tenth_column_title,
            render: function (data: any, type: any, full: any) {
              // that.dr_cr = full.dr_cr;
              if (full.match_status == 1) {
                document
                  .getElementsByClassName('datatable-buttons')[0]
                  ?.classList.remove('dt-button')
                return (

                  '<button class="btn btn-outline-info btn-rounded"  matched-core-id="' +
                  full.id + '"matched-core-cr-dr="' +
                  full.dr_cr + '">  Matched</button>'

                )


              }

              // else if (full.match_status == 2) {
              //   document
              //     .getElementsByClassName('datatable-buttons')[0]
              //     ?.classList.remove('dt-button')
              //   return (

              //     '<button class="btn btn-outline-success btn-rounded"partial-id="' +
              //     full.id +
              //     '"> Partially Matched</button>'



              //   )
              // }


              else {
                return ('umatched')

              }
            },

          },
          {
            title: this.ats_eleventh_column_title,
            render: function (data: any, type: any, full: any) {
              return full.firstname + ' ' + full.lastname;
            },
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
        dom: "<'row mb-1 mt-4'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
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
    //======== fixed asset mms data options      ============   
    try {
      this.dtOptions_fixed_asset_mms = {
        serverSide: false,
        scrollX: true,
        searching: true,
        lengthChange: true,
        ordering: true,
        paging: true,

        pagingType: 'full_numbers',
        pageLength: 7,
        select: false,
        ajax: (dataTablesParameters: any, callback: any, dt: any) => {

          callback({

            data: this.rtgs,

          });
        },

        columns: [
          {
            title: this.ats_first_column_title,
            data: 'id',
          },
          {
            title: this.fixed_second_column_title,
            data: 'reference',
          },

          {
            title: this.fixed_asset_core2_column_title,
            data: 'transaction_date',
          },
          // {
          //   title: this.fixed_asset_core3_column_title,
          //   data: 'period',
          // },
          {
            title: this.fixed_asset_core4_column_title,
            data: 'debit',
          },
          {
            title: this.fixed_asset_core5_column_title,
            data: 'credit',
          },
          {
            title: this.fixed_asset_core8_column_title,
            data: 'additional_information',
          },
          {
            title: this.fixed_asset_core1_column_title,
            data: 'store_code',
          },
          {
            title: this.fixed_asset_core7_column_title,
            data: 'store_name',
          },
          {
            title: this.fixed_asset_core6_column_title,
            data: 'category_description',
          },
          {
            title: this.fixed_asset_core9_column_title,
            data: 'tran_code',
          },

          {

            title: this.ats_tenth_column_title,
            render: function (data: any, type: any, full: any) {
              if (full.match_status == 1) {
                document
                  .getElementsByClassName('datatable-buttons')[0]
                  ?.classList.remove('dt-button')
                return (
                  '<button class="btn btn-outline-info btn-rounded"  matched-fixed_asset_mms_id="' +
                  full.id + '">  Matched</button>'

                )
              }

              else {
                return ('umatched')

              }
            },

          },


        ],
        dom: "<'row mb-1 mt-4'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
        colReorder: {
          order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          action: function (e: any, dt: any, node: any, config: any) { },
        },
        buttons: {
          buttons: [
            'colvis',
            ,

            {
              text: 'Reload',
              action: function (e: any, dt: any, node: any, config: any) {
                dt.ajax.reload();
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

        columnDefs: [
          {
            targets: '_all',
            defaultContent: '-',
            // className: 'select-checkbox',
          },

        ],

      };
    } catch (ex) {
      console.log('Exception: ' + JSON.stringify(ex));
    }

    // ======== fixes asset core data options ==============
    try {
      this.dtOptions_fixed_asset_core = {
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


        ajax: (dataTablesParameters: any, callback: any, dt: any) => {

          callback({

            data: this.rtgs,


          });
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
            title: this.fixed_asset_core2_column_title,
            data: 'transaction_date',
          },

          {
            title: this.core_fixed_third_column_title,
            data: 'debit',
          },
          {
            title: this.core_fixed_fifth_column_title,
            data: 'credit',
          },
          {
            title: this.fixed_asset_value_date_column_title,
            data: 'value_date',
          },
          {
            title: this.fixed_core_posting_date_column_title,
            data: 'posting_date',
          },
          {
            title: this.fixed_coreaccount_number_column_title,
            data: 'account_number',
          },
          {
            title: this.fixed_core_account_name_column_title,
            data: 'account_name',
          },
          {
            title: this.fixed_asset_naration_column_title,
            data: 'naration',
          },
          {

            title: this.ats_tenth_column_title,
            render: function (data: any, type: any, full: any) {
              if (full.match_status == 1) {
                document
                  .getElementsByClassName('datatable-buttons')[0]
                  ?.classList.remove('dt-button')
                return (
                  '<button class="btn btn-outline-info btn-rounded"  fixed_matched-core-id="' +
                  full.id + '">  Matched</button>'
                )
              }


              else {
                return ('umatched')

              }
            },

          },
        ],
        dom: "<'row mb-1 mt-4'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
        colReorder: {
          order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          action: function (e: any, dt: any, node: any, config: any) { },
        },
        buttons: {
          buttons: [
            'colvis',
            ,

            {
              text: 'Reload',
              action: function (e: any, dt: any, node: any, config: any) {
                dt.ajax.reload();
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

    //================================
    try {
      this.dtOptions_stock_mms = {
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
 
        ajax: (dataTablesParameters: any, callback: any, dt: any) => {
          // this.service.getAllAtsForView().subscribe(
          //   async (resp: any) => {
          //     console.log(
          //       'table1 ==========>: ' + JSON.stringify(resp, null, 2)
          //     );
          //     if (resp != null) {
          //       console.log(
          //         'response for table: ' + JSON.stringify(resp, null, 2)
          //       );
          //       // data: resp
          callback({
            //         recordsTotal: resp.recordsTotal,
            //         recordsFiltered: resp.recordsFiltered,
            data: this.rtgs,


          });
        
        },
        columns: [
          {
            title: this.stock_mms_first_column_title,
            data: 'id',
          },
          {
            title: this.stock_mms_second_column_title,
            data: 'store_code',
          },
          {
            title: this.stock_mms_third_column_title,
            data: 'stock_account_segment',
          },
          {
            title: this.stock_mms_fourth_column_title,
            data: 'stock_date',
          },
          {
            title: this.stock_mms_fifth_column_title,
            data: 'description',
          },
          {
            title: this.stock_mms_sixth_column_title,
            data: 'period',
          },
          {
            title: this.stock_mms_seventh_column_title,
            data: 'amount',
          },
          {
            title: this.stock_mms_eighth_column_title,
            data: 'dr_cr',
          },
          {
            title: this.stock_mms_ninth_column_title,
            data: 'tran_code',
          },
          {
            title: this.stock_mms_tenth_column_title,
            data: 'store_name',
          },

          {

            title: this.stock_mms_eleventh_column_title,
            render: function (data: any, type: any, full: any) {
            //console.log("the match statusssssssssssssss"+full.match_status)

              if (full.match_status == 1) {
                document
                  .getElementsByClassName('datatable-buttons')[0]
                  ?.classList.remove('dt-button')
                return (
                  '<button class="btn btn-outline-info btn-rounded"matched-stock_mms_id="' +
                  full.id + '">  Matched</button>'
                )
              }

              else {
                return ('umatched')

              }
            },

          },

          // {
          //   title: this.stock_mms_eleventh_column_title,
          //   render: function (data: any, type: any, full: any) {
          //     return full.firstname + ' ' + full.lastname;
          //   },
          // },

          {
            title: this.stock_mms_twelvth_column_title,
            data: 'category_description',
          },

          {
            title: this.stock_mms_thirteenth_column_title,
            data: 'reference',
          },
          
        ],
        dom: "<'row mb-1 mt-4'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
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
      this.dtOptions_stock_core = {
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
 
        ajax: (dataTablesParameters: any, callback: any, dt: any) => {
          // this.service.getAllAtsForView().subscribe(
          //   async (resp: any) => {
          //     console.log(
          //       'table1 ==========>: ' + JSON.stringify(resp, null, 2)
          //     );
          //     if (resp != null) {
          //       console.log(
          //         'response for table: ' + JSON.stringify(resp, null, 2)
          //       );
          //       // data: resp
          callback({
            //         recordsTotal: resp.recordsTotal,
            //         recordsFiltered: resp.recordsFiltered,
            data: this.rtgs,


          });
        
        },
        columns: [
          {
            title: this.stock_first_column_title,
            data: 'id',
          },
          {
            title: this.stock_second_column_title,
            data: 'transaction_reference',
          },
          {
            title: this.stock_third_column_title,
            data: 'amount',
          },
          {
            title: this.stock_fourth_column_title,
            data: 'branch_code',
          },
          {
            title: this.stock_fifth_column_title,
            data: 'value_date',
          },
          {
            title: this.stock_sixth_column_title,
            data: 'posting_date',
          },
          {
            title: this.stock_seventh_column_title,
            data: 'dr_cr',
          },
          {
            title: this.stock_eighth_column_title,
            data: 'stock_account_segment',
          },
          {
            title: this.stock_ninth_column_title,
            data: 'source_branch',
          },

          {
          title: this.stock_tenth_column_title,
          render: function (data: any, type: any, full: any) {
            console.log("the match statusssssssssssssss"+full.match_status)

            if (full.match_status == 1) {
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button')
              return (
                '<button class="btn btn-outline-info btn-rounded"matched-stock-core-id="' +
                full.id + '">  Matched</button>'
                
              )
            }

            else {
              return ('umatched')

            }
          },

        },
          {
            title: this.stock_eleventh_column_title,
            data: 'description',
          },

        ],
        dom: "<'row mb-1 mt-4'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mt-1'Q>",
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

    //================================
  }

  ngAfterViewInit(): void {


    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('matched-id')) {
        this.service
          .fetchMatchedInformation(event.target.getAttribute('matched-id').toString(), event.target.getAttribute('value-date').toString())
          .subscribe(
            (data) => {
              this.MatchDeatail = data;
              this.match_date = this.MatchDeatail.match_date
              this.mached_by = this.MatchDeatail.firstname + " " + this.MatchDeatail.lastname
              if (this.MatchDeatail.reconciliation_type == '1')
                this.reconcilation_type = 'Automatically'
              if (this.MatchDeatail.reconciliation_type == '2')
                this.reconcilation_type = 'Manually'
              this.branch_code = this.MatchDeatail.branch_code
              this.amount = this.MatchDeatail.amount
              this.additional_information = this.MatchDeatail.additional_information
              this.core_matched_detail = false;
              this.ats_matched_detail = true;
              this.fixed_asset_mms_matched_detail = false
              this.fixed_asset_core_matched_detail = false
              this.modal = new window.bootstrap.Modal(
                document.getElementById('modal-786263487'),
              ).show();
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
                        this.service
                          .fetchMatchedInformation(event.target.getAttribute('matched-id').toString(), event.target.getAttribute('value-date').toString())
                          .subscribe(
                            (data) => {
                              this.MatchDeatail = data;
                              this.match_date = this.MatchDeatail.match_date
                              this.mached_by = this.MatchDeatail.firstname + " " + this.MatchDeatail.lastname
                              if (this.MatchDeatail.reconciliation_type == '1')
                                this.reconcilation_type = 'Automatically'
                              if (this.MatchDeatail.reconciliation_type == '2')
                                this.reconcilation_type = 'Manually'
                              this.branch_code = this.MatchDeatail.branch_code
                              this.amount = this.MatchDeatail.amount
                              this.additional_information = this.MatchDeatail.additional_information
                              this.core_matched_detail = false;
                              this.ats_matched_detail = true;
                              this.fixed_asset_mms_matched_detail = false
                              this.fixed_asset_core_matched_detail = false
                              this.modal = new window.bootstrap.Modal(
                                document.getElementById('modal-786263487'),
                              ).show();
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
        // if (this.MatchDeatail.reconciliation_type == '1') {

        //   // Swal.fire({
        //   //   icon: 'info',
        //   //   title: 'detail',
        //   //  // html: '<pre>' + str + '</pre>',

        //   //   text: 'Match date----> '+this.MatchDeatail.match_date +",       "+
        //   //  'Matched by----> '+this.MatchDeatail.firstname+"  " +this.MatchDeatail.lastname+",      "+
        //   //  'Reconcilation With amount----> '+this.MatchDeatail.amount +",  "+
        //   //  'Reconcilation With branch  code-----> '+this.MatchDeatail.branch_code+",   "+
        //   //  'Reconcilation type---->  Automatically,      '+
        //   //  'Reconcilation with Additional Information: '+this.MatchDeatail.additional_information

        //   // });
        // }
        // else if (this.MatchDeatail.reconciliation_type == '2') {
        //   Swal.fire({
        //     icon: 'info',
        //     title: 'detail',
        //     text: 'Match date----> ' + this.MatchDeatail.match_date + ",       " +
        //       'Matched by----> ' + this.MatchDeatail.firstname + "  " + this.MatchDeatail.lastname + ",      " +
        //       'Reconcilation With amount----> ' + this.MatchDeatail.amount + ",  " +
        //       'Reconcilation With branch  code-----> ' + this.MatchDeatail.branch_code + ",   " +
        //       'Reconcilation type---->  Manually,        ' +
        //       'Reconcilation with Additional Information---->' + this.MatchDeatail.additional_information
        //   });
        // }

      }

      else if (event.target.hasAttribute('matched-core-id')) {
        const datas = new FormData();
        datas.append('type', this.generalSearchPayload.type);
        datas.append('dr_cr', event.target.getAttribute('matched-core-cr-dr'));
        datas.append('reference', event.target.getAttribute('reference'));
        console.log(event.target.getAttribute('matched-core-id'))
        //var cr_dr = event.target.getAttribute('matched-core-cr-dr')

        this.service
          .fetchMatchedInformationCore(event.target.getAttribute('matched-core-id'), datas)
          .subscribe(
            (data) => {
              this.core_detail = data;

              this.core_match_date = this.core_detail.match_date
              this.core_mached_by = this.core_detail.firstname + " " + this.core_detail.lastname
              if (this.core_detail.reconciliation_type == '1')
                this.core_reconcilation_type = 'Automatically'
              else if (this.core_detail.reconciliation_type == '2')
                this.core_reconcilation_type = 'Manually'
              if (this.generalSearchPayload.type == "Payable" || this.generalSearchPayload.type == "Receivable"
                || this.generalSearchPayload.type == "QBS" || this.generalSearchPayload.type == "IssueCore"
              )
                this.core_value_date_type = this.core_detail.value_date
              else {
                this.core_value_date_type = this.core_detail.value_date_type
              }
              this.core_amount = this.core_detail.amount
              if (this.generalSearchPayload.type == "Payable" || this.generalSearchPayload.type == "Receivable"
                || this.generalSearchPayload.type == "QBS" || this.generalSearchPayload.type == "IssueCore") {
                this.reference = this.core_detail.additional_information
              }
              else {
                this.reference = this.core_detail.reference
              }
              this.ats_matched_detail = false;
              this.core_matched_detail = true;
              this.fixed_asset_mms_matched_detail = false
              this.fixed_asset_core_matched_detail = false
              console.log("-------" + this.reference)
              new window.bootstrap.Modal(
                document.getElementById('modal-786263487'),
              ).show();
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
                        this.service
                          .fetchMatchedInformationCore(event.target.getAttribute('matched-core-id'), datas)
                          .subscribe(
                            (data) => {
                              this.core_detail = data;
                              this.core_match_date = this.core_detail.match_date
                              this.core_mached_by = this.core_detail.firstname + " " + this.core_detail.lastname
                              if (this.core_detail.reconciliation_type == '1')
                                this.core_reconcilation_type = 'Automatically'
                              else if (this.core_detail.reconciliation_type == '2')
                                this.core_reconcilation_type = 'Manually'
                              if (this.generalSearchPayload.type == "Payable")
                                this.core_value_date_type = this.core_detail.value_date
                              else {
                                this.core_value_date_type = this.core_detail.value_date_type
                              }
                              this.core_amount = this.core_detail.amount
                              if (this.generalSearchPayload.type == "Payable") {
                                this.reference = this.core_detail.additional_information
                              }
                              else {
                                this.reference = this.core_detail.reference
                              }
                              this.ats_matched_detail = false;
                              this.core_matched_detail = true;
                              this.fixed_asset_mms_matched_detail = false
                              this.fixed_asset_core_matched_detail = false
                              console.log("-------" + this.reference)
                              new window.bootstrap.Modal(
                                document.getElementById('modal-786263487'),
                              ).show();
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
        // if (this.MatchDeatail.reconciliation_type == '1') {

        //   // Swal.fire({
        //   //   icon: 'info',
        //   //   title: 'detail',
        //   //  // html: '<pre>' + str + '</pre>',

        //   //   text: 'Match date----> '+this.MatchDeatail.match_date +",       "+
        //   //  'Matched by----> '+this.MatchDeatail.firstname+"  " +this.MatchDeatail.lastname+",      "+
        //   //  'Reconcilation With amount----> '+this.MatchDeatail.amount +",  "+
        //   //  'Reconcilation With branch  code-----> '+this.MatchDeatail.branch_code+",   "+
        //   //  'Reconcilation type---->  Automatically,      '+
        //   //  'Reconcilation with Additional Information: '+this.MatchDeatail.additional_information

        //   // });
        // }
        // else if (this.MatchDeatail.reconciliation_type == '2') {
        //   Swal.fire({
        //     icon: 'info',
        //     title: 'detail',
        //     text: 'Match date----> ' + this.MatchDeatail.match_date + ",       " +
        //       'Matched by----> ' + this.MatchDeatail.firstname + "  " + this.MatchDeatail.lastname + ",      " +
        //       'Reconcilation With amount----> ' + this.MatchDeatail.amount + ",  " +
        //       'Reconcilation With branch  code-----> ' + this.MatchDeatail.branch_code + ",   " +
        //       'Reconcilation type---->  Manually,        ' +
        //       'Reconcilation with Additional Information---->' + this.MatchDeatail.additional_information
        //   });
        // }

      }
      // else if (event.target.hasAttribute('edit-currency-id')) {
      //   this.router.navigate([
      //     'user/view-currency-remark/edit-currency-remark/' + event.target.getAttribute('edit-currency-id'),
      //   ])
      // }
      ///=== event Target  for fixed asset mms 
      
      else if (event.target.hasAttribute('matched-stock-core-id')) {

        this.service.fetchMatchedInformationStock_core(event.target.getAttribute('matched-stock-core-id'))
          .subscribe(
            (data) => {
              console.log("this is the match detailllllllllllllllllllllllllllll"+data)

              this.history_detail = data;
              this.core_match_date = this.core_detail.match_date
              this.core_mached_by = this.core_detail.firstname + " " + this.core_detail.lastname
              console.log(this.core_detail.reconciliation_type)
              if (this.core_detail.reconciliation_type == '1') {

                this.history_detail.reconciliation_type = "Automatically"

              }
              else if (this.core_detail.reconciliation_type == "2")
                this.history_detail.reconciliation_type = "Manually"
              this.ats_matched_detail = false;
              this.core_matched_detail = false;
              this.fixed_asset_mms_matched_detail = false
              this.fixed_asset_core_matched_detail = false
              this.stock_core_matched_detail=true
              this.stock_mms_matched_detail=false

              console.log("-------" + this.reference)
              new window.bootstrap.Modal(
                document.getElementById('modal-786263480'),
              ).show();
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
                        this.service
                          .fetchMatchedInformationStock_core(event.target.getAttribute('matched-stock-core-id'))
                          .subscribe(
                            (data) => {
                              this.history_detail = data;
                              console.log("____________________________________")
                              this.core_match_date = this.core_detail.match_date
                              this.core_mached_by = this.core_detail.firstname + " " + this.core_detail.lastname
                              if (this.core_detail.reconciliation_type == '1')
                                this.history_detail.reconciliation_type = 'Automatically'
                              else if (this.core_detail.reconciliation_type == '2')
                                this.history_detail.reconciliation_type = 'Manually'
                              this.ats_matched_detail = false;
                              this.core_matched_detail = false;
                              this.fixed_asset_mms_matched_detail = false
                              this.fixed_asset_core_matched_detail = false
                              this.stock_core_matched_detail=true
                              this.stock_mms_matched_detail=false
                              console.log("-------" + this.reference)
                              new window.bootstrap.Modal(
                                document.getElementById('modal-786263488'),
                              ).show();
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

      }

      
      else if (event.target.hasAttribute('matched-stock_mms_id')) {

        this.service
          .fetchMatchedInformationStock_mms(event.target.getAttribute('matched-stock_mms_id'))
          .subscribe(
            (data) => {
              this.history_detail = data;
              console.log("here is the stock dataaaaaaaaaaaaaaaaaaa"+ data)
             this.core_mached_by = this.core_detail.firstname + " " + this.core_detail.lastname

              //this.branch_code = this.history_detail.branch_code
              //this.amount = this.history_detail.amount
             // this.additional_information = this.history_detail.additional_information
             this.match_date = this.history_detail.match_date

              if (this.history_detail.reconciliation_type == '1')
                this.history_detail.type = 'Automatically'

              else if (this.history_detail.reconciliation_type == '2')
                this.history_detail.type = 'Manually'

              console.log("here is the stock typeeeeee"+this.history_detail.reconciliation_type)

              this.ats_matched_detail = false;
              this.core_matched_detail = false;
              this.fixed_asset_mms_matched_detail = false
              this.fixed_asset_core_matched_detail = false
              this.stock_core_matched_detail = false
              this.stock_mms_matched_detail=true

              console.log("-------" + this.reference)
              new window.bootstrap.Modal(
                document.getElementById('modal-786263480'),
              ).show();
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
                        this.service
                          .fetchMatchedInformationStock_mms(event.target.getAttribute('matched-stock_mms_id'))
                          .subscribe(
                            (data) => {
                              this.history_detail = data;
                              this.core_mached_by = this.core_detail.firstname + " " + this.core_detail.lastname

                              this.match_date = this.history_detail.match_date
                              
                              console.log("here is the match dateeeeeee"+ this.history_detail.match_date);
                              this.ats_matched_detail = false;
                              this.core_matched_detail = false;
                              this.fixed_asset_mms_matched_detail = false
                              this.fixed_asset_core_matched_detail = false
                              this.stock_core_matched_detail = false
                              this.stock_mms_matched_detail=true
                              console.log("-------" + this.reference)
                              new window.bootstrap.Modal(
                                document.getElementById('modal-786263489'),
                              ).show();
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

      }

      else if (event.target.hasAttribute('fixed_matched-core-id')) {

        this.service.fetchMatchedInformationFixed_asset_core(event.target.getAttribute('fixed_matched-core-id'))
          .subscribe(
            (data) => {

              this.history_detail = data;
              this.core_match_date = this.core_detail.match_date
              this.core_mached_by = this.core_detail.firstname + " " + this.core_detail.lastname
              console.log(this.core_detail.reconciliation_type)
              if (this.core_detail.reconciliation_type == '1') {

                this.history_detail.reconciliation_type = "Automatically"

              }
              else if (this.core_detail.reconciliation_type == "2")
                this.history_detail.reconciliation_type = "Manually"
              this.ats_matched_detail = false;
              this.core_matched_detail = false;
              this.fixed_asset_mms_matched_detail = false
              this.fixed_asset_core_matched_detail = true
              console.log("-------" + this.reference)
              new window.bootstrap.Modal(
                document.getElementById('modal-786263488'),
              ).show();
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
                        this.service
                          .fetchMatchedInformationFixed_asset_core(event.target.getAttribute('fixed_matched-core-id'))
                          .subscribe(
                            (data) => {
                              this.history_detail = data;
                              console.log("____________________________________")
                              this.core_match_date = this.core_detail.match_date
                              this.core_mached_by = this.core_detail.firstname + " " + this.core_detail.lastname
                              if (this.core_detail.reconciliation_type == '1')
                                this.history_detail.reconciliation_type = 'Automatically'
                              else if (this.core_detail.reconciliation_type == '2')
                                this.history_detail.reconciliation_type = 'Manually'
                              this.ats_matched_detail = false;
                              this.core_matched_detail = false;
                              this.fixed_asset_mms_matched_detail = false
                              this.fixed_asset_core_matched_detail = true
                              console.log("-------" + this.reference)
                              new window.bootstrap.Modal(
                                document.getElementById('modal-786263488'),
                              ).show();
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

      }

      else if (event.target.hasAttribute('matched-fixed_asset_mms_id')) {

        this.service
          .fetchMatchedInformationFixed_asset_mms(event.target.getAttribute('matched-fixed_asset_mms_id'))
          .subscribe(
            (data) => {
              this.history_detail = data;
              console.log(data)
              // this.core_mached_by = this.core_detail.firstname + " " + this.core_detail.lastname
              if (this.history_detail.type == '1')
                this.history_detail.type = 'Automatically'
              else if (this.history_detail.type == '2')
                this.history_detail.type = 'Manually'
              this.ats_matched_detail = false;
              this.core_matched_detail = false;
              this.fixed_asset_mms_matched_detail = true
              this.fixed_asset_core_matched_detail = false
              console.log("-------" + this.reference)
              new window.bootstrap.Modal(
                document.getElementById('modal-786263489'),
              ).show();
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
                        this.service
                          .fetchMatchedInformationFixed_asset_mms(event.target.getAttribute('fixed_asset_mms_id'))
                          .subscribe(
                            (data) => {
                              this.history_detail = data;

                              this.ats_matched_detail = false;
                              this.core_matched_detail = false;
                              this.fixed_asset_mms_matched_detail = true
                              this.fixed_asset_core_matched_detail = false
                              console.log("-------" + this.reference)
                              new window.bootstrap.Modal(
                                document.getElementById('modal-786263489'),
                              ).show();
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

      }



    })
  }




  submitGenerallSearch() {
    console.log("some thing happened")
    console.log("===================submit clicked======================")

    this.clicked = true;
    if (this.generalSearchForm.valid) {

      this.generalSearchPayload.type =
        this.generalSearchForm.get('type')?.value;
      this.generalSearchPayload.reference =
        this.generalSearchForm.get('reference')?.value;
      this.generalSearchPayload.branch_code =
        this.generalSearchForm.get('branch_code')?.value;
      this.generalSearchPayload.value_date =
        this.generalSearchForm.get('value_date')?.value;
      this.generalSearchPayload.min_amount =
        this.generalSearchForm.get('min_amount')?.value;
      this.generalSearchPayload.max_amount =
        this.generalSearchForm.get('max_amount')?.value;
      this.generalSearchPayload.account_name =
        this.generalSearchForm.get('account_name')?.value;
      this.generalSearchPayload.debit =
        this.generalSearchForm.get('debit')?.value;
      this.generalSearchPayload.credit =
        this.generalSearchForm.get('credit')?.value;
      this.generalSearchPayload.category =
        this.generalSearchForm.get('category')?.value;

        this.generalSearchPayload.categoryStockCore =
        this.generalSearchForm.get('categoryStockCore')?.value;

        this.generalSearchPayload.categoryStockMMs =
        this.generalSearchForm.get('categoryStockMMs')?.value;


        console.log("categoryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy ="+ this.generalSearchForm.get('category')?.value)
      this.generalSearchPayload.tag_number =
        this.generalSearchForm.get('tag_number')?.value;
        this.generalSearchPayload.source_branch =
        this.generalSearchForm.get('source_branch')?.value;
        this.generalSearchPayload.account =
        this.generalSearchForm.get('account')?.value;
        this.generalSearchPayload.store_name =
        this.generalSearchForm.get('store_name')?.value;
      // this.generalSearchPayload.transaction_date =  
      // this.generalSearchForm.get('transaction_date')?.value;
      // this.generalSearchPayload.match_date =  
      // this.generalSearchForm.get('match_date')?.value;
      this.generalSearchPayload.account_number =
        this.generalSearchForm.get('account_number')?.value;
      // this.generalSearchPayload.posting_date =  
      // this.generalSearchForm.get('posting_date')?.value;
      //   this.generalSearchPayload.value_date2 =  this.generalSearchForm.get('value_date2')?.value;
      console.log("general search payload" + this.generalSearchPayload)
      this.submitGeneralSearch(this.generalSearchPayload);
      this.min_amount_greater_than_max_amount_true = false;
    }
    else {
      console.log("some proble happend")
      if (this.min_am > this.max_am)
        this.min_amount_greater_than_max_amount_true = true;
      this.checked_ats = false;
      this.checked_core = false;
    }
  }
  closeModal() {
    this.modal.hide();
    $(".modal-backdrop").remove();
  }
  onSubmit() { }

  onChange(value: any) {
    this.generalSearchPayload.type = value.target.value;
    if (this.generalSearchPayload.type == "ATS") {
      this.ats = true
      this.core = false
      this.issue = false
      this.fixed_asset_mms = false
      this.fixed_asset_core = false;
      this.stockCore = false;
      this.stockMMS=false

    }
    else if (this.generalSearchPayload.type == "CORE") {
      this.core = true
      this.issue = false
      this.ats = false
      this.fixed_asset_mms = false
      this.fixed_asset_core = false;
      this.stockCore = false;
      this.stockMMS=false

    }
    else if (this.generalSearchPayload.type == "Payable") {
      this.core = true
      this.issue = false
      this.ats = false
      this.fixed_asset_mms = false
      this.fixed_asset_core = false;
      this.stockCore = false;
      this.stockMMS=false


    }
    else if (this.generalSearchPayload.type == "Receivable") {
      this.core = true
      this.issue = false
      this.ats = false
      this.fixed_asset_mms = false
      this.fixed_asset_core = false;
      this.stockCore = false;
      this.stockMMS=false

    
    }
    else if (this.generalSearchPayload.type == "QBS") {
      this.issue = false
      this.core = true
      this.ats = false
      this.fixed_asset_mms = false
      this.fixed_asset_core = false;
      this.stockCore = false;
      this.stockMMS=false


    }
    else if (this.generalSearchPayload.type == "IssueCore") {
      this.issue = true
      this.core = false
      this.ats = false
      this.fixed_asset_mms = false;
      this.fixed_asset_core = false;
      this.stockCore = false;
      this.stockMMS=false


    }
    else if (this.generalSearchPayload.type == "FixedAssetMMS") {
      this.issue = false
      this.core = false
      this.ats = false
      this.fixed_asset_mms = true
      this.fixed_asset_core = false;
      this.stockCore = false;
      this.stockMMS=false

    }
    else if (this.generalSearchPayload.type == "FixedAssetCore") {

      this.issue = false
      this.core = false
      this.ats = false
      this.fixed_asset_mms = false
      this.fixed_asset_core = true;
      this.stockCore = false;
      this.stockMMS=false


 }
 else if (this.generalSearchPayload.type == "stockCore") {

  this.issue = false
  this.core = false
  this.ats = false
  this.fixed_asset_mms = false
  this.fixed_asset_core = false;
  this.stockCore = true;
  this.stockMMS=false


}
else if (this.generalSearchPayload.type == "stockMMS") {

  this.issue = false
  this.core = false
  this.ats = false
  this.fixed_asset_mms = false
  this.fixed_asset_core = false;
  this.stockCore = false;
  this.stockMMS = true;
}

this.localStorageService.store("type", this.generalSearchPayload.type)

  }

  onChangeminAmount(event: any) {
    if (event != undefined) {
      if (event.target.value != null) {
        this.check_min_amount = true
        this.min_am = event.target.value;

        console.log("===========" + this.min_am)
      }
      else if (event.target.value == null) {
        this.check_min_amount = false
      }
    }
    else {
      this.check_min_amount = false;
      this.min_am = "";

    }

  }
  onChangemaxAmount(event: any) {
    if (event != undefined) {
      if (event.target.value != null) {
        this.max_am = event.target.value;
        this.check_max_amount = true

        console.log("===========" + this.min_am)
      }
      else if (event.target.value == null) {
        this.check_min_amount = false
      }
    }
    else {
      this.check_max_amount = false;
      this.max_am = "";

    }
  }

  submitGeneralSearch(generalSearchPayload: GeneralSearchPayload) {
    console.log(
      'searchhhhhhhhhhhhhhhhhhh' + generalSearchPayload.min_upload_date);

    console.log(generalSearchPayload.account_name!)
    console.log("__________________________________")

    console.log('here here: ' + this.generalSearchPayload.min_upload_date)
    this.service.postGeneralSearch(generalSearchPayload).subscribe(
      (data) => {
        this.rtgs = data;
        if ((this.generalSearchPayload.type == 'ATS'
          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'ATS'
            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
          (this.generalSearchPayload.type == 'ATS'
            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'ATS' && this.generalSearchPayload.min_upload_date != '0'
            && this.generalSearchPayload.max_upload_date != '0') ||
          (this.generalSearchPayload.type == 'ATS' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
          (this.generalSearchPayload.type == 'ATS' && this.generalSearchPayload.reference != '') ||
          (this.generalSearchPayload.type == 'ATS' && this.generalSearchPayload.value_date != '')

        ) {
          this.checked_core = false;
          this.checked_ats = true;
          this.checked_issue_core = false;
          this.checked_issue_qbs = false;
          this.checked_fixed_asset_mms = false;
          this.checked_fixed_asset_core = false;
          this.checked_stockCore = false;
          this.checked_stockMMS = false;
          $('#ats_history').DataTable().ajax.reload()

        } else if ((this.generalSearchPayload.type == 'CORE'
          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'CORE'
            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
          (this.generalSearchPayload.type == 'CORE'
            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'CORE' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
          (this.generalSearchPayload.type == 'CORE' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
          (this.generalSearchPayload.type == 'CORE' && this.generalSearchPayload.reference != '') ||
          (this.generalSearchPayload.type == 'CORE' && this.generalSearchPayload.value_date != '') ||
          (this.generalSearchPayload.type == 'CORE' && this.generalSearchPayload.branch_code != '')

        ) {
          this.checked_ats = false;
          this.checked_core = true;
          this.checked_issue_core = false;
          this.checked_issue_qbs = false;
          this.checked_fixed_asset_mms = false;
          this.checked_fixed_asset_core = false;
          this.checked_stockCore = false;
          this.checked_stockMMS = false;
          $('#core_history').DataTable().ajax.reload()

        } else if ((this.generalSearchPayload.type == 'Payable'
          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'Payable'
            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
          (this.generalSearchPayload.type == 'Payable'
            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'Payable' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
          (this.generalSearchPayload.type == 'Payable' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
          (this.generalSearchPayload.type == 'Payable' && this.generalSearchPayload.reference != '') ||
          (this.generalSearchPayload.type == 'Payable' && this.generalSearchPayload.value_date != '') ||
          (this.generalSearchPayload.type == 'Payable' && this.generalSearchPayload.branch_code != '')

        ) {
          this.checked_ats = false;
          this.checked_core = true;
          this.checked_issue_core = false;
          this.checked_issue_qbs = false;
          this.checked_fixed_asset_mms = false;
          this.checked_fixed_asset_core = false;
          this.checked_stockCore = false;
          this.checked_stockMMS = false;
          $('#core_history').DataTable().ajax.reload()
          console.log("-----payable")

        } else if ((this.generalSearchPayload.type == 'QBS'
          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'QBS'
            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
          (this.generalSearchPayload.type == 'QBS'
            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'QBS' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
          (this.generalSearchPayload.type == 'QBS' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
          (this.generalSearchPayload.type == 'QBS' && this.generalSearchPayload.reference != '') ||
          (this.generalSearchPayload.type == 'QBS' && this.generalSearchPayload.value_date != '') ||
          (this.generalSearchPayload.type == 'QBS' && this.generalSearchPayload.branch_code != '')

        ) {
          this.checked_ats = false;
          this.checked_core = false;
          this.checked_issue_core = false;
          this.checked_issue_qbs = true;
          this.checked_fixed_asset_mms = false;
          this.checked_fixed_asset_core = false;
          this.checked_stockCore = false;
          this.checked_stockMMS = false;
          $('#issue_qbs').DataTable().ajax.reload()
          console.log("-----QBS")

        } else if ((this.generalSearchPayload.type == 'IssueCore'
          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'IssueCore'
            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
          (this.generalSearchPayload.type == 'IssueCore'
            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
          (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
          (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.reference != '') ||
          (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.value_date != '') ||
          (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.branch_code != '')

        ) {
          this.checked_ats = false;
          this.checked_core = false;
          this.checked_issue_core = true;
          this.checked_issue_qbs = false;
          this.checked_fixed_asset_mms = false;
          this.checked_fixed_asset_core = false;
          this.checked_stockCore = false;
          this.checked_stockMMS = false;
          $('#issue_core').DataTable().ajax.reload()
          console.log("-----IssueCore")

        } else if ((this.generalSearchPayload.type == 'Receivable'
          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'Receivable'
            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
          (this.generalSearchPayload.type == 'Receivable'
            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'Receivable' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
          (this.generalSearchPayload.type == 'Receivable' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
          (this.generalSearchPayload.type == 'Receivable' && this.generalSearchPayload.reference != '') ||
          (this.generalSearchPayload.type == 'Receivable' && this.generalSearchPayload.value_date != '') ||
          (this.generalSearchPayload.type == 'Receivable' && this.generalSearchPayload.branch_code != '')

        ) {
          this.checked_ats = false;
          this.checked_core = true;
          this.checked_issue_core = false;
          this.checked_issue_qbs = false;
          this.checked_fixed_asset_mms = false;
          this.checked_fixed_asset_core = false;
          this.checked_stockCore = false;
          this.checked_stockMMS = false;
          $('#core_history').DataTable().ajax.reload()
          console.log("-----Receivable")

        }
        //   else if ((this.generalSearchPayload.type == 'IssueCore'
        //   && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
        //   (this.generalSearchPayload.type == 'IssueCore'
        //     && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
        //   (this.generalSearchPayload.type == 'IssueCore'
        //     && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
        //   (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
        //   (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
        //   (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.reference != '') ||
        //   (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.value_date != '') ||
        //   (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.branch_code != '')

        // ) {
        //   this.checked_ats = false;
        //   this.checked_core = false;
        //   this.checked_issue_core = true;
        //   this.checked_issue_qbs = false;
        //   this.checked_fixed_asset_mms=false;
        //     this.checked_fixed_asset_core=false;
        //   $('#issue_core').DataTable().ajax.reload()
        //   console.log("-----IssueCore")

        // }

        else if ((this.generalSearchPayload.type == 'FixedAssetMMS'
          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'FixedAssetMMS'
            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
          (this.generalSearchPayload.type == 'FixedAssetMMS'
            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
          // (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.reference != '') ||
          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.value_date != '') ||
          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.branch_code != '') ||
          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.account_name != '')
          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.transaction_date != '')
          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.debit != '')
          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.credit != '')
          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.match_date != '')
          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.category != '')
          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.tag_number != '')


        ) {
          console.log("min uplload date ")
          console.log("__________________________________________________________")
          console.log("Account name" + this.generalSearchPayload.account_name)
          console.log("__________________________________________________________")

          this.checked_ats = false;
          this.checked_core = false;
          this.checked_issue_core = false;
          this.checked_issue_qbs = false;
          this.checked_fixed_asset_mms = true;
          this.checked_fixed_asset_core = false;
          this.checked_stockCore = false;
          this.checked_stockMMS = false;
          $('#fixed_asset_mms_id').DataTable().ajax.reload()
          console.log("-----FixedAssetMMS")

        }

        else if ((this.generalSearchPayload.type == 'FixedAssetCore'
          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'FixedAssetCore'
            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
          (this.generalSearchPayload.type == 'FixedAssetCore'
            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.reference != '') ||
          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.value_date != '') ||
          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.branch_code != '') ||
          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.account_name != '')
          || (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.transaction_date != '')
          || (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.debit != '')
          || (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.credit != '')
          || (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.match_date != '')
          || (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.category != '')

        ) {
          this.checked_ats = false;
          this.checked_core = false;
          this.checked_issue_core = false;
          this.checked_issue_qbs = false;
          this.checked_fixed_asset_mms = false;
          this.checked_fixed_asset_core = true;
          this.checked_stockCore = false;
          this.checked_stockMMS = false;
          $('#fixed_asset_core_id').DataTable().ajax.reload()
          console.log("-----FixedAssetCOre")

        }

        //======================================================

        if ((this.generalSearchPayload.type == 'stockCore'
        && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null)  ||
        (this.generalSearchPayload.type == 'stockCore' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
        (this.generalSearchPayload.type == 'stockCore' && this.generalSearchPayload.reference != '') ||
        (this.generalSearchPayload.type == 'stockCore' && this.generalSearchPayload.value_date != '')||
        (this.generalSearchPayload.type == 'stockCore' && this.generalSearchPayload.branch_code != '')||
        (this.generalSearchPayload.type == 'stockCore' && this.generalSearchPayload.source_branch != '')||
        (this.generalSearchPayload.type == 'stockCore' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
        (this.generalSearchPayload.type == 'stockCore' && this.generalSearchPayload.categoryStockCore != '')


      ) {
        this.checked_core = false;
        this.checked_ats = false;
        this.checked_issue_core = false;
        this.checked_issue_qbs = false;
        this.checked_fixed_asset_mms = false;
        this.checked_fixed_asset_core = false;
        this.checked_stockCore = true;
        this.checked_stockMMS = false;

        $('#stock_history').DataTable().ajax.reload()

      } 

      if ((this.generalSearchPayload.type == 'stockMMS'
      && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
      (this.generalSearchPayload.type == 'stockMMS' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
      (this.generalSearchPayload.type == 'stockMMS' && this.generalSearchPayload.reference != '') ||
      (this.generalSearchPayload.type == 'stockMMS' && this.generalSearchPayload.store_name != '') ||
      (this.generalSearchPayload.type == 'stockMMS' && this.generalSearchPayload.account != '') ||
      (this.generalSearchPayload.type == 'stockMMS' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
      (this.generalSearchPayload.type == 'stockMMS' && this.generalSearchPayload.categoryStockMMs != '')
      
    ) {
      this.checked_core = false;
      this.checked_ats = false;
      this.checked_issue_core = false;
      this.checked_issue_qbs = false;
      this.checked_fixed_asset_mms = false;
      this.checked_fixed_asset_core = false;
      this.checked_stockMMS = true;
      this.checked_stockCore = false;

      $('#stock_mms_history').DataTable().ajax.reload()

    } 
      
        //=======================================================

        this.submitted = true;

        // this.router.navigate(['/list-account']);
      },
      (error: any) => {
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
                  this.service
                    .postGeneralSearch(this.generalSearchPayload)
                    .subscribe(
                      (data) => {
                        this.rtgs = data;
                        if ((this.generalSearchPayload.type == 'ATS'
                          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'ATS'
                            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
                          (this.generalSearchPayload.type == 'ATS'
                            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'ATS' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
                          (this.generalSearchPayload.type == 'ATS' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
                          (this.generalSearchPayload.type == 'ATS' && this.generalSearchPayload.reference != '') ||
                          (this.generalSearchPayload.type == 'ATS' && this.generalSearchPayload.value_date != '')

                        ) {
                          this.checked_core = false;
                          this.checked_ats = true;
                          this.checked_issue_core = false;
                          this.checked_issue_qbs = false;
                          this.checked_fixed_asset_mms = false;
                          this.checked_fixed_asset_core = false;
                          $('#ats_history').DataTable().ajax.reload()

                        } else if ((this.generalSearchPayload.type == 'CORE'
                          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'CORE'
                            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
                          (this.generalSearchPayload.type == 'CORE'
                            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'CORE' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
                          (this.generalSearchPayload.type == 'CORE' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
                          (this.generalSearchPayload.type == 'CORE' && this.generalSearchPayload.reference != '') ||
                          (this.generalSearchPayload.type == 'CORE' && this.generalSearchPayload.value_date != '') ||
                          (this.generalSearchPayload.type == 'CORE' && this.generalSearchPayload.branch_code != '')

                        ) {
                          this.checked_ats = false;
                          this.checked_core = true;
                          this.checked_issue_core = false;
                          this.checked_issue_qbs = false;
                          this.checked_fixed_asset_mms = false;
                          this.checked_fixed_asset_core = false;
                          $('#core_history').DataTable().ajax.reload()

                        } else if ((this.generalSearchPayload.type == 'Payable'
                          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'Payable'
                            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
                          (this.generalSearchPayload.type == 'Payable'
                            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'Payable' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
                          (this.generalSearchPayload.type == 'Payable' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
                          (this.generalSearchPayload.type == 'Payable' && this.generalSearchPayload.reference != '') ||
                          (this.generalSearchPayload.type == 'Payable' && this.generalSearchPayload.value_date != '') ||
                          (this.generalSearchPayload.type == 'Payable' && this.generalSearchPayload.branch_code != '')

                        ) {
                          this.checked_ats = false;
                          this.checked_core = true;
                          this.checked_issue_core = false;
                          this.checked_issue_qbs = false;
                          this.checked_fixed_asset_mms = false;
                          this.checked_fixed_asset_core = false;
                          $('#core_history').DataTable().ajax.reload()
                          console.log("-----payable")

                        } else if ((this.generalSearchPayload.type == 'QBS'
                          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'QBS'
                            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
                          (this.generalSearchPayload.type == 'QBS'
                            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'QBS' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
                          (this.generalSearchPayload.type == 'QBS' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
                          (this.generalSearchPayload.type == 'QBS' && this.generalSearchPayload.reference != '') ||
                          (this.generalSearchPayload.type == 'QBS' && this.generalSearchPayload.value_date != '') ||
                          (this.generalSearchPayload.type == 'QBS' && this.generalSearchPayload.branch_code != '')

                        ) {
                          this.checked_ats = false;
                          this.checked_core = false;
                          this.checked_issue_core = false;
                          this.checked_issue_qbs = true;
                          this.checked_fixed_asset_mms = false;
                          this.checked_fixed_asset_core = false;
                          $('#issue_qbs').DataTable().ajax.reload()
                          console.log("-----QBS")

                        } else if ((this.generalSearchPayload.type == 'IssueCore'
                          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'IssueCore'
                            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
                          (this.generalSearchPayload.type == 'IssueCore'
                            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
                          (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
                          (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.reference != '') ||
                          (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.value_date != '') ||
                          (this.generalSearchPayload.type == 'IssueCore' && this.generalSearchPayload.branch_code != '')

                        ) {
                          this.checked_ats = false;
                          this.checked_core = false;
                          this.checked_issue_core = true;
                          this.checked_issue_qbs = false;
                          this.checked_fixed_asset_mms = false;
                          this.checked_fixed_asset_core = false;
                          $('#issue_core').DataTable().ajax.reload()
                          console.log("-----IssueCore")

                        } else if ((this.generalSearchPayload.type == 'Receivable'
                          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'Receivable'
                            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
                          (this.generalSearchPayload.type == 'Receivable'
                            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'Receivable' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
                          (this.generalSearchPayload.type == 'Receivable' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
                          (this.generalSearchPayload.type == 'Receivable' && this.generalSearchPayload.reference != '') ||
                          (this.generalSearchPayload.type == 'Receivable' && this.generalSearchPayload.value_date != '') ||
                          (this.generalSearchPayload.type == 'Receivable' && this.generalSearchPayload.branch_code != '')

                        ) {
                          this.checked_ats = false;
                          this.checked_core = true;
                          this.checked_issue_core = false;
                          this.checked_issue_qbs = false;
                          this.checked_fixed_asset_mms = false;
                          this.checked_fixed_asset_core = false;
                          $('#core_history').DataTable().ajax.reload()
                          console.log("-----Receivable")

                        }
                        else if ((this.generalSearchPayload.type == 'FixedAssetMMS'
                          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'FixedAssetMMS'
                            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
                          (this.generalSearchPayload.type == 'FixedAssetMMS'
                            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
                          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
                          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.reference != '') ||
                          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.value_date != '') ||
                          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.branch_code != '') ||
                          (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.account_name != '')
                          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.transaction_date != '')
                          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.debit != '')
                          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.credit != '')
                          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.category != '')
                          || (this.generalSearchPayload.type == 'FixedAssetMMS' && this.generalSearchPayload.tag_number != '')


                        ) {
                          console.log("__________________________________________________________")
                          console.log("Account name" + this.generalSearchPayload.account_name)
                          console.log("__________________________________________________________")

                          this.checked_ats = false;
                          this.checked_core = false;
                          this.checked_issue_core = false;
                          this.checked_issue_qbs = false;
                          this.checked_fixed_asset_mms = true;
                          this.checked_fixed_asset_core = false;
                          $('#fixed_asset_mms_id').DataTable().ajax.reload()
                          console.log("-----FixedAssetMMS")

                        }

                        else if ((this.generalSearchPayload.type == 'FixedAssetCore'
                          && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'FixedAssetCore'
                            && this.generalSearchPayload.min_amount != null && this.generalSearchPayload.max_amount == null) ||
                          (this.generalSearchPayload.type == 'FixedAssetCore'
                            && this.generalSearchPayload.min_amount == null && this.generalSearchPayload.max_amount != null) ||
                          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.min_upload_date != '0' && this.generalSearchPayload.max_upload_date != '0') ||
                          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.min_match_date != '0' && this.generalSearchPayload.max_match_date != '0') ||
                          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.reference != '') ||
                          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.value_date != '') ||
                          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.branch_code != '') ||
                          (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.account_name != '')
                          || (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.transaction_date != '')
                          || (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.debit != '')
                          || (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.credit != '')
                          || (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.match_date != '')
                          || (this.generalSearchPayload.type == 'FixedAssetCore' && this.generalSearchPayload.category != '')


                        ) {
                          this.checked_ats = false;
                          this.checked_core = false;
                          this.checked_issue_core = false;
                          this.checked_issue_qbs = false;
                          this.checked_fixed_asset_mms = false;
                          this.checked_fixed_asset_core = true;
                          $('#fixed_asset_core_id').DataTable().ajax.reload()
                          console.log("-----FixedAssetCOre")

                        }


                        this.submitted = true;

                      },
                      (error: any) => {

                        if (error.error.text === 'access-token-expired') {
                          console.log('refresh token expired.');
                          this.SwalSessionExpired.fire();
                          this._refreshTokenExpired();
                        } else if (error.error.text === 'extra-data') {
                          console.log("this is the placeeeeeeeeeee")
                          Swal.fire({
                            icon: 'error',
                            title: 'Search again',
                            text: 'Transactions are too many!',
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

            );
            this.localStorageService.store('refresh_token_requested', true);
          }
        }
        else if (error.error.text === 'extra-data') {
          Swal.fire({
            icon: 'error',
            title: 'Search again',
            text: 'Searched transactions are above limit! Please use other search options or minimize the range',
          });
        }
        else if (error.error.text === 'add-other-searching-crateria') {
          console.log("here is the placeeeee of add-other-searching-criteria")
          this.submitted = false;
          this.search_ats = true;
          Swal.fire({
            icon: 'error',
            title: 'Search again',
            text: ' please select one of search crateria from  searching list in addition of Type',
          });
        }
        else if (error.error.text === 'incorrect_max_amount') {
          this.submitted = false;
          this.search_ats = true;
          Swal.fire({
            icon: 'error',
            title: 'Incorrect Maximum Amount',
            text: ' please enter correct max amount(greater or equal min amount)',
          });
        }
        else {

          this.submitted = false;
          this.search_ats = true;
          Swal.fire({
            icon: 'error',
            title: 'Search again',
            text: ' please select one of search crateria from  searching list in addition of Type',

          });
        }


      }
    );
  }
  //FUNCTIONS
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


















