import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecureLayoutPageRoutingModule } from './secure-layout-routing.module';
import { SecureLayoutPage } from './secure-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecureLayoutPageRoutingModule
  ],
  declarations: [SecureLayoutPage]
})
export class SecureLayoutPageModule {}
