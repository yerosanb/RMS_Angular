import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './Auth/signup/signup.component';
import { AuthGuard } from './Auth/guards/auth.guard';
import { LoginAuthGuard } from './Auth/guards/login/login-auth.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './Auth/login/login.component';
import { TermsAndConditionsComponent } from './utils_/terms-and-conditions/terms-and-conditions.component';
import { PageNotFoundComponent } from './utils_/page-not-found/page-not-found.component';
import { HomeComponent } from './c/components/home/home.component';
import { LogInfoComponent } from './c/components/log-info/log-info.component';
import { IpUsersComponent } from './c/components/ip-users/ip-users.component';
import { TimelineComponent } from './c/components/timeline/timeline.component';
import { ExceptionsComponent } from './c/components/exceptions/exceptions.component';
//import { RoleStudentGuard } from './c/guards/roles_guard/role-student.guard';
import { RoleTeacherGuard } from './c/guards/roles_guard/role-teacher.guard';
import { RoleAdminGuard } from './c/guards/roles_guard/role-admin.guard';
import { RoleTeacherStudentGuard } from './c/guards/roles_guard/role-teacher-student.guard';
import { UsersComponent } from './Admin/c/users/users.component';
import { UserActivitiesComponent } from './Admin/c/user-activities/user-activities.component';
import { LoginsComponent } from './Admin/c/logins/logins.component';
import { RolesComponent } from './Admin/c/roles/roles.component';
import { RegisterActorComponent } from './Admin/c/register-actor/register-actor.component';

import { FunctionalitiesRoleComponent } from './Admin/c/functionalities_role_based/functionalities_role.component';
import { RoleApproverGuard } from './Approver/guard/role-approver.guard';
import { CurrencyRequestsComponent } from './Approver/c/requests/currency-requests/currency-requests.component';
import { AccountRequestsComponent } from './Approver/c/requests/account-requests/account-requests.component';
import { SendCurrencyRemarkComponent } from './Approver/c/remark/send-currency-remark/send-currency-remark.component';
import { ApprovedCurrencyRequestsComponent } from './Approver/c/requests/approved-currency-requests/approved-currency-requests.component';
import { RejectedCurrencyRequestsComponent } from './Approver/c/requests/rejected-currency-requests/rejected-currency-requests.component';
import { MmComponent } from './Admin/c/mm/mm.component';
import { ChangePasswordComponent } from './Admin/c/change-password/change-password.component';
import { FirstTimeGuard } from './Admin/guards/first-time.guard';

import { ApprovedAccountRequestsComponent } from './Approver/c/requests/approved-account-requests/approved-account-requests.component';
import { RejectedAccountRequestsComponent } from './Approver/c/requests/rejected-account-requests/rejected-account-requests.component';
import { SendAccountRemarkComponent } from './Approver/c/remark/send-account-remark/send-account-remark.component';
import { ViewAccountRemarkComponent } from './Approver/c/remark/view-account-remark/view-account-remark.component';
import { ViewCurrencyRemarkComponent } from './Approver/c/remark/view-currency-remark/view-currency-remark.component';

import { RoleUserGuard } from './User/c/guards/role-user.guard';
import { CurrencyListComponent } from './User/c/components/currency-list/currency-list.component';
import { CreateCurrencyComponent } from './User/c/components/create-currency/create-currency.component';
import { ListAccountComponent } from './User/c/components/list-account/list-account.component';
import { CreateAccountComponent } from './User/c/components/create-account/create-account.component';
import { CurrencyEditComponent } from './User/c/components/currency-edit/currency-edit.component';
import { EditAccountComponent } from './User/c/components/edit-account/edit-account.component';
import { ViewAccountRequestComponent } from './User/c/components/view-account-request/view-account-request.component';
import { ViewCurrencyRequestComponent } from './User/c/components/view-currency-request/view-currency-request.component';
import { EditPendingAccountsComponent } from './User/c/components/edit-pending-accounts/edit-pending-accounts.component';
import { EditPendingCurrenciesComponent } from './User/c/components/edit-pending-currencies/edit-pending-currencies.component';

