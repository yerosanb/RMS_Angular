import { Component, OnInit } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-fixed-asset-division',
  templateUrl: './fixed-asset-division.component.html',
  styleUrls: ['./fixed-asset-division.component.css']
})
export class FixedAssetDivisionComponent implements OnInit {

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
