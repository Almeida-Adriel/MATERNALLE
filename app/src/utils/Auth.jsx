import React from 'react';
import { notification } from 'antd';

class Auth {
    constructor() {
        // this.TOKEN_EXPIRATION_TIME = 6000  // 6 segundos para teste
        this.TOKEN_EXPIRATION_TIME = 3600000 * 24 * 7 // 7 dias
    }

    isAuthenticated() {
        let token = localStorage.getItem('token')
        let email = localStorage.getItem('userEmail')
        let lastLogin = localStorage.getItem('lastLogin');

        let validation = (!!token && token.length > 100 && email.includes("@"))
        
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
            return localStorage.getItem('token').toString()
        }
    }

    saveDataLogin(data) {
        if (!!data) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('userEmail', data.userEmail)
            localStorage.setItem('lastLogin', Date.now().toString());
        }
    }

    clear(){
        localStorage.clear()
    }

    showSessionExpiredNotification() {
        notification.warning({
            message: <span style={{ color: '#fa8c16' }}>Sessão Expirada</span>,
            description: "Por questões de segurança, sua sessão foi encerrada automaticamente. Faça login novamente.",
            placement: 'topLeft',
            duration: 6.5,
            style: {
                width: 400,
                borderLeft: '3px solid #fa8c16',
            },
        });
    }
}

export default Auth