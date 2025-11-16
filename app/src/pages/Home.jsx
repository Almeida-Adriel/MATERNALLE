import React, { useState, useEffect } from 'react';
import Header from '../components/DefaultHeader';
import Footer from '../components/DefaultFooter';
import PlanCard from '../components/PlanCard';
import DefaultSidebar from '../components/DefaultSidebar';
// menu
import cliente from '../menu/cliente';
import admin from '../menu/admin';
// utilitários
import Service from '../utils/service/Service';
import Auth from '../utils/service/Auth';
import { tipoUsuario } from '../utils/enum/tipoUsuario';
import { tipoPerfil } from '../utils/enum/tipoPerfil';

const auth = new Auth();
const service = new Service();

const Home = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [menu, setMenu] = useState([]);
  const [res, setRes] = useState({});
  const [userId, setUserId] = useState(auth.getId());

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const setProfile = async () => {
    try {
      const res = await service.get('usuario', userId);
      setRes(res);
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
      console.error('Erro ao obter perfil:', error);
    }
  };

  useEffect(() => {
    if (!res.data) {
      setProfile();
    }
  }, [res]);

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <DefaultSidebar
        sidebarVisible={sidebarVisible}
        toggleSidebar={toggleSidebar}
        menu={menu}
      />
      <main className="flex-1 min-h-screen">
        <section className="bg-gradient-brand-to-b from-white to-brand-50">
          <div className="max-w-4/5 mx-auto grid md:grid-cols-2 gap-8 p-6 md:p-10">
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-brand-800">
                Acompanhamento carinhoso para a sua maternidade
              </h1>
              <p className="mt-4 text-slate-600">
                Centralize consultas, vacinas, exames e conteúdos confiáveis.
                Tudo em um só lugar, feito para a rotina da mãe recente.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  className="px-5 py-3 rounded-full bg-brand-500 text-white hover:bg-brand-600"
                  href="/login"
                >
                  Começar agora
                </a>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="font-semibold text-brand-700">
                Próximos compromissos
              </h2>
              <ul className="mt-4 space-y-3">
                <li className="p-4 rounded-lg border border-brand-100 bg-white">
                  <p className="text-sm text-slate-500">
                    Vacina • 16/10, 14:00
                  </p>
                  <p className="font-medium">2ª dose Pentavalente</p>
                </li>
                <li className="p-4 rounded-lg border border-brand-100 bg-white">
                  <p className="text-sm text-slate-500">
                    Pediatra • 18/10, 09:30
                  </p>
                  <p className="font-medium">Consulta de acompanhamento</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-6/8 mx-auto p-6 md:p-10">
          <h3 className="text-xl font-semibold text-brand-800">
            Conteúdos recomendados
          </h3>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="bg-white border border-brand-100 rounded-xl p-5 shadow-sm">
              <h4 className="font-semibold text-brand-700">
                Amamentação sem dor
              </h4>
              <p className="mt-2 text-sm text-slate-600">
                Dicas de pega correta e posições confortáveis.
              </p>
              <button className="mt-4 text-brand-700 font-medium hover:underline">
                Ler mais
              </button>
            </article>
            <article className="bg-white border border-brand-100 rounded-xl p-5 shadow-sm">
              <h4 className="font-semibold text-brand-700">Sono do bebê</h4>
              <p className="mt-2 text-sm text-slate-600">
                Rotinas simples para noites mais tranquilas.
              </p>
              <button className="mt-4 text-brand-700 font-medium hover:underline">
                Ler mais
              </button>
            </article>
            <article className="bg-white border border-brand-100 rounded-xl p-5 shadow-sm">
              <h4 className="font-semibold text-brand-700">Pós-parto real</h4>
              <p className="mt-2 text-sm text-slate-600">
                O que esperar do puerpério e como se cuidar.
              </p>
              <button className="mt-4 text-brand-700 font-medium hover:underline">
                Ler mais
              </button>
            </article>
          </div>
        </section>

        <section className="bg-brand-50 py-6">
          <div className="max-w-6/8 mx-auto p-6 md:p-10">
            <h3 className="text-3xl font-bold text-brand-800 text-center">
              Escolha o Plano Ideal para Você
            </h3>
            <p className="text-center text-slate-600 mt-3 mb-10">
              Acesso completo a todas as ferramentas de suporte à maternidade.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Plano Gratuito (Acesso Básico) */}
              <PlanCard
                title={tipoPerfil.BASICO}
                titleKey="BASICO"
                price="Grátis"
                features={[
                  'Acesso limitado ao Conteúdo',
                  'Registro de Notas e Lembretes (Básico)',
                  'Teste de Edimburgo (apenas 1)',
                ]}
              />

              {/* Plano Premium (Recomendado) */}
              <PlanCard
                title={tipoPerfil.PREMIUM}
                titleKey="PREMIUM"
                price="R$ 19,90"
                features={[
                  'Conteúdo Completo',
                  'Controle Financeiro com Dashboard',
                  'Testes de Edimburgo Ilimitados',
                  'Notificações Personalizadas de Lembretes',
                  'Suporte Prioritário',
                ]}
              />

              {/* Plano Anual (Melhor Custo) */}
              <PlanCard
                title={tipoPerfil.PREMIUM_ANUAL}
                titleKey="PREMIUM_ANUAL"
                price="R$ 169,90"
                features={[
                  'Todos os recursos do Premium',
                  'Economia de 30% no valor total',
                  'Presente de boas-vindas (E-book)',
                  'Acesso antecipado a novos recursos',
                ]}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
