import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErcaAts } from '../payloads/recon/erca-ats';
import { Observable } from 'rxjs';
import { RtgsAts } from '../payloads/recon/rtgs-ats';
import { RtgsCore } from '../payloads/recon/rtgs-core';
import { EditTransactionPayload } from '../payloads/edit-transaction-payload/edit-transaction-payload';

import { CommentPayload } from '../payloads/comment-payload';

@Injectable({
  providedIn: 'root',
})
export class ReconcileService {
  [x: string]: any;

  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/user/recon/';
  private url2 = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/user/recon/erca/';

  constructor(private httpClient: HttpClient) {}
  
  updateTransaction(editPayload: EditTransactionPayload): Observable<boolean> {
    return this.httpClient.post<boolean>(
      this.url + 'update_transaction',
      editPayload
    );
  }
  
  deleteTransactions(text: any, ids: any[], type: string): Observable<boolean> {
    var out = {
      reason: text,
      ids: ids,
      type: type,
    };
  
    return this.httpClient.post<any>(this.url + 'delete_transactions/', out);
  }

  getAtsForRecon(c_date: string): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_ats_for_recon/' + c_date
    );
  }

  getEditedAtsTransaction(): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get-edited-ats' 
    );
  }

  getEditedCoreTransaction(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get-edited-core' 
    );
  }
  //====================================================== payable -----------------------------------
  getEditedPayableTransaction(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get-edited-payable' 
    );
  }
  getEditedDetailPayableTransaction(id:number): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get-edited-detail-payable/'+id 
    );
  }
  //======================================================= ending ====================================

 getEditedDetailAtsTransaction(id:number): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get-edited-detail-ats/'+id 
    );
  }

  getEditedDetailCoreTransaction(id:number): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get-edited-detail-core/'+id 
    );
  }

  getRtgsAtsMatched(c_date: string): Observable<Array<RtgsAts>> {
    console.log('from service: ' + c_date);
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_ats_matched/' + c_date
    );
  }

  getRtgsAtsPartiallyMatched(c_date: string): Observable<Array<RtgsAts>> {
    console.log('from service: ' + c_date);
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_ats_partially_matched/' + c_date
    );
  }

  getErcaAtsForRecon() {
    return this.httpClient.get<Array<ErcaAts>>(this.url2 + 'get_ats_for_recon');
  }

  getRtgsAtsForReconAuto(c_date: string) {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_ats_for_recon_auto/' + c_date
    );
  }
  //============================================= get payable transaction for auto start ======================
  getPayableCreditForReconAuto(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_payable_credit_for_recon_auto' 
    );
  }
  getPayableDebitForReconAuto(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_payable_debit_for_recon_auto' 
    );
  }
  //============================================ get payable transaction for auto start =======================

  getRtgsCoreForReconAuto(c_date: string): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_core_for_recon_auto/' + c_date
    );
  }

  getCoreForReconPartialAuto(c_date: string): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_core_for_recon_partial_auto/' + c_date
    );
  }

  getAtsForReconPartialAuto(c_date: string) {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_ats_for_recon_partial_auto/' + c_date
    );
  }

  getAtsForReconPartial() {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_ats_for_recon_partial'
    );
  }
  getCoreForRecon(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_core_for_recon'
    );
  }
  getRtgsCoreMatched(c_date: string): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_core_matched/' + c_date
    );
  }
  getRtgsCorePartiallyMatched(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_core_partially_matched'
    );
  }

  getCoreForReconPartial(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_core_for_recon_partial'
    );
  }

  getErcaCoreForRecon() {
    return this.httpClient.get<Array<ErcaAts>>(
      this.url2 + 'get_core_for_recon'
    );
  }
  matchTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    console.log(JSON.stringify(out, null, 2));
    return this.httpClient.post<any>(this.url + 'match_transactions', out);
  }
  matchTransactionsReversal( id_2: string) {
    var out = {
      id_2: id_2,
    };
    console.log(JSON.stringify(out, null, 2));
    return this.httpClient.post<any>(this.url + 'match_transactions_reversal', out);
  }
  matchPayableTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    console.log(JSON.stringify(out, null, 2));
    return this.httpClient.post<any>(this.url + 'match_payable_transactions', out);
  }

  matchTransactionsWithComment(
    id_1: string,
    id_2: string,
    reason: string,
    type: string
  ) {
    var out = {
      id_1: id_1,
      id_2: id_2,
      reason: reason,
      type: type,
    };
    console.log(JSON.stringify(out, null, 2));
    return this.httpClient.post<any>(
      this.url + 'match_transactions_with_reason',
      out
    );
  }
