import { AbstractControl } from '@angular/forms';

export class greaterThan0Validator {
  constructor() {
    console.log('error validator');
  }
  static GreaterThan0Validator(control: AbstractControl) {
    if (control.get('amount')?.value?.length) {
      return null;
    }
    if (control.get('amount')?.value <= 0) {
      control.get('amount')?.setErrors({ lessThan0: true });
    }
    return null;
  }
}
