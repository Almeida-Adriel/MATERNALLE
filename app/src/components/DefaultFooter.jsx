import React from "react";

const Footer = () => {
  return (
    <>
      <footer class="bg-white border-t border-brand-100 flex">
          <div class="flex justify-between items-center w-full text-xs text-slate-500 py-2 px-10">
              <div>
                  <p class="text-brand-600">© 2025 MATERNALLE. Todos os direitos reservados.</p>
              </div>
              <div class="-ml-14">
                  <img src="logo.png" alt="Logo Maternalle" class="h-12 w-24 mx-auto bg-white" />
              </div>
              <div class="text-brand-600 text-right">
                  <p>Desenvolvido por Adriel Almeida</p>
              </div>
          </div>
      </footer>
    </>
  );
};

export default Footer;
