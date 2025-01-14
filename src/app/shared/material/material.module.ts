import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatGridListModule, MatDialogModule
  ],
  exports : [MatToolbarModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatGridListModule, MatDialogModule]
})
export class MaterialModule { }
