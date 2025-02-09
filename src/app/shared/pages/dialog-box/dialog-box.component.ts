import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {
  id: string;
  vehicleNumbers: string[] = []; // Vehicle numbers (bike or car)
  selectedVehicleNumber: string = '';
  selectedVehicleType: string = ''; // Vehicle type dynamically set

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
    this.vehicleNumbers = data.activeVehicles; // Only active tab's vehicles
    this.selectedVehicleType = data.vehicleType; // 'bike' or 'car'
    console.log(data);
    
  }

  // Submit selected vehicle
  parkVehicle(): void {
    if (!this.selectedVehicleNumber) {
      alert("Please select a vehicle number.");
      return;
    }

    this.dialogRef.close({
      id : this.id,
      vehicleNumber: this.selectedVehicleNumber,
      vehicleType: this.selectedVehicleType
    });
  }

  // Close dialog
  closeDialog(): void {
    this.dialogRef.close();
  }

}
