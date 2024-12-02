import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginPage } from './login/login.page';
import { LogoutPage } from './logout/logout.page';

@NgModule({
  declarations: [LoginPage, LogoutPage],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CoreModule { }
