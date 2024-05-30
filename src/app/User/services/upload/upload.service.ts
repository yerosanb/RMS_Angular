import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilePayload } from '../../payloads/file-payload';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/user/files/';
  public downloadUrl: string = '';
  constructor(private httpClient: HttpClient) {}

  // downloadReport(arg0: string, arg1: string) {
  //   return this.httpClient.post<string[]>(`${this.url}upload`, formData, {
  //     reportProgress: true,
  //     observe: 'events',
  //   })
  // }
 
  getfiletype(): Observable<FilePayload> {
    return this.httpClient.get<FilePayload>(`${this.url + 'email'}`
    );
  }
  uploadAndExtractFile(formData: FormData): Observable<HttpEvent<string[]>> {
    return this.httpClient.post<string[]>(`${this.url}upload`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getUploadedFiles(): Observable<FilePayload[]> {
    return this.httpClient.get<FilePayload[]>(
      `${this.url + 'get_uploaded_files'}`
    );
  }

  getUploadedFilebyId(id: any): Observable<FilePayload> {
    return this.httpClient.get<FilePayload>(
      `${this.url + 'get_uploaded_file_by_id/'}${id}`
    );
  }

  downloadFiles(id: any): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  downloadFiles_second(id: any, type : any): Observable<HttpEvent<Blob>> {
    this.downloadUrl = `${this.url}download_second/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${id}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  } 
  downloadReportFiles(date: any, type: string,con:any,ifb:any): Observable<HttpEvent<Blob>> {
    console.log("this is the download file serviceeeeeeeeeeeeeeeeeeeeeee")
    var out: string = date + '-_-' + type + '-_-' + con + '-_-' + ifb;   
    this.downloadUrl = `${this.url}downloadReportFiles/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${out}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  downloadReport(date: string, type: string): Observable<HttpEvent<Blob>> {
    var out: string = date + '-_-' + type;
    this.downloadUrl = `${this.url}report/downlod/`;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    return this.httpClient.get(`${this.downloadUrl}${date}`, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  deleteFile(id: any): Observable<Boolean[]> {
    return this.httpClient.post<Boolean[]>(`${this.url}deletefile`, id);
  }
  rolebackFile(formatDate: FormData): Observable<Boolean> {
    return this.httpClient.post<Boolean>(`${this.url}rolebackfile`, formatDate);
  }

  updateFile(id: any, filePayload: FilePayload): Observable<Boolean> {
    return this.httpClient.post<Boolean>(
      `${this.url + 'updatefile/'}${id}`,
      filePayload
    );
  }

  checkTokenDoesNotExpired(id: any): Observable<Boolean> {
    return this.httpClient.post<Boolean>(`${this.url}true`, '');
  }
}
