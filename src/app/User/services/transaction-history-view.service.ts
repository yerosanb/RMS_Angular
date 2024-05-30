import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralSearchPayload } from '../payloads/general-search-payload';
import { MatchDeatailPayload } from '../payloads/match-deatail-payload';
import { MatchDeatailPayloadCore } from '../payloads/match-deatail-payload-core';
import { BtbAts } from '../payloads/recon/btb-ats';
import { ErcaAts } from '../payloads/recon/erca-ats';
import { RtgsAts } from '../payloads/recon/rtgs-ats';
import { SpecificSearchPayload } from '../payloads/specific-search-payload';

// var window: Window
@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryViewService {
  
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + "/api/user/recon/rtgs/"
  
  constructor(private httpClient: HttpClient) {}
  
postGeneralSearch(generalPayload: GeneralSearchPayload): Observable<Array<BtbAts>> {
  console.log("here is the general search")
    
    return this.httpClient.post<Array<BtbAts>>(
     `${this.url + 'search-general'}`,
     generalPayload
   );

  }

postSpecificSearch(specificaPayload: SpecificSearchPayload): Observable<Array<BtbAts>> {
  console.log("hereeeeeeeeeeeee specific")
  return this.httpClient.post<Array<BtbAts>>(
   `${this.url + 'search-specific'}`,
   specificaPayload
 
 );
}

// getAllAtsForView(c_date: string): Observable<Array<GeneralSearchPayload>> {
//   return this.httpClient.get<Array<GeneralSearchPayload>>(this.url + 'get_all_ats_for_view/' + c_date);
// }



// fetchMatchedInformation(): Observable<fetchMatchedInformation[]>{
//   console.log("currency service of dt opetion one")
//    return this.httpClient.get<MatchDeatailPayload[]>(`${this.url + 'get_match_detail'
//   }`);
// }

getAtsHistoryorView(): Observable<Array<BtbAts>> {
  
  console.log("currency service of dt opetion one")
  return this.httpClient.get<BtbAts[]>(`${this.url + 'search-general'
 }`);
}

fetchMatchedInformation(id:String,value_date:string): Observable<MatchDeatailPayload>{
  var out = {
    id: id,
    value_date: value_date,
  };
  console.log("see hereeee find by id")
  return this.httpClient.post<MatchDeatailPayload>(this.url+'matched-detail-ats',out);
}

fetchMatchedInformationCore(id:number,datas:FormData): Observable<MatchDeatailPayloadCore>{
  console.log("see hereeee find by id")

  return this.httpClient.post<MatchDeatailPayloadCore>(`${this.url+'matched-detail-core'}/${id}`,datas);
}
fetchMatchedInformationFixed_asset_core(id:number): Observable<any>{
  console.log("see hereeee find by id")

  return this.httpClient.get<MatchDeatailPayloadCore>(`${this.url+'match_detail_fixed_core'}/${id}`);

}
fetchMatchedInformationFixed_asset_mms(id:number): Observable<any>{
  console.log("see hereeee find by id")

  return this.httpClient.get<MatchDeatailPayloadCore>(`${this.url+'match_detail_fixed_mms'}/${id}`);
}

fetchMatchedInformationStock_core(id:number): Observable<any>{
  console.log("see hereeee find by id")

  return this.httpClient.get<MatchDeatailPayloadCore>(`${this.url+'match_detail_stock_core'}/${id}`);

}

fetchMatchedInformationStock_mms(id:number): Observable<any>{
  console.log("see hereeee find by id")

  return this.httpClient.get<MatchDeatailPayloadCore>(`${this.url+'match_detail_stock_mms'}/${id}`);
}
}
