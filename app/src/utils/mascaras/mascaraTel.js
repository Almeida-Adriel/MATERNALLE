const mascaraTelefone = (value) => {
  // Garantir que o valor seja uma string
  if (value === null || value === undefined) return '';

  value = value.replace(/\D/g, '').slice(0, 11);

  // Converte o valor para string se necessário
  value = String(value);

  // Remove tudo o que não for número
  value = value.replace(/\D/g, '');

  if (value.length === 0) return '';

  // Aplica o DDD
  if (value.length <= 2) {
    return `(${value}`;
  }

  if (value.length <= 6) {
    return `(${value.slice(0, 2)}) ${value.slice(2)}`;
  }

  if (value.length <= 10) {
    // Número fixo: (99) 9999-9999
    return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
  } else {
    // Número celular: (99) 99999-9999
    return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  }
};

export default mascaraTelefone;
