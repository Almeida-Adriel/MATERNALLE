import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header class="bg-white/80 backdrop-blur border-b border-brand-100 sticky top-0 z-50">
        <nav class="max-w-6xl mx-auto flex items-center justify-between p-4">
            <a href="#" class="flex items-center gap-2">
                <span class="inline-block h-8 w-8 rounded-full bg-brand-500"></span>
                <span class="font-semibold text-brand-700">Maternalle</span>
            </a>

            <div class="hidden md:flex items-center gap-6">
                <a class="hover:text-brand-700" href="#">Início</a>
                <a class="hover:text-brand-700" href="#">Conteúdos</a>
                <a class="hover:text-brand-700" href="#">Postos de Saúde</a>
                <a class="hover:text-brand-700" href="#">Escala de Edimburgo</a>
            </div>

            <div class="flex items-center gap-3">
                <button class="md:hidden p-2 rounded hover:bg-brand-100" id="menuBtn" aria-label="Abrir menu">
                    ☰
                </button>
                <a href="#login"
                    class="hidden md:inline-block px-4 py-2 rounded-full bg-brand-500 text-white hover:bg-brand-600">
                    Entrar
                </a>
            </div>
        </nav>

        <div id="mobileMenu" class="md:hidden hidden border-t border-brand-100">
            <div class="max-w-6xl mx-auto p-4 flex flex-col gap-3">
                <a class="hover:text-brand-700" href="#">Início</a>
                <a class="hover:text-brand-700" href="#">Conteúdos</a>
                <a class="hover:text-brand-700" href="#">Consultas</a>
                <a class="hover:text-brand-700" href="#">Comunidade</a>
                <a href="#login" class="px-4 py-2 rounded-full bg-brand-500 text-white text-center hover:bg-brand-600">
                    Entrar
                </a>
            </div>
        </div>
    </header>
  );
};

export default Header;