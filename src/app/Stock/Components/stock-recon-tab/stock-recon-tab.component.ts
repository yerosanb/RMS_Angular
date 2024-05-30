import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { location } from 'ngx-bootstrap/utils/facade/browser';
import { LocalStorageService } from 'ngx-webstorage';
import { win32 } from 'path';
import { windowWhen } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';
import { StockAutomaticComponent } from '../stock-automatic/stock-automatic.component';
import { StockManualComponent } from '../stock-manual/stock-manual.component';
import { NavigatorUpperComponent } from 'src/app/c/components/navigator-upper/navigator-upper.component';
declare var window: any;
@Component({
  selector: 'app-stock-recon-tab',
  templateUrl: './stock-recon-tab.component.html',
  styleUrls: ['./stock-recon-tab.component.css']
})
export class StockReconTabComponent implements OnInit {
  @ViewChild(StockAutomaticComponent)
  componentStockAutomaticaly!: StockAutomaticComponent;
  @ViewChild(StockManualComponent)
  componentStockManually!: StockManualComponent;
  @ViewChild(NavigatorUpperComponent)
  navigatorUpperComponent!: NavigatorUpperComponent;

  tabTitles = ['Manual', 'Automatic'];
  stockTabset: any;
  selectedTab: any;

  constructor(public localStorageService: LocalStorageService,
    private route: ActivatedRoute, public authService: AuthService,
    private router: Router,) {
  }
  type: any = "000";
  ngOnInit() {

  }

  onSelect(data: TabDirective): void {
    this.localStorageService.store(
      'recon-selected-tab-stock',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }
  onChange(value: any) {
    this.selectedTab = this.localStorageService.retrieve(
      'recon-selected-tab-stock');
      this.type = value.target.value;
      this.navigatorUpperComponent.current_link = this.type;
      this.router.navigateByUrl(`Stock/${this.type}`);
      if (this.selectedTab == 0) {
        this.componentStockManually.type = this.type;
        $('#mms_stock_table').DataTable().ajax.reload();
        $('#core_stock_table').DataTable().ajax.reload();
      } else if (this.selectedTab == 1) {
        this.componentStockAutomaticaly.type = this.type;
        $('#stock_mms_auto_table').DataTable().ajax.reload();
        $('#stock_core_auto_table').DataTable().ajax.reload();
      }

   }

}

