import { Component, OnInit } from '@angular/core';
import { Iuser } from '../../model/user.interface';
import {  bikes, cars } from '../../const/bikeAndCar';

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

  constructor() { }


  ngOnInit(): void {
    this.carSlot = cars;
    this.bikeSlot = bikes;
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



}
