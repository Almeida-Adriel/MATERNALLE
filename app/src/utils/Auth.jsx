import React from 'react';
import Cookies from 'js-cookie';

class Auth {
    constructor() {
        this.COOKIE_EXPIRATION_DAYS = 1;
    }

    _getCookie(key) {
        // Cookies.get() retorna undefined se o cookie não existir
        return Cookies.get(key); 
    }

    isAuthenticated() {
        let email = this._getCookie('userEmail') || localStorage.getItem('userEmail'); 

        let validation = (!!email && email.includes("@"));
        return validation;
    }

    getToken() {
        if(this.isAuthenticated()){
            return this._getCookie('token'); 
        }
    }

    getId() {
        if(this.isAuthenticated()){
            return this._getCookie('userId'); 
        }
    }

    saveDataLogin(data) {
        if (!!data) {
            const options = { expires: this.COOKIE_EXPIRATION_DAYS, secure: true, sameSite: 'Strict' };
            Cookies.set('userEmail', data.userEmail, options)
        }
    }

    clear(){
        Cookies.remove('userEmail')
    }
}

export default Auth