import React from "react";
import Header from "./DefaultHeader";
import Footer from "./DefaultFooter";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Header />
      {/* Espaço para outras telas */}
      <main className="flex-1 container mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
