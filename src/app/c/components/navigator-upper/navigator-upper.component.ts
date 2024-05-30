import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';
// Input
@Component({
  selector: 'app-navigator-upper',
  templateUrl: './navigator-upper.component.html',
  styleUrls: ['./navigator-upper.component.css'],
})
export class NavigatorUpperComponent {
  links!: string[];
  current_link!: string;
  constructor(private router: Router) {
    console.log('here here: ' + window.location.pathname.substring(1))
    this.links = window.location.pathname.substring(1).replace('rms/', '').split('/');
    this.current_link = this.links[this.links.length - 1];
    this.links.splice(this.links.indexOf(this.current_link), 1);

    if (this.links.length == 0 && this.current_link != 'home') {
      this.links.push('home');
    }
  }
  navigateTo(link_to: string) {
    var new_link: string = '/';
    // var new_link: string = '/rms';
    for (let link of this.links) {
      new_link = new_link + '/' + link;
      if (link == link_to) break;
    }
    if (this.validUrl(new_link)) this.goTo(new_link);
  }

  validUrl(link: string): Boolean {
    if ('functionalities' == link.split('/').at(link.split('/').length - 1) || 
    'edit' == link.split('/').at(link.split('/').length - 1) || 
    'currency-remark' == link.split('/').at(link.split('/').length - 1)||
    'account-remark' == link.split('/').at(link.split('/').length - 1)||
    'account-requests' == link.split('/').at(link.split('/').length - 1)||
    'edit-account' == link.split('/').at(link.split('/').length - 1)||
    'edit-currency' == link.split('/').at(link.split('/').length - 1))
     
    return false;

    else return true;
  }

  goTo(link: string) {
    this.router.navigateByUrl(link);
  }

}
