const buscarUfEMunicipio = async (latitude, longitude) => {
    const apiUrl = `https://brasilapi.com.br/api/geo/v1/reverse?latitude=${latitude}&longitude=${longitude}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            // Lança um erro se a resposta HTTP não for bem-sucedida (ex: 404, 500)
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // A Brasil API retorna um array de objetos de localização.
        // O primeiro elemento (índice 0) é o mais provável/próximo.
        if (data && data.length > 0) {
            const primeiroResultado = data[0];

            // A estrutura de resposta da Brasil API para este endpoint é geralmente:
            // data[0].state e data[0].city

            return {
                uf: primeiroResultado.state, // Sigla da Unidade Federativa
                municipio: primeiroResultado.city // Nome do Município
            };
        } else {
            // Retorna null se a API não encontrar um resultado para as coordenadas
            console.log("Nenhum município encontrado para as coordenadas.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar UF e Município:", error);
        // Em caso de erro, retorna null
        return null;
    }
}

export { buscarUfEMunicipio }