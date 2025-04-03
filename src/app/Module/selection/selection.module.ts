import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectionRoutingModule } from './selection-routing.module';
import { MdmModulesComponent } from 'src/app/Views/mdm-modules/mdm-modules.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MdmModulesComponent],
  imports: [
    CommonModule,
    SelectionRoutingModule,
   
  ]
})
export class SelectionModule { }
