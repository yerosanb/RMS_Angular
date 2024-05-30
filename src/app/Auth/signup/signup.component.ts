import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { CheckEmailExistPayload } from 'src/app/Admin/payloads/admin_check_email_exist_payload';
import { RegisterActorPayload } from 'src/app/Admin/payloads/register_actor_payload';
import { Roles } from 'src/app/Admin/payloads/roles_payload';
import { AdminService } from 'src/app/Admin/services/admin.service';
import { phoneNumberValidator } from 'src/app/Admin/validators/phone_number_validator';
import { AuthService } from 'src/app/services/auth-service.service';
import { UtilService } from 'src/app/services/util-service/util.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  //Swal Config
  @ViewChild('SwalSessionExpired')
  public readonly SwalSessionExpired!: SwalComponent;
  @ViewChild('SuccessSwalRegisterUser')
  public readonly SuccessSwalRegisterUser!: SwalComponent;
  @ViewChild('SuccessSwalUpdateUser')
  public readonly SuccessSwalUpdateUser!: SwalComponent;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  user_id: any;
  user_role: any;
  slect_role: boolean = false;

  //form and other
  registerForm!: FormGroup;
  submitted: boolean = false;
  emailChecked: boolean = false;
  registerActorPayload: RegisterActorPayload;
  checkEmailExistPayload!: CheckEmailExistPayload;
  roles!: Roles[];
  role_selected!: string;
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.user_role = this.activatedRoute.snapshot.paramMap.get('role');
    this.checkEmailExistPayload = {
      email: '',
    };
    this.registerActorPayload = {
      id: null,
      firstname: '',
      middlename: '',
      lastname: '',
      gender: '',
      email: '',
      phonenumber: '',
      role: '',
    };
    // this.role_selected = '1';

    this.registerForm = this.formBuilder.group(
      {
        firstname: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z/]*'),
        ]),
        middlename: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z/]*'),
        ]),
        lastname: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z/]*'),
        ]),
        gender: new FormControl('Male'),
        email: new FormControl('', [
          Validators.required,
          Validators.maxLength(320),
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.]+@awashbank.com$'),
         
        ]),
        phonenumber: new FormControl('', [Validators.required]),
        // role: new FormControl('', [Validators.required]),
      },
      { validators: phoneNumberValidator.MatchValidator }
    );
  }
  onSubmit() {

    if (
      this.registerForm.valid
    ) {

      this.registerActorPayload = this.registerForm.value;
      console.log(
        'values' + JSON.stringify(this.registerActorPayload, null, 2)
      );
      this.authService.checkEmailExist(this.registerActorPayload.email).subscribe(
        (data: Boolean) => {
          if (data == true) {
            Swal.fire({
              icon: 'error',
              title: 'Duplication',
              text: 'User already create account',
            });
          } else if (data == false) {
            this.registerActor(this.registerActorPayload);
          }
        },
      );
    } else this.submitted = true;
  }

  registerActor(registerActorPayload: RegisterActorPayload) {
    console.log(
      'Payload: ' + JSON.stringify(this.registerActorPayload, null, 2)
    );
    this.authService.signUp(registerActorPayload).subscribe(
      async (data: any) => {
        if (data == true) {
          this.SuccessSwalRegisterUser.fire();
          this.registerForm.reset();
          this.router.navigateByUrl('/login');
          this.registerForm.controls['gender'].setValue('Male');
          this.submitted = false;
          console.log('register success: ' + data);
        } else if(data==false) {
          Swal.fire({
            icon: 'error',
            title: 'Permission',
            text: 'You are not permitted to perform this action!',
          });
        }else {
          Swal.fire({
            icon: 'error',
            title: 'Error happen',
            text: 'Something went wrong!',
          });
        }
      },
      (error) => {
      }
    );
  }

}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



