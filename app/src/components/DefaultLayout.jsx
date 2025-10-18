import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./DefaultHeader";
import Footer from "./DefaultFooter";
import routes from "../utils/routes";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Header />
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
            <Route path="/" element={<Navigate to='/Home' replace/>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
