import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManualSearchPage } from './manual-search.page';

const routes: Routes = [
  {
    path: '',
    component: ManualSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManualSearchPageRoutingModule {}
