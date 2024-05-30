import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocalStorageService, NgxWebstorageModule } from 'ngx-webstorage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingPageHeaderComponent } from './landing-page/landing-page-header/landing-page-header.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { PageNotFoundComponent } from './utils_/page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsAndConditionsComponent } from './utils_/terms-and-conditions/terms-and-conditions.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
//import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MultiDropdownSubjectComponent } from './Auth/signup/multi-dropdown-subject/multi-dropdown-subject.component';
import { HttpClientInterceptor } from './utils_/interceptors/http-client-interceptor';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LOADING_BAR_CONFIG } from '@ngx-loading-bar/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './c/components/home/home.component';
import { LeftsideMenuComponent } from './c/components/home/leftside-menu/leftside-menu.component';
import { FooterComponent } from './c/components/home/footer/footer.component';
import { HeaderComponent } from './c/components/home/header/header.component';
import { LogInfoComponent } from './c/components/log-info/log-info.component';
import { ExceptionsComponent } from './c/components/exceptions/exceptions.component';
import { IpUsersComponent } from './c/components/ip-users/ip-users.component';
import { TimelineComponent } from './c/components/timeline/timeline.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { QuillModule } from 'ngx-quill';
import { NgToastModule } from 'ng-angular-popup';
import { NavigatorUpperComponent } from './c/components/navigator-upper/navigator-upper.component';
import { DataTablesModule } from 'angular-datatables';
import { UsersComponent } from './Admin/c/users/users.component';
import { UserActivitiesComponent } from './Admin/c/user-activities/user-activities.component';
import { RolesComponent } from './Admin/c/roles/roles.component';
import { LoginsComponent } from './Admin/c/logins/logins.component';

import { FunctionalitiesRoleComponent } from './Admin/c/functionalities_role_based/functionalities_role.component';

import { FunctionalitiesComponent } from './Admin/c/functionalities/functionalities.component';

//=========approver start=========
import { CurrencyRequestsComponent } from './Approver/c/requests/currency-requests/currency-requests.component';
import { AccountRequestsComponent } from './Approver/c/requests/account-requests/account-requests.component';
import { SendCurrencyRemarkComponent } from './Approver/c/remark/send-currency-remark/send-currency-remark.component';
import { SendAccountRemarkComponent } from './Approver/c/remark/send-account-remark/send-account-remark.component';
import { ApprovedCurrencyRequestsComponent } from './Approver/c/requests/approved-currency-requests/approved-currency-requests.component';
import { RejectedCurrencyRequestsComponent } from './Approver/c/requests/rejected-currency-requests/rejected-currency-requests.component';
import { ApprovedAccountRequestsComponent } from './Approver/c/requests/approved-account-requests/approved-account-requests.component';
import { RejectedAccountRequestsComponent } from './Approver/c/requests/rejected-account-requests/rejected-account-requests.component';

//=========approver end=========

import { CustomErrorHandler } from './ErrorHandling/custom-error-handler.service';
import { MmComponent } from './Admin/c/mm/mm.component';
import { ChangePasswordComponent } from './Admin/c/change-password/change-password.component';
import { ViewAccountRemarkComponent } from './Approver/c/remark/view-account-remark/view-account-remark.component';
import { ViewCurrencyRemarkComponent } from './Approver/c/remark/view-currency-remark/view-currency-remark.component';

