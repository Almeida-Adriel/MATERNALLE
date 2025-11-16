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
        console.log('User ID from cookie:', id);

        return id;
    }

    getId() {
        if(this.isAuthenticated()){
            let userId = this._getCookie('userId')
            return userId;
        }
    }

    clear(){
        Cookies.remove('userId');
    }
}

export default Auth