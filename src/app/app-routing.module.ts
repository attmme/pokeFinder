import { TabsPageModule } from './tabs/tabs.module';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PublicGuard } from './shared/guards/public.guard';
import { PrivateGuard } from './shared/guards/private.guard';
import { BuscadorPage } from './buscador/buscador.page';
import { RegisterPage } from './register/register.page';
import { LoginPage } from './login/login.page';
import { PerfilPage } from './perfil/perfil.page';

const routes: Routes = [

  { // Canvier per buscador
    // path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    // path: '', pathMatch: 'full', loadChildren: () => import('./buscador/buscador.module').then(m => m.BuscadorPageModule),
    path: '', pathMatch: 'full', redirectTo: 'buscador',
  },
  {
    path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    /* canActivate: [PublicGuard] */
  },
  {
    path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule),
    /* canActivate: [PublicGuard] */
  },
  {
    path: 'perfil', loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule),
    // canActivate: [PrivateGuard]
  },
  {
    path: 'buscador', loadChildren: () => import('./buscador/buscador.module').then(m => m.BuscadorPageModule),
    //  canActivate: [PrivateGuard] 
  },
  {
    // path: '**', loadChildren: () => import('./buscador/buscador.module').then(m => m.BuscadorPageModule),
    // canActivate: [PrivateGuard] 
    // path: '**', component: BuscadorPage
    path: '**', redirectTo: 'buscador',
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
