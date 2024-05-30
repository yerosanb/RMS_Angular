import { AbstractControl } from '@angular/forms'

export class createPasswordMatchValidator {
  constructor() {}
  static MatchValidator(control: AbstractControl) {
    if (!control.get('confirmpassword')?.value?.length) return null
    if (
      control.get('newpassword')?.value !==
      control.get('confirmpassword')?.value
    ) {
      // console.log('not equal: ' + control.get('password')?.value + " : " + control.get('confirmPassword')?.value)
      control.get('confirmpassword')?.setErrors({ mismatch: true })
    } 
   else if (
      control.get('oldpassword')?.value ==
      control.get('newpassword')?.value
    ) {
      // console.log('not equal: ' + control.get('password')?.value + " : " + control.get('confirmPassword')?.value)
      control.get('newpassword')?.setErrors({ match: true })
    }
    else {
      console.log('equal')
    }
    return null
  }
}
