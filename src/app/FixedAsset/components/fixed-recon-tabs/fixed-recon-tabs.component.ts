import { Component, OnInit } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-fixed-recon-tabs',
  templateUrl: './fixed-recon-tabs.component.html',
  styleUrls: ['./fixed-recon-tabs.component.css']
})
export class FixedReconTabsComponent implements OnInit {

  tabTitles = [ 'Computer', 'Furniture','Motor-Vehicle', 'Office-Equipment'];

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
