import { Component, OnInit } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-recon-tabs',
  templateUrl: './recon-tabs.component.html',
  styleUrls: ['./recon-tabs.component.css']
})
export class ReconTabsComponent implements OnInit {
  
  tabTitles = ['Manual', 'Automatic'];
  
  constructor(public localStorageService: LocalStorageService) {
  }

  ngOnInit() {
  }
  onSelect(data: TabDirective): void {
    this.localStorageService.store(
      'recon-selected-tab-fixed-asset',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }

}
