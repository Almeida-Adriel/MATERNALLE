import React, { Suspense, useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./DefaultHeader";
import Footer from "./DefaultFooter";
import cliente from '../menu/cliente';
import admin from '../menu/admin';
import routes from "../utils/routes";
import Service from "../utils/service/Service";
import Auth from "../utils/service/Auth";
import { tipoUsuario } from "../utils/enum/tipoUsuario";

const service = new Service()
const auth = new Auth()

const Layout = () => {

  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [menu, setMenu] = useState([])

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  }

  const setProfile = async () => {
    try {
      const res = await service.get('usuario', { 'id': auth.getId() });
      const perfil = res?.perfil;
      let menu = [];

      switch (perfil) {
        case tipoUsuario.ADMIN:
          menu = admin;
          break;
        case tipoUsuario.CLIENTE:
        default:
          menu = cliente;
          break;
      }
      setMenu(menu);
    } catch (error) {
      console.error("Erro ao obter perfil:", error);
    }
  }

  useEffect(() => {
    setProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-t from-white via-brand-100 to-from-white">
      <Header toggleSideBar={toggleSidebar} />
      <main className="flex-1 container mx-auto px-6 py-8">
        <Suspense fallback={<div>Carregando...</div>}>
          <Routes>
            {routes.map((route, idx) =>
              route.component ? (
                <Route
                  key={idx}
                  path={route.path}
                  element={<route.component />}
                />
              ) : null
            )}
            <Route path="/*" element={<Navigate to="/dasboard" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
