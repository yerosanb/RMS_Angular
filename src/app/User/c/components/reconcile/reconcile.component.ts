import { Component, OnInit, ViewChild } from '@angular/core';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-reconcile',
  templateUrl: './reconcile.component.html',
  styleUrls: ['./reconcile.component.css'],
})
export class ReconcileComponent implements OnInit {
  

  tabTitles = ['PAS','Payable','Receivable'];
  // tabTitles = ['Manual', 'Automatic','Automatic-Partial' ,'Partial','Reconcile Payable','Reconcile Receivable'];


  constructor(public localStorageService: LocalStorageService) {
  }
  
  ngOnInit() {
  }
  onSelect(data: TabDirective): void {
    this.localStorageService.store(
      'recon-selected-tab',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }
}
