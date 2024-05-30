import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { CheckEmailExistPayload } from '../payloads/admin_check_email_exist_payload';
import { FunctionalityPayload } from '../payloads/functionality_payload';
import { RegisterActorPayload } from '../payloads/register_actor_payload';
import { Roles } from '../payloads/roles_payload';
import { LogPayload } from '../payloads/logs_payload';
import { UserActivityPayload } from '../payloads/user_activity_payload';
import { UserPayload } from '../payloads/user_payload';
import { ChangePasswordPayload } from '../payloads/change_password_payload';
import { CurrencyRequest } from 'src/app/User/payloads/currency-request';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private url = (window as { [key: string]: any })["cfgApiBaseUrl"] as string + '/api/admin/';
  roles!: Roles;
  constructor(private httpClient: HttpClient) {}

  register(registerActorPayload: RegisterActorPayload): Observable<Boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }).set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this.httpClient
      .post<Boolean>(
        this.url + 'register_user',
        registerActorPayload,
        requestOptions
      )
      .pipe(
        map((data) => {
          console.log('response: ' + JSON.stringify(data, null, 2));
          return data;
        })
      );
  }

  updateFunctionalityStatus(
    role_id: any,
    functionalities_status: any
  ): Observable<Boolean> {
    return this.httpClient.put<Boolean>(
      this.url + 'update_functionality_status/' + role_id,
      JSON.stringify(functionalities_status)
    );
  }

  updateFunctionalityStatusNoRole(
    functionalities_status: any
  ): Observable<Boolean> {
    return this.httpClient.put<Boolean>(
      this.url + 'update_functionality_status_no_role',
      JSON.stringify(functionalities_status)
    );
  }

  getFunctionalities(role_id: any): Observable<Array<FunctionalityPayload>> {
    return this.httpClient.get<Array<FunctionalityPayload>>(
      this.url + 'get_functionality/' + role_id
    );
  }

  getFunctionalitiesNoRole(): Observable<Array<FunctionalityPayload>> {
    return this.httpClient.get<Array<FunctionalityPayload>>(
      this.url + 'get_functionality_no_role'
    );
  }

  deleteUser(user_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'delete_user/' + user_id);
  }
  rejectPendingUser(user_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'reject_pending_user/' + user_id);
  }

  approve_pending_user(user_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'approve_pending_user/' + user_id);
  }
  resetPasswordByAdmin(user_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'reset_password_by_admin/' + user_id
    );
  }

  getUserName(): Observable<string> {
    return this.httpClient.get<string>(this.url + 'get_user_name');
  }

  getUser(user_id: any): Observable<RegisterActorPayload> {
    return this.httpClient.get<RegisterActorPayload>(
      this.url + 'get_user/' + user_id
    );
  }
  getPendingUserById(user_id: any): Observable<RegisterActorPayload> {
    return this.httpClient.get<RegisterActorPayload>(
      this.url + 'get_pending_user/' + user_id
    );
  }
  resetPassword(
    changePasswordPayload: ChangePasswordPayload
  ): Observable<Boolean> {
    return this.httpClient.post<Boolean>(
      this.url + 'reset_password',
      changePasswordPayload
    );
  }
  changePassword(
    changePasswordPayload: ChangePasswordPayload
  ): Observable<Boolean> {
    return this.httpClient.post<Boolean>(
      this.url + 'change_password',
      changePasswordPayload
    );
  }


  getAllRoles(): Observable<Array<Roles>> {
    return this.httpClient.get<Array<Roles>>(
      this.url + 'get_all_roles'
      // 'http://localhost:5056/api/admin/' + 'get_all_roles'
    );
  }

  getAllUsers(): Observable<Array<UserPayload>> {
    return this.httpClient.get<Array<UserPayload>>(this.url + 'get_all_users');
  }
  getpendingUser(): Observable<Array<UserPayload>> {
    return this.httpClient.get<Array<UserPayload>>(this.url + 'get_pending_users');
  }

  getApprovedRejectedUser(): Observable<Array<UserPayload>> {
    return this.httpClient.get<Array<UserPayload>>(this.url + 'get_approved_rejected_users');
  }
  getAllLogs(c_date: string) {
    return this.httpClient.get<Array<LogPayload>>(this.url + 'get_all_logs/'+ c_date);
  }
  getAllLogss(paginable:any) {
    return this.httpClient.get<Array<LogPayload>>(this.url + 'get_all_logs/');
  }
  getAllUserActivities(c_date: string) {
    return this.httpClient.get<Array<UserActivityPayload>>(
      this.url + 'get_all_user_activities/'+ c_date
    );
  }

  checkEmailExist(
    checkEmailExistPayload: CheckEmailExistPayload
  ): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'check_email/' + checkEmailExistPayload.email
    );
  }

  deactivateUser(user_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'deactivate_user/' + user_id
    );
  }

  deactivateRole(selected_role_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'deactivate_role/' + selected_role_id
    );
  }

  activateUser(user_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(this.url + 'activate_user/' + user_id);
  }

  activateRole(selected_role_id: any): Observable<Boolean> {
    return this.httpClient.get<Boolean>(
      this.url + 'activate_role/' + selected_role_id
    );
  }
  postRoleRequest(rolePayload:CurrencyRequest):Observable<Object>{
    console.log(rolePayload+ "of service")
    return this.httpClient.post(`${ this.url+'send-request'}`, rolePayload);
  }
}

