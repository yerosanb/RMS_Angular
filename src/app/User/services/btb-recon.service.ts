import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BtbAts } from '../payloads/recon/btb-ats';
import { BtbCore } from '../payloads/recon/btb-core';

@Injectable({
  providedIn: 'root'
})
export class BtbReconService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + "/api/user/recon/btb/"
  private url2 = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + "/api/user/recon/erca/"

  constructor(
  private httpClient: HttpClient,
   ) { } 

  getBtbAtsForReconManual(c_date: string): Observable<Array<BtbAts>> {
    return this.httpClient.get<Array<BtbAts>>(this.url + 'get_ats_for_btb_recon/' + c_date);
  }  
  getBtbCoreForReconManual(): Observable<Array<BtbCore>>
   {
    return this.httpClient.get<Array<BtbAts>>(this.url + 'get_core_for_btb_recon');
  }
  matchPartialTransactions(id_1: string, id_2: string) {
    var out = {
      'id_1': id_1,
      'id_2': id_2,
    }
    return this.httpClient.post<any>(this.url + 'match_partial_transactions', out);
    // throw new Error('Method not implemented.');
  }
  matchTransactions(id_1: string, id_2: string) {
      var out = {
        'id_1': id_1,
        'id_2': id_2,
      }
      return this.httpClient.post<any>(this.url + 'match_transactions', out);
    }
}
