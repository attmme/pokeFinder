import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class Validadors {

    caractersValids = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ";
    // caractersCognomValids = this.caractersValids + " ";

    constructor() {
    }

    email() {
        return ['', [
            Validators.required,
            // Validators.email,
            Validators.maxLength(40),
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ]];
    }

    // Credencials
    password() {
        return ['', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(32)
        ]];
    }

    // Mirar si els passwords coincideixen 
    checkPasswords(controlName: string, matchingControlName: string, elmClicats) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (control.value != matchingControl.value) {
                elmClicats.confirm = true;
                matchingControl.setErrors({ passwordNotMatch: true });
            } else {
                elmClicats.confirm = false;
            }
        }
    }

    // Nom
    nom() {
        return ['', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern("^[a-z0-9._%+-]$")
        ]];
    }
    nomMax(nom, obj) {

        if (nom == undefined) // afegit nou, provar
        {
            return false;
        }

        if (nom.length > 20) {
            obj.teError |= (1 << 0); // set bit 0
            return true;
        }

        obj.teError &= ~(1 << 0);
        return false;
    }

    nomMin(nom, obj) {

        if (nom == undefined) // afegit nou, provar
        {
            return false;
        }

        if (nom.length >= 1 && nom.length < 3) {
            obj.teError |= (1 << 1);
            return true;
        }

        obj.teError &= ~(1 << 1);
        return false;
    }

    nomInvalid(nom, obj) {

        if (nom == undefined) // afegit nou, provar
        {
            return false;
        }

        return this.cognomInvalid(nom, obj);
    }

    // Cognoms
    cognom() {
        return ['', [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(32),
            Validators.pattern("^[a-z0-9._%+-]$")
        ]];
    }

    cognomMax(cognoms, obj) {

        if (cognoms == undefined) // afegit nou, provar
        {
            return false;
        }

        if (cognoms.length > 40) {
            obj.teError |= (1 << 3);
            return true;
        }

        obj.teError &= ~(1 << 3);
        return false;
    }

    cognomMin(cognoms, obj) {

        if (cognoms == undefined) // afegit nou, provar
        {
            return false;
        }

        if (cognoms.length >= 1 && cognoms.length < 3) {
            obj.teError |= (1 << 4);
            return true;
        }

        obj.teError &= ~(1 << 4);
        return false;
    }

    cognomInvalid(cognoms, obj) {

        let k = 0;

        if (cognoms == undefined) // afegit nou, provar
        {
            return false;
        }

        for (let i = 0; i < cognoms.length; i++) {
            if (this.caractersValids.includes(cognoms[i])) {
                k++;
            }
        }

        if ((k != cognoms.length)) {
            obj.teError |= (1 << 5);
        }
        else {
            obj.teError &= ~(1 << 5);
        }

        return (k != cognoms.length);
    }

    // Edat
    edat() {
        return ['', [
            Validators.required,
            Validators.maxLength(3),
            Validators.max(110),
            Validators.pattern("^[0-9]$")
        ]];
    }
    edatTipus(edat, obj) {

        if (edat == undefined) // afegit nou, provar
        {
            return false;
        }

        if (Number(edat) >= 0 || edat < 0) {
            obj.teError &= ~(1 << 6);
            return false;
        }

        obj.teError |= (1 << 6);
        return true;
    }

    edatMax(edat, obj) {

        if (edat == undefined) // afegit nou, provar
        {
            return false;
        }

        if (Number(edat) > 110) {
            obj.teError |= (1 << 7);
            return true;
        }

        obj.teError &= ~(1 << 7);
        return false;
    }

    edatMinim(edat, obj) {

        if (edat == undefined) // afegit nou, provar
        {
            return false;
        }

        if (Number(edat) < 0) {
            obj.teError |= (1 << 8);
            return true;
        }

        obj.teError &= ~(1 << 8);
        return false;
    }
}