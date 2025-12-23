import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../custom_modules/material/material-module';

@Component({
  selector: 'app-reactive-brand-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './reactive-brand-component.html',
  styleUrl: './reactive-brand-component.scss',
})
export class ReactiveBrandComponent {

}
