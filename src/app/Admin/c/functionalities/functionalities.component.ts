import { Component, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-functionalities',
  templateUrl: './functionalities.component.html',
  styleUrls: ['./functionalities.component.css'],
})
export class FunctionalitiesComponent {

  @ViewChild(DataTableDirective)
  datatableElement!: DataTableDirective;

  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  functionalities_status: any = {};
  response: any = {};
  functionality_size = 0;
  dtOptions: DataTables.Settings = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private utilService: UtilService,
    private authService: AuthService,
    private renderer: Renderer2,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      const that = this;
      this.dtOptions = {
        paging: true,
        scrollX: true,
        pagingType: 'full_numbers',
        ajax: (dataTablesParameters: any, callback: any) => {
          this.adminService.getFunctionalitiesNoRole().subscribe(
            async (resp: any) => {
              if (resp != null) {
                console.log(
                  'response for table: ' + JSON.stringify(resp, null, 2)
                );
                callback({
                  recordsTotal: resp.recordsTotal,
                  recordsFiltered: resp.recordsFiltered,
                  data: resp,
                });
                this.response = resp;
                this.functionality_size = resp.length;
                for (let functionality of resp)
                  if (functionality.status == '0')
                    this.functionalities_status[functionality.id] = false;
                  else this.functionalities_status[functionality.id] = true;
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Permission',
                  text: 'You are not permitted to perform this action!',
                });
              }
            },
            (error: any) => {
              if (error.error.text === 'access-token-expired') {
                console.log('Access-token-expired requesting refresh token...');
                if (
                  this.localStorageService.retrieve(
                    'refresh_token_requested'
                  ) == null
                )
                  this.utilService.refreshToken().subscribe(
                    (data) => {
                      if (data === true) {
                        console.log(
                          'refresh token success re-requesting the actual request'
                        );
                        this.localStorageService.clear(
                          'refresh_token_requested'
                        );

                        this.adminService.getFunctionalitiesNoRole().subscribe(
                          async (resp: any) => {
                            if (resp != null) {
                              console.log(
                                'response for table: ' +
                                  JSON.stringify(resp, null, 2)
                              );
                              callback({
                                recordsTotal: resp.recordsTotal,
                                recordsFiltered: resp.recordsFiltered,
                                data: resp,
                              });
                              this.response = resp;
                              this.functionality_size = resp.length;
                              for (let functionality of resp)
                                if (functionality.status == '0')
                                  this.functionalities_status[
                                    functionality.id
                                  ] = false;
                                else
                                  this.functionalities_status[
                                    functionality.id
                                  ] = true;
                            } else {
                              Swal.fire({
                                icon: 'error',
                                title: 'Permission',
                                text: 'You are not permitted to perform this action!',
                              });
                            }
                          },
                          (error: any) => {
                            if (error.error.text === 'access-token-expired') {
                              console.log('refresh token expired.');
                              this.SwalSessionExpired.fire();
                              this._refreshTokenExpired();
                            } else {
                              Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong!',
                              });
                              console.log(
                                JSON.stringify(error.error.apierror, null, 2)
                              );
                            }
                          }
                        );
                      } else {
                        console.log('refresh token expired.');
                        this.SwalSessionExpired.fire();
                        this._refreshTokenExpired();
                      }
                    },
                    (error) => {
                      console.log('error refreshing access token');
                      Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                      });
                      console.log(
                        JSON.stringify(error.error.apierror, null, 2)
                      );
                    }
                  );
                this.localStorageService.store('refresh_token_requested', true);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
                console.log(JSON.stringify(error.error.apierror, null, 2));
              }
            }
          );
        },

        columnDefs: [
          {
            targets: [0],
            className: 'bolded',
          },
        ],
        columns: [
          {
            title: '-ID-',
            data: 'id',
          },
          {
            title: 'Name',
            data: 'name',
          },
          {
            title: 'Description',
            data: 'description',
          },
          {
            title: 'State',
            render: function (data: any, type: any, full: any) {
              document
                .getElementsByClassName('datatable-buttons')[0]
                ?.classList.remove('dt-button');
              if (full.status_all == 1) {
                if (full.status == '0')
                  return (
                    '<div class="form-check form-checkbox-success mb-2"> <input status_change="' +
                    full.id +
                    '" type="checkbox" class="form-check-input" id="functionality_checkbox_' +
                    full.id +
                    '" > <label class="form-check-label" for="functionality_checkbox_' +
                    full.id +
                    '">State</label> </div>'
                  );
                else
                  return (
                    '<div class="form-check form-checkbox-success mb-2"> <input status_change="' +
                    full.id +
                    '" checked type="checkbox" class="form-check-input" id="functionality_checkbox_' +
                    full.id +
                    '" > <label class="form-check-label" for="functionality_checkbox_' +
                    full.id +
                    '">State</label> </div>'
                  );
              } else
                return (
                  '<div class="form-check form-checkbox-success mb-2"' +
                  'data-toggle="tooltip" data-placement="top" title="Disabled Functionality."> <input ' +
                  ' disabled type="checkbox" class="form-check-input" id="functionality_checkbox_' +
                  full.id +
                  '" > <label class="form-check-label" for="functionality_checkbox_' +
                  full.id +
                  '">State</label> </div>'
                );
            },
          },
        ],
      };
    } catch (ex) {
      console.log('Exception: ' + JSON.stringify(ex));
    }
  }
  ngAfterViewInit(): void {
    this.renderer.listen('document', 'change', (event) => {
      if (event.target.hasAttribute('status_change')) {
        var functionality_id = event.target.getAttribute('status_change');
        this.functionalities_status[functionality_id] =
          this.functionalities_status[functionality_id] = (<HTMLInputElement>(
            document.getElementById(
              'functionality_checkbox_' + functionality_id
            )
          )).checked;
      }
    });
  }
  updateStatus() {
  
    console.log(JSON.stringify(this.functionalities_status, null, 2));
    this.adminService
      .updateFunctionalityStatusNoRole(this.functionalities_status)
      .subscribe(
        (data: any) => {
          if (data == true) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Successfully Updated!',
            });
            this.datatableElement.dtInstance.then(
              (dtInstance: DataTables.Api) => {
                dtInstance.ajax.reload();
              }
            );
            // this.datatableElement.dtInstance.then()
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Permission',
              text: 'You are not permitted to perform this action!',
            });
          }
          console.log('success: ' + data);
        },
        (error: any) => {
          if (error.error.text === 'access-token-expired') {
            console.log('Access-token-expired requesting refresh token...');
            if (
              this.localStorageService.retrieve('refresh_token_requested') ==
              null
            ) {
              this.utilService.refreshToken().subscribe(
                (data) => {
                  if (data === true) {
                    console.log(
                      'refresh token success re-requesting the actual request'
                    );
                    this.localStorageService.clear('refresh_token_requested');
                    //================================================================================
                    this.adminService
                      .updateFunctionalityStatusNoRole(
                        this.functionalities_status
                      )
                      .subscribe(
                        (data: any) => {
                          if (data == true) {
                            Swal.fire({
                              icon: 'success',
                              title: 'Success',
                              text: 'Successfully Updated!',
                            });
                            this.datatableElement.dtInstance.then(
                              (dtInstance: DataTables.Api) => {
                                dtInstance.ajax.reload();
                              }
                            );
                            // this.datatableElement.dtInstance.then()
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Permission',
                              text: 'You are not permitted to perform this action!',
                            });
                          }
                          console.log('success: ' + data);
                        },
                        (error: any) => {
                          if (error.error.text === 'access-token-expired') {
                            console.log('refresh token expired.');
                            this.SwalSessionExpired.fire();
                            this._refreshTokenExpired();
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Something went wrong!',
                            });
                            console.log(
                              JSON.stringify(error.error.apierror, null, 2)
                            );
                          }
                        }
                      );
                  } else {
                    console.log('refresh token expired.');
                    this.SwalSessionExpired.fire();
                    this._refreshTokenExpired();
                  }
                },
                (error) => {
                  console.log('error refreshing access token');
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                  });
                  console.log(JSON.stringify(error.error.apierror, null, 2));
                }
              );
              this.localStorageService.store('refresh_token_requested', true);
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
            console.log(JSON.stringify(error.error.apierror, null, 2));
          }
        }
      );
  }
  _refreshTokenExpired() {
    console.log('logging out');

    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          delay(3500);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
        } else {
          console.log('login failed 001');
        }
      },
      (error) => {
        console.log(
          'Error: ' + JSON.stringify(error.error.apierror.message, null, 2)
        );
      }
    );
  }
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
