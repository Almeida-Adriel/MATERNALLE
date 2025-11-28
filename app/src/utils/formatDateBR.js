const formatDateBR = (d) => {
  try {
    const dt = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
    if (isNaN(dt.getTime())) return '--/--/----';
    return dt.toLocaleDateString('pt-BR');
  } catch {
    return '--/--/----';
  }
};

export default formatDateBR