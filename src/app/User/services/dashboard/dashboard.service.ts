import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/dashboard/';
  private appUrl = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/approver/dashboard/';
  private url2 = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/Admin/dashboard/';
 
  //private url = 'http://localhost:5056/api/dashboard/';
  //private appUrl = 'http://localhost:5056/api/approver/dashboard/';
  //private url2='http://localhost:5056/api/Admindashboard/';


  constructor(private httpClient: HttpClient) {}

  getDashboardData(): Observable<any> {
    return this.httpClient.get<Observable<any>>(this.url + 'getData');
  }

  getApproverDashboardData(): Observable<any> {
    return this.httpClient.get<Observable<any>>(this.url + 'getApproverData');
  }

  getAdminDashboardData(): Observable<any> {
    return this.httpClient.get<Observable<any>>(this.url + 'getAdminData');
  }
}
