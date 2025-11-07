import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowForward, MdArrowBack } from 'react-icons/md';
import { ThemeProvider } from '@mui/material/styles';
import customTheme from '../utils/CustomTheme';
import { dicasPerBebe } from '../utils/dicas/bebes';
import { dicasPerGestacao } from '../utils/dicas/perpouras';

const Acompanhamento = ({ dados }) => {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userData, setUserData] = useState(dados);
    
    const isGestante = userData?.status_maternidade === "GESTANTE";
    const filhos = userData?.filhos || [];

    // Função para calcular a idade formatada
    const idadeFormatada = (dataNascimento) => {
        const nascimento = new Date(dataNascimento);
        const hoje = new Date();

        let anos = hoje.getFullYear() - nascimento.getFullYear();
        let meses = hoje.getMonth() - nascimento.getMonth();
        let dias = hoje.getDate() - nascimento.getDate();

        if (dias < 0) {
            meses--;
            const dataMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
            const diasNoMesAnterior = dataMesAnterior.getDate();
            dias += diasNoMesAnterior;
        }

        if (meses < 0) {
            anos--;
            meses += 12;
        }

        const totalMeses = anos * 12 + meses;

        if (totalMeses < 12) {
            if (totalMeses === 0 && dias === 0) {
                return "Recém-nascido";
            } else if (totalMeses === 0) {
                return `${dias} dia${dias !== 1 ? 's' : ''}`;
            }

            let resultado = "";
            if (meses > 0) {
                resultado += `${meses} mes${meses !== 1 ? 'es' : ''}`;
            }
            if (dias > 0) {
                resultado += (meses > 0 ? " e " : "") + `${dias} dia${dias !== 1 ? 's' : ''}`;
            }

            return resultado.trim();
        } else {
            let resultado = "";
            if (anos > 0) {
                resultado += `${anos} ano${anos !== 1 ? 's' : ''}`;
            }
            if (meses > 0) {
                resultado += (anos > 0 ? ", " : "") + `${meses} mes${meses !== 1 ? 'es' : ''}`;
            }
            if (dias > 0) {
                resultado += (anos > 0 || meses > 0 ? " e " : "") + `${dias} dia${dias !== 1 ? 's' : ''}`;
            }

            return resultado;
        }
    };
    
    const contagemRegressivaDPP = () => {
        if (!userData.dpp) return "Data de previsão de parto não informada";
        const hoje = new Date();
        const dpp = new Date(userData.dpp);
        const diffTime = dpp - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
            const textLink = () => {
                navigate('/perfil');
            }
            return (
            <span>
                O parto já ocorreu. <button onClick={textLink} className="text-brand-600 underline cursor-pointer">Atualize as informações do seu perfil</button>
            </span>
            );
        }
        return `${diffDays} dia${diffDays !== 1 ? 's' : ''} restantes para o parto`;
    };

    // Função para calcular “semana-mês” da gestação (1-9 meses, cada mês com até 4 semanas)
    const calculaMesSemanaGestacao = () => {
        if (!userData.dpp) return null;
        const hoje = new Date();
        const dpp = new Date(userData.dpp);
        const diffMs = dpp - hoje;
        const diffWeeksLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        const totalWeeks = 40;               // Considerando 40 semanas de gestação
        const completedWeeks = totalWeeks - diffWeeksLeft;
        // possibilidade: completedWeeks pode ultrapassar 40 — limite ao máximo 40
        const weeks = Math.min(Math.max(completedWeeks, 1), 40);
        const month = Math.min(Math.ceil(weeks / 4), 9);
        const weekInMonth = Math.min(((weeks - 1) % 4) + 1, 4);
        return `${weekInMonth}-${month}`;
    };

    // Recupera a dica correta conforme o período
    const dicaAtual = () => {
        if (isGestante) {
            const chave = calculaMesSemanaGestacao();
            return (chave && dicasPerGestacao[chave]) ? dicasPerGestacao[chave] : null;
        } else {
            const filho = filhos[currentIndex];
            const chave = filho ? calculaMesSemanaBebe(filho.data_nascimento) : null;
            return (chave && dicasPerBebe[chave]) ? dicasPerBebe[chave] : null;
        }
    };

    const dica = dicaAtual();

    const next = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (isGestante ? 1 : filhos.length));
    };

    const prev = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + (isGestante ? 1 : filhos.length)) % (isGestante ? 1 : filhos.length)
        );
    };
    const textLink = () => {
        navigate('/teste_edimburgo');
    }
    return (
        <ThemeProvider theme={customTheme}>
            <div className="flex flex-col items-center justify-center h-full space-y-6">            

                <div className="bg-white rounded-lg shadow-md p-8 border border-brand-200 w-full max-w-3xl mx-auto mt-6 justify-center flex-1">
                    {isGestante ? (
                        <>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-extrabold text-brand-900 mb-4 text-center">
                                    {`${userData.nome}`}
                                </h3>
                                <p className="text-lg text-slate-700">
                                    <strong>Status da Maternidade:</strong> {userData.status_maternidade}
                                </p>
                                <p className="text-lg text-slate-700">
                                    <strong>Data de Previsão do Parto:</strong> {new Date(userData.dpp).toLocaleDateString('pt-BR')}
                                </p>
                                <p className="text-lg text-slate-700">
                                    <strong>Contagem Regressiva para o parto:</strong> {contagemRegressivaDPP(userData.dpp)}
                                </p>
                                <p className="text-lg text-slate-700">
                                    <strong>Resultado do Teste de Edimburgo: </strong> 
                                    {userData.resultado_teste_edimburgo 
                                        ? userData.resultado_teste_edimburgo
                                        : (
                                        <span>
                                            Sem resultado. <button onClick={textLink} className="text-brand-600 underline cursor-pointer">Fazer o teste</button>
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className='mt-6'>
                                <h4 className="text-xl font-semibold text-brand-700 mb-2">{dica ? "Dica da Semana" : "Dica Aleatória da Semana"}</h4>
                                {dica ? (
                                    <div className="p-4 bg-brand-50 rounded border border-brand-100">
                                        <p className="text-slate-700">{dica.dica}</p>
                                        {dica.link && (
                                            <a href={dica.link} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline mt-2 block">
                                                Ver estudo
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic">Sem dica disponível para esta semana.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-3xl font-extrabold text-brand-900 mb-4 text-center">
                                {`${filhos[currentIndex]?.nome}`}
                            </h3>
                            <p className="text-lg text-slate-700"><strong>Data de Nascimento:</strong> {new Date(filhos[currentIndex]?.data_nascimento).toLocaleDateString('pt-BR')}</p>
                            <p className="text-lg text-slate-700"><strong>Idade:</strong> {idadeFormatada(filhos[currentIndex]?.data_nascimento)}</p>
                            <p className="text-lg text-slate-700"><strong>Gênero:</strong> {filhos[currentIndex]?.genero || "Não informado"}</p>
                            <p className="text-lg text-slate-700"><strong>Peso ao Nascer:</strong> {filhos[currentIndex]?.peso_nascimento || "Não informado"}</p>
                            <p className="text-lg text-slate-700"><strong>Tipo de Parto:</strong> {filhos[currentIndex]?.tipo_parto || "Não informado"}</p>
                        </div>
                    )}
                </div>

                {/* Controles do Carrossel */}
                <div className="flex justify-between w-full mt-auto">
                    {filhos.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                className="bg-brand-600 text-white p-4 rounded-full hover:bg-brand-700 transition-colors shadow-lg"
                            >
                                <MdArrowBack size={30} />
                            </button>

                            <button
                                onClick={next}
                                className="bg-brand-600 text-white p-4 rounded-full hover:bg-brand-700 transition-colors shadow-lg"
                            >
                                <MdArrowForward size={30} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Acompanhamento;
