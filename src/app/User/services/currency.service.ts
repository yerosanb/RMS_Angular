import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyRequest } from '../payloads/currency-request';
    
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
private baseURL=(window as { [key: string]: any })["cfgApiBaseUrl"] as string + "/currency/"

constructor(private httpClient: HttpClient) {
}
getCurrencyList(): Observable<CurrencyRequest[]>{
  console.log("currency service")
   return this.httpClient.get<CurrencyRequest[]>(`${this.baseURL+'get_currency'
  }`);
}
postCurrencyRequest(currencyPayload:CurrencyRequest):Observable<Object>{
  console.log(currencyPayload+ "of service")
  return this.httpClient.post(`${this.baseURL+'send-request'}`, currencyPayload);
}
deleteCurrency(id:number): Observable<Boolean>{
  return this.httpClient.delete<Boolean>(`${this.baseURL + 'deleteCurrency'}/${id}`);
  // return this.httpClient.delete(`${this.baseURL + 'deleteCurrency'}/${id}`);
} 
deleteCurrencyRequest(id:number): Observable<Boolean>{
  return this.httpClient.delete<Boolean>(`${this.baseURL + 'deleteCurrencyRequest'}/${id}`);
  // return this.httpClient.delete(`${this.baseURL + 'deleteCurrency'}/${id}`);
} 
getCurrencyById(id:number): Observable<CurrencyRequest>{
  console.log("see hereeee find by id")
  return this.httpClient.get<CurrencyRequest>(`${this.baseURL+'findById'}/${id}`);
}

updateCurrency(id:number, employee: CurrencyRequest): Observable<Object>{
  return this.httpClient.put(`${this.baseURL+'updateCurrency'}/${id}`, employee);
}
updateApprovedCurrency(currencyRequest: CurrencyRequest, id:number): Observable<Object>{
  return this.httpClient.put(`${this.baseURL+'update-approved-request'}/${id}`, currencyRequest);
}
// PostApprovedUpdate(currencyRequest: CurrencyRequest, id:number): Observable<Object> {
//   console.log(currencyRequest + 'of service');
//   return this.httpClient.post(
//     `${this.baseURL + 'update-approved-request'}`,
//     currencyRequest
//   );
// }
getCurrencyRequestById(id: number): Observable<CurrencyRequest> {
  console.log('gertbyidiiiiiii');
  return this.httpClient.get<CurrencyRequest>(
    `${this.baseURL + 'findById_currency'}/${id}`
  );
}
 
}
