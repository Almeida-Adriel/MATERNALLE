import axios from "axios";
import Auth from "./Auth";

const BASE_URL = "https://maternalle.onrender.com/"; // produção
// const BASE_URL = "http://192.168.56.1:5000/"; // teste local
// const BASE_URL = "http://localhost:5000/";
const auth = new Auth();

const handle401Error = (error) => {
  if (error.response && error.response.status === 401) {
    sessionStorage.setItem(
      'flash',
      JSON.stringify({
        type: 'warning',
        description: 'Sessão expirada, por favor, faça login novamente.',
      })
    );
    window.location.href = '/login';
  }
  return Promise.reject(error.response?.data || error);
};

// INSTÂNCIA AUTENTICADA
const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para token
api.interceptors.request.use((config) => {
  const token = auth.getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  handle401Error
);

// Instância pública (login)
const publicApi = axios.create({
  baseURL: BASE_URL,
});

publicApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response?.data || error)
);

class Service {
  formatRequest(data) {
    if (data instanceof FormData) {
      return {
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      };
    }
    return { data }; 
  }

  get(rota, id) {
    const path = id ? `${rota}?id=${id}` : rota;
    return api.get(path);
  }

  post(rota, data) {
    const { data: formattedData, headers } = this.formatRequest(data);
    return api.post(rota, formattedData, { headers });
  }

  put(rota, data) {
    const { data: formattedData, headers } = this.formatRequest(data);
    return api.put(rota, formattedData, { headers });
  }

  delete(rota, id) {
    const path = id ? `${rota}/${id}` : rota;
    return api.delete(path);
  }

  requestWithParams(method, rota, params = {}) {
    return api.request({
      method,
      url: rota,
      params,
    });
  }

  getWithParams(rota, params = {}) {
    return this.requestWithParams('get', rota, params);
  }

  deleteWithParams(rota, params = {}) {
    return api.request({
      method: 'delete',
      url: rota,
      params,
    });
  }

  postNoAuth(rota, data) {
    return publicApi.post(rota, data);
  }

  login(cpf, password) {
    return publicApi.post("auth/login", { cpf, password })
      .then((res) => {
        auth.saveDataLogin({
          token: res.data.token,
          id: res.data.id,
          userRole: res.data.userRole,
        });
        return res;
      });
  }

  async logout() {
    auth.clear();
    return true;
  }
}

export default Service;
