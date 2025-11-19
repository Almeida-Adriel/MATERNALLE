import React, { Suspense, useEffect, useState } from 'react';
import Service from '../utils/service/Service';
import {
  MdOutlineMedicalServices,
  MdEditNote,
  MdOutlinePregnantWoman,
  MdOutlineChildCare,
  MdAssessment,
} from 'react-icons/md';
import { statusMaternidadeEnum } from '../utils/enum/statusMaternidade';
import Acompanhamento from '../components/Acompanhamento';
import Auth from '../utils/service/Auth';

const service = new Service();
const auth = new Auth();

const formatDateBR = (d) => {
  try {
    const dt = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
    if (isNaN(dt.getTime())) return '--/--/----';
    return dt.toLocaleDateString('pt-BR');
  } catch {
    return '--/--/----';
  }
};
const CompromissoCard = ({ tipo, data, descricao }) => (
  <div className="p-4 rounded-lg border border-brand-100 bg-white hover:shadow-md transition-shadow">
    <p className="text-sm text-slate-500 font-medium">
      {tipo} • {data}
    </p>
    <p className="font-semibold text-brand-800">{descricao}</p>
  </div>
);

const NotaCard = ({ titulo, descricao, data_criacao }) => (
  <div className="p-4 rounded-lg border border-brand-100 bg-white hover:bg-brand-50/50 transition-colors">
    <h4 className="font-semibold text-brand-700 truncate">{titulo}</h4>
    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{descricao}</p>
    <p className="mt-2 text-xs text-slate-400">{formatDateBR(data_criacao)}</p>
  </div>
);

const Central = ({ data, loading }) => {
  const [compromissos, setCompromissos] = useState([]);
  const [loadingCompromissos, setLoadingCompromissos] = useState(false);
  const [notas, setNotas] = useState(data?.notas || []);
  const usuarioId = auth.getId();

  useEffect(() => {
    const fetchCompromissos = async () => {
      setLoadingCompromissos(true);
      try {
        const res = await service.getWithParams('notas', {
          id_usuario: usuarioId,
          lembrete: false,
        });
        const lista = Array.isArray(res?.data) ? res.data : [];
        setNotas(lista);
      } catch (error) {
        console.error('Erro ao buscar notas:', error);
        setNotas([]);
      }

      try {
        const res = await service.getWithParams('notas', {
          id_usuario: usuarioId,
          lembrete: true,
        });

        const lista = Array.isArray(res?.data) ? res.data : [];

        setCompromissos(
          lista.map((c) => ({
            data: formatDateBR(c.data_lembrete),
            descricao: c.descricao || c.titulo || 'Sem descrição',
            tipo: c.titulo,
          }))
        );
      } catch (error) {
        console.error('Erro ao buscar compromissos (lembretes):', error);
        setCompromissos([]);
      } finally {
        setLoadingCompromissos(false);
      }
    };

    if (usuarioId) {
      fetchCompromissos();
    } else {
      setLoadingCompromissos(false);
      setCompromissos([]);
    }
  }, [usuarioId]);

  if (loading || loadingCompromissos) {
    return (
      <div className="text-center py-10 text-brand-600">
        Carregando dados da Central...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10 text-brand-600">
        Sem dados do usuário no momento.
      </div>
    );
  }

  const notasRecentes = notas;

  return (
    <div className="space-y-10">
      {/* Seção Superior: Compromissos e Acompanhamento */}
      <section className="grid lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Próximos Compromissos e Últimas Notas */}
        <div className="lg:col-span-2 space-y-8">
          {/* Próximos Compromissos (Lembretes) */}
          <div className="bg-white rounded-2xl shadow p-6 border border-brand-100">
            <h2 className="text-xl font-bold text-brand-800 flex items-center mb-4">
              <MdOutlineMedicalServices
                className="mr-2 text-brand-500"
                size={24}
              />
              Próximos Compromissos
            </h2>
            <div className="space-y-3">
              {compromissos.length > 0 ? (
                compromissos.slice(0, 4).map(
                  (
                    c,
                    index // Limita a 4
                  ) => <CompromissoCard key={index} {...c} />
                )
              ) : (
                <p className="text-slate-500 italic">
                  Nenhum compromisso futuro agendado.
                </p>
              )}
            </div>
          </div>

          {/* Últimas Notas */}
          <div className="bg-white rounded-2xl shadow p-6 border border-brand-100">
            <h2 className="text-xl font-bold text-brand-800 flex items-center mb-4">
              <MdEditNote className="mr-2 text-brand-500" size={24} />
              Últimas Notas (Recentes)
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {notasRecentes.length > 0 ? (
                // Limita a 4 notas (4 cards)
                notasRecentes
                  .slice(0, 4)
                  .map((n) => (
                    <NotaCard
                      key={n.id}
                      titulo={n.titulo}
                      descricao={n.descricao}
                      data_criacao={n.data_criacao}
                    />
                  ))
              ) : (
                <p className="text-slate-500 italic col-span-2">
                  Nenhuma nota registrada. Comece a anotar!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Acompanhamento */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow p-6 h-full border border-brand-100 min-h-64 flex flex-col">
            <h2 className="text-xl font-bold text-brand-800 flex items-center">
              {data.status_maternidade ===
              Object.keys(statusMaternidadeEnum)[1] ? (
                <>
                  <MdOutlinePregnantWoman
                    className="mr-2 text-brand-500"
                    size={24}
                  />
                  <p>Acompanhamento Materno</p>
                </>
              ) : (
                <>
                  <MdOutlineChildCare
                    className="mr-2 text-brand-500"
                    size={24}
                  />
                  <p>Acompanhamento do bebê</p>
                </>
              )}
            </h2>
            <div className="justify-center flex-1 ">
              <Suspense
                fallback={
                  <div className="text-center py-10 text-brand-600">
                    Carregando acompanhamento...
                  </div>
                }
              >
                <Acompanhamento dados={data} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Inferior: Gráficos Financeiros */}
      <section>
        <div className="bg-white rounded-2xl shadow p-6 border border-brand-100 min-h-80">
          <h2 className="text-xl font-bold text-brand-800 flex items-center mb-4">
            <MdAssessment className="mr-2 text-brand-500" size={24} />
            Análise Financeira
          </h2>
          <div className="h-64 bg-gray-100/70 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-slate-500 italic p-4">
            [Espaço Reservado para Gráficos com base em Finanças]
          </div>
        </div>
      </section>
    </div>
  );
};

export default Central;
