import { Component, OnInit } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-recon-tab-vehicle',
  templateUrl: './recon-tab-vehicle.component.html',
  styleUrls: ['./recon-tab-vehicle.component.css']
})
export class ReconTabVehicleComponent implements OnInit {

  tabTitles = ['Manual', 'Automatic'];

  constructor(public localStorageService: LocalStorageService) {
  }
  
  ngOnInit() {
  }
  onSelect(data: TabDirective): void {
    this.localStorageService.store(
      'recon-selected-tab-fixed-vehicle',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }

}
