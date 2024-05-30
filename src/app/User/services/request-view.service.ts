import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrencyRequest } from '../payloads/currency-request';
import { AccountPayload } from '../payloads/account-payload';
    
@Injectable({
  providedIn: 'root'
})
export class RequestViewService {
private baseURL = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + "/currency/"
private baseURL2 = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + "/account/"

constructor(private httpClient: HttpClient) {

}
fetchAllAccount(): Observable<AccountPayload[]>{
  console.log("currency service of dt opetion one")
   return this.httpClient.get<AccountPayload[]>(`${this.baseURL2 + 'get_all_accounts'
  }`);
}

fetchAllCurrency(): Observable<CurrencyRequest[]>{
  console.log("currency service")
  return this.httpClient.get<CurrencyRequest[]>(`${this.baseURL+'get_all_currencies'
  }`);
}

fetchApprovedAccount(): Observable<AccountPayload[]>{
  console.log("currency service")
   return this.httpClient.get<AccountPayload[]>(`${this.baseURL2+'get_approved_accounts'
  }`);
}


fetchApprovedCurrency(): Observable<CurrencyRequest[]>{
  console.log("currency service")
   return this.httpClient.get<CurrencyRequest[]>(`${this.baseURL+'get_approved_currencies'
  }`);
}

fetchPendingAccount(): Observable<AccountPayload[]>{
  console.log("currency service")
   return this.httpClient.get<AccountPayload[]>(`${this.baseURL2+'get_pending_accounts'
  }`);
}

fetchPendingCurrency(): Observable<CurrencyRequest[]>{
  console.log("flow is directed herreeee")
   return this.httpClient.get<CurrencyRequest[]>(`${this.baseURL+'get_pending_currencies'
  }`);
}

fetchRejectedAccount(): Observable<AccountPayload[]>{
  console.log("currency service")
   return this.httpClient.get<AccountPayload[]>(`${this.baseURL2+'get_rejected_accounts'
  }`);
}

fetchRejectedCurrency(): Observable<CurrencyRequest[]>{
  console.log("currency service")
   return this.httpClient.get<CurrencyRequest[]>(`${this.baseURL+'get_rejected_currencies'
  }`);
}
 
}
