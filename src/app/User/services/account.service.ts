import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountPayload } from '../payloads/account-payload';
import { CurrencyRequest } from '../payloads/currency-request';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseURL = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/account/';

  constructor(private httpClient: HttpClient) {}

  getAccountList(): Observable<AccountPayload[]> {
    return this.httpClient.get<AccountPayload[]>(
      `${this.baseURL + 'get_approved_accounts'}`
    );
  }

  getCurrentWorkspace(): Observable<string> {
    return this.httpClient.get<string>(
      `${this.baseURL + 'get_current_workspace'}`
    );
  }

  setWorkspace(type: string): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.baseURL + 'set_workspace/' + type);
  }

  changeUserWorkspaceAccount(account_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.baseURL + 'change_user_workspace_account/' + account_id
    );
  }

  getSelectedAccount(): Observable<Number> {
    return this.httpClient.get<Number>(
      `${this.baseURL + 'get_selected_account'}`
    );
  }

  getAllAccounts(): Observable<AccountPayload[]> {
    console.log('accountsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    return this.httpClient.get<AccountPayload[]>(
      `${this.baseURL + 'get_all_accounts_to_set'}`
    );
  }
  postAccountRequest(accountPayload: AccountPayload): Observable<Object> {
     return this.httpClient.post(
      `${this.baseURL + 'send-request'}`,
      accountPayload
    );
  }
  deleteAccount(id: number): Observable<Boolean> {
    console.log(id);
    return this.httpClient.delete<Boolean>(
      `${this.baseURL + 'delete-account'}/${id}`
    );
    // return this.httpClient.delete(`${this.baseURL + 'deleteCurrency'}/${id}`);
  }

  deleteAccountRequest(id: number): Observable<Boolean> {
    console.log(id);
    return this.httpClient.delete<Boolean>(
      `${this.baseURL + 'delete-account-request'}/${id}`
    );

    // return this.httpClient.delete(`${this.baseURL + 'deleteCurrency'}/${id}`);
  }
  getAccountById(id: number): Observable<AccountPayload> {
    console.log('gertbyidiiiiiii');
    return this.httpClient.get<AccountPayload>(
      `${this.baseURL + 'findById'}/${id}`
    );
  }
  getAccountRequestById(id: number): Observable<AccountPayload> {
    console.log('gertbyidiiiiiii');
    return this.httpClient.get<AccountPayload>(
      `${this.baseURL + 'findById_account'}/${id}`
    );
  }

  updateAccount(
    id: number,
    accountPayload: AccountPayload
  ): Observable<Object> {
    console.log('thisss is updpate account');
    return this.httpClient.put(
      `${this.baseURL + 'update-account'}/${id}`,
      accountPayload
    );
  }
  updateApprovedAccount(
    id: number,
    accountPayload: AccountPayload
  ): Observable<Object> {
    console.log('thisss is updpate account');
    return this.httpClient.put(
      `${this.baseURL + 'update-approved-request'}/${id}`,
      accountPayload
    );
  }
  // PostApprovedUpdate(accountPayload: AccountPayload): Observable<Object> {
  //   console.log(accountPayload + 'of service');
  //   return this.httpClient.post(
  //     `${this.baseURL + 'update-approved-request'}`,
  //     accountPayload
  //   );
  // }
}
