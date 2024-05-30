import { AbstractControl } from '@angular/forms';

export class cr_dr_validator {
  constructor() {
    console.log('error validator');
  }
  static cr_dr_validator(control: AbstractControl) {
    if(control.get('type')?.value == null) return null
    if (
      control.get('type')?.value.toLowerCase() != 'cr' &&
      control.get('type')?.value.toLowerCase() != 'dr'
    ) {
      control.get('type')?.setErrors({ cr_dr_error: true });
    }
    return null;
  }
}
