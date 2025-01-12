import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomRegex } from '../../const/validation';
import { NoSpaceValidators } from '../validations/noSpaceValidation';
import { crossDuplicateValidator, noDuplicateVehicleValidator } from '../validations/noDuplicateVehicle';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  vehiclePattern = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
  registrationForm !: FormGroup;
  constructor(private usersServise : UsersService, private router : Router) {

  }

  ngOnInit() {
    this.createregistrationForm();
  }


  createregistrationForm() {
    this.registrationForm = new FormGroup({
      userName: new FormControl(null,
        [
          Validators.required,
          Validators.pattern(CustomRegex.username),
          Validators.minLength(5),
          Validators.maxLength(8),
          NoSpaceValidators.noSpaceControl
        ]
      ),
      email: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.email)]),
      bikes: new FormArray([new FormControl(null, [Validators.required, Validators.pattern(this.vehiclePattern)])],[noDuplicateVehicleValidator]),
      cars: new FormArray([new FormControl(null, [Validators.required, Validators.pattern(this.vehiclePattern)])],[noDuplicateVehicleValidator]),
      password: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.password)])
    }, [crossDuplicateValidator])
  }

  onRegister() {
    if(this.registrationForm.valid){
      this.usersServise.register(this.registrationForm.value).subscribe(res => {
        this.router.navigate(['/home']);
        localStorage.setItem('isLoggedIn', JSON.stringify(true)); // Store true
      })
    }
  }

  get f() {
    return this.registrationForm.controls
  }

  get userName() {
    return this.registrationForm.get("userName") as FormControl;
  }

  get bikesFormArr() {
    return this.registrationForm.get("bikes") as FormArray;
  }

  get carsFormArr() {
    return this.registrationForm.get("cars") as FormArray;
  }

  onAddBike() {
    if (this.bikesFormArr.length < 2) {
      let newBikeControl = new FormControl(null, [Validators.required, Validators.pattern(this.vehiclePattern)]);
      this.bikesFormArr.push(newBikeControl)
    }
  }

  onRemoveBike(i: number) {
    // console.log(i);
    this.bikesFormArr.removeAt(i)
  }

  onAddCar() {
    if (this.carsFormArr.length < 2) {
      let newCarControl = new FormControl(null, [Validators.required, Validators.pattern(this.vehiclePattern)]);
      this.carsFormArr.push(newCarControl)
    }
  }

  onRemoveCar(i: number) {
    // console.log(i);
    this.carsFormArr.removeAt(i)
  }

 
}