import { CurrencyListComponent } from './User/c/components/currency-list/currency-list.component';
import { CreateCurrencyComponent } from './User/c/components/create-currency/create-currency.component';
import { ListAccountComponent } from './User/c/components/list-account/list-account.component';
import { CreateAccountComponent } from './User/c/components/create-account/create-account.component';
import { CurrencyEditComponent } from './User/c/components/currency-edit/currency-edit.component';
Import: [TabsModule.forRoot()];
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';
import { EditAccountComponent } from './User/c/components/edit-account/edit-account.component';
import { ViewAccountRequestComponent } from './User/c/components/view-account-request/view-account-request.component';
import { ViewCurrencyRequestComponent } from './User/c/components/view-currency-request/view-currency-request.component';
import { EditPendingAccountsComponent } from './User/c/components/edit-pending-accounts/edit-pending-accounts.component';
import { EditPendingCurrenciesComponent } from './User/c/components/edit-pending-currencies/edit-pending-currencies.component';
import { FileUploadComponent } from './User/c/components/file-upload/file-upload.component';
import { ReconcileComponent } from './User/c/components/reconcile/reconcile.component';
import { ReconAutomaticComponent } from './User/c/components/recon-automatic/recon-automatic.component';
import { ReconManualSpeedComponent } from './User/c/components/recon-manual-speed/recon-manual-speed.component';
import { AccountRemarkReplayComponent } from './User/c/components/account-remark-replay/account-remark-replay.component';
import { AccountRmarkComponent } from './User/c/components/account-rmark/account-rmark.component';
import { ReplayRemarkComponent } from './User/c/components/replay-remark/replay-remark.component';
import { EditAccountRmarkComponent } from './User/c/components/edit-account-rmark/edit-account-rmark.component';
import { RemarkComponent } from './User/c/components/remark/remark.component';

import { AllAccountsComponent } from './User/c/components/all-accounts/all-accounts.component';
import { ApprovedAccountsComponent } from './User/c/components/approved-accounts/approved-accounts.component';
import { PendingAccountsComponent } from './User/c/components/pending-accounts/pending-accounts.component';
import { RejectedAccountsComponent } from './User/c/components/rejected-accounts/rejected-accounts.component';
import { AllCurrenciesComponent } from './User/c/components/all-currencies/all-currencies.component';
import { ApprovedCurrenciesComponent } from './User/c/components/approved-currencies/approved-currencies.component';
import { PendingCurrenciesComponent } from './User/c/components/pending-currencies/pending-currencies.component';
import { RejectedCurrenciesComponent } from './User/c/components/rejected-currencies/rejected-currencies.component';

import { EditCurrencyRemarkComponent } from './User/c/components/edit-currency-remark/edit-currency-remark.component';
import { CurrencyRemarkEditComponent } from './User/c/components/currency-remark-edit/currency-remark-edit.component';

import { PartialMatchedComponent } from './User/c/components/partial-matched/partial-matched.component';

import { ViewTransactonComponent } from './User/c/components/view-transacton/view-transacton.component';

import { ViewBtbMatchedComponent } from './User/c/components/transaction-matching-view/view-btb-matched/view-btb-matched.component';
import { ViewAllMatchedComponent } from './User/c/components/transaction-matching-view/view-all-matched/view-all-matched.component';
//import { ViewRtgsMatchedComponent } from './User/c/components/transaction-matching-view/view-rtgs-matched/view-rtgs-matched.component';
import { ViewSosMatchedComponent } from './User/c/components/transaction-matching-view/view-sos-matched/view-sos-matched.component';
import { ViewErcaMatchedComponent } from './User/c/components/transaction-matching-view/view-erca-matched/view-erca-matched.component';
import { ViewAllPartiallyMatchedComponent } from './User/c/components/transaction-matching-view/view-all-partially-matched/view-all-partially-matched.component';
import { RtgsViewComponent } from './User/c/components/transaction-matching-view/rtgs-view/rtgs-view.component';
import { ErcaViewComponent } from './User/c/components/transaction-matching-view/erca-view/erca-view.component';
import { BtbViewComponent } from './User/c/components/transaction-matching-view/btb-view/btb-view.component';
import { SosViewComponent } from './User/c/components/transaction-matching-view/sos-view/sos-view.component';
import { AllViewComponent } from './User/c/components/transaction-matching-view/all-view/all-view.component';
import { ViewAllUnmatchedComponent } from './User/c/components/transaction-matching-view/view-all-unmatched/view-all-unmatched.component';

import { ReportAllComponent } from './User/c/components/report/report-all/report-all.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { PartialAutomaticComponent } from './User/c/components/partial-automatic/partial-automatic.component';
import { ViewEditedTransactionComponent } from './User/c/components/view-edited-transaction/view-edited-transaction.component';
import { ViewEditedNBEComponent } from './User/c/components/view-edited-nbe/view-edited-nbe.component';
import { ViewEditedCoreComponent } from './User/c/components/view-edited-core/view-edited-core.component';

