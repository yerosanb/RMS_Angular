import { Component, OnInit } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-recon-tab-furn',
  templateUrl: './recon-tab-furn.component.html',
  styleUrls: ['./recon-tab-furn.component.css']
})
export class ReconTabFurnComponent implements OnInit {

  tabTitles = ['Manual', 'Automatic'];

  constructor(public localStorageService: LocalStorageService) {
  }
  
  ngOnInit() {
  }
  onSelect(data: TabDirective): void {
    this.localStorageService.store(
      'recon-selected-tab-fixed-furniture',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }

}
