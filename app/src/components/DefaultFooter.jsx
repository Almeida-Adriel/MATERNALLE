import React from "react";

const Footer = () => {
  return (
    <footer className="bg-pink-100 mt-auto py-6 shadow-inner">
      <div className="container mx-auto text-center text-pink-700 font-medium">
        &copy; {new Date().getFullYear()} MATERNALLE. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
