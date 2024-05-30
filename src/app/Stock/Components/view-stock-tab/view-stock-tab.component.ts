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
  selector: 'app-view-stock-tab',
  templateUrl: './view-stock-tab.component.html',
  styleUrls: ['./view-stock-tab.component.css']
})
export class ViewStockTabComponent   implements OnInit {
  tabTitles = ['Stock-Matched', 'Stock-Unmatched','Stock-Matched-With Reason','Stock-Core-Reversal-Matched','Stock-Core-Deleted','Stock-MMS-Deleted'];
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
    this.selectedTab = this.localStorageService.retrieve(
      'recon-selected-tab-stock');
  }


}
