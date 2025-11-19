import React from 'react';
import logo from '../../public/maternalle.png';

const Footer = () => {
  return (
    <footer className="bg-brand-50/10 border-t border-brand-100 flex bottom-0 w-full mt-auto py-2">
      <div className="flex justify-between items-center w-full text-xs text-slate-500 px-10">
        <div>
          <p className="text-brand-600">
            © 2025 MATERNALLE. Todos os direitos reservados.
          </p>
        </div>
        <div className="-ml-14 invisible md:visible">
          <img
            src={logo}
            alt="Logo Maternalle"
            className="h-10 w-40 bg-brand-50/10"
          />
        </div>
        <div className="text-brand-600 text-right">
          <p>Desenvolvido por Adriel Almeida</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
