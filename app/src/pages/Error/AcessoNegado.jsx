import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineWarningAmber } from 'react-icons/md';

const AcessoNegado = () => {
  const redirectPath = '/central';

  const buttonText = 'Voltar para Central do Usuário';

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 p-10">
        <div className="text-center">
          <MdOutlineWarningAmber
            className="mx-auto h-16 w-16 text-brand-500"
            size={40}
          />
          <h1 className="mt-4 text-3xl font-extrabold text-brand-900">
            Acesso Negado
          </h1>
          <p className="mt-2 text-sm text-brand-600">
            Você não possui a permissão necessária para visualizar esta página.
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            to={redirectPath}
            className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-500 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition duration-150 ease-in-out shadow-lg"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AcessoNegado;
