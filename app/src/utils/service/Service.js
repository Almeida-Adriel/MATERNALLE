import axios from "axios";
import Auth from "./Auth";

const BASE_URL = "https://maternalle.onrender.com/"; // URL de produção
// const BASE_URL = "http://192.168.1.19:5000/"; // URL de teste local
// const BASE_URL = "http://localhost:5000/";
const auth = new Auth();

const handle401Error = (error) => {
    // Verifica se a resposta existe e se o status é 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      sessionStorage.setItem(
        'flash',
        JSON.stringify({
          type: 'warning',
          description: 'Sessão expirada, por favor, faça login novamente.',
        })
      );
      // window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error); 
};

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, 
});

// Adiciona o interceptor de resposta para tratar erros 401 em todas as requisições 'api'
api.interceptors.response.use(
    (response) => response,
    handle401Error
);

// Instância para Requisições PÚBLICAS (Login/Cadastro)
const publicApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Ainda é bom para receber o cookie de login
});
publicApi.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error.response?.data || error)
);

class Service {
  get(rota, id) {
    const path = id ? `${rota}?id=${id}` : rota; 
    return api.get(path);
  }

  post(rota, data) {
    return api.post(rota, data);
  }

  put(rota, data) {
    return api.put(rota, data);
  }

  delete(rota, id) {
    const path = id ? `${rota}/${id}` : rota;
    return api.delete(path);
  }

  requestWithParams(method, rota, params = {}) {
    return api.request({
        method: method,
        url: rota,
        params: params, // Axios formata automaticamente como ?param1=valor1&param2=valor2
    });
  }

  getWithParams(rota, params = {}) {
    return this.requestWithParams('get', rota, params);
  }

  deleteWithParams(rota, params = {}) {
    return api.request({
        method: 'delete',
        url: rota,
        params: params // Parâmetros vão para a URL: /rota?id=5
    });
  }

  postNoAuth(rota, data) {
    return publicApi.post(rota, data);
  }

  login(cpf, password) {
    const data = { cpf, password }; 
    return publicApi.post('auth/login', data);
  }
  
  async logout() {
    try {
        const response = await publicApi.post('auth/logout'); 
        
        if (response.status === 200) { 
          auth.clear();
          return true;
        } 
    } catch (error) {
      console.error('Erro ao tentar logout:', error);
      
      auth.clear();
      
      return false;
    }
  }
}

export default Service;