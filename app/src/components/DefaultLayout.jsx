import React, { Suspense, useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
// componente
import Header from './DefaultHeader';
import Footer from './DefaultFooter';
import DefaultSidebar from './DefaultSidebar';
// menu
import cliente from '../menu/cliente';
import admin from '../menu/admin';
// utilitários
import routes from '../utils/routes';
import Service from '../utils/service/Service';
import Auth from '../utils/service/Auth';
import { tipoUsuario } from '../utils/enum/tipoUsuario';

const service = new Service();
const auth = new Auth();

function AdminRoute({ children }) {
  const isAuthenticated = auth.isAuthenticated();
  const userRole = auth.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'ADMIN') {
    return <Navigate to="/acesso_negado" replace />;
  }

  return children;
}

const Layout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [menu, setMenu] = useState([]);
  const [res, setRes] = useState({});

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const setProfile = async () => {
    try {
      const userId = auth.getId();

      if (!userId) {
        setMenu(cliente);
        setRes({});
        return;
      }

      const res = await service.get('usuarios', userId);
      setRes(res.data);

      const perfilRole = res?.data.perfil.role;
      let menu = [];

      if (perfilRole === 'ADMIN') {
        menu = admin;
      } else {
        menu = cliente;
      }
      setMenu(menu);
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      setMenu(cliente);
    }
  };

  useEffect(() => {
    setProfile();
  }, []);

  const renderRouteElement = (route, data) => {
    const listAdminRoutes = ['/conteudos_adm', '/dashboard', '/usuarios'];
    const isAdminRoute = listAdminRoutes.includes(route.path);

    if (isAdminRoute) {
      return (
        <AdminRoute>
          <route.component data={data} />
        </AdminRoute>
      );
    }

    return <route.component data={data} />;
  };

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-t from-white via-brand-100 to-from-white">
      <Header toggleSidebar={toggleSidebar} />
      <DefaultSidebar
        sidebarVisible={sidebarVisible}
        toggleSidebar={toggleSidebar}
        menu={menu}
      />
      <main className="flex-1 container mx-auto px-6 py-4">
        <Suspense fallback={<div>Carregando...</div>}>
          <Routes>
            {routes.map((route, idx) =>
              route.component ? (
                <Route
                  key={idx}
                  path={
                    route.path.startsWith('/')
                      ? route.path.substring(1)
                      : route.path
                  }
                  element={renderRouteElement(route, res)}
                />
              ) : null
            )}
            <Route path="*" element={<Navigate to="/central" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
