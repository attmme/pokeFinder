import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  home_actiu = true;
  perfil_actiu = true;
  buscador_actiu = true;
  

  constructor() {}

}
