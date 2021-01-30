
export class Validadors {

    caractersValids = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    caractersCognomValids = this.caractersValids + " ";

    constructor() {
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

        let j = 0;

        for (let i = 0; i < nom.length; i++) {
            if (this.caractersValids.includes(nom[i])) {
                j++;
            }
        }

        if ((j != nom.length)) {
            obj.teError |= (1 << 2);
        }
        else {
            obj.teError &= ~(1 << 2);
        }

        return (j != nom.length);
    }
}