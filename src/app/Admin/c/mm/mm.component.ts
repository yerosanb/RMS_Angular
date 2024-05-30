import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
import { DataTablesResponse } from '../../payloads/datatables-response';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-mm',
  templateUrl: './mm.component.html',
  styleUrls: ['./mm.component.css'],
})
export class MmComponent implements OnInit, AfterViewInit, OnDestroy {
  dtOptions: any;

  @ViewChild(DataTableDirective)
  datatableElement!: DataTableDirective;
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;

  first_column_title = 'ID';
  second_column_title = 'First name';
  third_column_title = 'Last name';

  constructor(
    private adminService: AdminService,
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService,
    private httpClient: HttpClient
  ) {}
  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search('')
        .column(1)
        .search('')
        .column(2)
        .search('')
        .draw();
      // dtInstance.column(0).search('2').draw();
    });
  }

  ngOnDestroy(): void {
    // $.fn['dataTable'].ext.search.pop();
  }

  // this is query parameters: {draw=2, columns[0].data=id, columns[0].name=, columns[0].searchable=true, columns[0].orderable=true, columns[0].search.value=, columns[0].search.regex=false, columns[1].data=firstName, columns[1].name=, columns[1].searchable=true, columns[1].orderable=true, columns[1].search.value=, columns[1].search.regex=false, columns[2].data=lastName, columns[2].name=, columns[2].searchable=true, columns[2].orderable=true, columns[2].search.value=, columns[2].search.regex=false, columns[3].data=position, columns[3].name=, columns[3].searchable=true, columns[3].orderable=true, columns[3].search.value=, columns[3].search.regex=false, columns[4].data=age, columns[4].name=, columns[4].searchable=true, columns[4].orderable=true, columns[4].search.value=, columns[4].search.regex=false, columns[5].data=salary, columns[5].name=, columns[5].searchable=true, columns[5].orderable=true, columns[5].search.value=, columns[5].search.regex=false, columns[6].data=office.city, columns[6].name=, columns[6].searchable=true, columns[6].orderable=true, columns[6].search.value=, columns[6].search.regex=false, order[0].column=0, order[0].dir=asc, start=0, length=10, search.value=, search.regex=false, searchPanes.position.0=Analyst, _=1675528635109}

  ngOnInit() {
    this.dtOptions = {
      processing: true,
      serverSide: true,
      // scrollX: true,
      searching: true,
      lengthChange: true,
      ordering: true,
      paging: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      select: true,
      // deferRender: true,
      // ajax: '../../../../assets/data/data.json',

      ajax: (dataTablesParameters: any, callback: any) => {
        console.log(
          'to send: ' + JSON.stringify(dataTablesParameters, null, 6)
        );
        if (JSON.stringify(dataTablesParameters.searchPanes, null, 6) == '{}') {
          console.log('nullllllllllllllll');
        } else {
          console.log(
            'not nullllllllllllllllllllllll' +
              JSON.stringify(dataTablesParameters.searchPanes)
          );
        }

        this.httpClient
          .post<DataTablesResponse>(
            'http://localhost:5056/api/admin/get_all_users_mm/',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            console.log('received: ' + JSON.stringify(resp, null, 6));
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data,
            });
          });
      },

      // ajax: (dataTablesParameters: any, callback: any) => {
      //   console.log(
      //     'datatables parameters: ' +
      //       JSON.stringify(dataTablesParameters, null, 6)
      //   );
      //   this.httpClient
      //     .post<DataTablesResponse>(
      //       'http://localhost:5056/api/admin/get_all_users_mm/',
      //       dataTablesParameters,
      //       {}
      //     )
      //     .subscribe(
      //       async (resp: any) => {
      //         if (resp != null) {
      //           console.log(
      //             'response for table: ' + JSON.stringify(resp, null, 2)
      //           );
      //           callback({
      //             recordsTotal: resp.recordsTotal,
      //             recordsFiltered: resp.recordsFiltered,
      //             data: resp.data,
      //           });
      //           console.log(
      //             'records total(after token refresh): ' +
      //               JSON.stringify(resp.length)
      //           );
      //         } else {
      //           Swal.fire({
      //             icon: 'error',
      //             title: 'Permission',
      //             text: 'You are not permitted to perform this action!',
      //           });
      //         }
      //       },
      //       (error: any) => {}
      //     );
      // },
      columns: [
        {
          title: this.first_column_title,
          data: 'id',
        },
        {
          title: this.second_column_title,
          data: 'firstName',
        },
        {
          title: this.third_column_title,
          data: 'lastName',
        },
      ],
      dom: "<'row mb-1 mt-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: "<'row mb-1 mx-1'P><'row mb-1 mt-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip",
      // dom: "<'row mb-1 mx-1'P><'row mb-1 mt-1'<'col-sm-5'l><'col-sm-7'f>><'row mb-1'B>rtip<'row mb-1 mt-3'Q>",
      colReorder: {
        order: [0, 1, 2],
        action: function (e: any, dt: any, node: any, config: any) {
          console.log('reordered');
        },
      },
      buttons: {
        buttons: [
          'colvis',
          ,
          {
            text: 'Reload',
            action: function (e: any, dt: any, node: any, config: any) {
              dt.ajax.reload();
              alert('reload success');
            },
          },
          {
            extend: 'copy',
            text: '<u>C</u>opy',
            key: {
              key: 'c',
              altKey: true,
            },
          },
          'print',
          {
            extend: 'pdf',
            text: 'Pdf',
          },
          {
            extend: 'pdf',
            text: 'Pdf current page',
            exportOptions: {
              modifier: {
                page: 'current',
              },
            },
          },
          {
            extend: 'excel',
            text: 'Excel',
          },
          {
            extend: 'collection',
            text: 'Header',
            autoClose: true,
            background: true,
            dropup: false,
            collectionTitle: '',
            buttons: [
              {
                text: 'Enable fixed header',
                key: '1',
                action: function (e: any, dt: any, node: any, config: any) {
                  dt.fixedHeader.enable();
                },
              },
              {
                text: 'Disable fixed header',
                key: '1',
                action: function (e: any, dt: any, node: any, config: any) {
                  dt.fixedHeader.disable();
                },
              },
            ],
            fade: true,
          },
        ],
      },
      stateSave: false,
      // stateDuration: 0,
      fixedHeader: {
        header: true,
      },
      scrollCollapse: true,
      fixedColumns: false,
      // searchPanes: {
      //   initCollapsed: true,
      //   cascadePanes: true,
      //   clear: true,
      // },
      // columnDefs: [
      // {
      //   searchPanes: {
      //     show: true,
      //   },
      //   targets: [0, 1, 2],
      // },
      // {
      //   searchPanes: {
      //     options: [
      //       {
      //         label: 'Over 60',
      //         value: function (rowData: any, rowIdx: any) {
      //           console.log(
      //             'clickedddd: ' + JSON.stringify(rowData, null, 2)
      //           );
      //           return rowData[0] > 60;
      //         },
      //       },
      //     ],
      //   },
      //   targets: [0],
      // },
      //   {
      //     searchPanes: {
      //       show: true,
      //     },
      //     targets: [1, 2],
      //   },
      //   {
      //     searchPanes: {
      //       show: false,
      //       options: [
      //         {
      //           label: 'Prime Ages',
      //           value: function (rowData: any, rowIdx: any) {
      //             // let primeNumber = true;
      //             // for (let i = 2; i < Math.sqrt(rowData[0]); i++) {
      //             //   if (rowData[0] % i == 0) {
      //             //     primeNumber = false;
      //             //     break;
      //             //   }
      //             // }
      //             // return rowData[0] === '1';
      //             // return primeNumber && rowData[0] > 1;
      //           },
      //         },
      //       ],
      //     },
      //     targets: [0],
      //   },
      // ],
      // language: {
      //   searchPanes: {
      //     count: '{total} found',
      //     countFiltered: '{shown} / {total}',
      //   },
      // },
      // searchPanes: {
      //   panes: [
      //     {
      //       show: false,
      //       header: 'custom',
      //       options: [
      //         {
      //           label: 'Accountants in Tokyo',
      //           value: function (rowData: any, rowIdx: any) {
      //             // return rowData[0] === '1';
      //             // return rowData[1] === 'Accountant' && rowData[2] === 'Tokyo';
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
    };
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
