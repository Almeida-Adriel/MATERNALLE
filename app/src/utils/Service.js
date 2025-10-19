import axios from "axios";
import Auth from "/Auth";
// "http://localhost:5000/" // Testes locais
// const url = "http://srv-bd:64943/"; // Producao

const url = "http://localhost:5000/";

const autentication = new Auth();

class Service {
  get(rota, id) {
    return new Promise((resolve, reject) => {
      const path = `${url}/${rota}/${!!id ? `${id}` : ""}`;
      axios
        .get(path, {
          headers: {
            Authorization: "Bearer ".concat(autentication.getToken()),
          },
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === "401") {
              localStorage.clear();
              window.location.reload();
            }
          }
          reject();
        });
    });
  }

  getUrlParam(rota, param, filter) {
    return new Promise((resolve, reject) => {
      const path = `${url}/${rota}/${
        !!param && !!filter ? `?${param}=${filter}` : ""
      }`;
      axios
        .get(path, {
          headers: {
            Authorization: "Bearer ".concat(autentication.getToken()),
          },
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === "401") {
              localStorage.clear();
              window.location.reload();
            }
          }
          reject();
        });
    });
  }

  postUrlParam(rota, param, filter) {
    return new Promise((resolve, reject) => {
      const path = `${url}/${rota}/${
        !!param && !!filter ? `?${param}=${filter}` : ""
      }`;
      axios
        .post(path, null, {
          headers: { Authorization: `Bearer ${autentication.getToken()}` },
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === "401") {
              localStorage.clear();
              window.location.reload();
            }
          }
          reject();
        });
    });
  }

  postParam(rota, param) {
    return new Promise((resolve, reject) => {
      const path = `${url}/${rota}/${!!param ? `?${param}` : ""}`;
      axios
        .post(path, null, {
          headers: { Authorization: `Bearer ${autentication.getToken()}` },
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === "401") {
              localStorage.clear();
              window.location.reload();
            }
          }
          reject();
        });
    });
  }

  post(rota, data) {
    return new Promise((resolve, reject) => {
      const path = `${url}/${rota}`;
      axios
        .post(path, data, {
          headers: { Authorization: `Bearer ${autentication.getToken()}` },
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === "401") {
              localStorage.clear();
              window.location.reload();
            }
          }
          reject(error.response && error.response.data ? error.response.data : error);
        });
    });
  }

  postNoAuth(rota, data) {
    return new Promise((resolve, reject) => {
      const path = `${url}/${rota}`;
      axios
        .post(path, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === "401") {
              localStorage.clear();
              window.location.reload();
            }
          }
          reject();
        });
    });
  }

  put(rota, data) {
    return new Promise((resolve, reject) => {
      const path = `${url}/${rota}`;
      axios
        .put(path, data, {
          headers: {
            Authorization: "Bearer ".concat(autentication.getToken()),
          },
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === "401") {
              localStorage.clear();
              window.location.reload();
            }
          }
          reject(error.response && error.response.data ? error.response.data : error);
        });
    });
  }

  delete(rota, param, filter) {
    return new Promise((resolve, reject) => {
      const path = `${url}/${rota}/${
        !!param && !!filter ? `?${param}=${filter}` : ""
      }`;
      axios
        .delete(path, {
          headers: {
            Authorization: "Bearer ".concat(autentication.getToken()),
          },
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === "401") {
              localStorage.clear();
              window.location.reload();
            }
          }
          reject();
        });
    });
  }

  login(user, pass) {
    return new Promise((resolve, reject) => {
      const bodyParams = {
        grant_type: "password",
        username: user,
        password: pass,
      };

      const qs = require("qs");
      const path = `${url}token`;

      axios
        .post(path, qs.stringify(bodyParams))
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          autentication.clear();
          reject(error);
        });
    });
  }
}

export default Service;