import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecureLayoutPage } from './secure-layout.page';

const routes: Routes = [
  {
    path: '',
    component: SecureLayoutPage,
    children: [
      {
        path: 'scan',
        loadChildren: () => import('../../product/search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../../product/manual-search/manual-search.module').then(m => m.ManualSearchPageModule)
      },
      {
        path: 'config',
        loadChildren: () => import('../../setting/config/config.module').then(m => m.ConfigPageModule)
      },
      {
        path: '',
        redirectTo: '/scan',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/scan',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecureLayoutPageRoutingModule {}
