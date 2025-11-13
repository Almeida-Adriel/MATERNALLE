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

    getId() {
        if(this.isAuthenticated()){
            let userId = this._getCookie('userId')
            return userId;
        }
    }

    saveDataLogin(data) {
        if (!!data) {
            const options = { expires: this.COOKIE_EXPIRATION_DAYS, secure: true, sameSite: 'none' };
            Cookies.set('userId', data.userId, options)
            Cookies.set('token', data.token, options)
        }
    }

    clear(){
        Cookies.remove('userId')
    }
}

export default Auth