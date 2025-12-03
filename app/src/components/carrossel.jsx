const ConteudoCard = ({ titulo, descricao, id }) => (
  <div className="min-w-[250px] max-w-[340px] min-h-40 bg-white border border-brand-100 rounded-xl shadow p-4 mr-4 flex-shrink-0 hover:shadow-xl">
    <a href={`/conteudos/${id}`}>
      <h3 className="font-semibold text-brand-700 text-lg truncate">
        {titulo}
      </h3>
      <p className="text-sm text-slate-600 mt-2 line-clamp-4">{descricao}</p>
    </a>
  </div>
);

const CarrosselConteudos = ({ conteudos = [] }) => {
  const ultimosConteudos = conteudos.slice(0, 4);

  if (!conteudos.length) {
    return (
      <p className="text-slate-500 italic">
        Nenhum conteúdo disponível no momento.
      </p>
    );
  }

  return (
    <div className="flex max-w-full">
      <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
        {ultimosConteudos.map((c) => (
          <ConteudoCard
            key={c.id}
            titulo={c.titulo}
            descricao={c.descricao}
            id={c.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CarrosselConteudos;
