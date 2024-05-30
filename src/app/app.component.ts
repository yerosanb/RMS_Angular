import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
// import { slideInAnimation } from './animations'
import { fadeAnimation } from './utils_/animations';
import { AuthService } from './services/auth-service.service';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeAnimation],
})
export class AppComponent implements OnInit, AfterViewChecked {
  //SCROLL TO TOP
  isShow!: boolean;
  topPosToStartShowing = 300;

  // ============
  shoudBeVisible: Boolean = false;
  authService: AuthService;
  // nightMode: Boolean
  constructor(
    private authServicee: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private changeRef: ChangeDetectorRef,
    private renderer2: Renderer2
  ) {
    if (this.localStorageService.retrieve('refresh_token_requested') != null) {
      localStorageService.clear('refresh_token_requested');
      if (this.localStorageService.retrieve('refresh_token_requested') != null)
        localStorageService.clear('refresh_token_requested');
    }
    const subject = new BehaviorSubject(123);
    this.authService = authServicee;
    this.logoutAllTabs();
  }
  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }
  logoutAllTabs() {
    window.addEventListener(
      'storage',
      (event) => {
        if (event.storageArea == localStorage) {
          if (this.localStorageService.retrieve('user') == null) {
            this.router.navigate(['/login']);
          } else {
            if (
              window.location.pathname == '/login' ||
              window.location.pathname == '/signup'
            )
              this.router.navigateByUrl('/home');
          }
        }
      },
      false
    );
  }
  ngOnInit(): void {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const body = document.querySelector('body');
    body?.setAttribute('data-leftbar-theme', 'light');
    body?.setAttribute('data-layout', 'detached');
    body?.setAttribute(
      'layout-config',
      '{"layoutBoxed":false, "leftSidebarCondensed":false, "leftSidebarScrollable":true,"darkMode":false}'
    );
    body?.setAttribute('data-layout-mode', 'fluid');
    body?.setAttribute('data-leftbar-compact-mode', 'scrollable');
    // //////////////////////////////////////////////////////////////////////////////////////////
    // this.renderer2.setProperty(/// [attr.data-layout-mode]="'detached'"
    //   document.getElementById('the-body'),
    //   'data-leftbar-theme',
    //   'light'
    // );
    // this.renderer2.setAttribute(
    //   document.getElementsByName('body'),
    //   'data-leftbar-theme',
    //   'light'
    // );
    // body[0].setAttribute('data-leftbar-theme', 'light');

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (document.getElementById('custom_js') != null) {
          document.getElementById('custom_js')?.remove();
          console.log('removed...');
        }
        const node = document.createElement('script');
        node.src = 'assets/custom.js';
        node.type = 'text/javascript';
        node.async = false;
        node.id = 'custom_js';
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
        console.log('added...');
      }
    });
    if (
      this.localStorageService.retrieve('theme') == null ||
      this.localStorageService.retrieve('theme').trim() == 'light'.trim()
    ) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'assets/template_assets/css/app.min.css';
      link.media = 'all';
      head.appendChild(link);
    } else {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'assets/template_assets/css/app-dark.min.css';
      link.media = 'all';
      head.appendChild(link);
    }
    // var head = document.getElementsByTagName('head')[0]
    // var script = document.createElement('script')
    // // link.rel = 'stylesheet'
    // script.type = 'text/javascript'
    // script.src = 'assets/custom.js'
    // // link.media = 'all'
    // head.appendChild(script)
  }

  //SCROLL TO TOP
  @HostListener('window:scroll')
  checkScroll() {
    // window의 scroll top
    // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // console.log('[scroll]', scrollPosition);

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  // TODO: Cross browsing
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  title = 'plate_angular';
}
