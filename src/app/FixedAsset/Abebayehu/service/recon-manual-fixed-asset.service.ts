import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RawFixedCore } from '../models/raw-fixed-core';
import { RawFixedMMS } from '../models/raw-fixed-mms';
@Injectable({
  providedIn: 'root'
})
export class ReconManualFixedAssetService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + "/api/fixedAsset/recon/"
  // private url2 = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + "/api/fixedAsset/recon/erca/"

  constructor(
    private httpClient: HttpClient,
  ) { }

  get_raw_fixed_mms_for_recon_computer(transaction_date: string): Observable<Array<RawFixedMMS>> {
    return this.httpClient.get<Array<RawFixedMMS>>(this.url + 'get_raw_fixed_mms_for_recon_computer/' + transaction_date);
  }
  
  get_raw_fixed_mms_for_recon_equipment(transaction_date: string): Observable<Array<RawFixedMMS>> {
    return this.httpClient.get<Array<RawFixedMMS>>(this.url + 'get_raw_fixed_mms_for_recon_equipment/' + transaction_date);
  }

  get_raw_fixed_mms_for_recon_furniture(transaction_date: string): Observable<Array<RawFixedMMS>> {
    return this.httpClient.get<Array<RawFixedMMS>>(this.url + 'get_raw_fixed_mms_for_recon_furniture/' + transaction_date);
  }

  get_raw_fixed_mms_for_recon_vehicle(transaction_date: string): Observable<Array<RawFixedMMS>> {
    return this.httpClient.get<Array<RawFixedMMS>>(this.url + 'get_raw_fixed_mms_for_recon_vehicle/' + transaction_date);
  }

  get_raw_fixed_core_for_recon_computer(): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(this.url + 'get_raw_fixed_core_for_recon_computer');
  }

  get_raw_fixed_core_for_recon_equipment(): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(this.url + 'get_raw_fixed_core_for_recon_equipment');
  }

  get_raw_fixed_core_for_recon_vehicle(): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(this.url + 'get_raw_fixed_core_for_recon_vehicle');
  }

  get_raw_fixed_core_for_recon_furniture(): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(this.url + 'get_raw_fixed_core_for_recon_furniture');
  }

  matchPartialTransactions(id_1: string, id_2: string) {
    var out = {
      'id_1': id_1,
      'id_2': id_2,
    }

    return this.httpClient.post<any>(this.url + 'match_partial_transactions', out);
    // throw new Error('Method not implemented.');
  }
  
  matchTransactions(mms_fixed_id_list: any[], core_fixed_id_list: any[]) {
    var matched_fixed_asset_ids: any[] = []
    matched_fixed_asset_ids.push(mms_fixed_id_list);
    matched_fixed_asset_ids.push(core_fixed_id_list);
    return this.httpClient.post<any>(this.url + 'match_transactions', matched_fixed_asset_ids);
  }

  ReversalCoreFixedTransactions( core_fixed_id_list: any[]) {
    var matched_fixed_asset_ids: any[] = []
    matched_fixed_asset_ids.push(core_fixed_id_list);
    return this.httpClient.post<any>(this.url + 'match_reversal_transactions', matched_fixed_asset_ids);
  }
  matchTransactionsWithComment(
    mms_fixed_id_list: any[],
    core_fixed_id_list: any[],
    reason: string,
    type: string
  ) {


    var matched_fixed_asset_ids: any[] = []
    matched_fixed_asset_ids.push(core_fixed_id_list);
    matched_fixed_asset_ids.push(mms_fixed_id_list);

    var reason_type: any[]=[];
    reason_type.push(reason);
    reason_type.push(type);

    matched_fixed_asset_ids.push(reason_type);

    return this.httpClient.post<any>(
      this.url + 'match_transactions_with_reason',
      matched_fixed_asset_ids
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


  getDeleteFixedCoreTransaction(): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get-deleted-fixed-core' 
    );
  }

  getEditedDetailFixedCoreTransaction(id:number): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get-edited-detail-fixed-core/'+id 
    );
  }

  getDeleteFixedMMSTransaction(): Observable<Array<RawFixedMMS>> {
    return this.httpClient.get<Array<RawFixedMMS>>(
      this.url + 'get-deleted-fixed-mms' 
    );
  }

  getEditedDetailFixedMMSTransaction(id:number): Observable<Array<RawFixedMMS>> {
    return this.httpClient.get<Array<RawFixedMMS>>(
      this.url + 'get-edited-detail-fixed-mms/'+id 
    );
  }
}

