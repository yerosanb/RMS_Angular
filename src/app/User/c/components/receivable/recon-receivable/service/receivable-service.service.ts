import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditTransactionPayload } from 'src/app/User/payloads/edit-transaction-payload/edit-transaction-payload';
import { RtgsCore } from 'src/app/User/payloads/recon/rtgs-core';

@Injectable({
  providedIn: 'root'
})
export class ReceivableServiceService {
  private url =
  ((window as { [key: string]: any })['cfgApiBaseUrl'] as string) +
  '/api/receivable/';
  constructor(private httpClient: HttpClient) { }


  getCredit() : Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_receivable_credit_for_recon'
    );
  }

  
  getDebit() : Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_receivable_debit_for_recon'
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

  // matchPartialTransactions(formData: FormData) {
  //   console.log('fromdataaaaaaaaaa' + formData);
  //   return this.httpClient.post<any>(
  //     this.url + 'match_partial_transactions',
  //     formData
  //   );
  //   // throw new Error('Method not implemented.');
  // }

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

  getReceivableCreditForReconAuto(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_receivable_credit_for_recon_auto' 
    );
  }
  getReceivableDebitForReconAuto(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get_receivable_debit_for_recon_auto' 
    );
  }

  matchAllReceivableTransactions(
    id_1: string,
    id_2: string,
    core_id: string,
    amount_1:string,
    amount_2:string
  ) {
    var out = {
      id_1: id_1,
      id_2: id_2,
      core_id: core_id,
      amount_1:amount_1,
      amount_2:amount_2
    };
    return this.httpClient.post<any>(
      this.url + 'match_all_receivable_transactions' ,
      out
    );
    // throw new Error('Method not implemented.');
  }

  getReceivableCreditMatched(match_date:string): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_receivable_credit_matched/'+match_date);
  }
  getPayableDebitMatched(match_date:string): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_receivable_debit_matched/'+match_date);
  }

  unmatchReceivableTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_receivable_transactions', out);
  }

  getAllReceivableCreditMatchWithReason(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_receivable_credit_matched_with_reason');
  }
  getAllReceivableDebitMatchWithReason(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_receivable_debit_matched_with_reason');
  }
  
}
