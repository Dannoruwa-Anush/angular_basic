import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    // Angular Material imports
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
  ],
  exports: [
    // Re-export these for use in other modules
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
  ]
})
export class MaterialModule { }
