import React from 'react'
import Header from '../components/DefaultHeader'
import Footer from '../components/DefaultFooter'

const Home = () => {
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-brand-50">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 p-6 md:p-10">
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-brand-800">
                        Acompanhamento carinhoso para a sua maternidade
                    </h1>
                    <p className="mt-4 text-slate-600">
                        Centralize consultas, vacinas, exames e conteúdos confiáveis. Tudo em um só lugar,
                        feito para a rotina da mãe recente.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <a className="px-5 py-3 rounded-full bg-brand-500 text-white hover:bg-brand-600" href="/login">
                            Começar agora
                        </a>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold text-brand-700">Próximos compromissos</h2>
                    <ul className="mt-4 space-y-3">
                        <li className="p-4 rounded-lg border border-brand-100 bg-white">
                            <p className="text-sm text-slate-500">Vacina • 16/10, 14:00</p>
                            <p className="font-medium">2ª dose Pentavalente</p>
                        </li>
                        <li className="p-4 rounded-lg border border-brand-100 bg-white">
                            <p className="text-sm text-slate-500">Pediatra • 18/10, 09:30</p>
                            <p className="font-medium">Consulta de acompanhamento</p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <section className="max-w-6xl mx-auto p-6 md:p-10">
            <h3 className="text-xl font-semibold text-brand-800">Conteúdos recomendados</h3>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <article className="bg-white border border-brand-100 rounded-xl p-5 shadow-sm">
                    <h4 className="font-semibold text-brand-700">Amamentação sem dor</h4>
                    <p className="mt-2 text-sm text-slate-600">Dicas de pega correta e posições confortáveis.</p>
                    <button className="mt-4 text-brand-700 font-medium hover:underline">Ler mais</button>
                </article>
                <article className="bg-white border border-brand-100 rounded-xl p-5 shadow-sm">
                    <h4 className="font-semibold text-brand-700">Sono do bebê</h4>
                    <p className="mt-2 text-sm text-slate-600">Rotinas simples para noites mais tranquilas.</p>
                    <button className="mt-4 text-brand-700 font-medium hover:underline">Ler mais</button>
                </article>
                <article className="bg-white border border-brand-100 rounded-xl p-5 shadow-sm">
                    <h4 className="font-semibold text-brand-700">Pós-parto real</h4>
                    <p className="mt-2 text-sm text-slate-600">O que esperar do puerpério e como se cuidar.</p>
                    <button className="mt-4 text-brand-700 font-medium hover:underline">Ler mais</button>
                </article>
            </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Home