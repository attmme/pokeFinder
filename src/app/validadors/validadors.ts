import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class Validadors {

    caractersValids = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    caractersCognomValids = this.caractersValids + " ";

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


    // Cognoms
    cognomMax(cognoms, obj) {

        if (cognoms.length > 40) {
            obj.teError |= (1 << 3);
            return true;
        }

        obj.teError &= ~(1 << 3);
        return false;
    }

    cognomMin(cognoms, obj) {

        if (cognoms.length >= 1 && cognoms.length < 3) {
            obj.teError |= (1 << 4);
            return true;
        }

        obj.teError &= ~(1 << 4);
        return false;
    }

    cognomInvalid(cognoms, obj) {

        let k = 0;

        for (let i = 0; i < cognoms.length; i++) {
            if (this.caractersCognomValids.includes(cognoms[i])) {
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
    edatTipus(edat, obj) {

        if (Number(edat) >= 0 || edat < 0) {
            obj.teError &= ~(1 << 6);
            return false;
        }

        obj.teError |= (1 << 6);
        return true;
    }

    edatMax(edat, obj) {

        if (Number(edat) > 110) {
            obj.teError |= (1 << 7);
            return true;
        }

        obj.teError &= ~(1 << 7);
        return false;
    }

    edatMinim(edat, obj) {

        if (Number(edat) < 0) {
            obj.teError |= (1 << 8);
            return true;
        }

        obj.teError &= ~(1 << 8);
        return false;
    }

    // Nom
    nomMax(nom, obj) {

        if (nom.length > 20) {
            obj.teError |= (1 << 0); // set bit 0
            return true;
        }

        obj.teError &= ~(1 << 0);
        return false;
    }

    nomMin(nom, obj) {

        if (nom.length >= 1 && nom.length < 3) {
            obj.teError |= (1 << 1);
            return true;
        }

        obj.teError &= ~(1 << 1);
        return false;
    }

    nomInvalid(nom, obj) {
        return this.cognomInvalid(nom, obj);
    }
}