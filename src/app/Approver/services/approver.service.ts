import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AccountRequest } from '../payloads/account-request';
import { CurencyRequest } from '../payloads/curency-request';
import { Remark } from '../payloads/remark';

@Injectable({
  providedIn: 'root'
})
export class ApproverService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/approver/';
  currencyRequest!: CurencyRequest;
  accountRequest!: AccountRequest;

  constructor(private httpClient: HttpClient) {}

  getAllCurrencyRequests(): Observable<Array<CurencyRequest>> {
    return this.httpClient.get<Array<CurencyRequest>>(this.url + 'view_currency_requests');
  }

  getAllApprovedCurrencyRequests(): Observable<Array<CurencyRequest>> {
    return this.httpClient.get<Array<CurencyRequest>>(this.url + 'view_approved_currency_requests');
  }
  getAllApprovedAccountRequests(): Observable<Array<AccountRequest>> {
    return this.httpClient.get<Array<AccountRequest>>(this.url + 'view_approved_account_requests');
  }


  getAllRejectedCurrencyRequests(): Observable<Array<CurencyRequest>> {
    return this.httpClient.get<Array<CurencyRequest>>(this.url + 'view_rejected_currency_requests');
  }

  getAllRejectedAccountRequests(): Observable<Array<AccountRequest>> {
    return this.httpClient.get<Array<AccountRequest>>(this.url + 'view_rejected_account_requests');
  }

  getAllAccountRequests(): Observable<Array<AccountRequest>> {
    return this.httpClient.get<Array<AccountRequest>>(this.url + 'view_account_requests');
  }

  getAccountRemarks(): Observable<Array<Remark>> {
    return this.httpClient.get<Array<Remark>>(this.url + 'view_account_remarks');
  }

  getCurrencyRemarks(): Observable<Array<Remark>> {
    return this.httpClient.get<Array<Remark>>(this.url + 'view_currency_remarks');
  }

  approveCurrencyRequest(selected_request_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'approve_currency_request/' + selected_request_id
    );
  }

  approveAccountRequest(selected_request_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'approve_account_request/' + selected_request_id
    );
  }

  rejectCurrencyRequest(selected_request_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url +'reject_currency_request/' + selected_request_id
    );
  }

  rejectAccountRequest(selected_request_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url +'reject_account_request/' + selected_request_id
    );
  }


  currencyRemark(request_id:any,remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'currency_remark/'+request_id, remark,requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  accountRemark(request_id:any,remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'account_remark/'+request_id, remark,requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  replayRemark(remark_id:any,remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'replay_remark_account/'+remark_id, remark,requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  replayRemarkCurrency(remark_id:any,remark: Remark): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(this.url + 'replay_remark_currency/'+remark_id, remark,requestOptions)
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

}