//============================================================ match with reason payable transaction start ===================
matchPayableTransactionsWithComment(
  id_1: string,
  id_2: string,
  reason: string,
) {
  var out = {
    id_1: id_1,
    id_2: id_2,
    reason: reason,
  };
  console.log(JSON.stringify(out, null, 2));
  return this.httpClient.post<any>(
    this.url + 'match_payable_transactions_with_reason',
    out
  );
}
//======================================================= end======================================================
  // matchPartialToFullTransactions(arg0: string, arg1: string, arg2: string, arg3: string) {
  //   throw new Error('Method not implemented.');
  // }

  matchPartialToFullTransactions(
    b2b_new_ids_ats: string,
    b2b_old_ids_ats: string,
    b2b_new_ids_core: string,
    b2b_old_ids_core: string
  ): Observable<Boolean> {
    var out = {
      "b2b_new_ids_ats": b2b_new_ids_ats,
      "b2b_old_ids_ats": b2b_old_ids_ats,
      "b2b_new_ids_core": b2b_new_ids_core,
      "b2b_old_ids_core": b2b_old_ids_core,
    };
    console.log(JSON.stringify(out, null, 2));
    return this.httpClient.post<Boolean>(
      this.url + 'match_partial_to_full_transactions',
      out
    );
  }
  unmatchTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_transactions', out);
  }

  unmatchPartialTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(
      this.url + 'unmatch_partial_transactions',
      out
    );
  }

  matchPartialTransactions(formData: FormData) {
    console.log('fromdataaaaaaaaaa' + formData);
    return this.httpClient.post<any>(
      this.url + 'match_partial_transactions',
      formData
    );
    // throw new Error('Method not implemented.');
  }

  //   getRtgsAtsForReconAuto(c_date: string) {
  //   return this.httpClient.get<Array<RtgsAts>>(this.url + 'get_ats_for_recon_auto/' + c_date);
  // }


  matchAllTransactions(
    id_1: string,
    id_2: string,
    core_id: string,
    type: string,
    c_date: string
  ) {
    var out = {
      id_1: id_1,
      id_2: id_2,
      core_id: core_id,
      type: type,
    };
    return this.httpClient.post<any>(
      this.url + 'match_all_transactions/' + c_date,
      out
    );
    // throw new Error('Method not implemented.');
  }
  //======================================== start  automatic payable match  =======================
  matchAllPayableTransactions(
    id_1: string,
    id_2: string,
    core_id: string,
  ) {
    var out = {
      id_1: id_1,
      id_2: id_2,
      core_id: core_id,
    };
    return this.httpClient.post<any>(
      this.url + 'match_all_payable_transactions' ,
      out
    );
    // throw new Error('Method not implemented.');
  }
  //======================================= end  automatic payable match ===========================

  matchAllTransactionsPartialy(
    id_1: string,
    id_2: string,
    core_id: string,
    c_date: string
  ) {
    var out = {
      id_1: id_1,
      id_2: id_2,
      core_id: core_id,
    };
    return this.httpClient.post<any>(
      this.url + 'match_all_transactions_partialy/' + c_date,
      out
    );
    // throw new Error('Method not implemented.');
  }

  // postCommentForPartialMatch(commentPayload: CommentPayload): Observable<Object> {
  //   console.log(commentPayload + 'of service');
  //   return this.httpClient.post(
  //     `${this.url + 'match_partial_transactions'}`,
  //     commentPayload
  //   );
  // }


  getAllAtsMatchWithReason(c_date: string): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(this.url + 'get_all_ats_matched_with_reason/' + c_date);
  }

  getAllCoreMatchWithReason(c_date: string): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(this.url + 'get_all_core_matched_with_reason/' + c_date);
  }
  /////////////// payable start //////////////////////
  getPayableCreditForReconcilation(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_payable_credit' 
    );
  }
  getPayableDebitForReconcilation(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_payable_debit' 
    );
  }
  getAllPayableCreditMatchWithReason(): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(this.url + 'get_payable_credit_matched_with_reason');
  }
  getAllPayableDebitMatchWithReason(): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(this.url + 'get_payable_debit_matched_with_reason');
  }
  /////////////// payable end ///////////////////////
}
