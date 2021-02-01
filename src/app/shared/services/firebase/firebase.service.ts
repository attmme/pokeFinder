//import { UserService } from './user.service';
//import { Item } from '../interfaces/item';
//import { FirebaseApp } from '@angular/fire';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import { ToastController } from '@ionic/angular';
// import { resolve } from 'dns';
// import { rejects } from 'assert';


@Injectable({
  providedIn: 'root',
})

export class FirebaseService {
  user: Observable<firebase.User>;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastCtrl: ToastController,
  ) {
    this.user = firebaseAuth.authState;
  }

  // Guardar time-task
  task(dades: object) {
    let collection = this.firestore.collection('tasks');
    // -- Agafar l'objecte i canviar aquí el contingut
    collection.doc('test').set({
      prova: 'prova',
    });
  }

  // -- Guardar time-task
  crearEstructuraColeccio(ruta: string, dades: any) {
    let collection = this.firestore.collection(ruta);
    let id_unica = uuidv4();
    return (
      // --  Agafar l'objecte i canviar aquí el contingut
      collection.doc(id_unica).set({ //dades.id.toString()
        nomDocument: id_unica,
        id_llistat_tasques: dades.cssClass.split(';')[1], // cssClass element[1] = id llistat tasques
        data_inici: dades.start,
        data_final: dades.end,
        color: dades.color,
        titol: dades.title,
      })
    );
  }

  // Llegir coleccio
  readColl(name) {
    let collection = this.firestore.collection(name);
    return collection
      .get()
      .toPromise()
      .then((data) => data.docs.map((el) => el.data()));
  }

  // tamany colecció
  collLength(ruta) {
    let collection = this.firestore.collection(ruta);
    return collection
      .get()
      .toPromise()
      .then((data) => data.docs.map((el) => el.data()).length.toString());
  }

  removeCollUsuari(id:string, tamany) {

    let ruta = `/users/${id}/pokemons/`;

    return new Promise((resolve, reject) => {

      for (let i = 0; i < tamany; i++) {
        let deleteDoc = this.firestore.collection(ruta).doc(i.toString()).delete();
      }

      this.firestore.collection('/users/').doc(id).delete();

      resolve("");
    });

  }

  // Escriure document
  writeDoc(ruta_coleccio, doc_id: string, obj) {
    let coleccio = this.firestore.collection(ruta_coleccio);
    coleccio.doc(doc_id).set(obj);
  }

  // Llegir document
  readDoc(name, id) {
    let collection = this.firestore.collection(name).doc(id);
    // -- old: this.firestore.collection(`users/${id_usuari}/tasks`).doc(id).delete();
    return collection.get().toPromise();
  }

  llegir_tasques_usuari(id_usuari) {
    let collection = this.firestore.collection(`users/${id_usuari}/tasks`);
    return collection
      .get()
      .toPromise()
      .then((data) => data.docs.map((el) => el.data()));
  }

  // Registro
  registrar(dades) {
    return this.firebaseAuth
      .createUserWithEmailAndPassword(dades.email, dades.password)
      .then((value) => {

        // -- S'afegeix a la colecció users (bdd) un nou document (taula) amb la id de l'usuari registrat
        let obj_users = {
          nom: '',
          cognoms: '',
          edat: '',
        };
        this.writeDoc('users', value.user.uid, obj_users);


        //  Creem una estructura per als pokemon, li donem el pikachu
        let ruta = `users/${value.user.uid}/pokemons`;

        let obj = {
          index: '0',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
          id: 25,
          name: 'Pikachu',
          height: 4,
          weight: 60,
          base_experience: 112,
          type: 'electric',
        };
        this.writeDoc(ruta, obj.index, obj);
      });
  }

  eliminarUsuari() {
    let user = firebase.auth().currentUser;

    return user.delete();
  }

  // Eliminar document
  delete(id_usuari: string, nom_document: string) {
    return this.firestore
      .collection(`users/${id_usuari}/tasks`)
      .doc(nom_document)
      .delete();
  }

  // Login
  login(email: string, password: string) {
    // -- Retornem una promesa, es consumeix en login.form.component
    return this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  // Logout
  logout() {
    localStorage.removeItem('userId');
    this.firebaseAuth.signOut().then().catch();
  }

  updateUsuari(id, objecte) {

    if(objecte.nom == undefined)
    {
      objecte.nom = '';
    }
    if(objecte.cognoms == undefined)
    {
      objecte.cognoms = '';
    }
    if(objecte.edat == undefined)
    {
      objecte.edat = '';
    }
    if(objecte.imatge == undefined || objecte.imatge == '')
    {
      objecte.imatge = '/assets/profile/avatar.png';
    }

    this.firestore.collection('/users/').doc(id).set(objecte);
  }

  async avis(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2500
    });
    toast.present();
  }
}
