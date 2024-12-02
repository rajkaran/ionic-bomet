import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManualSearchPageRoutingModule } from './manual-search-routing.module';

import { ManualSearchPage } from './manual-search.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ManualSearchPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ManualSearchPage]
})
export class ManualSearchPageModule {}
