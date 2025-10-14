import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-pink-200 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold text-pink-700">
          Acompanhamento Mãe
        </div>

        {/* Navbar */}
        <nav>
          <ul className="flex space-x-6 text-pink-800 font-medium">
            <li>
              <Link to="/" className="hover:text-pink-900">
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-pink-900">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/conteudo" className="hover:text-pink-900">
                Conteúdo
              </Link>
            </li>
            <li>
              <Link to="/contato" className="hover:text-pink-900">
                Contato
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;