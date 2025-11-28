class Auth {
    constructor() {
        this.TOKEN_KEY = 'token';
        this.USER_ID_KEY = 'userId';
        this.ROLE_KEY = 'userRole';
    }

    // Verifica se existe token
    isAuthenticated() {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getId() {
        return localStorage.getItem(this.USER_ID_KEY);
    }

    getUserRole() {
        return localStorage.getItem(this.ROLE_KEY);
    }

    // Salva informações de login
    saveDataLogin(data) {
        if (!data) return;

        localStorage.setItem(this.TOKEN_KEY, data.token);
        localStorage.setItem(this.USER_ID_KEY, data.id || data.userId);
        localStorage.setItem(this.ROLE_KEY, data.userRole);
    }

    // Limpa dados da sessão
    clear() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_ID_KEY);
        localStorage.removeItem(this.ROLE_KEY);
        sessionStorage.removeItem('flash');
    }
}

export default Auth;
