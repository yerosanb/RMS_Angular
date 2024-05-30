import { Component, OnInit} from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { TabDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-recon-receivable',
  templateUrl: './recon-receivable.component.html',
  styleUrls: ['./recon-receivable.component.css']
})
export class ReconReceivableComponent implements OnInit  {
  
  tabTitles = ['Manual', 'Automatic'];

  constructor(public localStorageService: LocalStorageService) {
  }
  
  ngOnInit() {
  }
  onSelect(data: TabDirective): void {
    this.localStorageService.store(

      'selected-tab_',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }
}