import { ViewTransactionHistoryComponent } from './User/c/components/view-transaction-history/view-transaction-history.component';
//import { ViewMatchWithReasonComponent } from './User/c/components/transaction-matching-view/view-match-with-reason/view-match-with-reason.component';
import { ViewMatchingReasonComponent } from './User/c/components/view-matching-reason/view-matching-reason.component';
import { ViewRtgsMatchedComponent } from './User/c/components/transaction-matching-view/view-rtgs-matched/view-rtgs-matched.component';
import { RecoStokeComponent } from './User/c/MMS/components/reco-stoke/reco-stoke.component';
import { ViewStockeMatchedComponent } from './User/c/MMS/components/view-stocke-matched/view-stocke-matched.component';
import { StockViewComponent } from './User/c/MMS/components/stock-view/stock-view.component';
import { ReconAutoIssueComponent } from './User/c/components/issue_account/c/recon-auto-issue/recon-auto-issue.component';
import { ReconcileIssueComponent } from './User/c/components/issue_account/c/reconcile-issue/reconcile-issue.component';
import { ReconManualIssueComponent } from './User/c/components/issue_account/c/recon-manual-issue/recon-manual-issue.component';
import { PayableReconcileComponent } from './User/c/components/Payable/components/payable-reconcile/payable-reconcile.component';
import { ViewPayableComponent } from './User/c/components/Payable/components/view-payable/view-payable.component';
import { PayableMatchedComponent } from './User/c/components/Payable/components/payable-matched/payable-matched.component';
import { PayableUnmatchComponent } from './User/c/components/Payable/components/payable-unmatch/payable-unmatch.component';
import { PayableRecoComponent } from './User/c/components/Payable/components/payable-reco/payable-reco.component';
import { PayableAutoComponent } from './User/c/components/Payable/components/payable-auto/payable-auto.component';
import { ReconReceivableComponent } from './User/c/components/receivable/recon-receivable/recon-receivable.component';
import { ReceivableManualComponent } from './User/c/components/receivable/receivable-manual/receivable-manual.component';
import { ReceivableAutomaticComponent } from './User/c/components/receivable/receivable-automatic/receivable-automatic.component';
import { ViewReceivableComponent } from './User/c/components/receivable/view-receivable/view-receivable.component';
import { ReceivableMatchedComponent } from './User/c/components/receivable/receivable-matched/receivable-matched.component';
import { ReceivableUnmatchComponent } from './User/c/components/receivable/receivable-unmatch/receivable-unmatch.component';
import { ViewEditedPayableComponent } from './User/c/components/Payable/components/view-edited-payable/view-edited-payable.component';
import { ViewMatchWithResonPayableComponent } from './User/c/components/Payable/components/view-match-with-reson-payable/view-match-with-reson-payable.component';

import { ReconTabsComponent } from './FixedAsset/components/recon-tab-comp/recon-tabs.component';
import { ViewTransactionTabsComponent } from './FixedAsset/components/view-transaction-tabs/view-transaction-tabs.component';

import { ViewMatchWithReasonComponent } from './User/c/components/receivable/view-match-with-reason/view-match-with-reason.component';
import { ViewIssueTransactionComponent } from './User/c/components/issue_account/c/view-issue-transaction/view-issue-transaction.component';
import { IssueMatchedComponent } from './User/c/components/issue_account/c/issue-matched/issue-matched.component';
import { IssueUnmatchedComponent } from './User/c/components/issue_account/c/issue-unmatched/issue-unmatched.component';

//import { ReconManualFixedAssetComponent } from './FixedAsset/Abebayehu/component/recon-manual-fixed-asset/recon-manual-fixed-asset.component';

