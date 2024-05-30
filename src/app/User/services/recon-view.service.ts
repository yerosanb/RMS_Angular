import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErcaAts } from '../payloads/recon/erca-ats';
import { ErcaCore } from '../payloads/recon/erca-core';
import { RtgsAts } from '../payloads/recon/rtgs-ats';
import { RtgsCore } from '../payloads/recon/rtgs-core';

@Injectable({
  providedIn: 'root'
})
export class ReconViewService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + "/api/user/recon/rtgs/"
  private url2 = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + "/api/user/recon/erca/"
  
  
  constructor(private httpClient: HttpClient) {}

  getRtgsAtsForView(c_date: string): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(this.url + 'get_rtgs_ats_for_view/' + c_date);
  }
  getRtgsCoreForView(c_date: string): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_rtgs_core_for_view/' + c_date);
  }
  getCoreReversalForView(c_date: string): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_core_reversal_for_view/' + c_date);
  }
  //================================================ view payable matched  start======================
  getPayableCreditForView(match_date:string): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_payable_credit_for_view/'+match_date);
  }
  getPayableDebitForView(match_date:string): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_payable_debit_for_view/'+match_date);
  }
  //================================================ view payable matched  end======================
  getRtgsAtsUnmathcedForView(c_date: string): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(this.url + 'get_rtgs_ats_unmatched_for_view/' + c_date);
  }
  getRtgsCoreUnmatchedForView(c_date: string): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_rtgs_core_unmatched_for_view/'+ c_date);
  }
  getRtgsAtsPartialForView(c_date: string): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(this.url + 'get_rtgs_ats_partial_for_view/' + c_date);
  }
  getRtgsCorePartialForView(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_rtgs_core_partial_for_view');
  }

  getErcaAtsForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_erca_ats_for_view/' + c_date);
  }
  getErcaCoreForView(c_date: string): Observable<Array<ErcaCore>> {
    return this.httpClient.get<Array<ErcaCore>>(this.url2 + 'get_erca_core_for_view/'+ c_date);
  }

  getErcaAtsUnmatchedForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_erca_ats_unmatched_for_view/' + c_date);
  }
  getErcaCoreUnmatchedForView(): Observable<Array<ErcaCore>> {
    return this.httpClient.get<Array<ErcaCore>>(this.url2 + 'get_erca_core_unmatched_for_view');
  }
  getErcaAtsPartialForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_erca_ats_partial_for_view/' + c_date);
  }
  getErcaCorePartialForView(): Observable<Array<ErcaCore>> {
    return this.httpClient.get<Array<ErcaCore>>(this.url2 + 'get_erca_core_partial_for_view');
  }

  getBtbAtsForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_btb_ats_for_view/' + c_date);
  }

  getBtbCoreForView(c_date: string): Observable<Array<ErcaCore>> {
    return this.httpClient.get<Array<ErcaCore>>(this.url2 + 'get_btb_core_for_view/' + c_date);
  }

  getBtbAtsUnmatchedForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_btb_ats_unmatched_for_view/' + c_date);
  }
  getBtbCoreUnmatchedForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_btb_core_unmatched_for_view/' + c_date);
  }
  getBtbAtsPartialForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_btb_ats_partial_for_view/' + c_date);
  }
  getBtbCorePartialForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_btb_core_partial_for_view/' + c_date);
  }
  
  getSosAtsForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_sos_ats_for_view/' + c_date);
  }
  getSosCoreForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_sos_core_for_view/' + c_date);
  }
  getSosAtsUnmatchedForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_sos_ats_unmatched_for_view/' + c_date);
  }
  getSosCoreUnmatchedForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_sos_core_unmatched_for_view/' + c_date);
  }
  getSosAtsPartialForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_sos_ats_partial_for_view/' + c_date);
  }
  getSosCorePartialForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_sos_core_partial_for_view/' + c_date);
  }
  
  getAllAtsForView(c_date: string): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(this.url2 + 'get_all_ats_for_view/' + c_date);
  }

  getAllCoreForView(c_date: string): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(this.url2 + 'get_all_core_for_view/' + c_date);
  }
  getAllAtsUnmatchedForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_all_ats_unmatched_for_view/' + c_date);
  }
  getAllCoreUnmatchedForView(c_date: string): Observable<Array<ErcaCore>> {
    return this.httpClient.get<Array<ErcaCore>>(this.url2 + 'get_all_core_unmatched_for_view/' + c_date);
  }
  //============================================== get all unmatch payable transaction strart =====================
  getPayableCreditUnmatchedForView(): Observable<Array<ErcaCore>> {
    return this.httpClient.get<Array<ErcaCore>>(this.url2 + 'get_payable_credit_unmatched_for_view/');
  }
  getPayableDebitUnmatchedForView(): Observable<Array<ErcaCore>> {
    return this.httpClient.get<Array<ErcaCore>>(this.url2 + 'get_payable_debit_unmatched_for_view/');
  }
  //============================================ ending get all unmatch payable transaction ===================
  
 getAllAtsPartialForView(c_date: string): Observable<Array<ErcaAts>> {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_all_ats_partial_for_view/' + c_date);
  }
  getAllCorePartialForView(c_date: string): Observable<Array<ErcaCore>> {
    return this.httpClient.get<Array<ErcaCore>>(this.url2 + 'get_all_core_partial_for_view/' + c_date);
  }

  deleteReconItem(id: number[]): Observable<ErcaAts[]>{
    console.log("hereeeee is the iddddddd"+ id);
    return this.httpClient.delete<ErcaAts[]>(`${this.url2 + 'delete_erca'}/${id}`, );
    // return this.httpClient.delete(`${this.baseURL + 'deleteCurrency'}/${id}`);
  }
  unmatchTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_transactions', out);
  }
  unmatchCoreReversalTransactions( id_2: string) {
    var out = {
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_core_reversaltransactions', out);
  }
  //======================================================= unmatch payable transaction  start==============================
  unmatchPayableTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_payable_transactions', out);
  }
  //======================================================= unmatch payable transaction  end =============================

  unmatchErcaTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url2 + 'unmatch_erca_transactions', out);
  }
  unmatchBtbTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url2 + 'unmatch_btb_transactions', out);
  }
  unmatchSosTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url2 + 'unmatch_sos_transactions', out);
  }
  unmatchAllPartialTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url2 + 'unmatch_all_partial_transactions', out);
  }
  
  // deleteReconItem(formData: FormData): Observable<HttpEvent<string[]>> {
  //   return this.httpClient.post<string[]>(`${this.url2}upload`, formData, {
  //     reportProgress: true,
  //     observe: 'events',
  //   })
  // } 
   
}
