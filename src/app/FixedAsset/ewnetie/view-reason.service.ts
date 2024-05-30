import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewReasonService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/Fixed/recon/';


  constructor(private httpClient: HttpClient) { }

  getFixedMMSForViewReason(c_date: string): Observable<any> {
    return this.httpClient.get<any>(this.url + 'get_fixed_mms_for_view_reason/' + c_date);
  }

  getFixedCoreForViewReason(c_date: string): Observable<Array<any>> {
    return this.httpClient.get<Array<any>>(this.url + 'get_fixed_core_for_view_reason/' + c_date);
  }

  unmatchTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_transactions', out);
  }
}
