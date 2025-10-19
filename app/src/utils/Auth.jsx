import React from 'react';
import Cookies from 'js-cookie';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

class Auth {
    constructor() {
        // this.TOKEN_EXPIRATION_TIME = 6000  // 6 segundos para teste
        this.TOKEN_EXPIRATION_TIME = 3600000 * 24;

        this.COOKIE_EXPIRATION_DAYS = 1;
    }

    _getCookie(key) {
        // Cookies.get() retorna undefined se o cookie não existir
        return Cookies.get(key); 
    }

    isAuthenticated() {
        let token = this._getCookie('token');
        let email = this._getCookie('userEmail');
        let lastLogin = this._getCookie('lastLogin');

        let validation = (!!token && token.length > 100 && (email && email.includes("@")))
        
        // Verifica tempo de expiração
        const timeValidation = lastLogin && (Date.now() - parseInt(lastLogin)) < this.TOKEN_EXPIRATION_TIME;
        
        if (!timeValidation && validation) {
            this.showSessionExpiredNotification();
            this.clear()
        }

        return (validation && timeValidation)
    }

    getToken() {
        if(this.isAuthenticated()){
            return this._getCookie('token'); 
        }
    }

    saveDataLogin(data) {
        if (!!data) {
            const options = { expires: this.COOKIE_EXPIRATION_DAYS, secure: true, sameSite: 'Strict' };
            
            // Define o cookie com opções de segurança e tempo de vida (1 dia)
            Cookies.set('token', data.token, options)
            Cookies.set('userEmail', data.userEmail, options)
            // O tempo de login deve expirar junto com o cookie
            Cookies.set('lastLogin', Date.now().toString(), options); 
        }
    }

    clear(){
        Cookies.remove('token')
        Cookies.remove('userEmail')
        Cookies.remove('lastLogin')
    }

    showSessionExpiredNotification() {
        return (
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert variant="outlined" severity="warning">
                    Sessão Expirada: Por questões de segurança, sua sessão foi encerrada automaticamente. Faça login novamente.
                </Alert>
            </Stack>
        );
    }
}

export default Auth