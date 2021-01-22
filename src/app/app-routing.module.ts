import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule) },
  { path: 'perfil', loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule) },
  { path: 'buscador', loadChildren: () => import('./buscador/buscador.module').then(m => m.BuscadorPageModule) },
  { path: 'qr', loadChildren: () => import('./modal-qr-scanner/modal-qr-scanner.module').then(m => m.ModalQrScannerPageModule) },
  { path: '**', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
