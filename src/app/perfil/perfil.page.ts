import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  // Agafar del firebase
  perfil = {
    img: "https://sites.google.com/site/misitiowebdeanimales/_/rsrc/1431934328321/home/aves/pato/animal-hd-collection-329357.jpg",
    nom: "Test",
    cognoms: "T T",
    edat: 1,
  }

  constructor() { }

  ngOnInit() { }

  // Arreglar estils
  // Al clicar l'imatge, puguis agafar un altre de la galeria
  // Cancelar no guarda res i torna al home
  // Aceptar guarda a la bd i 

}
