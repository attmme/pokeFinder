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

  {
    path: '', pathMatch: 'full', redirectTo: 'buscador',
  },
  {
    path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [PublicGuard]
  },
  {
    path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule),
    canActivate: [PublicGuard]
  },
  {
    path: 'buscador', loadChildren: () => import('./buscador/buscador.module').then(m => m.BuscadorPageModule),
    canActivate: [PrivateGuard]
  },
  {
    path: '**', redirectTo: 'buscador',
    // canActivate: [PrivateGuard]
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
