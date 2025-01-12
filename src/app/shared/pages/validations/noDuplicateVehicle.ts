import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

export const noDuplicateVehicleValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!(control instanceof FormArray)) {
    return null;
  }

  const allValues = control.controls.map(c => c.value?.toUpperCase().trim()).filter(v => v);
  const duplicates = allValues.filter((item, index) => allValues.indexOf(item) !== index);

  return duplicates.length ? { duplicateVehicle: true } : null;
};

export const crossDuplicateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const bikesArray = control.get('bikes') as FormArray;
  const carsArray = control.get('cars') as FormArray;

  if (!bikesArray || !carsArray) {
    return null;
  }

  const bikesValues = bikesArray.controls.map(c => c.value?.toUpperCase().trim()).filter(v => v);
  const carsValues = carsArray.controls.map(c => c.value?.toUpperCase().trim()).filter(v => v);

  const commonValues = bikesValues.filter(value => carsValues.includes(value));

  return commonValues.length ? { crossDuplicateVehicle: true } : null;
};