//import { FixedReconAutomaticComponent } from './FixedAsset/garama/component/fixed-recon-automatic/fixed-recon-automatic.component';
import { MatchedReasonComponent } from './User/c/components/issue_account/c/matched-reason/matched-reason.component';
import { EditedIssueCoreComponent } from './User/c/components/issue_account/c/edited-issue-core/edited-issue-core.component';
import { EditedIssueQbsComponent } from './User/c/components/issue_account/c/edited-issue-qbs/edited-issue-qbs.component';
import { ReconPasTabsComponent } from './User/c/components/reconcile/recon-pas-tabs/recon-pas-tabs.component';
import { ViewFixedassetTransactionsComponent } from './FixedAsset/garama/component/view-fixedasset-transactions/view-fixedasset-transactions.component';
import { IssueCoreReversalMatchedComponent } from './User/c/components/issue_account/c/issue-core-reversal-matched/issue-core-reversal-matched.component';
import { IssueQbsReversalmatchedComponent } from './User/c/components/issue_account/c/issue-qbs-reversalmatched/issue-qbs-reversalmatched.component';
import { ViewFixedAssetWithReasonComponent } from './FixedAsset/ewnetie/view-fixed-asset-with-reason/view-fixed-asset-with-reason.component';
import { RegisterActorComponent } from './Admin/c/register-actor/register-actor.component';
import { MultiDropdownRoleComponent } from './Admin/c/register-actor/multi-dropdown-role/multi-dropdown-role.component';
import { ViewFixedUnmatchedComponent } from './FixedAsset/garama/component/view-fixed-unmatched/view-fixed-unmatched.component';
import { RegisterRoleComponent } from './Admin/c/register-role/register-role.component';
import { FixedMmsEditedDeletedComponent } from './FixedAsset/Abebayehu/component/fixed-mms-edited-deleted/fixed-mms-edited-deleted.component';
import { FixedCoreEditedDeletedComponent } from './FixedAsset/Abebayehu/component/fixed-core-edited-deleted/fixed-core-edited-deleted.component';
import { FixedReconTabsComponent } from './FixedAsset/components/fixed-recon-tabs/fixed-recon-tabs.component';
import { ReconTabFurnComponent } from './FixedAsset/components/recon-tab-furn/recon-tab-furn.component';
import { ReconTabVehicleComponent } from './FixedAsset/components/recon-tab-vehicle/recon-tab-vehicle.component';
import { ReconTabEquipmentComponent } from './FixedAsset/components/recon-tab-equipment/recon-tab-equipment.component';
//import { ReconManualComputerComponent } from './FixedAsset/Abebayehu/component/recon-manual-computer/recon-manual-computer.component';
//import { ReconMaualVehicleComponent } from './FixedAsset/Abebayehu/component/recon-maual-vehicle/recon-maual-vehicle.component';
//import { ReconManualEquipmentComponent } from './FixedAsset/Abebayehu/component/recon-manual-equipment/recon-manual-equipment.component';
//import { ComputerReconAutomaticComponent } from './FixedAsset/garama/component/computer-recon-automatic/computer-recon-automatic.component';
import { VehicleReconAutomaticComponent } from './FixedAsset/garama/component/vehicle-recon-automatic/vehicle-recon-automatic.component';
import { EquipmentReconAutomaticComponent } from './FixedAsset/garama/component/equipment-recon-automatic/equipment-recon-automatic.component';
//import { ReconManualFurnitureComponent } from './FixedAsset/Abebayehu/component/recon-manual-furniture/recon-manual-furniture.component';
import { FurnitureReconAutomaticComponent } from './FixedAsset/garama/component/furniture-recon-automatic/furniture-recon-automatic.component';
//import { EquipmentComponent } from './FixedAsset/components/equipment/equipment.component';
import { PendingUserComponent } from './Admin/c/pending-user/pending-user.component';
import { ApprovePendingUserComponent } from './Admin/c/approve-pending-user/approve-pending-user.component';
import { MultiDropdownRolesComponent } from './Admin/c/approve-pending-user/multi-dropdown-role/multi-dropdown-roles.component';
import { ViewComputerTabsComponent } from './FixedAsset/components/view-computer-tabs/view-computer-tabs.component';
import { ViewFurnitureTabsComponent } from './FixedAsset/components/view-furniture-tabs/view-furniture-tabs.component';
import { ViewEquipmentTabsComponent } from './FixedAsset/components/view-equipment-tabs/view-equipment-tabs.component';
import { ViewVehicleTabsComponent } from './FixedAsset/components/view-vehicle-tabs/view-vehicle-tabs.component';
import { ViewVehicleUnmatchedComponent } from './FixedAsset/components/view-vehicle-unmatched/view-vehicle-unmatched.component';
import { ViewComputerUnmatchedComponent } from './FixedAsset/components/view-computer-unmatched/view-computer-unmatched.component';
import { ViewFurnitureUnmatchedComponent } from './FixedAsset/components/view-furniture-unmatched/view-furniture-unmatched.component';
import { ViewEquipmentUnmatchedComponent } from './FixedAsset/components/view-equipment-unmatched/view-equipment-unmatched.component';
import { ViewComputerMatchedComponent } from './FixedAsset/components/view-computer-matched/view-computer-matched.component';
import { ViewFurnitureMatchedComponent } from './FixedAsset/components/view-furniture-matched/view-furniture-matched.component';
import { ViewEquipmentMatchedComponent } from './FixedAsset/components/view-equipment-matched/view-equipment-matched.component';
import { ViewVehicleMatchedComponent } from './FixedAsset/components/view-vehicle-matched/view-vehicle-matched.component';
import { ViewWaitingComponent } from './FixedAsset/components/view-waiting-disposed-removed/view-waiting/view-waiting.component';
import { ViewDisposedComponent } from './FixedAsset/components/view-waiting-disposed-removed/view-disposed/view-disposed.component';
import { ViewRemovedComponent } from './FixedAsset/components/view-waiting-disposed-removed/view-removed/view-removed.component';
import { ViewApprovedRejectUserComponent } from './User/userApprover/view-approved-reject-user/view-approved-reject-user.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FixedAssetDivisionComponent } from './FixedAsset/components/fixed-asset-division/fixed-asset-division.component';
import { ReconManualComputerComponent } from './FixedAsset/components/recon-manual-computer/recon-manual-computer.component';
//import { ReconManualVehicleComponent } from './FixedAsset/components/recon-manual-vehicle/recon-manual-vehicle.component';
import { ReconAutomaticEquipmentComponent } from './FixedAsset/components/recon-automatic-equipment/recon-automatic-equipment.component';
import { ReconAutomaticComputerComponent } from './FixedAsset/components/recon-automatic-computer/recon-automatic-computer.component';
import { ReconAutomaticVehicleComponent } from './FixedAsset/components/recon-automatic-vehicle/recon-automatic-vehicle.component';
import { ReconAutomaticFurnitureComponent } from './FixedAsset/components/recon-automatic-furniture/recon-automatic-furniture.component';
import { ReconManualFurnitureComponent } from './FixedAsset/components/recon-manual-furniture/recon-manual-furniture.component';
import { ReconManualVehicleComponent } from './FixedAsset/components/recon-manual-vehicle/recon-manual-vehicle.component';
import { ReconManualEquipmentComponent } from './FixedAsset/components/recon-manual-equipment/recon-manual-equipment.component';
import { PasCoreReversalMatchedComponent } from './User/c/components/transaction-matching-view/pas-core-reversal-matched/pas-core-reversal-matched.component';
import { ViewCoreReversalComponent } from './FixedAsset/components/view-core-reversal/view-core-reversal.component';
import { ViewStockComponent } from './Stock/Components/view-stock/view-stock.component';
import { StockManualComponent } from './Stock/Components/stock-manual/stock-manual.component';
import { StockAutomaticComponent } from './Stock/Components/stock-automatic/stock-automatic.component';
import { StockReconTabComponent } from './Stock/Components/stock-recon-tab/stock-recon-tab.component';
import { DisposedAmountsComponent } from './FixedAsset/components/disposed-amounts/disposed-amounts.component';
import { ViewStockTabComponent } from './Stock/Components/view-stock-tab/view-stock-tab.component';
import { StockUnmatchedComponent } from './Stock/Components/stock-unmatched/stock-unmatched.component';
import { StockReversalComponent } from './Stock/Components/stock-reversal/stock-reversal.component';
import { MatchedWithReasonComponent } from './Stock/Components/matched-with-reason/matched-with-reason.component';
import { ViewMmsStockDeletedComponent } from './Stock/Components/view-mms-stock-deleted/view-mms-stock-deleted.component';
import { ViewCoreStockDeletedComponent } from './Stock/Components/view-core-stock-deleted/view-core-stock-deleted.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LandingPageHeaderComponent,
    LoginComponent,
    SignupComponent,
    PageNotFoundComponent,
    TermsAndConditionsComponent,
    MultiDropdownSubjectComponent,
    MultiDropdownRoleComponent,
    MultiDropdownRolesComponent,
    HomeComponent,
    LeftsideMenuComponent,
    FooterComponent,
    HeaderComponent,
    LogInfoComponent,
    ExceptionsComponent,
    IpUsersComponent,
    TimelineComponent,
    NavigatorUpperComponent,
    RegisterActorComponent,
    // declarations for Admin actor start
    RegisterActorComponent,
    UsersComponent,
    UserActivitiesComponent,
    RolesComponent,
    LoginsComponent,
    FunctionalitiesComponent,
    CurrencyListComponent,
    CreateCurrencyComponent,
    ListAccountComponent,
    CreateAccountComponent,
    CurrencyEditComponent,
    EditAccountComponent,
    ViewAccountRequestComponent,
    ViewCurrencyRequestComponent,
    EditPendingAccountsComponent,
    EditPendingCurrenciesComponent,
    AccountRemarkReplayComponent,
    AccountRmarkComponent,
    ReplayRemarkComponent,
    EditAccountRmarkComponent,
    RemarkComponent,
    FunctionalitiesRoleComponent,
    MmComponent,
    ChangePasswordComponent,
    FunctionalitiesComponent,
    // declarations for Admin actor end

    //Recon
    FileUploadComponent,
    ReconcileComponent,
    ReconAutomaticComponent,
    ReconManualSpeedComponent,

    // declarations for Admin actor end
    //=========approver start=========
    CurrencyRequestsComponent,
    AccountRequestsComponent,
    SendCurrencyRemarkComponent,
    SendAccountRemarkComponent,
    ApprovedCurrencyRequestsComponent,
    RejectedCurrencyRequestsComponent,
    ApprovedAccountRequestsComponent,
    RejectedAccountRequestsComponent,
    ViewAccountRemarkComponent,
    ViewCurrencyRemarkComponent,
    AllAccountsComponent,
    ApprovedAccountsComponent,
    PendingAccountsComponent,
    RejectedAccountsComponent,
    AllCurrenciesComponent,
    ApprovedCurrenciesComponent,
    PendingCurrenciesComponent,
    RejectedCurrenciesComponent,
    EditCurrencyRemarkComponent,
    CurrencyRemarkEditComponent,
    PartialMatchedComponent,
    ViewTransactonComponent,
    ViewAllMatchedComponent,
    ViewAllUnmatchedComponent,
    ViewRtgsMatchedComponent,
    ViewErcaMatchedComponent,
    ViewSosMatchedComponent,
    ViewBtbMatchedComponent,
    ViewAllPartiallyMatchedComponent,
    RtgsViewComponent,
    ErcaViewComponent,
    BtbViewComponent,
    SosViewComponent,
    AllViewComponent,
    PartialAutomaticComponent,
    ViewEditedTransactionComponent,
    ViewEditedNBEComponent,
    ViewEditedCoreComponent,
    ViewTransactionHistoryComponent,
    ReportAllComponent,
    PartialAutomaticComponent,
    ViewMatchingReasonComponent,
    RecoStokeComponent,
    ViewStockeMatchedComponent,
    StockViewComponent,
    //=========approver end=========
    //=========issue account start===
    ReconcileIssueComponent,
    ReconAutoIssueComponent,
    ReconManualIssueComponent,
    PayableReconcileComponent,
    ViewPayableComponent,
    PayableMatchedComponent,
    PayableUnmatchComponent,
    PayableRecoComponent,
    PayableAutoComponent,
    ReconReceivableComponent,
    ReceivableManualComponent,
    ReceivableAutomaticComponent,
    ViewReceivableComponent,
    ReceivableMatchedComponent,
    ReceivableUnmatchComponent,
    ViewEditedPayableComponent,
    ViewMatchWithResonPayableComponent,

    ViewMatchWithReasonComponent,
    ViewIssueTransactionComponent,
    IssueMatchedComponent,
    IssueUnmatchedComponent,

    //=========issue account end===

    //===========fixed asset start======
    ReconTabsComponent,
    ViewTransactionTabsComponent,

    //ReconManualFixedAssetComponent,
    //===========fixed asset end======

    //FixedReconAutomaticComponent,
    MatchedReasonComponent,
    EditedIssueCoreComponent,
    EditedIssueQbsComponent,
    //===========fixed asset end======

    ReconPasTabsComponent,
    ViewFixedassetTransactionsComponent,
    ReconPasTabsComponent,
    IssueCoreReversalMatchedComponent,
    IssueQbsReversalmatchedComponent,
    ViewFixedUnmatchedComponent,
    ViewFixedAssetWithReasonComponent,
    RegisterRoleComponent,
    FixedMmsEditedDeletedComponent,
    FixedCoreEditedDeletedComponent,
    FixedReconTabsComponent,
    ReconTabFurnComponent,
    ReconTabVehicleComponent,
    ReconTabEquipmentComponent,
    //ReconManualVehicleComponent,
    //ReconManualEquipmentComponent,
    //ComputerReconAutomaticComponent,
    VehicleReconAutomaticComponent,
    EquipmentReconAutomaticComponent,
    //ReconManualFurnitureComponent,
    FurnitureReconAutomaticComponent,
    PendingUserComponent,
    ApprovePendingUserComponent,
    ViewComputerTabsComponent,
    ViewFurnitureTabsComponent,
    ViewEquipmentTabsComponent,
    ViewVehicleTabsComponent,
    ViewVehicleUnmatchedComponent,
    ViewComputerUnmatchedComponent,
    ViewFurnitureUnmatchedComponent,
    ViewEquipmentUnmatchedComponent,
    ViewComputerMatchedComponent,
    ViewFurnitureMatchedComponent,
    ViewEquipmentMatchedComponent,
    ViewVehicleMatchedComponent,
    ViewWaitingComponent,
    ViewDisposedComponent,
    ViewRemovedComponent,
    ViewApprovedRejectUserComponent,
    FixedAssetDivisionComponent,
    ReconManualComputerComponent,
    ReconManualVehicleComponent,
    ReconAutomaticEquipmentComponent,
    ReconAutomaticComputerComponent,
    ReconAutomaticVehicleComponent,
    ReconAutomaticFurnitureComponent,
    ReconManualFurnitureComponent,
    ReconManualEquipmentComponent,
    PasCoreReversalMatchedComponent,
    ViewCoreReversalComponent,
    ViewStockComponent,
    StockManualComponent,
    StockAutomaticComponent,
    StockReconTabComponent,
    DisposedAmountsComponent,
    ViewStockTabComponent,
    StockUnmatchedComponent,
    StockReversalComponent,
    MatchedWithReasonComponent,
    ViewMmsStockDeletedComponent,
    ViewCoreStockDeletedComponent

  ],
  imports: [
    BrowserAnimationsModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    SweetAlert2Module.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxWebstorageModule.forRoot(),
    BrowserModule,
    FormsModule,
    EditorModule,
    BsDatepickerModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    QuillModule,
    NgxDropzoneModule,
    NgToastModule,
    DataTablesModule,
    TabsModule.forRoot(),
    TabsModule,
    PdfViewerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientInterceptor,
      multi: true,
    },
    { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 5 } },

    TabsetConfig,
    // {provide: LocalStorageService }

    // { provide: ErrorHandler, useClass: CustomErrorHandler },
    // { provide: ErrorHandler, useClass: CustomErrorHandler },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
