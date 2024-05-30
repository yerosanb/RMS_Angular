import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
@Component({
  selector: 'app-view-issue-transaction',
  templateUrl: './view-issue-transaction.component.html',
  styleUrls: ['./view-issue-transaction.component.css']
})
export class ViewIssueTransactionComponent implements OnInit {
  @ViewChild('loginpopup')
  private loginpopup!: ElementRef;
  showOption:boolean=true;
  tabTitles = ['Matched ', 'UnMatched ','Matched With Reason ', 'Issue QBS  Edited & Deleted ' ,'Issue Core  Edited & Deleted ','Issue Core reversal','Issue QBS reversal' ];

  constructor(public localStorageService: LocalStorageService,
              public authService:AuthService) {
  }

 handleClick(event:any) {
    if (this.showOption) {
        let clickedComponent = event.target;
        if ( clickedComponent !== this.loginpopup.nativeElement ) {
            this.showOption = false;
        }
    }
}

 toggleOption(){
   this.showOption = this.showOption === true ? false : true;
}



  ngOnInit() {
  }
  onSelect(data: TabDirective): void {
    this.localStorageService.store(
      'view-selected-tab-tra',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }
}