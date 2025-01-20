import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {
  selectedVehicle: string = '';
  isActive : boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { slot: string, vehicleType: string, vehicleNumber: string[], isActive : boolean, userId : number }
  ) {
    console.log(data);
    
  }

  confirmBooking(): void {
    if (this.selectedVehicle) {
      this.dialogRef.close({
        slot: this.data.slot,
        vehicleNumber: this.selectedVehicle,
        vehicleType: this.data.vehicleType,
        isActive : true,
        userId : this.data.userId
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
