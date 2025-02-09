import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { ParkingService } from '../../services/parking.service';
import { Slot } from '../../model/user.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  bikeSlots: Slot[] = [];
  carSlots: Slot[] = [];
  activeTab: string = 'bike';
  bikesCount: number = 0;
  carsCount: number = 0;
  user : any = {};

  constructor(
    private dialog: MatDialog, private userService: UsersService, private parkingService: ParkingService
  ) { }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // Get count of bikes and cars
    console.log(this.user);
    this.bikesCount = this.user.bikes.filter((bike: any) => bike !== null).length;
    this.carsCount = this.user.cars.filter((car: any) => car !== null).length;

    forkJoin({
      carSlots: this.parkingService.getSlots('car'),
      bikeSlots: this.parkingService.getSlots('bike')
    }).subscribe(result => {
      this.carSlots = result.carSlots;
      this.bikeSlots = result.bikeSlots;
    });

  }


  openSlotDialog(slot: any): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(this.user);

    // Get the logged-in user's vehicles based on the active tab (bike or car)
    const userVehicles = this.activeTab === 'bike' ? this.user.bikes || [] : this.user.cars || [];

    // Use forkJoin to get both car and bike slots in parallel
    forkJoin({
      carSlots: this.parkingService.getSlots('car'),
      bikeSlots: this.parkingService.getSlots('bike')
    }).subscribe(result => {
      // Combine the results from car and bike slots
      const allSlots = [...result.carSlots, ...result.bikeSlots];

      // Mark active slots based on the logged-in user's vehicles
      const updatedSlots = allSlots.map(slot => {
        if (userVehicles.includes(slot.vehicleNumber)) {
          slot.isActive = true;
        } else {
          slot.isActive = false;
        }
        return slot;
      });

      // Filter out active (parked) vehicles
      const parkedVehicles = updatedSlots
        .filter(s => s.isActive)  // Get only active (parked) slots
        .map(s => s.vehicleNumber); // Extract parked vehicle numbers

      // Filter out parked vehicles from user's list
      const availableVehicles = userVehicles.filter((num: any) => !parkedVehicles.includes(num));

      // Check if the clicked slot is already occupied by the logged-in user's vehicle
      const isSlotOccupiedByUser = userVehicles.includes(slot.vehicleNumber);

      // If the slot is already occupied by the user, prevent opening the dialog
      if (isSlotOccupiedByUser) {
        return; // Do nothing, dialog will not open
      }

      // Open dialog box with filtered vehicles
      const dialogRef = this.dialog.open(DialogBoxComponent, {
        data: {
          id: slot.id,
          vehicleType: this.activeTab, // 'bike' or 'car'
          activeVehicles: availableVehicles, // Filtered vehicles only
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Call API to update parking slot with the selected vehicle
          this.parkingService.updateParkingSlot(slot.id, result.vehicleNumber, this.user.id, result.vehicleType)
            .subscribe(response => {
              console.log('Parking Updated:', response);
              // Update the slot with new vehicle number and set it as active
              slot.isActive = true;
              slot.vehicleNumber = result.vehicleNumber;

              if (result.vehicleType === 'bike') {
                this.user.bikes = this.user.bikes.filter((bike: any) => bike !== result.vehicleNumber);
                this.bikesCount = this.user.bikes.length;  // Update bikes count
              } else if (result.vehicleType === 'car') {
                this.user.cars = this.user.cars.filter((car: any) => car !== result.vehicleNumber);
                this.carsCount = this.user.cars.length;  // Update cars count
              }

              // Update localStorage so changes persist
              localStorage.setItem('user', JSON.stringify(this.user));
            });
        }
      });
    });
  }
  


  toggleTab(tab: string): void {
    this.activeTab = tab;
  }

  selectSection(section: string) {
    this.activeTab = section;
  }



}
