import { AbstractControl, Validators } from "@angular/forms";




export class NoSpaceValidators {
    
    static noSpaceControl(controls: AbstractControl): Validators | null {
        if(!controls.value){
            return null;
        }

        if(controls.value.includes(' ')){
            return {
                noSpaceErr : "space is not allowed"
            }
        }else{
            return null;
        }
    }
}