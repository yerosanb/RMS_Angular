
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CheckEmailExistPayload } from 'src/app/Admin/payloads/admin_check_email_exist_payload';
import { RemarkPayload } from '../payloads/remark-payload';
import { ReplayRemarkPayload } from '../payloads/replay-remark-payload';
import { total } from '../payloads/totalPayload';
// import { EmailPayload } from '../../payloads/email-payload';
// import { RemarkPayload } from './remark-payload';
// import { ReplayRemarkPayload } from './replay-remark-payload';
// import { total } from './totalPayload';
@Injectable({
  providedIn: 'root'
})
export class RemarkService {

  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/user/';

  constructor(private httpClient: HttpClient) { }

  getUserRemark(): Observable<Array<RemarkPayload>> {
    return this.httpClient.get<Array<RemarkPayload>>(
      this.url + 'view_user_remark'
    );
  }
  getaccountRemark(): Observable<Array<RemarkPayload>> {
    return this.httpClient.get<Array<RemarkPayload>>(
      this.url + 'view_account_remark'
    );
  }


  GetTotalCurrencyrmark() : Observable<total> {
    return this.httpClient.get<total>(
      this.url + 'GetTotalCurrencyrmark'
    );
  }
  GetTotalaccountrmark() : Observable<total> {
    return this.httpClient.get<total>(
      this.url + 'GetTotalAccountrmark'
    );
  }
  
  postCurrencyRemark(RemarkPayload: ReplayRemarkPayload): Observable<Object> {

    return this.httpClient.post(`${this.url + 'replay_currency_remark'}`, RemarkPayload);
  }

  postAccountRemark(RemarkPayload: ReplayRemarkPayload): Observable<Object> {

    return this.httpClient.post(`${this.url + 'replay_account_remark'}`, RemarkPayload);
  }

  deletCurrencyRemark(id: number): Observable<Boolean> {
    return this.httpClient.delete<Boolean>(`${this.url + 'delete_currency_remark'}/${id}`);

  }
  deletAccountRemark(id: number): Observable<Boolean> {
    return this.httpClient.delete<Boolean>(`${this.url + 'delete_account_remark'}/${id}`);

  }
  getEmail(): Observable<CheckEmailExistPayload> {
    return this.httpClient.get<CheckEmailExistPayload>(`${this.url + 'email'}`
    );
  }
   getRemarkyId(remarkId:any): Observable<RemarkPayload> {
    return this.httpClient.get<RemarkPayload>(
      this.url + 'get_remark_byId/'+remarkId
    );
  }
  
  updateRemark(
    id: number,
    remark: ReplayRemarkPayload
  ): Observable<Object> {
    return this.httpClient.put(
      `${this.url + 'update_remark'}/${id}`,
      remark
    );
  }
}