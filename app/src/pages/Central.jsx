import React, { useState, useEffect, Suspense } from 'react';
import Service from "../utils/service/Service";
import { MdOutlineMedicalServices, MdEditNote, MdOutlinePregnantWoman, MdOutlineChildCare, MdAssessment } from 'react-icons/md';
import { statusMaternidadeEnum } from '../utils/enum/statusMaternidade';
import Acompanhamento from './Acompanhamento';

const service = new Service();

// Dados de exemplo para o componente, baseados na sua descrição e imagem
// Substitua isso pela chamada real do seu backend para buscar dados.
const mockUserData = {
    // ... (restante dos dados do usuário)
    notas: [
        { id: 1, titulo: "Primeira consulta de rotina", conteudo: "O pediatra verificou o peso e altura. Tudo dentro do esperado.", data: new Date(2025, 10, 28) },
        { id: 2, titulo: "Dúvidas sobre amamentação", conteudo: "Pesquisar sobre a pega correta e consultar a doula.", data: new Date(2025, 10, 25) },
        { id: 3, titulo: "Compra de vitaminas", conteudo: "Lembrar de comprar vitamina D para o bebê na próxima semana.", data: new Date(2025, 10, 20) },
    ],
    compromissos: [
        { tipo: 'Vacina', data: '16/10', hora: '14:00', descricao: '2ª dose Pentavalente' },
        { tipo: 'Pediatra', data: '18/10', hora: '09:30', descricao: 'Consulta de acompanhamento' },
        { tipo: 'Exame', data: '25/11', hora: '11:00', descricao: 'Teste do Pezinho' },
    ]
};


// Componente para exibir um único Compromisso
const CompromissoCard = ({ tipo, data, hora, descricao }) => (
    <div className="p-4 rounded-lg border border-brand-100 bg-white hover:shadow-md transition-shadow">
        <p className="text-sm text-slate-500 font-medium">
            {tipo} • {data}, {hora}
        </p>
        <p className="font-semibold text-brand-800">{descricao}</p>
    </div>
);

// Componente para exibir uma única Nota (Simulando card)
const NotaCard = ({ titulo, conteudo, data }) => (
    <div className="p-4 rounded-lg border border-brand-100 bg-white hover:bg-brand-50/50 transition-colors">
        <h4 className="font-semibold text-brand-700 truncate">{titulo}</h4>
        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{conteudo}</p>
        <p className="mt-2 text-xs text-slate-400">
            {data.toLocaleDateString('pt-BR')}
        </p>
    </div>
);

const Central = ({ data }) => {
    // Usei o mockUserData como estado inicial. Na prática, você faria uma chamada API aqui.
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    // Função para buscar os dados do usuário
    const fetchUserData = async () => {
        setLoading(true);
        try {
            // Lógica de busca real
            // const userId = auth.getId();
            // const res = await service.get('usuario', userId);
            // setUserData(res.data);
            
            // Simulação de dados (Remova isso ao implementar a chamada real)
            await new Promise(resolve => setTimeout(resolve, 500)); 
            setUserData(mockUserData);
            
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
            setUserData(mockUserData); // Fallback para dados mockados em caso de erro
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-brand-600">Carregando...</div>;
    }

    // Ordena as notas: Mais recentes primeiro (Assumindo que data é um objeto Date ou pode ser convertido)
    const notasOrdenadas = userData?.notas 
        ? [...userData.notas].sort((a, b) => b.data.getTime() - a.data.getTime()) 
        : [];

    return (
        <div className="space-y-10">
            {/* Seção Superior: Compromissos e Mapa */}
            <section className="grid lg:grid-cols-3 gap-8">
                
                {/* Coluna Esquerda: Próximos Compromissos e Últimas Notas */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Próximos Compromissos */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-brand-100">
                        <h2 className="text-xl font-bold text-brand-800 flex items-center mb-4">
                            <MdOutlineMedicalServices className="mr-2 text-brand-500" size={24} />
                            Próximos Compromissos
                        </h2>
                        <div className="space-y-3">
                            {userData?.compromissos.length > 0 ? (
                                userData.compromissos.map((c, index) => (
                                    <CompromissoCard key={index} {...c} />
                                ))
                            ) : (
                                <p className="text-slate-500 italic">Nenhum compromisso futuro agendado.</p>
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
                            {notasOrdenadas.length > 0 ? (
                                notasOrdenadas.slice(0, 4).map((n) => (
                                    <NotaCard key={n.id} {...n} />
                                ))
                            ) : (
                                <p className="text-slate-500 italic col-span-2">Nenhuma nota registrada. Comece a anotar!</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Coluna Direita: Espaço para o Mapa */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow p-6 h-full border border-brand-100 min-h-64 flex flex-col">
                        <h2 className="text-xl font-bold text-brand-800 flex items-center">
                            {data.status_maternidade === Object.keys(statusMaternidadeEnum)[1] 
                                ? (
                                    <>
                                        <MdOutlinePregnantWoman className="mr-2 text-brand-500" size={24} />
                                        <p>Acompanhamento Materno</p>
                                    </>
                                )
                                : (
                                    <>
                                        <MdOutlineChildCare className="mr-2 text-brand-500" size={24} />
                                        <p>Acompanhamento do bebê</p>
                                    </>
                                )
                            }
                            
                        </h2>
                        <div className='justify-center flex-1 '>
                            <Suspense fallback={<div className="text-center py-10 text-brand-600">Carregando acompanhamento...</div>}>
                                <Acompanhamento dados={data}/>
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
                    {/* ESTE É O ESPAÇO RESERVADO PARA OS GRÁFICOS */}
                    <div className="h-64 bg-gray-100/70 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-slate-500 italic p-4">
                        [Espaço Reservado para Gráficos com base em Finanças]
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Central;