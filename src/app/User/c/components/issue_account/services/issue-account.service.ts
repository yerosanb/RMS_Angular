import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditTransactionPayload } from 'src/app/User/payloads/edit-transaction-payload/edit-transaction-payload';
import { RtgsAts } from 'src/app/User/payloads/recon/rtgs-ats';
import { RtgsCore } from 'src/app/User/payloads/recon/rtgs-core';

@Injectable({
  providedIn: 'root',
})
export class IssueAccountService {
  private url =
    ((window as { [key: string]: any })['cfgApiBaseUrl'] as string) +
    '/api/issueaccount/';

  constructor(private httpClient: HttpClient) {}

  getCoreIssueForeRecon(): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_core_issue_for_recon'
    );
  }

  // getCoreIssueForeViewMatched(m_date:String): Observable<Array<RtgsAts>> {
  //   return this.httpClient.get<Array<RtgsAts>>(
  //     this.url + 'get_core_issue_for_view_matched/'+m_date
  //   );
  // }

getCoreIssueForeViewMatched(minDate:String,maxDate:String): Observable<Array<RtgsAts>> {
  var dates = {
    minDate: minDate,
    maxDate: maxDate,
    };
    return this.httpClient.post<Array<RtgsAts>>(`${this.url + 'get_core_issue_for_view_matched'}`,dates);
}

  getCoreIssueForeViewreversal(minDate:String,maxDate:String): Observable<Array<RtgsAts>> {
    var dates = {
      minDate: minDate,
      maxDate: maxDate,
      };
    return this.httpClient.post<Array<RtgsAts>>(
      
      `${this.url + 'get_core_issue_for_view_matched_reversal'}`,dates
    );
  }
  getQbsIssueForeViewreversal(minDate:String,maxDate:String): Observable<Array<RtgsAts>> {
    var dates = {
      minDate: minDate,
      maxDate: maxDate,
      };
    return this.httpClient.post<Array<RtgsAts>>(
      `${this.url + 'get_QBS_issue_for_view_matched_reversal'}`,dates
    );
  }
  getCoreIssueForeViewUnMatched(): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_core_issue_for_view_unmatched'
    );
  }

  getQbsIssueForeRecon(): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_qbs_issue_for_recon'
    );
  }
  // getQbsIssueForeViewMatched(m_date:String): Observable<Array<RtgsAts>> {

  //   //var aa = this.url + 'get_qbs_issue_for_view_matched';
  //   return this.httpClient.get<Array<RtgsAts>>(
  //     this.url + 'get_qbs_issue_for_view_matched/'+m_date
  //   );
  // }
  
  getQbsIssueForeViewMatched(minDate:String,maxDate:String): Observable<Array<RtgsAts>> {

    var dates = {
      minDate: minDate,
      maxDate: maxDate,
      };
    return this.httpClient.post<Array<RtgsAts>>(
      `${this.url + 'get_qbs_issue_for_view_matched'}`,dates
    );
  }




  getCoreIssueForeRecon_auto(): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_core_issue_for_recon_auto'
    );
  }


  getQbsIssueForeRecon_auto(): Observable<Array<RtgsAts>> {
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_qbs_issue_for_recon_auto'
    );
  }
getQbsIssueForeViewUnMatched(): Observable<Array<RtgsAts>> {
    //var aa = this.url + 'get_qbs_issue_for_view_matched';
    return this.httpClient.get<Array<RtgsAts>>(
      this.url + 'get_qbs_issue_for_view_unmatched'
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
  matchRevTransactionsIssueCore(id_1: string) {
    var out = {
      id_1: id_1,
    };
    console.log(JSON.stringify(out, null, 2));
    return this.httpClient.post<any>(this.url + 'match_Issue_core_reversal_transactions', out);
  }
  matchRevTransactionsIssue_qbs(id_1: string) {
    var out = {
      id_1: id_1,
    };
    console.log(JSON.stringify(out, null, 2));
    return this.httpClient.post<any>(this.url + 'match_Issue_qbs_reversal_transactions', out);
  }

  matchTransactionsComment(id_1: string, id_2: string, reason: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
      reason: reason,
    };
    console.log(JSON.stringify(out, null, 2));
    return this.httpClient.post<any>(this.url + 'match_transactions_with_reason', out);
  }

  unmatchIssueTransactions(id_1: string, id_2: string) {
    var out = {
      id_1: id_1,
      id_2: id_2,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_issue_transactions', out);
  } 
  
  unmatchIssueCoreReversalTransactions(id_1: string) {
    var out = {
      id_1: id_1,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_issue_core_reversal_transactions', out);
  } 
  unmatchIssueQBSReversalTransactions(id_1: string) {
    var out = {
      id_1: id_1,
    };
    return this.httpClient.post<any>(this.url + 'unmatch_issue_qbs_reversal_transactions', out);
  }
  matchAllTransactions(
    id_1: string,
    id_2: string,
    data_1_branch:String,
    data_2_branch:String,
    data_1_amount:String,
    data_2_amount:String,
   // qbs_id: string,
    //type: string,
   // c_date: string
  ) {
    var out = {
      id_1: id_1,
      id_2: id_2,
      data_1_branch:data_1_branch,
      data_2_branch:data_2_branch,
      data_1_amount:data_1_amount,
      data_2_amount:data_2_amount,
      //qbs_id: qbs_id,
     // type: type,
    };
    return this.httpClient.post<any>(
      this.url + 'match_all_transactions', out
    );
    // throw new Error('Method not implemented.');
  }
  
  getAllIssueCoreMatchWithReason(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_issue_core_matched_with_reason');
  }
  getAllIssueQBSMatchWithReason(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(this.url + 'get_issue_qbs_matched_with_reason');
  }
  getEditeIssueCoreTransaction(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get-edited-issue-core' 
    );
  }
  getEditeIssueQBSTransaction(): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get-edited-issue-qbs' 
    );
  }
  getEditedDetailIssueCoreTransaction(id:number): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get-edited-detail-issue-core/'+id 
    );
  }
  getEditedDetailIssueQBSTransaction(id:number): Observable<Array<RtgsCore>> {
    return this.httpClient.get<Array<RtgsCore>>(
      this.url + 'get-edited-detail-issue-qbs/'+id 
    );
  }
  updateTransaction(editPayload: EditTransactionPayload): Observable<boolean> {
    return this.httpClient.post<boolean>(
      this.url + 'update_transaction_issue',
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

}
