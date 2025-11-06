const buscarUfEMunicipio = async (latitude, longitude) => {
    const apiUrl = `https://brasilapi.com.br/api/geo/v1/reverse?latitude=${latitude}&longitude=${longitude}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const primeiroResultado = data[0];

            return {
                uf: primeiroResultado.state,
                municipio: primeiroResultado.city
            };
        } else {
            console.log("Nenhum município encontrado para as coordenadas.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar UF e Município:", error);
        return null;
    }
};

const buscarPostosSaude = async (uf, municipio) => {
    const apiUrl = `https://apidadosabertos.saude.gov.br/cnes/estabelecimentos?uf=${uf}&municipio=${municipio}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erro na requisição para postos de saúde: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return data; // Retorna os postos de saúde encontrados
        } else {
            console.log("Nenhum posto de saúde encontrado.");
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar postos de saúde:", error);
        return [];
    }
};

const obterPostosDeSaudeProximos = async (latitude, longitude) => {
    const resultadoMunicipio = await buscarUfEMunicipio(latitude, longitude);

    if (resultadoMunicipio) {
        const { uf, municipio } = resultadoMunicipio;
        const postos = await buscarPostosSaude(uf, municipio);

        return postos; 
    } else {
        console.log("Não foi possível determinar o município e a UF.");
        return [];
    }
};

export { obterPostosDeSaudeProximos };