// <!DOCTYPE HTML PUBLIC '-//W3C//DTD XHTML 1.0 Transitional //EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'><head><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta name='x-apple-disable-message-reformatting'><!--[if !mso]><!--><meta http-equiv='X-UA-Compatible' content='IE=edge'><!--<![endif]--><title></title><style type='text/css'>@media only screen and (min-width: 620px) {.u-row {width: 600px !important;}.u-row .u-col {vertical-align: top;}.u-row .u-col-100 {width: 600px !important;}}@media (max-width: 620px) {.u-row-container {max-width: 100% !important;padding-left: 0px !important;padding-right: 0px !important;}.u-row .u-col {min-width: 320px !important;max-width: 100% !important;display: block !important;}.u-row {width: 100% !important;}.u-col {width: 100% !important;}.u-col > div {margin: 0 auto;}}body {margin: 0;padding: 0;}table,tr,td {vertical-align: top;border-collapse: collapse;}p {margin: 0;}.ie-container table,.mso-container table {table-layout: fixed;}* {line-height: inherit;}a[x-apple-data-detectors='true'] {color: inherit !important;text-decoration: none !important;}table, td { color: #000000; } @media (max-width: 480px) { #u_content_image_2 .v-container-padding-padding { padding: 30px 10px 10px 20px !important; } #u_content_image_2 .v-src-width { width: auto !important; } #u_content_image_2 .v-src-max-width { max-width: 100% !important; } #u_content_heading_4 .v-font-size { font-size: 45px !important; } #u_content_heading_3 .v-container-padding-padding { padding: 39px 10px 10px !important; } #u_content_heading_3 .v-font-size { font-size: 26px !important; } #u_content_text_2 .v-container-padding-padding { padding: 20px 10px 40px !important; } }</style><!--[if !mso]><!--><link href='https://fonts.googleapis.com/css2?family=Federo&display=swap' rel='stylesheet' type='text/css'><!--<![endif]--></head><body class='clean-body u_body' style='margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000'><!--[if IE]><div class='ie-container'><![endif]--><!--[if mso]><div class='mso-container'><![endif]--><table style='border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%' cellpadding='0' cellspacing='0'><tbody><tr style='vertical-align: top'><td style='word-break: break-word;border-collapse: collapse !important;vertical-align: top'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='center' style='background-color: #ffffff;'><![endif]--><div class='u-row-container' style='padding: 0px;background-color: transparent'><div class='u-row' style='Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;'><div style='border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('images/image-3.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding: 0px;background-color: transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:600px;'><tr style='background-image: url('images/image-3.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><![endif]--><!--[if (mso)|(IE)]><td align='center' width='600' style='background-color: #273896;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;' valign='top'><![endif]--><div class='u-col u-col-100' style='max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;'><div style='background-color: #273896;height: 100%;width: 100% !important;'><!--[if (!mso)&(!IE)]><!--><div style='box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;'><!--<![endif]--><table id='u_content_image_2' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px 25px;font-family:helvetica,sans-serif;' align='left'><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 0px;padding-left: 0px;' align='center'><img align='center' border='0' src='images/image-1.jpeg' alt='image' title='image' style='outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 80%;max-width: 452px;' width='452' class='v-src-width v-src-max-width'/></td></tr></table></td></tr></tbody></table><table id='u_content_heading_4' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:30px 10px 5px;font-family:helvetica,sans-serif;' align='left'><h1 class='v-font-size' style='margin: 0px; color: #ffffff; line-height: 100%; text-align: center; word-wrap: break-word; font-family: Federo; font-size: 40px; '><strong>AWASH BANK RECONCILIATION SYSTEM</strong></h1></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><div class='u-row-container' style='padding: 0px;background-color: transparent'><div class='u-row' style='Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;'><div style='border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('images/image-2.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding: 0px;background-color: transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:600px;'><tr style='background-image: url('images/image-2.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;'><![endif]--><!--[if (mso)|(IE)]><td align='center' width='600' style='width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;' valign='top'><![endif]--><div class='u-col u-col-100' style='max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;'><div style='height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;'><!--[if (!mso)&(!IE)]><!--><div style='box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;'><!--<![endif]--><table id='u_content_heading_3' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:helvetica,sans-serif;' align='left'><h1 class='v-font-size' style='margin: 0px; color: #fe9a37; line-height: 140%; text-align: center; word-wrap: break-word; font-family: Federo; font-size: 33px; '><strong>JANUARY 22, 2023</strong></h1></td></tr></tbody></table><table id='u_content_text_2' style='font-family:helvetica,sans-serif;' role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td class='v-container-padding-padding' style='overflow-wrap:break-word;word-break:break-word;padding:20px 60px 60px;font-family:helvetica,sans-serif;' align='left'><div class='v-font-size' style='line-height: 140%; text-align: center; word-wrap: break-word;'><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'>You have been registered as a USER, and your password is</span></p><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'>PASSWORD:<strong> lskKUu76GH</strong></span></p><p style='font-size: 14px; line-height: 140%;'><span style='font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;'>please use your awash outlook and this password to login into AWASH BANK RECONCILIATION SYSTEM.</span></p></div></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table><!--[if mso]></div><![endif]--><!--[if IE]></div><![endif]--></body></html>
