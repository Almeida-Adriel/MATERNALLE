import React from 'react'
import Header from '../components/DefaultHeader'
import Footer from '../components/DefaultFooter'

const Home = () => {
  return (
    <>
      <Header />

      <main class="flex-1">
        <section class="bg-gradient-to-b from-white to-brand-50">
            <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 p-6 md:p-10">
                <div class="flex flex-col justify-center">
                    <h1 class="text-3xl md:text-4xl font-bold text-brand-800">
                        Acompanhamento carinhoso para a sua maternidade
                    </h1>
                    <p class="mt-4 text-slate-600">
                        Centralize consultas, vacinas, exames e conteúdos confiáveis. Tudo em um só lugar,
                        feito para a rotina da mãe recente.
                    </p>
                    <div class="mt-6 flex gap-3">
                        <a class="px-5 py-3 rounded-full bg-brand-500 text-white hover:bg-brand-600" href="#">
                            Começar agora
                        </a>
                        <a class="px-5 py-3 rounded-full border border-brand-300 text-brand-700 hover:bg-brand-100"
                            href="#">
                            Ver conteúdos
                        </a>
                    </div>
                </div>
                <div class="bg-white rounded-2xl shadow p-6">
                    <h2 class="font-semibold text-brand-700">Próximos compromissos</h2>
                    <ul class="mt-4 space-y-3">
                        <li class="p-4 rounded-lg border border-brand-100 bg-white">
                            <p class="text-sm text-slate-500">Vacina • 16/10, 14:00</p>
                            <p class="font-medium">2ª dose Pentavalente</p>
                        </li>
                        <li class="p-4 rounded-lg border border-brand-100 bg-white">
                            <p class="text-sm text-slate-500">Pediatra • 18/10, 09:30</p>
                            <p class="font-medium">Consulta de acompanhamento</p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="max-w-6xl mx-auto p-6 md:p-10">
            <h3 class="text-xl font-semibold text-brand-800">Conteúdos recomendados</h3>
            <div class="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <article class="bg-white border border-brand-100 rounded-xl p-5 shadow-sm">
                    <h4 class="font-semibold text-brand-700">Amamentação sem dor</h4>
                    <p class="mt-2 text-sm text-slate-600">Dicas de pega correta e posições confortáveis.</p>
                    <button class="mt-4 text-brand-700 font-medium hover:underline">Ler mais</button>
                </article>
                <article class="bg-white border border-brand-100 rounded-xl p-5 shadow-sm">
                    <h4 class="font-semibold text-brand-700">Sono do bebê</h4>
                    <p class="mt-2 text-sm text-slate-600">Rotinas simples para noites mais tranquilas.</p>
                    <button class="mt-4 text-brand-700 font-medium hover:underline">Ler mais</button>
                </article>
                <article class="bg-white border border-brand-100 rounded-xl p-5 shadow-sm">
                    <h4 class="font-semibold text-brand-700">Pós-parto real</h4>
                    <p class="mt-2 text-sm text-slate-600">O que esperar do puerpério e como se cuidar.</p>
                    <button class="mt-4 text-brand-700 font-medium hover:underline">Ler mais</button>
                </article>
            </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Home