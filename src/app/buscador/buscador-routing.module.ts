import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscadorPage } from './buscador.page';

const routes: Routes = [
  {
    path: '',
    component: BuscadorPage,
 /*    children: [
       {
         path: 'buscador',
         loadChildren: () => import('../tabs/tabs.module').then(m => m.TabsPageModule)
       }
     ] */
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscadorPageRoutingModule {}
