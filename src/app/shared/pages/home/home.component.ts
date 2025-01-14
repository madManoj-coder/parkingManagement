import { Component, OnInit } from '@angular/core';
import { Iuser } from '../../model/user.interface';
import {  bikes, cars } from '../../const/bikeAndCar';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import { ParkingService } from '../../services/parking.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeTab : string = 'bike';
  carSlot !: Array<Iuser>;
  bikeSlot !: Array<Iuser>;
  columns: string[] = ['A', 'B', 'C', 'D'];
  totalBikes : number = 0;
  totalCars : number = 0;
  user: any;
  slots: any[] = [];

  constructor(private dialog: MatDialog, private parkingService : ParkingService, private http : HttpClient) { }


  ngOnInit(): void {
    this.carSlot = cars;
    this.bikeSlot = bikes;
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData);
      this.totalBikes = user.bikes?.length || 0;
      this.totalCars = user.cars?.length || 0;
      console.log(user);
    }
  }

   // ✅ Method to filter car slots by column
   filterCarSlotsByColumn(col: string): Iuser[] {
    return this.carSlot.filter(slot => slot.slot.startsWith(col));
  }

  // ✅ Method to filter bike slots by column
  filterBikeSlotsByColumn(col: string): Iuser[] {
    return this.bikeSlot.filter(slot => slot.slot.startsWith(col));
  }

  selectSection(section: string) {
    this.activeTab = section;
  }

  assignSlot(slot: any, type: 'bike' | 'car'): void {
    
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('No logged-in user found!');
      return;
    }
  
    const user = JSON.parse(userData);
    let vehicleNumbers: string[] = [];
  
    // Get all vehicle numbers based on type
    if (type === 'bike' && user.bikes?.length > 0) {
      vehicleNumbers = user.bikes;
    } else if (type === 'car' && user.cars?.length > 0) {
      vehicleNumbers = user.cars;
    } else {
      alert(`No ${type} available for this user!`);
      return;
    }
  
    // Open the dialog with vehicle options
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '300px',
      data: { 
        slot: slot.slot, 
        type: type, 
        vehicleNumbers: vehicleNumbers 
      }
    });
  
    dialogRef.afterClosed().subscribe((selectedNumber : string)  => {
      if (selectedNumber) {
        slot.isActive = true;
        slot.vehicleNumber = selectedNumber;
        if (slot.isActive) {
          slot.isActive = true;  // Activate the slot
        } else {
          // deactivate on second click
          slot.isActive = false;
        }
        this.updateSlotInBackend(slot);
        alert(`${type} number ${selectedNumber} assigned to slot ${slot.slot}`);
      }
    });
  }
  
  
  updateSlotInBackend(slot: any): void {
    this.http.patch(`http://localhost:3000/slots/${slot.id}`, slot).subscribe(() => {
      console.log('Slot updated in backend');
    });
  }
  


  releaseAllSlots(): void {
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('No logged-in user found!');
      return;
    }
  
    const user = JSON.parse(userData);
  
    this.slots.forEach(slot => {
      if (slot.isActive && slot.userId === user.id) {
        slot.isActive = false;
        slot.vehicleNumber = '';
        slot.userId = '';
        slot.type = '';
  
        // Restore vehicle count
        if (slot.type === 'bike') {
          this.totalBikes++;
        } else if (slot.type === 'car') {
          this.totalCars++;
        }
  
        this.updateSlotInBackend(slot);
      }
    });
  
    alert('All your vehicles have been released.');
  }
  
  
  

}
