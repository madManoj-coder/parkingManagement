import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {
  slot: any;
  vehicleNumbers: string[] = []; // Vehicle numbers (bike or car)
  selectedVehicleNumber: string = '';
  selectedVehicleType: string = 'bike'; // Default to bike

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.slot = data.slot;
    this.vehicleNumbers = data.vehicleNumbers; // Receive vehicle numbers based on active tab
    this.selectedVehicleType = data.activeTab; // Set vehicle type based on active tab (bike or car)
    
  }

  // On select vehicle and submit
  parkVehicle(): void {
    this.dialogRef.close({
      vehicleNumber: this.selectedVehicleNumber,
      vehicleType: this.selectedVehicleType
    });
  }

  // On close
  closeDialog(): void {
    this.dialogRef.close();
  }

}
