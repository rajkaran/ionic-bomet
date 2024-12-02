import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './core/login/login.page';
import { LogoutPage } from './core/logout/logout.page';
import { NotFoundPage } from './core/not-found/not-found.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./shared/secure-layout/secure-layout.module').then(m => m.SecureLayoutPageModule)
  },
  { path: 'login', component: LoginPage, pathMatch: 'full' },
  { path: 'logout', component: LogoutPage, pathMatch: 'full' },
  { path: '**', component: NotFoundPage },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
