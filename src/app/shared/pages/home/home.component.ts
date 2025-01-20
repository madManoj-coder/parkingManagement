import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { Iuser } from '../../model/user.interface';
import { bikes, cars } from '../../const/bikeAndCar';
import { HttpClient } from '@angular/common/http';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  bikeSlots: Iuser[] = [];
  carSlots: Iuser[] = [];
  activeTab: string = 'bike';
  columns: string[] = ['A', 'B', 'C', 'D'];
  totalBikes: number = 0;
  totalCars: number = 0;
  loggedInUserId !: string;
  userId !: number;
  isActive !: boolean;
  userBikes: string[] = [];
  userCars: string[] = [];
  currentUserId: number | null = null;

  constructor(
    private dialog: MatDialog, private userService: UsersService
  ) { }


  ngOnInit(): void {
    this.initializeSlots();
    this.loadUserData();
  }



  initializeSlots(): void {
    this.bikeSlots = bikes.map(slot => ({
      ...slot,
      isActive: false, // Slots are inactive by default
      userId: null, // No user owns the slot initially
      vehicleNumber: null, // No vehicle is assigned initially
    }));
  
    this.carSlots = cars.map(slot => ({
      ...slot,
      isActive: false,
      userId: null,
      vehicleNumber: null,
    }));
  }
  


  loadUserData(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      console.log(user);
      this.loggedInUserId = user.id;
      console.log(this.loggedInUserId);
      this.userId = user.userId;
      this.userBikes = user.bikes || [];
      this.userCars = user.cars || [];
      this.totalBikes = this.userBikes.length;
      this.totalCars = this.userCars.length;
    }
  }


  // Open Dialog on Slot Click
  openBookingDialog(slot: string, vehicleType: 'car' | 'bike'): void {
    const slots = vehicleType === 'car' ? this.carSlots : this.bikeSlots;
    const selectedSlot = slots.find(s => s.slot === slot);
  
    // Prevent interaction if the slot is active and belongs to another user
    if (selectedSlot?.isActive && selectedSlot.userId !== this.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You cannot book or modify this slot.',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    const availableVehicles = this.getAvailableVehicles(vehicleType);
  
    if (availableVehicles.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No Vehicles Available',
        text: `No available ${vehicleType}s left to book.`,
        confirmButtonText: 'OK',
      });
      return;
    }
  
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {
        slot: slot,
        vehicleType: vehicleType,
        isActive : true,
        vehicleNumber: availableVehicles,
      },
    });
  
    dialogRef.afterClosed().subscribe(selectedVehicle => {
      if (selectedVehicle) {
        // Update the slot directly in the array
        const targetSlot = slots.find(s => s.slot === selectedVehicle.slot);
        if (targetSlot) {
          targetSlot.isActive = true; // Mark the slot as active
          targetSlot.vehicleNumber = selectedVehicle.vehicleNumber; // Assign the selected vehicle
          // targetSlot.vehicleType = selectedVehicle.vehicleType; // Set the vehicle type
          targetSlot.userId = selectedVehicle.userId;
          if (vehicleType === 'car') {
            this.userCars = this.userCars.filter(car => car !== targetSlot.vehicleNumber);
            this.totalCars = this.userCars.length; // Update car count
          } else {
            this.userBikes = this.userBikes.filter(bike => bike !== targetSlot.vehicleNumber);
            this.totalBikes = this.userBikes.length; // Update bike count
          }
        }
      }
      console.log(selectedVehicle);
      this.userService.parkVehicle(selectedVehicle).subscribe(res => {
        console.log(res);
        localStorage.setItem('parkObj', JSON.stringify(res))
      })
    });
  }


  getAvailableVehicles(vehicleType: 'car' | 'bike'): string[] {
    // Choose the right slots based on vehicle type
    const slots = vehicleType === 'car' ? this.carSlots : this.bikeSlots;
  
    // Filter out the booked vehicles for the logged-in user
    const bookedVehicles = slots.filter(s => s.isActive && s.userId === this.userId).map(s => s.vehicleNumber);
  
    // Return the list of vehicles the user has, excluding the ones already booked
    return vehicleType === 'car'
      ? this.userCars.filter(car => !bookedVehicles.includes(car))
      : this.userBikes.filter(bike => !bookedVehicles.includes(bike));
  }
  
  


  // Book Slot
  bookSlot(slot: string, vehicleType: 'car' | 'bike', vehicleNumber: string): void {
    const slots = vehicleType === 'car' ? this.carSlots : this.bikeSlots;
    const selectedSlot = slots.find(s => s.slot === slot);
  
    if (selectedSlot) {
      // Only allow booking if the logged-in user is booking the slot
      if (selectedSlot.userId === this.userId || !selectedSlot.isActive) {
        selectedSlot.isActive = true; // Mark the slot as active
        selectedSlot.userId = this.userId; // Assign the logged-in user ID
        selectedSlot.vehicleNumber = vehicleNumber; // Assign the vehicle number
  
        // Update user's available vehicles
        if (vehicleType === 'car') {
          this.userCars = this.userCars.filter(car => car !== vehicleNumber);
          this.totalCars = this.userCars.length; // Update car count
        } else {
          this.userBikes = this.userBikes.filter(bike => bike !== vehicleNumber);
          this.totalBikes = this.userBikes.length; // Update bike count
        }
      } else {
        // Show an error if another user owns the slot
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'This slot is already booked by another user.',
          confirmButtonText: 'OK',
        });
      }
    }
  }
  

  // Filter Available Vehicles (Exclude Already Booked)
  getAvailableSlots(vehicleType: 'car' | 'bike'): Iuser[] {
    const slots = vehicleType === 'car' ? this.carSlots : this.bikeSlots;
    return slots.filter(
      slot => !slot.isActive || slot.userId === this.userId // Include inactive slots or slots owned by the user
    );
  }
  
  // Example usage in template
  filterCarSlotsByColumn(col: string): Iuser[] {
    return this.getAvailableSlots('car').filter(slot => slot.slot.startsWith(col));
  }
  
  filterBikeSlotsByColumn(col: string): Iuser[] {
    return this.getAvailableSlots('bike').filter(slot => slot.slot.startsWith(col));
  }

  selectSection(section: string) {
    this.activeTab = section;
  }
  



}
