import React from 'react';
import Cookies from 'js-cookie';

class Auth {
    constructor() {
        this.COOKIE_EXPIRATION_DAYS = 1;
        this.ROLE_KEY = 'userRole';
    }

    isAuthenticated() {
        let id = this._getCookie('userId'); 

        return id;
    }

    _getCookie(key) {
        return Cookies.get(key); 
    }

    getId() {
        if(this.isAuthenticated()){
            let userId = this._getCookie('userId')
            return userId;
        }
    }

    getUserRole() {
        return this._getCookie(this.ROLE_KEY);
    }

    saveDataLogin(data) {
        if (!!data) {
            const options = { expires: this.COOKIE_EXPIRATION_DAYS, secure: true, sameSite: 'none' };
            Cookies.set('userId', data.userId, options)
            Cookies.set('token', data.token, options)
            Cookies.set(this.ROLE_KEY, data.userRole, options);
        }
    }

    clear(){
        Cookies.remove('userId');
        Cookies.remove('token');
        Cookies.remove(this.ROLE_KEY)
    }
}

export default Auth