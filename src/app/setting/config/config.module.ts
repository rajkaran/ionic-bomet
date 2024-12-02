import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ConfigPageRoutingModule } from './config-routing.module';
import { ConfigPage } from './config.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ConfigPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ConfigPage],
  providers: [AppVersion]
})
export class ConfigPageModule {}
