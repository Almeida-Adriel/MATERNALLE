import React from 'react';
import Cookies from 'js-cookie';

class Auth {
    constructor() {
        this.COOKIE_EXPIRATION_DAYS = 1;
    }

    _getCookie(key) {
        return Cookies.get(key); 
    }

    isAuthenticated() {
        let id = this._getCookie('userId'); 

        return id;
    }

    getToken() {
        if(this.isAuthenticated()){
            return this._getCookie('token'); 
        }
    }

    getId() {
        if(this.isAuthenticated()){
            let userId = this._getCookie('userId')
            return userId;
        }
    }

    saveDataLogin(data) {
        if (!!data) {
            const options = { expires: this.COOKIE_EXPIRATION_DAYS, secure: true, sameSite: 'Strict' };
            Cookies.set('userId', data.userId, options)
        }
    }

    clear(){
        Cookies.remove('userId')
    }
}

export default Auth