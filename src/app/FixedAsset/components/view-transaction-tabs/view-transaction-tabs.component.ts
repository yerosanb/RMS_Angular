import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-view-transaction-tabs',
  templateUrl: './view-transaction-tabs.component.html',
  styleUrls: ['./view-transaction-tabs.component.css'],
})
export class ViewTransactionTabsComponent implements OnInit {

  @ViewChild('loginpopup')
  private loginpopup!: ElementRef;
  showOption: boolean = true;

  tabTitles = ['Computer', 'Furniture', ' Equipment', 'Motor vehicle','Matched with Reason', 'Core Deleted', 'MMS Deleted', 'MMS Waiting', 'MMS Disposed', 'MMS Removed', 'Reverasl Matched'];

  constructor(
    public localStorageService: LocalStorageService,
    public authService: AuthService
  ) {}

  handleClick(event: any) {
    if (this.showOption) {
      let clickedComponent = event.target;
      if (clickedComponent !== this.loginpopup.nativeElement) {
        this.showOption = false;
      }
    }
  }

  toggleOption() {
    this.showOption = this.showOption === true ? false : true;
  }

  ngOnInit() {}
  onSelect(data: TabDirective): void {
    this.localStorageService.store(
      'recon-selected-tab-tra-fixed-asset',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }
}
