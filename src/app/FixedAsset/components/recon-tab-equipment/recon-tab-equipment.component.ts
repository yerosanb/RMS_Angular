import { Component, OnInit } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-recon-tab-equipment',
  templateUrl: './recon-tab-equipment.component.html',
  styleUrls: ['./recon-tab-equipment.component.css']
})
export class ReconTabEquipmentComponent implements OnInit {

  tabTitles = ['Manual', 'Automatic'];

  constructor(public localStorageService: LocalStorageService) {
  }
  
  ngOnInit() {
  }
  onSelect(data: TabDirective): void {
    this.localStorageService.store(
      'recon-selected-tab-fixed-equipment',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }

}

