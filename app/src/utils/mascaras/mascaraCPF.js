function mascaraCpf(value) {
  if (value === null || value === undefined || value === '') return '';

  value = value.replace(/\D/g, '').slice(0, 11);

  if (value.length === 0) return '';

  value = value.replace(/^(\d{3})(\d)/, '$1.$2');
  value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  value = value.replace(
    /^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})(\d)/,
    '$1.$2.$3-$4'
  );

  return value;
}

export default mascaraCpf;