import { FileUploadComponent } from './User/c/components/file-upload/file-upload.component';

import { ReconcileComponent } from './User/c/components/reconcile/reconcile.component';

import { ReplayRemarkComponent } from './User/c/components/replay-remark/replay-remark.component';
import { RemarkComponent } from './User/c/components/remark/remark.component';
import { AccountRemarkReplayComponent } from './User/c/components/account-remark-replay/account-remark-replay.component';
import { EditAccountRmarkComponent } from './User/c/components/edit-account-rmark/edit-account-rmark.component';
import { AccountRmarkComponent } from './User/c/components/account-rmark/account-rmark.component';
import { FunctionalitiesComponent } from './Admin/c/functionalities/functionalities.component';

import { EditCurrencyRemarkComponent } from './User/c/components/edit-currency-remark/edit-currency-remark.component';
import { ViewTransactonComponent } from './User/c/components/view-transacton/view-transacton.component';

import { ViewTransactionHistoryComponent } from './User/c/components/view-transaction-history/view-transaction-history.component';

import { ReportAllComponent } from './User/c/components/report/report-all/report-all.component';
import { RoleFileUploadGuard } from './User/c/guards/role-file-upload.guard';
import { RoleIssueAccountGuard } from './User/c/components/issue_account/guards/role-issue-account.guard';
import { ReconcileIssueComponent } from './User/c/components/issue_account/c/reconcile-issue/reconcile-issue.component';

import { ReconTabsComponent } from './FixedAsset/components/recon-tab-comp/recon-tabs.component';
import { RoleFixedAssetGuard } from './FixedAsset/guards/role-fixed-asset.guard';

import { ViewIssueTransactionComponent } from './User/c/components/issue_account/c/view-issue-transaction/view-issue-transaction.component';
import { ViewTransactionTabsComponent } from './FixedAsset/components/view-transaction-tabs/view-transaction-tabs.component';
import { ViewFixedassetTransactionsComponent } from './FixedAsset/garama/component/view-fixedasset-transactions/view-fixedasset-transactions.component';
import { RegisterRoleComponent } from './Admin/c/register-role/register-role.component';
import { FixedReconTabsComponent } from './FixedAsset/components/fixed-recon-tabs/fixed-recon-tabs.component';
import { PendingUserComponent } from './Admin/c/pending-user/pending-user.component';
import { ApprovePendingUserComponent } from './Admin/c/approve-pending-user/approve-pending-user.component';
import { RoleSharedGuard } from './User/c/guards/role-shared.guard';
import { RoleUserApproverGuard } from './User/userApprover/role-user-approver.guard';
import { ViewApprovedRejectUserComponent } from './User/userApprover/view-approved-reject-user/view-approved-reject-user.component';
import { FixedAssetDivisionComponent } from './FixedAsset/components/fixed-asset-division/fixed-asset-division.component';
import { ViewStockComponent } from './Stock/Components/view-stock/view-stock.component';
import { StockReconTabComponent } from './Stock/Components/stock-recon-tab/stock-recon-tab.component';
import { DisposedAmountsComponent } from './FixedAsset/components/disposed-amounts/disposed-amounts.component';
import { ViewStockTabComponent } from './Stock/Components/view-stock-tab/view-stock-tab.component';


