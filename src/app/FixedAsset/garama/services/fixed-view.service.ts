import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RawFixedCore } from '../payload/fixed-core-data-payload';
import { RawFixedMMS } from '../payload/fixed-mms-data-payload';
import { FixedMmsWaiting } from '../payload/fixed-mms-waiting';
import { FixedMmsdisposed } from '../payload/fixed-mmsdisposed';
import { FixedMmsRemoved } from '../payload/fixed-mms-removed';

@Injectable({
  providedIn: 'root',
})
export class FixedViewService {
  private url =
    ((window as { [key: string]: any })['cfgApiBaseUrl'] as string) +
    '/api/Fixed/recon/';

  constructor(private httpClient: HttpClient) {}

  getWaitingMms(bsInlineRangeValue: Date[]) {
    console.log('here is the date range.' + bsInlineRangeValue.toLocaleString());
    return this.httpClient.get<Array<RawFixedMMS>>(this.url + 'get_mms_waiting');
  }
  getComputerMMsUnmatchedForView(
    c_date: string
  ): Observable<Array<RawFixedMMS>> {
    return this.httpClient.get<Array<RawFixedMMS>>(
      this.url + 'get_computer_mms_unmatched_for_view/' + c_date
    );
  }
  getComputerCoreUnmatchedForView(
    c_date: string
  ): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get_computer_core_unmatched_for_view/' + c_date
    );
  }
  getFurnitureMMsUnmatchedForView(
    c_date: string
  ): Observable<Array<RawFixedMMS>> {
    return this.httpClient.get<Array<RawFixedMMS>>(
      this.url + 'get_furniture_mms_unmatched_for_view/' + c_date
    );
  }
  getFurnitureCoreUnmatchedForView(
    c_date: string
  ): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get_furniture_core_unmatched_for_view/' + c_date
    );
  }
  getEquipmentMMsUnmatchedForView(
    c_date: string
  ): Observable<Array<RawFixedMMS>> {
    return this.httpClient.get<Array<RawFixedMMS>>(
      this.url + 'get_equipment_mms_unmatched_for_view/' + c_date
    );
  }
  getEquipmentCoreUnmatchedForView(
    c_date: string
  ): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get_equipment_core_unmatched_for_view/' + c_date
    );
  }
  getVehicleMMsUnmatchedForView(
    c_date: string
  ): Observable<Array<RawFixedMMS>> {
    return this.httpClient.get<Array<RawFixedMMS>>(
      this.url + 'get_vehicle_mms_unmatched_for_view/' + c_date
    );
  }
  getVehicleCoreUnmatchedForView(
    c_date: string
  ): Observable<Array<RawFixedCore>> {
    return this.httpClient.get<Array<RawFixedCore>>(
      this.url + 'get_vehicle_core_unmatched_for_view/' + c_date
    );
  }
  getMMMSWaiting
    (minDate:String,maxDate:String): Observable<Array<FixedMmsWaiting>> {
  var dates = {
    minDate: minDate,
    maxDate: maxDate,
  };
  return this.httpClient.post<Array<FixedMmsWaiting>>(
   `${this.url + 'view_mms_waiting'}`,dates
 );

}
getMMMSDisposed
(minDate:String,maxDate:String): Observable<Array<FixedMmsdisposed>> {
var dates = {
minDate: minDate,
maxDate: maxDate,
};
return this.httpClient.post<Array<FixedMmsdisposed>>(
`${this.url + 'view_mms_disposed'}`,dates
);

}
getMMMSRemoved
(minDate:String,maxDate:String): Observable<Array<FixedMmsRemoved>> {
var dates = {
minDate: minDate,
maxDate: maxDate,
};
return this.httpClient.post<Array<FixedMmsRemoved>>(
`${this.url + 'view_mms_removed'}`,dates
);

}

getCoreReversalForView(c_date: string): Observable<Array<RawFixedCore>> {
  return this.httpClient.get<Array<RawFixedCore>>(this.url + 'get_core_reversal_for_view/' + c_date);
}

unmatchCoreReversalTransactions( id_2: string) {
  var out = {
    id_2: id_2,
  };
  return this.httpClient.post<any>(this.url + 'unmatch_core_reversaltransactions', out);
}
}
