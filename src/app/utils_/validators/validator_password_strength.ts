import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function createPasswordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null

    // const hasUpperCase = /[A-Z]+/.test(control.value)

    // const hasLowerCase = /[a-z]+/.test(control.value)

    // const hasNumeric = /[0-9]+/.test(control.value)

    // const passwordValid =
    //   /[A-Z]+/.test(control.value) &&
    //   /[a-z]+/.test(control.value) &&
    //   /[0-9]+/.test(control.value)

    return !(
      /[A-Z]+/.test(control.value) &&
      /[a-z]+/.test(control.value) &&
      /[0-9]+/.test(control.value)
    )
      ? { passwordStrength: true }
      : null
  }
}