const routes: Routes = [
  //fixed asset routes start========================================
  {
    path: 'fixedasset/reconcile',
    component:  FixedAssetDivisionComponent ,
  },
  {
    path: 'fixedasset/reconcile',
    component:  FixedAssetDivisionComponent ,
    canActivate: [AuthGuard, RoleFixedAssetGuard],
  },
  //fixed asset routes end==========================================
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // ================s======================================================
  // routings for recon project
  //ADMIN
  { path: 'admin', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [AuthGuard, RoleAdminGuard],
  },
  {
    path: 'User-Approver/pending-users',
    component: PendingUserComponent,
    canActivate: [AuthGuard, RoleUserApproverGuard],
  },
  {
    path: 'User-Approver/Approve-pending-users/:id',
    component: ApprovePendingUserComponent,
    canActivate: [AuthGuard, RoleUserApproverGuard],
  },
  {
    path: 'User-Approver/Approve-pending-users',
    component: PendingUserComponent,
    canActivate: [AuthGuard, RoleUserApproverGuard],
  },
  {
    path: 'User-Approver/Approved-Rejected-users',
    component: ViewApprovedRejectUserComponent,
    canActivate: [AuthGuard, RoleUserApproverGuard],
  },

  // {
  //   path: 'admin/users/add',
  //   component: RegisterActorComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'admin/roles/add',
  //   component: RegisterRoleComponent,
  //   canActivate: [AuthGuard],
  // },

  {
    path: 'admin/roles',
    component: RolesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/logins',
    component: LoginsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/user-activities',
    component: UserActivitiesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/roles/functionalities/:id',
    component: FunctionalitiesRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/users/edit/:id',
    component: RegisterActorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/mm',
    component: MmComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/functionalities',
    component: FunctionalitiesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [FirstTimeGuard],
  },

  // end of admin routes

  // ========================================================================

  //=========Approver routes start======
  { path: 'Approver', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'Approver/Currency-requests',
    component: CurrencyRequestsComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },

  {
    path: 'Approver/Approved-currency-requests',
    component: ApprovedCurrencyRequestsComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },
  {
    path: 'Approver/Approved-account-requests',
    component: ApprovedAccountRequestsComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },
  {
    path: 'Approver/Rejected-currency-requests',
    component: RejectedCurrencyRequestsComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },

  {
    path: 'Approver/Rejected-account-requests',
    component: RejectedAccountRequestsComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },

  {
    path: 'Approver/Account-requests',
    component: AccountRequestsComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },

  {
    path: 'Approver/Currency-requests/currency-remark/:id',
    component: SendCurrencyRemarkComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },

  {
    path: 'Approver/Account-requests/account-remark/:id',
    component: SendAccountRemarkComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },

  {
    path: 'Approver/account-remark',
    component: ViewAccountRemarkComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },

  {
    path: 'Approver/currency-remark',
    component: ViewCurrencyRemarkComponent,
    canActivate: [AuthGuard, RoleApproverGuard],
  },

  //===================================================================
  //issue account starts here

  {
    path: 'issueaccount/reconcile',
    component: ReconcileIssueComponent,
    canActivate: [AuthGuard, RoleIssueAccountGuard],
  },
  {
    path: 'issueaccount/view_transaction',
    component: ViewIssueTransactionComponent,
    canActivate: [AuthGuard, RoleIssueAccountGuard],
  },

  //issue account ends here
  //===================================================================
{
  path: 'Stock/reconcile',
  component: StockReconTabComponent,
  canActivate: [AuthGuard, RoleFixedAssetGuard],
},
{
  path: 'Stock/View-transaction',
  component: ViewStockComponent,
  canActivate: [AuthGuard, RoleFixedAssetGuard],
},

{
  path: 'Stock/View-transaction-tab',
  component: ViewStockTabComponent,
  canActivate: [AuthGuard, RoleFixedAssetGuard],
},
{
  path: 'Stock/:type',
  component: StockReconTabComponent,
  canActivate: [AuthGuard, RoleFixedAssetGuard],
},
// {
//   path: 'Stock/Tools',
//   component: ToolsReconcileComponent,
//   canActivate: [AuthGuard, RoleFixedAssetGuard],
// },
// {
//   path: 'Stock/Spares',
//   component: SparesReconcileComponent,
//   canActivate: [AuthGuard, RoleFixedAssetGuard],
// },
// {
//   path: 'Stock/Uniform',
//   component: UniformReconcileComponent,
//   canActivate: [AuthGuard, RoleFixedAssetGuard],
// },
// {
//   path: 'Stock/Accessory',
//   component: AccessoryReconcileComponent,
//   canActivate: [AuthGuard, RoleFixedAssetGuard],
// },
// {
//   path: 'Stock/Check',
//   component: CheckReconcileComponent,
//   canActivate: [AuthGuard, RoleFixedAssetGuard],
// },
// {
//   path: 'Stock/Sanitory',
//   component: SanitoryReconcileComponent,
//   canActivate: [AuthGuard, RoleFixedAssetGuard],
// },
// {
//   path: 'Stock/Computer',
//   component: ComputerReconcileComponent,
//   canActivate: [AuthGuard, RoleFixedAssetGuard],
// },
// {
//   path: 'Stock/Furniture',
//   component: FurnitureReconcileComponent,
//   canActivate: [AuthGuard, RoleFixedAssetGuard],
// },
// {
//   path: 'Stock/Equipment',
//   component: EquipmentReconcileComponent,
//   canActivate: [AuthGuard, RoleFixedAssetGuard],
// },
  //===================================================================
  //User

  { path: 'user', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'user/reconcile',
    component: ReconcileComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/view_transaction',
    component: ViewTransactonComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/file-upload',
    component: FileUploadComponent,
    canActivate: [AuthGuard, RoleFileUploadGuard],
  },
  {
    path: 'user/view-currency',
    component: CurrencyListComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/view-currency/create-currency',
    component: CreateCurrencyComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/list-account',
    component: ListAccountComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/list-account/edit-account/:id',
    component: EditAccountComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/view-account-request/edit-pending-account',
    component: ViewCurrencyRequestComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/list-account/create-account',
    component: CreateAccountComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/view-currency/edit-currency/:id',
    component: CurrencyEditComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/view-currency-request',
    component: ViewCurrencyRequestComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/view-currency-request/edit-pending-currencies/:id',
    component: EditPendingCurrenciesComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/view-currency-remark',
    component: RemarkComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/view-account-request',
    component: ViewAccountRequestComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/view-account-request/edit-pending-account/:id',
    component: EditPendingAccountsComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/view-currency-remark/replay-remark/:id',
    component: ReplayRemarkComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/view-currency-remark/replay-remark',
    component: RemarkComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/view-account-remark/replay-account-remark',
    component: AccountRmarkComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/view-account-remark/replay-account-remark/:id',
    component: AccountRemarkReplayComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/view-account-remark/edit-account-remark',
    component: AccountRmarkComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/view-account-remark/edit-account-remark/:id',
    component: EditAccountRmarkComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/view-account-remark',
    component: AccountRmarkComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/view-currency-remark/edit-currency-remark',
    component: RemarkComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },
  {
    path: 'user/view-currency-remark/edit-currency-remark/:id',
    component: EditCurrencyRemarkComponent,
    canActivate: [AuthGuard, RoleUserGuard],
  },

  {
    path: 'user/view-transaction-history',
    component: ViewTransactionHistoryComponent,
    canActivate: [AuthGuard, RoleSharedGuard],
  },

  {
    path: 'user/report-all',
    component: ReportAllComponent,
    canActivate: [AuthGuard, RoleSharedGuard],
  },

  //end of user
  //=========================================================
  {
    path: 'landing-page',
    component: LandingPageComponent,
    canActivate: [LoginAuthGuard],
  },

  {
    path: 'log-info',
    component: LogInfoComponent,
    canActivate: [AuthGuard, RoleAdminGuard],
  },
  {
    path: 'ip-users',
    component: IpUsersComponent,
    canActivate: [AuthGuard, RoleAdminGuard],
  },

  {
    path: 'exceptions',
    component: ExceptionsComponent,
    canActivate: [AuthGuard, RoleAdminGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [LoginAuthGuard],
    // outlet: 'outer',
    // data: { animation: 'HomePage' },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginAuthGuard],
    // outlet: 'outer',
    // data: { animation: 'HomePage' },
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
    // outlet: 'outer',
  },
  {
    path: 'fixedasset/view_transaction',
    component: ViewTransactionTabsComponent,
    canActivate: [AuthGuard, RoleFixedAssetGuard],
  },
  {
    path: 'fixedasset/disposed-amounts',
    component: DisposedAmountsComponent,
    canActivate: [AuthGuard, RoleFixedAssetGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    // outlet: 'outer'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
