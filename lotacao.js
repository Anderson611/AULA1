const calculartaxa = () => {
    const form = document.forms["taxa"];

    const quantidade = parseFloat(form.elements["quantidade"].value);
    const area = parseFloat(form.elements["area"].value);
    const peso = parseFloat(form.elements["peso"].value);
    const porcentagem = parseFloat(form.elements["porcentagem"].value);
    const animais = parseFloat(form.elements["animais"].value);
    const dias = parseFloat(form.elements["dias"].value);
    const valor=parseFloat(form.elements["valor"].value);

    if (isNaN(quantidade) || isNaN(area) || isNaN(peso) || isNaN(porcentagem) || isNaN(animais) || isNaN(dias)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Massa seca da pastagem na área
    const MS = quantidade * area * 10000 * 0.25;

    // Forragem disponível para consumo de matéria seca
    const disponivel = MS * 0.7 * 0.5;

    // Consumo diário total dos animais
    const consumoDiario = ((peso * porcentagem) / 100) * animais;

    // Consumo total no período
    const consumoForragem = consumoDiario * dias;

    // Capacidade de suporte da área em dias
    const diassuporte = (disponivel / consumoForragem).toFixed(2);

    // Capacidade de UA/ha
    const capacidadesuporte = (((peso*animais)/450)/area).toFixed(2);

    let mensagem = "";

    if (capacidadesuporte < valor) {
        mensagem = `A área está em risco de subpastejo, pois apresentou um valor menor que ${valor} UA/ha (${capacidadesuporte} UA/ha). Grande parte da forragem terá perdas devido à senescência e à lignificação. Levando em consideração a quantidade de animais, a área suporta no máximo ${(diassuporte*dias)} dias de pastejo continuo. É necessário ajustar a UA/ha para aumentar o número de animais.`;

    } else if (capacidadesuporte >= valor && capacidadesuporte <= 1.2) {
        mensagem = `A capacidade de suporte da área está sendo respeitada. Perdas por senescência e redução da qualidade nutricional da pastagem serão evitadas. Valor da capacidade suporte: ${capacidadesuporte} UA/ha. Levando em consideração a quantidade de animais, a área suporta no máximo ${(diassuporte*dias)} dias de pastejo continuo. Não necessitando ajustar o número de animais.`;

    } else {
        mensagem = `A capacidade de suporte da área não está sendo respeitada. O excesso de animais pode causar desertificação e prejudicar a rebrota da forrageira. Valor da capacidade suporte calculada é igual a: ${capacidadesuporte} UA/ha. Levando em consideração a quantidade de animais, a área suporta no máximo ${(diassuporte*dias)} dias de pastejo continuo. Deve-se ajustar a UA/ha para diminuir o número de animais.`;
    }

    alert(mensagem);
};

function gerarPDF() {
    const element = document.createElement('div');
    element.innerHTML = `
        <h2 style='text-align: center;'>Relatório de Taxa de Lotação</h2>
        <p><strong>Média de peso dos animais:</strong> ${document.getElementById("peso").value} Kg</p>
        <p><strong>Porcentagem de consumo:</strong> ${document.getElementById("porcentagem").value}%</p>
        <p><strong>Número de animais:</strong> ${document.getElementById("animais").value}</p>
        <p><strong>Matéria verde coletada:</strong> ${document.getElementById("quantidade").value} Kg/m²</p>
        <p><strong>Área de pastejo:</strong> ${document.getElementById("area").value} ha</p>
        <p><strong>Dias de pastejo:</strong> ${document.getElementById("dias").value}</p>
    `;

    const peso = parseFloat(document.getElementById("peso").value) || 0;
    const porcentagem = parseFloat(document.getElementById("porcentagem").value) || 0;
    const animais = parseFloat(document.getElementById("animais").value) || 0;
    const quantidade = parseFloat(document.getElementById("quantidade").value) || 0;
    const area = parseFloat(document.getElementById("area").value) || 0;
    const dias = parseFloat(document.getElementById("dias").value) || 0;
    const valor = parseFloat(document.getElementById("valor").value) || 0;

    if (peso === 0 || porcentagem === 0 || animais === 0 || quantidade === 0 || area === 0 || dias === 0 || valor === 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const MS = quantidade * area * 10000 * 0.25;
    const disponivel = MS * 0.7 * 0.5;
    const consumoDiario = ((peso * porcentagem) / 100) * animais;
    const consumoForragem = consumoDiario * dias;
    const diassuporte = (disponivel / consumoForragem).toFixed(2);
    const capacidadesuporte = (((peso * animais) / 450) / area).toFixed(2);

    let mensagem = "";

    if (capacidadesuporte < valor) {
        mensagem = `A área está em risco de subpastejo, pois apresentou um valor menor que ${valor} UA/ha (${capacidadesuporte} UA/ha). Grande parte da forragem terá perdas devido à senescência e à lignificação. Levando em consideração a quantidade de animais, a área suporta no máximo ${(diassuporte * dias).toFixed(2)} dias de pastejo contínuo. É necessário ajustar a UA/ha para aumentar o número de animais.`;
    } else if (capacidadesuporte >= valor && capacidadesuporte <= 1.2) {
        mensagem = `A capacidade de suporte da área está sendo respeitada. Perdas por senescência e redução da qualidade nutricional da pastagem serão evitadas. Valor da capacidade suporte: ${capacidadesuporte} UA/ha. Levando em consideração a quantidade de animais, a área suporta no máximo ${(diassuporte * dias).toFixed(2)} dias de pastejo contínuo. Não necessitando ajustar o número de animais.`;
    } else {
        mensagem = `A capacidade de suporte da área não está sendo respeitada. O excesso de animais pode causar desertificação e prejudicar a rebrota da forrageira. Valor da capacidade suporte calculada é igual a: ${capacidadesuporte} UA/ha. Levando em consideração a quantidade de animais, a área suporta no máximo ${(diassuporte * dias).toFixed(2)} dias de pastejo contínuo. Deve-se ajustar a UA/ha para diminuir o número de animais.`;
    }

    element.innerHTML += `<p><strong>Capacidade de suporte:</strong> ${capacidadesuporte} UA/ha</p>`;
    element.innerHTML += `<h3>Conclusão:</h3><p style="white-space: pre-line;">${mensagem}</p>`;

    document.body.appendChild(element); // Adiciona temporariamente ao DOM para garantir renderização completa

    setTimeout(() => {
        html2pdf().from(element).save("taxa_lotacao.pdf").then(() => {
            document.body.removeChild(element); // Remove após a geração do PDF
        });
    }, 500); // Pequeno atraso para garantir que o HTML seja renderizado
}



