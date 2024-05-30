import { Injectable } from '@angular/core';
import { RawFixedMMS } from '../payload/fixed-mms-data-payload';
import { HttpClient } from '@angular/common/http';
import { RawFixedCore } from '../payload/fixed-core-data-payload';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FixedReconAutomaticService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/Fixed/recon/';
  
  constructor(private httpClient: HttpClient) { }

  //Fetch fixed mms raw data for auto reconn
  getFixedMMSForReconAutoComputer(c_date: string) {
    return this.httpClient.get<Array<RawFixedMMS>>(
      this.url + 'get_mms_for_recon_auto_computer/' + c_date
    );
  }
  getFixedMMSForReconAutoFurniture(c_date: string) {
    return this.httpClient.get<Array<RawFixedMMS>>(
      this.url + 'get_mms_for_recon_auto_furniture/' + c_date
    );
  }
  getFixedMMSForReconAutoEquipment(c_date: string) {
    return this.httpClient.get<Array<RawFixedMMS>>(
      this.url + 'get_mms_for_recon_auto_equipment/' + c_date
    );
  }
  getFixedMMSForReconAutoVehicle(c_date: string) {
    return this.httpClient.get<Array<RawFixedMMS>>(
      this.url + 'get_mms_for_recon_auto_vehicle/' + c_date
    );
  }
  
  //get fixed core raw data for auto recon
  getFixedCoreForReconAutoComputer(c_date: string): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get_core_for_recon_auto_computer/' + c_date
    );
  }
  ///////finally delelete this part
  getFixedCoreForReconAuto(c_date: string): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get_core_for_recon_auto_computer/' + c_date
    );
  }
  getFixedCoreForReconAutoEquipment(c_date: string): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get_core_for_recon_auto_equipment/' + c_date
    );
  }
  getFixedCoreForReconAutoVehicle(c_date: string): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get_core_for_recon_auto_vehicle/' + c_date
    );
  }
  
  getFixedCoreForReconAutoFurniture(c_date: string): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get_core_for_recon_auto_furniture/' + c_date
    );
  }
  ///////////////////

  matchTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    console.log(JSON.stringify(out, null, 2));
    return this.httpClient.post<any>(this.url + 'match_single_transaction', out);
  }

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
}
//get mms fixed for view
getFixedMMSForView(c_date: string): Observable<RawFixedMMS[]> {
  return this.httpClient.get<RawFixedMMS[]>(this.url + 'get_fixed_mms_for_view/' + c_date);
}


//get core fixed for view 
getFixedCoreForView(c_date: string):Observable<RawFixedCore[]>{
  return this.httpClient.get<RawFixedCore[]>(this.url + 'get_fixed_core_for_view/' + c_date); 
}
getFixedMMSForViewComputer(c_date: string): Observable<RawFixedMMS[]> {
  return this.httpClient.get<RawFixedMMS[]>(this.url + 'get_computer_mms_matched_for_view/' + c_date);
}


//get core fixed for view 
getFixedCoreForViewComputer(c_date: string):Observable<RawFixedCore[]>{
  return this.httpClient.get<RawFixedCore[]>(this.url + 'get_computer_core_matched_for_view/' + c_date); 
}
getFixedMMSForViewFurniture(c_date: string): Observable<RawFixedMMS[]> {
  return this.httpClient.get<RawFixedMMS[]>(this.url + 'get_furniture_mms_matched_for_view/' + c_date);
}


//get core fixed for view 
getFixedCoreForViewFurniture(c_date: string):Observable<RawFixedCore[]>{
  return this.httpClient.get<RawFixedCore[]>(this.url + 'get_furniture_core_matched_for_view/' + c_date); 
}

getFixedMMSForViewEquipment(c_date: string): Observable<RawFixedMMS[]> {
  return this.httpClient.get<RawFixedMMS[]>(this.url + 'get_equipment_mms_matched_for_view/' + c_date);
}


//get core fixed for view 
getFixedCoreForViewEquipment(c_date: string):Observable<RawFixedCore[]>{
  return this.httpClient.get<RawFixedCore[]>(this.url + 'get_equipment_core_matched_for_view/' + c_date); 
}
getFixedMMSForViewVehicle(c_date: string): Observable<RawFixedMMS[]> {
  return this.httpClient.get<RawFixedMMS[]>(this.url + 'get_vehicle_mms_matched_for_view/' + c_date);
}


//get core fixed for view 
getFixedCoreForViewVehicle(c_date: string):Observable<RawFixedCore[]>{
  return this.httpClient.get<RawFixedCore[]>(this.url + 'get_vehicle_core_matched_for_view/' + c_date); 
}

unmatchTransactions(id_1: string, id_2: string) {
  var out = {
    id_1: id_1,
    id_2: id_2,
  };
  return this.httpClient.post<any>(this.url + 'unmatch_transactions', out);
}
getUnmatchedFixedMMSForView(c_date: string): Observable<RawFixedMMS[]> {
  return this.httpClient.get<RawFixedMMS[]>(this.url + 'get_unmatched_fixed_mms_for_view/' + c_date);
}

//get core fixed for view 
getUnmatchedFixedCoreForView(c_date: string):Observable<RawFixedCore[]>{
  return this.httpClient.get<RawFixedCore[]>(this.url + 'get_unmatched_fixed_core_for_view/' + c_date); 
}

}
