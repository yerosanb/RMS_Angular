import { Component, OnInit } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-reconcile-issue',
  templateUrl: './reconcile-issue.component.html',
  styleUrls: ['./reconcile-issue.component.css']
})
export class ReconcileIssueComponent implements OnInit {

  tabTitles = ['Manual', 'Automatic'];

  constructor(public localStorageService: LocalStorageService) {
  }
  
  ngOnInit() {
  }
  onSelect(data: TabDirective): void {
    this.localStorageService.store(
      'recon-selected-tab-issue',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }

}
