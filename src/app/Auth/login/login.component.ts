import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth-service.service';
import { loginPayload } from 'src/app/utils_/payloads/Auth/login-payload';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { UtilService } from 'src/app/services/util-service/util.service';
declare var window: any
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit, AfterViewChecked {
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent; 
  @ViewChild('SuccessSendForgetPassword')
  public readonly SuccessSendForgetPassword!: SwalComponent;
  fullYear=new Date().getFullYear();
  //form
  refresh_token_requested = false;
  loginForm: FormGroup;
  forgotForm!: FormGroup;
  submitted: any;
  submitted_forgot_password: any;
  forgot_password_modal:any;
  difference_trial: any;
  login_payload: loginPayload;
  login_trial_exceeded: boolean = false;
  user_disabled: boolean = false;
  message:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private utilService: UtilService,
    private authService: AuthService,
    private changeRef: ChangeDetectorRef,
    public localStorageService: LocalStorageService // public datepipe: DatePipe,
  ) {
    this.login_payload = {
      email: '',
      password: '',
      rememberMe: false,
      browser_type: '',
      browser_version: '',
    };
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(320),
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20),
      ]),
      rememberMe: new FormControl(''),
    });
    this.forgotForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(320),
        Validators.email,
      ]),
    });
  }
  closeModal(){
    this.forgot_password_modal.hide()
  }
  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
    // loadDatatableScripts()
  }
  manageTimer(time_to_punish: any, diff: any) {
    console.log('time to punish: ' + time_to_punish);
    console.log('time to diff: ' + diff);
    console.log('the time should be: ' + (time_to_punish - diff));
  
    if (Number(time_to_punish) - Number(diff) >= 0) {
      let timerInterval: string | number | NodeJS.Timeout | undefined;
      Swal.fire({
        title:
          'Too much wrong attempts! please wait until the timer finishes and try again later.',
        html: 'try after <b></b> seconds.',
        timer: Number(time_to_punish) - Number(diff),
        allowOutsideClick: false,
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: false,
        showDenyButton: false,

        didOpen: () => {
          Swal.showLoading(Swal.getDenyButton()!);
          const b = Swal.getHtmlContainer()!.querySelector('b');
          timerInterval = setInterval(() => {
            b!.textContent = this.millisToMinutesAndSeconds(
              Number(Swal.getTimerLeft()!.toString())
            );
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log('I was closed by the timer');
          document
            .getElementById('bad-credential-message')
            ?.classList.remove('d-block');
          document
            .getElementById('bad-credential-message')
            ?.classList.add('d-none');
          document
            .getElementById('server-error-message')
            ?.classList.add('d-none');
          document
            .getElementById('server-error-message')
            ?.classList.remove('d-block');
        }
      });
    } else {
      document
        .getElementById('bad-credential-message')
        ?.classList.remove('d-block');
      document
        .getElementById('bad-credential-message')
        ?.classList.add('d-none');
      document.getElementById('server-error-message')?.classList.add('d-none');
      document
        .getElementById('server-error-message')
        ?.classList.remove('d-block');
    }
  }
  ngOnInit(): void {
    window.scroll(0, 0);
    this.getLoginTrial();
    this.forgot_password_modal= new window.bootstrap.Modal(
      document.getElementById('forgot-passoword'),
    )
  }
  getLoginTrial() {
    // if (Object.keys(localStorage).filter(x => localStorage.getItem(x)!.startsWith('login_trials'))) {
    if (this.localStorageService.retrieve('login_trials') != null) {
      this.authService
        .getLoginTrial(this.localStorageService.retrieve('login_trials'))
        .subscribe(
          (data: any) => {
            console.log('data: ' + JSON.stringify(data, null, 4));
            var message = data.split('$');
            console.log('date1: ' + message[1])
            console.log('date6: ' + message[6])
            console.log('datenow: ' + new Date())

            if (Number(message[0]) <= Number(message[2])) {
              if (Number(message[2]) - Number(message[0]) == 0) {
                const a = new Date(message[1])
                // const a = new Date(
                //   '' + message[1].split(' ')[0].replaceAll('/', '-')
                // );
                // a.setHours(message[1].split(' ')[1].split(':')[0]);
                // a.setMinutes(message[1].split(' ')[1].split(':')[1]);
                // a.setSeconds(message[1].split(' ')[1].split(':')[2]);
                this.manageTimer(
                  Number(message[4]),
                  this.timeDiff(new Date(message[6]), a)
                );
                console.log("each: " + new Date(message[6]) + ' : ' + a)
              } else {
                this.localStorageService.store(
                  'pt',
                  Number(message[2]) - Number(message[0])
                );
              }
            }
          },
          (error) => {
            console.log('error: ' + JSON.stringify(error, null, 4));
            var message = error.error.text.split('$');
            console.log('date1: ' + message[1])
            console.log('date6: ' + message[6])
            console.log('datenow: ' + new Date())

            if (Number(message[0]) <= Number(message[2])) {
              if (Number(message[2]) - Number(message[0]) == 0) {
                const a = new Date(message[1])
                // const a = new Date(
                //   '' + message[1].split(' ')[0].replaceAll('/', '-')
                // );
                // a.setHours(message[1].split(' ')[1].split(':')[0]);
                // a.setMinutes(message[1].split(' ')[1].split(':')[1]);
                // a.setSeconds(message[1].split(' ')[1].split(':')[2]);

                this.manageTimer(
                  Number(message[4]),
                  this.timeDiff(new Date(message[6]), a)
                );
                // console.log("time to punish: " + Number(message[4]))
              } else {
                this.localStorageService.store(
                  'pt',
                  Number(message[2]) - Number(message[0])
                );
              }
            }
          }
        );
    }
  }

  millisToMinutesAndSeconds(millis: number): string {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    var hours = (minutes - (minutes % 60)) / 60;
    minutes = minutes % 60;
    // var hours   = ((millis / (1000*60*60)) % 24);
    if (minutes == 0 && hours == 0)
      return (Number(seconds) < 10 ? '0' : '') + seconds;
    else if (hours == 0)
      return minutes + ':' + (Number(seconds) < 10 ? '0' : '') + seconds;
    else
      return (
        hours +
        ':' +
        minutes +
        ':' +
        (Number(seconds) < 10 ? '0' : '') +
        seconds
      );
  }
  onSubmit() {
    console.log('submit clicked: ' + this.login_trial_exceeded);
    if (this.loginForm.valid) {
      this.login_payload.email = this.loginForm.get('email')?.value;
      this.login_payload.password = this.loginForm.get('password')?.value;
      this.login_payload.browser_type = this.detectBrowserName();
      this.login_payload.browser_version = this.detectBrowserVersion();
      this.authService.login_other_device_browser( this.login_payload.email).subscribe(
      (data:Boolean) => {
        if (data==false) {
          this.authService.login(this.login_payload).subscribe(
            (data) => {
              if (data) {
                this.localStorageService.clear('pt');
                this.localStorageService.clear('pts');
                this.localStorageService.clear('login_trials');
                this.router.navigateByUrl('/home');
              }
            },
            (error) => {
              if (
                error.error.text != undefined &&
                error.error.text.toString().includes('thisismymessagetotheworld')
              ) {
                this.login_trial_exceeded = false;
                this.user_disabled = false;
                document
                  .getElementById('bad-credential-message')
                  ?.classList.add('d-block');
                document
                  .getElementById('bad-credential-message')
                  ?.classList.remove('d-none');
                document
                  .getElementById('server-error-message')
                  ?.classList.add('d-none');
                document
                  .getElementById('server-error-message')
                  ?.classList.remove('d-block');
    
                var message = error.error.text.split('$');
    
                if (Number(message[0]) <= Number(message[2])) {
                  if (Number(message[2]) - Number(message[0]) == 0) {
                    const a = new Date(message[1])
                    // const a = new Date(
                    //   '' + message[1].split(' ')[0].replaceAll('/', '-')
                    // );
                    // a.setHours(message[1].split(' ')[1].split(':')[0]);
                    // a.setMinutes(message[1].split(' ')[1].split(':')[1]);
                    // a.setSeconds(message[1].split(' ')[1].split(':')[2]);
    
                    console.log('time difff: ' + this.timeDiff(new Date(message[6]), a));
                    this.localStorageService.store(
                      'login_trials',
                      this.login_payload.email
                    );
                    this.manageTimer(
                      Number(message[4]),
                      this.timeDiff(new Date(message[6]), a)
                    );
                    console.log("time to punish: " + Number(message[4]))
                  } else {
                    console.log('message 2: ' + Number(message[2]));
                    console.log('message 2: ' + Number(message[0]));
                    this.localStorageService.store(
                      'pt',
                      Number(message[2]) - Number(message[0])
                    );
                  }
                } else if (
                  Number(Number(message[0]) - Number(message[2])) <=
                  Number(message[3])
                ) {
                  if (
                    Number(Number(message[0]) - Number(message[2])) -
                    Number(message[3]) ==
                    0
                  ) {
                    this.localStorageService.clear('pt');
                    this.login_trial_exceeded = true;
                  } else {
                    this.localStorageService.store(
                      'pt',
                      Number(message[2]) + Number(message[3]) - Number(message[0])
                    );
                  }
                }
                console.log('Error: ' + JSON.stringify(error, null, 4));
              } else if (
                error.error.text != undefined &&
                error.error.text === 'custom-bad-credentials'
              ) {
                this.login_trial_exceeded = false;
                this.user_disabled = false;
                this.localStorageService.clear('pt');
                document
                  .getElementById('bad-credential-message')
                  ?.classList.add('d-block');
                document
                  .getElementById('bad-credential-message')
                  ?.classList.remove('d-none');
                document
                  .getElementById('server-error-message')
                  ?.classList.add('d-none');
                document
                  .getElementById('server-error-message')
                  ?.classList.remove('d-block');
              } else if (
                error.error.text != undefined &&
                error.error.text.toString().includes('login-trial-exceeded')
              ) {
                this.user_disabled = false;
                this.localStorageService.clear('pt');
                this.login_trial_exceeded = true;
                document
                  .getElementById('bad-credential-message')
                  ?.classList.add('d-block');
                document
                  .getElementById('bad-credential-message')
                  ?.classList.remove('d-none');
                document
                  .getElementById('server-error-message')
                  ?.classList.add('d-none');
                document
                  .getElementById('server-error-message')
                  ?.classList.remove('d-block');
              } else if (
                error.error.text != undefined &&
                error.error.text.toString().includes('user_disabled')
              ) {
                console.log('here here');
                this.login_trial_exceeded = false;
                this.localStorageService.clear('pt');
                this.user_disabled = true;
                document
                  .getElementById('bad-credential-message')
                  ?.classList.add('d-block');
                document
                  .getElementById('bad-credential-message')
                  ?.classList.remove('d-none');
                document
                  .getElementById('server-error-message')
                  ?.classList.add('d-none');
                document
                  .getElementById('server-error-message')
                  ?.classList.remove('d-block');
              } else {
                this.login_trial_exceeded = false;
                this.user_disabled = false;
                document
                  .getElementById('bad-credential-message')
                  ?.classList.remove('d-block');
                document
                  .getElementById('bad-credential-message')
                  ?.classList.add('d-none');
                document
                  .getElementById('server-error-message')
                  ?.classList.add('d-block');
                document
                  .getElementById('server-error-message')
                  ?.classList.remove('d-none');
              }
    
              console.log('error from back: ' + JSON.stringify(error, null, 3))
            }
          );
    
        }
        else if(data==true)
        {
          Swal.fire({
            title: '<p style="color:gold">Already loggedin on another machine or browser !</p> ',
            text: 'Are you sure you want to logout ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0acf97',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes',
          }).then((result) => {
            if (result.isConfirmed) {
              this.authService.login_(this.login_payload).subscribe(
                (data) => {
                  if (data) {
                    this.localStorageService.clear('pt');
                    this.localStorageService.clear('pts');
                    this.localStorageService.clear('login_trials');
                    this.router.navigateByUrl('/home');
                  }
                },
                (error) => {
                  if (
                    error.error.text != undefined &&
                    error.error.text.toString().includes('thisismymessagetotheworld')
                  ) {
                    this.login_trial_exceeded = false;
                    this.user_disabled = false;
                    document
                      .getElementById('bad-credential-message')
                      ?.classList.add('d-block');
                    document
                      .getElementById('bad-credential-message')
                      ?.classList.remove('d-none');
                    document
                      .getElementById('server-error-message')
                      ?.classList.add('d-none');
                    document
                      .getElementById('server-error-message')
                      ?.classList.remove('d-block');
        
                    var message = error.error.text.split('$');
        
                    if (Number(message[0]) <= Number(message[2])) {
                      if (Number(message[2]) - Number(message[0]) == 0) {
                        const a = new Date(message[1])
                        // const a = new Date(
                        //   '' + message[1].split(' ')[0].replaceAll('/', '-')
                        // );
                        // a.setHours(message[1].split(' ')[1].split(':')[0]);
                        // a.setMinutes(message[1].split(' ')[1].split(':')[1]);
                        // a.setSeconds(message[1].split(' ')[1].split(':')[2]);
        
                        console.log('time difff: ' + this.timeDiff(new Date(message[6]), a));
                        this.localStorageService.store(
                          'login_trials',
                          this.login_payload.email
                        );
                        this.manageTimer(
                          Number(message[4]),
                          this.timeDiff(new Date(message[6]), a)
                        );
                        console.log("time to punish: " + Number(message[4]))
                      } else {
                        console.log('message 2: ' + Number(message[2]));
                        console.log('message 2: ' + Number(message[0]));
                        this.localStorageService.store(
                          'pt',
                          Number(message[2]) - Number(message[0])
                        );
                      }
                    } else if (
                      Number(Number(message[0]) - Number(message[2])) <=
                      Number(message[3])
                    ) {
                      if (
                        Number(Number(message[0]) - Number(message[2])) -
                        Number(message[3]) ==
                        0
                      ) {
                        this.localStorageService.clear('pt');
                        this.login_trial_exceeded = true;
                      } else {
                        this.localStorageService.store(
                          'pt',
                          Number(message[2]) + Number(message[3]) - Number(message[0])
                        );
                      }
                    }
                    console.log('Error: ' + JSON.stringify(error, null, 4));
                  } else if (
                    error.error.text != undefined &&
                    error.error.text === 'custom-bad-credentials'
                  ) {
                    this.login_trial_exceeded = false;
                    this.user_disabled = false;
                    this.localStorageService.clear('pt');
                    document
                      .getElementById('bad-credential-message')
                      ?.classList.add('d-block');
                    document
                      .getElementById('bad-credential-message')
                      ?.classList.remove('d-none');
                    document
                      .getElementById('server-error-message')
                      ?.classList.add('d-none');
                    document
                      .getElementById('server-error-message')
                      ?.classList.remove('d-block');
                  } else if (
                    error.error.text != undefined &&
                    error.error.text.toString().includes('login-trial-exceeded')
                  ) {
                    this.user_disabled = false;
                    this.localStorageService.clear('pt');
                    this.login_trial_exceeded = true;
                    document
                      .getElementById('bad-credential-message')
                      ?.classList.add('d-block');
                    document
                      .getElementById('bad-credential-message')
                      ?.classList.remove('d-none');
                    document
                      .getElementById('server-error-message')
                      ?.classList.add('d-none');
                    document
                      .getElementById('server-error-message')
                      ?.classList.remove('d-block');
                  } else if (
                    error.error.text != undefined &&
                    error.error.text.toString().includes('user_disabled')
                  ) {
                    console.log('here here');
                    this.login_trial_exceeded = false;
                    this.localStorageService.clear('pt');
                    this.user_disabled = true;
                    document
                      .getElementById('bad-credential-message')
                      ?.classList.add('d-block');
                    document
                      .getElementById('bad-credential-message')
                      ?.classList.remove('d-none');
                    document
                      .getElementById('server-error-message')
                      ?.classList.add('d-none');
                    document
                      .getElementById('server-error-message')
                      ?.classList.remove('d-block');
                  } else {
                    this.login_trial_exceeded = false;
                    this.user_disabled = false;
                    document
                      .getElementById('bad-credential-message')
                      ?.classList.remove('d-block');
                    document
                      .getElementById('bad-credential-message')
                      ?.classList.add('d-none');
                    document
                      .getElementById('server-error-message')
                      ?.classList.add('d-block');
                    document
                      .getElementById('server-error-message')
                      ?.classList.remove('d-none');
                  }
        
                  console.log('error from back: ' + JSON.stringify(error, null, 3))
                }
              );
         
       
            } else {
              console.log('canceled');
            }
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Server error occcur',
          text: 'Something went wrong.',
        });
      });
    
    
    } else {
      this.submitted = true;
      console.log('not valid');
    }
  }
  forSignUp()
  {
    this.router.navigateByUrl('/signup');
  }
  Submit() {
    if (this.forgotForm.valid) {
      this.authService.forgotPassword(this.forgotForm.controls['email']!.value).subscribe(
        (data: any) => {
          if (data == true) {
            Swal.fire({
              icon: 'success',
              title: 'success',
              text: 'Password sent via your email',
            });
            this.forgotForm.reset();
            this.closeModal();
            this.submitted_forgot_password = false;
          }

        },
        (error: any) => {
          if (error.error.text === 'access-token-expired') {
            console.log('Access-token-expired requesting refresh token...');
            if (!this.refresh_token_requested) {
              this.utilService.refreshToken().subscribe(
                (data) => {
                  if (data === true) {
                    console.log(
                      'refresh token success re-requesting the actual request'
                    );
                    this.refresh_token_requested = false;


                    //================================================================================
                    this.authService.forgotPassword(this.forgotForm.controls['email']!.value).subscribe(
                      (data: any) => {
                        if (data == true) {
                          Swal.fire({
                            icon: 'success',
                            title: 'success',
                            text: 'Password sent via your email',
                          });
                          this.forgotForm.reset();
                          this.closeModal();
                          this.submitted_forgot_password = false;
                        }
              
                      },
                      (error: any) => {
                        if (error.error.text === 'access-token-expired') {
                          console.log('refresh token expired.');
                          this.SwalSessionExpired.fire();
                          this._refreshTokenExpired();
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                          });
                          console.log(
                            JSON.stringify(error.error.apierror, null, 2)
                          );
                        }
                      }
                    );
                    //================================================================================
                  } else {
                    console.log('refresh token expired.');
                    this.SwalSessionExpired.fire();
                    this._refreshTokenExpired();
                  }
                },
                (error: any) => {
                  console.log('error refreshing access token');
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                  });
                  console.log(JSON.stringify(error.error.apierror, null, 2));
                }
              );
              this.refresh_token_requested = true;
            }
          }
          else if(error.error.text ==='cannot-send-password-to-the-user'){
            Swal.fire({
              icon: 'error',
              title: 'connection problem',
              text: 'Can not send password via your email',
            });
          }
          else if(error.error.text === 'email-does-not-exist'){
           this.message=true
          }
           else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
            console.log(JSON.stringify(error.error.apierror, null, 2));
          }
        }
      )
    }
    this.submitted_forgot_password = true
  }

  forgotPassword() {
    this.forgot_password_modal.show()
  }
  timeDiff(d1: Date, d2: Date): number {
    console.log('d1' + d1);
    console.log('d2' + d2);
    console.log(
      'the new diff: ' +
        Math.abs(new Date(d1).getTime() - new Date(d2).getTime())
    );
    // console.log('number of digits: ' + d1.toString().length)
    // if (d1.toString().length > d2.toString().length) {
    //   var length_difference = d1.toString().length - d2.toString().length
    // //   // console.log('d1>d2');
    // //   // console.log('number of digits:d1 ' + d1.toString().length)
    // //   // console.log('number of digits:d2 ' + d2.toString().length)
    //   for (var i = 0; i < length_difference; i++)
    //     d2 = Number(d2.toString() + '0');
    // } else if (d1.toString().length < d2.toString().length) {
    //   var length_difference = d2.toString().length - d1.toString().length
    // //   // console.log('d1<d2');
    // //   // console.log('number of digits:d1 ' + d1.toString().length)
    // //   // console.log('number of digits:d2 ' + d2.toString().length)
    //   for (var i = 0; i < length_difference; i++){
    //   // console.log('i: ' + i + ' :diff of length: ' + (d2.toString().length - d1.toString().length))
    //   d1 = Number(d1.toString() + '0');
    //   }
    // }

    // var diff = d1 - d2;
    // console.log('in time diff real: ' + Math.abs(d1 - d2));
    // console.log('number of digits:d1 ' + d1.toString())
    // console.log('number of digits:d2 ' + d2.toString())
    // return Math.abs(d1 - d2);
    return Math.abs(new Date(d1).getTime() - new Date(d2).getTime());
  }
  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }
  detectBrowserVersion() {
    var userAgent = navigator.userAgent,
      tem,
      matchTest =
        userAgent.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];
    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.splice(1).join(' ').replace('OPR', 'Opera');
    }
    matchTest = matchTest[2]
      ? [matchTest[1], matchTest[2]]
      : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null)
      matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }
  _refreshTokenExpired() {
    console.log('logging out');

    this.authService.clearCookies().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          delay(3500);
          this.router.navigateByUrl('/login');
          this.localStorageService.clear('user');
          this.localStorageService.clear('roles');
        } else {
          console.log('login failed 001');
        }
      },
      (error) => {
        console.log(
          'Error: ' + JSON.stringify(error.error.apierror.message, null, 2)
        );
      }
    );
  }
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
