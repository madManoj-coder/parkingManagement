import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { HttpClient } from '@angular/common/http';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import Swal from 'sweetalert2';
import { Slot } from '../../model/user.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  bikeSlots: Slot[] = [];  // Array to store slots
  carSlots: Slot[] = [];  // Array to store slots
  columns = ['A', 'B', 'C', 'D'];  // Parking slot columns (you can add more if needed)
  totalRows = 12;
  activeTab: string = 'bike';
  bikesCount: number = 0;
  slots: any[] = [];
  activeBikes: string[] = [];
  carsCount: number = 0;
  user: any = {};

  constructor(
    private dialog: MatDialog, private userService: UsersService
  ) { }

  ngOnInit(): void {
    this.loadSlots()
    // this.bikeSlots = this.generateSlots('bike', this.totalRows, this.columns.length);
    // this.carSlots = this.generateSlots('car', this.totalRows, this.columns.length);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Get count of bikes and cars
    this.bikesCount = user.bikes ? user.bikes.length : 0;
    this.carsCount = user.cars ? user.cars.length : 0;

    // let bikeNumbers = user.bikes;
    // console.log(bikeNumbers);

    // let carNumbers = user.cars;
    // console.log(carNumbers);

    // this.getActiveBikes();
    // this.getActiveCars();
  
  }

  // getActiveBikes(): void {
  //   if (this.user && this.user.bikes) {
  //     this.bikesCount = this.user.bikes.length;
  //   } else {
  //     this.bikesCount = 0;  // Default to 0 if no bikes exist
  //   }
  // }

  // // Method to retrieve active cars
  // getActiveCars(): void {
  //   if (this.user && this.user.cars) {
  //     this.carsCount = this.user.cars.length;
  //   } else {
  //     this.carsCount = 0;  // Default to 0 if no cars exist
  //   }
  // }

  loadSlots() {
    // Step 1: Get user data (bikes and cars) from localStorage
    let user = JSON.parse(localStorage.getItem('user') || '{}');

    // Step 2: Initialize slots (A1 to D12) dynamically
    this.slots = [];
    for (let i = 1; i <= 12; i++) {
      this.slots.push({
        slotName: `A${i}`,
        isOccupied: false,  // Initially, no slots are occupied
        vehicleType: '',    // Can be 'bike' or 'car'
        vehicleNumber: ''   // The vehicle number (bike or car)
      });
    }

    // Step 3: Assign bikes to slots
    let i = 0;
    for (i = 0; i < user.bikes.length; i++) {
      this.slots[i].isOccupied = true;
      this.slots[i].vehicleType = 'bike';
      this.slots[i].vehicleNumber = user.bikes[i];
    }

    // Step 4: Assign cars to slots (after bikes)
    let j = 0;
    for (j = 0; j < user.cars.length; j++) {
      if (i < this.slots.length) {  // Ensure we don't exceed the available slot count
        this.slots[i].isOccupied = true;
        this.slots[i].vehicleType = 'car';
        this.slots[i].vehicleNumber = user.cars[j];
        i++;
      }
    }

    // Optionally log the slots to check the result
    console.log(this.slots);  // You can remove this once you verify it's working correctly
  }

  parkVehicle(vehicleNumber: string): void {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.bikes) {
      user.bikes = user.bikes.filter((bike : string) => bike !== vehicleNumber);  // Remove bike from the list
    } else if (user && user.cars) {
      user.cars = user.cars.filter((car: string) => car !== vehicleNumber);  // Remove car from the list
    }
  
    // Update the user data in localStorage
    localStorage.setItem('user', JSON.stringify(user));
  
    // After parking a vehicle, refresh the slots
    this.loadSlots();  // refresh the slots after the change
  }
  

  openSlotDialog(slot: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user);
    
    
    // Check for bike and car numbers in localStorage
    this.bikesCount = user.bikes.length;
    console.log(this.bikesCount);
    
    this.carsCount = user.cars.length;
    

    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {
        slot: slot,
        bikes: this.bikesCount,
        cars: this.carsCount,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the slot based on dialog result
        slot.isOccupied = true;
        slot.vehicleNumber = result.vehicleNumber;
        slot.vehicleType = result.vehicleType;
      }
    });
  }
  

  removeVehicle(slot: Slot): void {
    // Check if the slot is occupied
    if (slot.isOccupied) {
      let user = JSON.parse(localStorage.getItem('user') || '{}');
  
      // Remove the vehicle from the corresponding array (bikes or cars)
      if (slot.vehicleType === 'bike') {
        user.bikes = user.bikes.filter((bike : string) => bike !== slot.vehicleNumber);
      } else if (slot.vehicleType === 'car') {
        user.cars = user.cars.filter((car : string) => car !== slot.vehicleNumber);
      }
  
      // Mark the slot as unoccupied
      slot.isOccupied = false;
      slot.vehicleNumber = '';
      slot.vehicleType = slot.vehicleType
  
      // Save the updated user data to localStorage
      localStorage.setItem('user', JSON.stringify(user));
  
      // Refresh the slots
      this.loadSlots();
    } else {
      alert('Slot is already empty!');
    }
  }

  openDialog(slot: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let vehicleNumbers = this.activeTab === 'bike' ? user.bikes : user.cars;

    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '300px',
      data: {
        slot: slot,
        vehicleNumbers: vehicleNumbers
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the slot with the selected vehicle number
        slot.vehicleNumber = result;
        slot.isOccupied = true;
      }
    });
  }
  
  toggleTab(tab: string): void {
    this.activeTab = tab;
    this.loadSlots();
  }

  updateVehicleCounts() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Get count of bikes and cars
    this.bikesCount = user.bikes ? user.bikes.length : 0;
    this.carsCount = user.cars ? user.cars.length : 0;

    let bikeNumbers = user.bikes;
    console.log(bikeNumbers);

    let carNumbers = user.cars;
    console.log(carNumbers);
  }

  // generateSlots(vehicleType: 'bike' | 'car', totalRows: number, totalColumns: number): Slot[] {
  //   const slots: Slot[] = [];

  //   // Loop through each row and column to create slots dynamically
  //   for (let row = 1; row <= totalRows; row++) {
  //     for (let col of this.columns) {
  //       const slotId = `${col}${row}`; // Format slot ID as A1, B2, etc.
  //       const slot: Slot = {
  //         vehicleType: vehicleType,
  //         slotId: slotId,
  //         isOccupied: false,        // Initially, all slots are available
  //         vehicleNumber: '',        // No vehicle is assigned initially     // Initially, all slots are available
  //       };
  //       slots.push(slot);
  //     }
  //   }
  //   return slots;
  // }


  // openDialog(slot: Slot): void {
  //   // Open a dialog for vehicle selection
  //   const dialogRef = this.dialog.open(DialogBoxComponent, {
  //     data: { slotId: slot.slotId, vehicleType: 'bike' }  // Pass data to dialog
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // If user selects a vehicle and parks, update slot state
  //       this.updateSlot(slot, result.vehicleNumber);
  //     }
  //   });
  // }

  updateSlot(slot: Slot, vehicleNumber: string): void {
    slot.isOccupied = true;  // Mark slot as occupied
    slot.vehicleNumber = vehicleNumber;  // Assign vehicle number
    localStorage.setItem('bikeSlots', JSON.stringify(this.bikeSlots));  // Save to local storage
  }


  selectSection(section: string) {
    this.activeTab = section;
  }

  releaseAllSlots() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    let allSlots = this.slots;

    // Loop through all slots and mark them as available
    allSlots.forEach(slot => {
      if (slot.vehicleType === 'bike' || slot.vehicleType === 'car') {
        slot.isOccupied = false;
        slot.vehicleType = '';
        slot.vehicleNumber = '';
      }
    });

    // Update the user data in localStorage (clear all bikes and cars)
    user.bikes = [];
    user.cars = [];
    localStorage.setItem('user', JSON.stringify(user));

    console.log('All slots released');
    console.log(this.slots);
  }


  updateSlotState(slot: any, vehicleType: string, vehicleNumber: string) {
    // Find the slot in the slots array
    let slotIndex = this.slots.findIndex(s => s.slotName === slot.slotName);
    if (slotIndex !== -1) {
      // Update the slot's state
      this.slots[slotIndex].isOccupied = true;
      this.slots[slotIndex].vehicleType = vehicleType;
      this.slots[slotIndex].vehicleNumber = vehicleNumber;

      // Save updated slots to localStorage
      let user = JSON.parse(localStorage.getItem('user') || '{}');

      // Update the user object in localStorage (adding the vehicle to the occupied slots)
      if (vehicleType === 'bike') {
        user.bikes.push(vehicleNumber);
      } else if (vehicleType === 'car') {
        user.cars.push(vehicleNumber);
      }

      // Save the updated user data to localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Optionally log the updated slots and user data
      console.log(this.slots);
      console.log(user);
    }
  }



}
