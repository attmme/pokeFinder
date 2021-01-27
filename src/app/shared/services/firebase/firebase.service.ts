//import { UserService } from './user.service';
//import { Item } from '../interfaces/item';
//import { FirebaseApp } from '@angular/fire';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root',
})

export class FirebaseService {
  user: Observable<firebase.User>;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private firestore: AngularFirestore,
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
      .then((data) => data.docs.map((el) => el.data()).length );
  }

  // Escriure document
  writeDoc(ruta_coleccio, doc_id, obj) {
    let coleccio = this.firestore.collection(ruta_coleccio);
    coleccio.doc(doc_id).set(obj);
  }

  // Llegir document
  readDoc(name, id) {
    let collection = this.firestore.collection(name);
    // -- old: this.firestore.collection(`users/${id_usuari}/tasks`).doc(id).delete();
    return collection.doc(id).get().toPromise();
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

        /*  let collection = this.firestore.collection('users');
 
         collection.doc(value.user.uid).set({
           email: dades.email,
           user: dades.nom,
         }); */


        //  Creem una estructura per als pokemon, li donem el pikachu
        /*        
         let pokellection = this.firestore.collection(`users/${value.user.uid}/pokemons`);
                
                pokellection.doc('0').set({
                  id: 0,
                  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
                  index: 25,
                  name: 'Pikachu',
                }); 
        */

        // -- S'afegeix a la colecció users (bdd) un nou document (taula) amb la id de l'usuari registrat
        let obj_users = {
          email: dades.email,
          user: dades.nom,
        };

        this.writeDoc('users', value.user.uid, obj_users);

        //  Creem una estructura per als pokemon, li donem el pikachu
        let ruta = `users/${value.user.uid}/pokemons`;

        let obj = {
          id: 0,
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
          index: 25,
          name: 'Pikachu',
        };

        this.writeDoc(ruta, obj.id, obj);
      });
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
  }

  usuariActual() {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.onAuthStateChanged(user => {
        resolve(user);
        /*       if (user) {
                return user;
              } else {
                console.log("NO ESTA LOGIN")
                return false;
              } */
      });

    });
  }
}
