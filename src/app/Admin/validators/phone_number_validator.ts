import { AbstractControl } from '@angular/forms';

export class phoneNumberValidator {
  constructor() {}
  static MatchValidator(control: AbstractControl) {
    if (!control.get('phonenumber')?.value?.length) return null;
    // if (control.get('password')?.value !== control.get('phonenumber')?.value) {
    //   // console.log('not equal: ' + control.get('password')?.value + " : " + control.get('phonenumber')?.value)
    //   control.get('phonenumber')?.setErrors({ mismatch: true });
    // } else {
    //   console.log('equal');
    // }

    var correct_phone_number =
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (control.get('phonenumber')?.value.match(correct_phone_number)) {
      console.log(true + ': it is phone number');
    } else {
      control.get('phonenumber')?.setErrors({ invalid_phone_number: true });
      console.log(false + ': it is not phone number');
    }

    return null;
  }
}
