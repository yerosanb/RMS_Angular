import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-view-transacton',
  templateUrl: './view-transacton.component.html',
  styleUrls: ['./view-transacton.component.css']
})
export class ViewTransactonComponent implements OnInit {
  @ViewChild('loginpopup')
  private loginpopup!: ElementRef;
  showOption:boolean=true;

  tabTitles = ['ALL ', 'RTGS ', 'ERCA ', 'Bank to bank ', 'IS/OS','PAS Core Reversal Matched','Payable','Recievable','Edited & Reasons'];

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
      'recon-selected-tab-tra',
      this.tabTitles.indexOf(data.heading!, 0)
    );
  }
}