import { Component, OnInit } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-recon-pas-tabs',
  templateUrl: './recon-pas-tabs.component.html',
  styleUrls: ['./recon-pas-tabs.component.css']
})
export class ReconPasTabsComponent implements OnInit {

  // tabTitles = ['PAS','Payable','Receivable'];
  tabTitles = ['Manual', 'Automatic','Automatic-Partial' ,'Partial'];

  constructor(public localStorageService: LocalStorageService) {
  }
  
  ngOnInit() {
  }
  onSelect(data: TabDirective): void {
    this.localStorageService.store(
      'recon-selected-tab_',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }
}
