import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cardCountValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const count = value ? value.length : 0;

    if (!count || count < min || count > max) {
      return { 'cardCount': true };
    }

    return null;
  };
}

export function duplicateCardValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cards = control.value;

    if (!cards) {
      return null;
    }

    const duplicates = cards.filter((card, index, array) =>
      array.indexOf(card) !== index
    );

    if (duplicates.length > 0) {
      return { 'duplicateCard': true };
    }

    return null;
  };
}
