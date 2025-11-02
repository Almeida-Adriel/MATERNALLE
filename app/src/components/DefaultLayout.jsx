import React, { Suspense, useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// componente
import Header from "./DefaultHeader";
import Footer from "./DefaultFooter";
import DefaultSidebar from "./DefaultSidebar";
// menu
import cliente from '../menu/cliente';
import admin from '../menu/admin';
// utilitários
import routes from "../utils/routes";
import Service from "../utils/service/Service";
import Auth from "../utils/service/Auth";
import { tipoUsuario } from "../utils/enum/tipoUsuario";

const service = new Service()
const auth = new Auth()

const Layout = () => {

  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [menu, setMenu] = useState([])
  const [res, setRes] = useState({})

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  }

  const setProfile = async () => {
    try {
      const userId = auth.getId()
      const res = await service.get('usuario', userId);
      setRes(res.data)
      const perfil = res?.data.perfil.role;
      let menu = [];
      switch (perfil) {
        case Object.keys(tipoUsuario)[1]:
          menu = admin;
          break;
        case Object.keys(tipoUsuario)[0]:
          menu = cliente;
          break;
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
      <Header toggleSidebar={toggleSidebar} />
      <DefaultSidebar 
        sidebarVisible={sidebarVisible} 
        toggleSidebar={toggleSidebar} 
        menu={menu}
      />
      <main className="flex-1 container mx-auto px-6 py-8">
        <Suspense fallback={<div>Carregando...</div>}>
          <Routes>
            {routes.map((route, idx) =>
              route.component ? (
                <Route
                  key={idx}
                  path={route.path}
                  element={<route.component data={res} />}
                />
              ) : null
            )}
            <Route path="/*" element={<Navigate to="/central" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
