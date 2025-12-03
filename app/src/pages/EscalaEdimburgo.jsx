import React, { useState } from 'react';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import Service from '../utils/service/Service';

const service = new Service();

const questions = [
  {
    id: 'q1',
    question: 'Tenho me sentido feliz ou animada com as coisas do dia a dia.',
    options: ['Quase o tempo todo', 'Boa parte do tempo', 'Raramente', 'Nunca'],
  },
  {
    id: 'q2',
    question: 'Tenho chorado sem motivo aparente ou mais do que o normal.',
    options: ['Nunca', 'Às vezes', 'Com frequência', 'Quase todos os dias'],
  },
  {
    id: 'q3',
    question: 'Tenho conseguido dormir quando o bebê dorme.',
    options: [
      'Sim, durmo bem',
      'Durmo razoavelmente',
      'Tenho dificuldade para dormir',
      'Quase não consigo dormir',
    ],
  },
  {
    id: 'q4',
    question:
      'Tenho me sentido sobrecarregada ou incapaz de lidar com as tarefas diárias.',
    options: [
      'Não, estou dando conta',
      'Às vezes me sinto assim',
      'Frequentemente me sinto sobrecarregada',
      'Sinto que não estou conseguindo lidar com nada',
    ],
  },
  {
    id: 'q5',
    question: 'Tenho me sentido conectada com meu bebê.',
    options: [
      'Muito conectada',
      'Razoavelmente conectada',
      'Sinto dificuldade de conexão',
      'Quase não sinto vínculo',
    ],
  },
  {
    id: 'q6',
    question: 'Sinto prazer ou alegria em atividades que antes eu gostava.',
    options: [
      'Sim, normalmente',
      'Um pouco menos do que antes',
      'Quase não sinto mais',
      'Nada me dá prazer no momento',
    ],
  },
  {
    id: 'q7',
    question: 'Tenho me sentido ansiosa, nervosa ou em constante alerta.',
    options: ['Raramente', 'Algumas vezes', 'Frequentemente', 'O tempo todo'],
  },
  {
    id: 'q8',
    question: 'Tenho pensamentos negativos sobre mim como mãe.',
    options: [
      'Raramente ou nunca',
      'Às vezes',
      'Frequentemente',
      'Quase sempre',
    ],
  },
  {
    id: 'q9',
    question: 'Tenho pensado que seria melhor se eu não estivesse aqui.',
    options: [
      'Nunca',
      'Já pensei, mas passou',
      'Penso nisso com frequência',
      'Tenho pensamentos desse tipo todos os dias',
    ],
  },
];

const EscalaEdimburgo = () => {
  const [answers, setAnswers] = useState({});

  const handleChange = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option, // <- apenas texto, igual ao schema
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      return alert('Por favor, responda todas as perguntas.');
    }

    try {
      const response = await service.post(
        '/edimburgo/calcular',
        JSON.stringify(answers)
      );

      const data = await response.json();
      console.log(data);

      alert(`Pontuação: ${data.total}\n${data.classificacao}`);
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar o formulário.');
    }
  };

  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="w-full mx-auto py-10 px-4 max-w-3xl">
      {/* HEADER PADRÃO */}
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
          <MdOutlineHealthAndSafety size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-800">
            Teste de Edimburgo
          </h1>
          <p className="text-sm text-slate-500">
            Avaliação de sintomas emocionais das últimas semanas.
          </p>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mb-6">
        <div className="text-sm font-medium text-brand-900 mb-1">
          Progresso: {Object.keys(answers).length} de {questions.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-brand-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* FORM PADRÃO */}
      <div className="space-y-6 max-h-[600px] overflow-y-auto no-scrollbar">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
          >
            <p className="font-semibold text-brand-900 mb-3">{q.question}</p>

            <div className="space-y-2">
              {q.options.map((option, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={option}
                    className="h-4 w-4 text-brand-600"
                    onChange={() => handleChange(q.id, option)}
                    checked={answers[q.id] === option}
                    required
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-10 bg-brand-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-brand-700 transition-all cursor-pointer shadow-lg hover:scale-[1.01]"
      >
        Enviar respostas
      </button>
    </div>
  );
};

export default EscalaEdimburgo;
