import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RawFixedCore } from 'src/app/FixedAsset/garama/payload/fixed-core-data-payload';
import { RawFixedMMS } from 'src/app/FixedAsset/garama/payload/fixed-mms-data-payload';
import { RawStockMMS } from '../Payloads/raw-stock-mms';
import { RawStockCore } from '../Payloads/raw-stock-core';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/Stock/recon/';

  constructor(private httpClient: HttpClient) { }


  StockCategory(type: String): String {
    return type;
  }

  //Fetch fixed mms raw data for auto reconn
  getStockMMSForReconAuto(c_date: string, type: String) {
    var out = {
      c_date: c_date,
      type: type,
    };
    return this.httpClient.post<Array<RawStockMMS>>(
      this.url + 'get_mms_for_recon_auto/', out
    );
  }
  getFixedCoreForReconAutoAccessory(c_date: string, type: string): Observable<Array<RawStockCore>> {
    var out = {
      c_date: c_date,
      type: type,
    };
    return this.httpClient.post<Array<RawStockCore>>(
      this.url + 'get_core_for_recon_auto/', out
    );
  }
  matchAllTransactions(
    id_1: string,
    id_2: string,
    core_id: string,
    type: string,
    c_date: string,
    amount_1:string,
    amount_2:string,
    dr_cr_1:string,
    dr_cr_2:string,
    reference_1:string,
    reference_2:string,
    account_1:string,
    account_2:string
  ) {
    var out = {
      id_1: id_1,
      id_2: id_2,
      core_id: core_id,
      type: type,
      amount_1:amount_1,
      amount_2:amount_2,
      dr_cr_1:dr_cr_1,
      dr_cr_2:dr_cr_2,
      reference_1:reference_1,
      reference_2:reference_2,
      account_1:account_1,
      account_2:account_2,
    };
    return this.httpClient.post<any>(
      this.url + 'match_all_transactions/' + c_date,
      out
    );
  }
  matchTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    console.log(JSON.stringify(out, null, 2));
    return this.httpClient.post<any>(this.url + 'match_single_transaction', out);
  }


  getStockMMSForView(c_date: string, type: string): Observable<RawFixedMMS[]> {
    var out = {
      c_date: c_date,
      type: type,
    };
    return this.httpClient.post<RawFixedMMS[]>(this.url + 'get_stock_mms_matched_for_view/', out);
  }
  getStockMMSMatchedWithReason(c_date: string, type: string): Observable<RawFixedMMS[]> {
    var out = {
      c_date: c_date,
      type: type,
    };
    return this.httpClient.post<RawFixedMMS[]>(this.url + 'get_stock_mms_matched_with_reason/', out);
  }

  //get core fixed for view 
  getStockCoreReversal(c_date: string): Observable<RawFixedCore[]> {

    return this.httpClient.get<RawFixedCore[]>(this.url + 'get_stock_core_reversal/' + c_date);
  }
  getStockCoreForView(c_date: string, type: string): Observable<RawFixedCore[]> {
    var out = {
      c_date: c_date,
      type: type+'00',
    };
    return this.httpClient.post<RawFixedCore[]>(this.url + 'get_stock_core_matched_for_view/', out);
  }
  getStockCoreMtchedwithReason(c_date: string, type: string): Observable<RawFixedCore[]> {
    var out = {
      c_date: c_date,
      type: type+'00',
    };
    return this.httpClient.post<RawFixedCore[]>(this.url + 'get_stock_core_matched_with_reason/', out);
  }

  getStockMMSForViewUnmatch(c_date: string, type: string): Observable<RawFixedMMS[]> {
    var out = {
      c_date: c_date,
      type: type,
    };
    return this.httpClient.post<RawFixedMMS[]>(this.url + 'get_stock_mms_unmatched_for_view/', out);
  }

  //get core fixed for view 
  getStockCoreForViewUnmatch(c_date: string, type: string): Observable<RawFixedCore[]> {
    var out = {
      c_date: c_date,
      type: type+'00',
    };
    return this.httpClient.post<RawFixedCore[]>(this.url + 'get_stock_core_unmatched_for_view/', out);
  }
  unmatchTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_transactions', out);
  }
  unmatchReversalTransactions(id_2: string) {
    var out = {
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_reversal_transactions', out);
  }
  // added by Demeke
  get_raw_stock_mms_for_recon(c_date: string, type: string): Observable<RawFixedMMS[]> {
    var out = {
      c_date: c_date,
      type: type,
    };
    return this.httpClient.post<RawFixedMMS[]>(this.url + 'get_stock_mms_for_recon_manual/', out);
  }
  get_raw_stock_core_for_recon(c_date: string, type: string): Observable<RawFixedCore[]> {
    var out = {
      c_date: c_date,
      type: type+'00',
    };
    return this.httpClient.post<RawFixedCore[]>(this.url + 'get_stock_core_for_recon_manual/', out);
  }

  matchTransaction(mms_id_list: any[], core_id_list: any[]) {
    var matched_ids: any[] = []
    matched_ids.push(mms_id_list);
    matched_ids.push(core_id_list);
    return this.httpClient.post<any>(this.url + 'match_transactions', matched_ids);
  }

  matchTransactionsWithComment(
    mms_id_list: any[],
    core_id_list: any[],
    reason: string,
    type: string
  ) {
    var matched_ids: any[] = []
    matched_ids.push(core_id_list);
    matched_ids.push(mms_id_list);
    var reason_type: any[] = [];
    reason_type.push(reason);
    reason_type.push(type);

    matched_ids.push(reason_type);

    return this.httpClient.post<any>(
      this.url + 'match_transactions_with_reason',
      matched_ids
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
  ReversalCoreStockTransactions( core_stock_id_list: any[]) {
    var matched_stock_ids: any[] = []
    matched_stock_ids.push(core_stock_id_list);
    return this.httpClient.post<any>(this.url + 'match_reversal_transactions', matched_stock_ids);
  }  
  getDeleteStockCoreTransaction(): Observable<Array<RawStockCore>> {
    return this.httpClient.get<Array<RawStockCore>>(
      this.url + 'get-deleted-stock-core' 
    );
  }
  getEditedDetailStockCoreTransaction(id:number): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get-edited-detail-stock-core/'+id 
    );
  }
  
  getDeleteStockMMSTransaction(): Observable<Array<RawStockMMS>> {
    return this.httpClient.get<Array<RawStockMMS>>(
      this.url + 'get-deleted-stock-mms' 
    );
  }
  getEditedDetailStockMMSTransaction(id:number): Observable<Array<RawStockMMS>> {
    return this.httpClient.get<Array<RawStockMMS>>(
      this.url + 'get-edited-detail-stock-mms/'+id 
    );
  }
// added by Demeke

}
