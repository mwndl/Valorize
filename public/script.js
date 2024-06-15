document.addEventListener('DOMContentLoaded', async function () {
    getSelic();
    getTRMediaMensal();
    setElementTitles(selectedLanguage)
});

var brFlag = document.getElementById('brFlag')
var usFlag = document.getElementById('usFlag')

brFlag.addEventListener('click', function() {
    changeLanguage('en');
    brFlag.style.display = 'none'
    usFlag.style.display = 'block'
});

usFlag.addEventListener('click', function() {
    changeLanguage('pt');
    brFlag.style.display = 'block'
    usFlag.style.display = 'none'
});

let selectedLanguage = 'pt';

function changeLanguage(language) {
    // Atualiza o valor do idioma selecionado na variável global
    selectedLanguage = language;

    const elementsToTranslate = document.querySelectorAll('[id]');
    // Feche o simulador para evitar elementos dinâmicos não traduzidos
    simularNovamenteButton();
    setElementTitles(language)

    elementsToTranslate.forEach(element => {
        const key = element.id;
        if (translations[selectedLanguage][key]) {
            if (element.querySelector('span')) {
                // Tratamento especial para elementos com span
                element.firstChild.textContent = translations[selectedLanguage][key];
            } else {
                // Para outros elementos
                element.textContent = translations[selectedLanguage][key];
            }
        }
    });
}

function setElementTitles(selectedLanguage) {
    document.getElementById('flagDiv').title = translations[selectedLanguage]['flagDivTitle'];
    document.getElementById('simularButton').title = translations[selectedLanguage]['simularButtonTitle'];
    document.getElementById('developerNameLabel').title = translations[selectedLanguage]['developerNameTitle'];
    document.getElementById('bmac2Label').title = translations[selectedLanguage]['bmac2LabelTitle'];
    document.getElementById('github_icon').title = translations[selectedLanguage]['githubIconTitle'];

}


/* SISTEMA DE OCULTAR SIMULADORES */
var divSimulator = document.querySelector('.simulator');
var divSimularNovamente = document.querySelector('#simular_novamente');
var divResultados = document.querySelector('#simulador_resultados')

divSimularNovamente.addEventListener('click', simularNovamenteButton());

function simularNovamenteButton() {
    divSimularNovamente.style.display = 'none'
    divResultados.style.display = 'none'

    if (divSimulator.style.display === 'none') {
        divSimulator.style.display = 'block';
    }
}

/*  ************************ */

function notification(customMessage) {
    const notification_div = document.getElementById("notification");
    const message = document.getElementById("notification-message");
    message.textContent = customMessage;
    notification_div.style.opacity = 1;
    notification_div.classList.remove("hidden");

    setTimeout(() => {
        notification_div.style.opacity = 0;
        setTimeout(() => {
            notification_div.classList.add("hidden");
            message.textContent = ''
            message.style = ''
        }, 500);
    }, 4000); // Tempo de exibição
};

// Formatar valores monetários (inputs valor inicial e mensal)
var valorInicialInput = document.getElementById('valor_inicial');
var valorMensalInput = document.getElementById('valor_mensal');

formatarValorInicial();
formatarValorMensal();

valorInicialInput.addEventListener('input', formatarValorInicial);
valorMensalInput.addEventListener('input', formatarValorMensal);

function formatarValorInicial() {
    valorInicialInput.value = formatarValor(valorInicialInput.value);
}

function formatarValorMensal() {
    valorMensalInput.value = formatarValor(valorMensalInput.value);
}

function formatarValor(valor) {
    valor = valor.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos
    if (valor.indexOf('.') !== -1) { // Verifica se o valor é decimal
        var partes = valor.split('.'); // Divide o valor em partes inteira e decimal
        valor = partes[0].replace(/^0+/, '') + '.' + partes[1]; // Remove zeros à esquerda apenas da parte inteira
    } else if (valor.length > 2) {
        valor = valor.replace(/^0+/, ''); // Remove zeros à esquerda
        valor = valor.replace(/(\d{2})$/, ',$1'); // Insere vírgula antes dos últimos dois dígitos
        if (valor.startsWith(',')) {
            valor = '0' + valor; // Adiciona zero à esquerda se começar com vírgula
        }
    } else if (valor.length === 2) {
        valor = '0,' + valor;
    } else if (valor.length === 1) {
        valor = '0,0' + valor;
    }

    // Formatação para números acima de 1000,00
    if (parseFloat(valor) >= 1000) {
        var partes = valor.split(',');
        var parteInteira = partes[0];
        var parteDecimal = partes.length > 1 ? ',' + partes[1] : '';
        parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona ponto a cada três dígitos da parte inteira
        valor = parteInteira + parteDecimal;
    }

    return valor;
}

// Função para formatar a data no formato dd/mm/yyyy
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Exibir e ocultar inputs de rentabilidade com base no tipo
var radios = document.getElementsByName('rentabilidade_tipo');
radios.forEach(function (radio) {
    radio.addEventListener('change', showRentInputs);
});

function showRentInputs() {
    var radios = document.getElementsByName('rentabilidade_tipo');

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            var valorSelecionado = radios[i].value;

            // Executar ação com base no valor selecionado
            switch (valorSelecionado) {
                case 'pos_radio':
                    document.getElementById('rent_pos').style.display = 'flex';
                    document.getElementById('rent_pre').style.display = 'none';
                    document.getElementById('rent_ipca').style.display = 'none';
                    document.getElementById('rent_poupanca').style.display = 'none';
                    break;
                case 'pre_radio':
                    document.getElementById('rent_pre').style.display = 'flex';
                    document.getElementById('rent_pos').style.display = 'none';
                    document.getElementById('rent_ipca').style.display = 'none';
                    document.getElementById('rent_poupanca').style.display = 'none';
                    break;
                case 'ipca_radio':
                    document.getElementById('rent_ipca').style.display = 'flex';
                    document.getElementById('rent_pos').style.display = 'none';
                    document.getElementById('rent_pre').style.display = 'none';
                    document.getElementById('rent_poupanca').style.display = 'none';
                    break;
                default:
                    document.getElementById('rent_pos').style.display = 'block';
                    document.getElementById('rent_pre').style.display = 'none';
                    document.getElementById('rent_ipca').style.display = 'none';
                    document.getElementById('rent_poupanca').style.display = 'none';
            }
        }
    }
}

function converterReais(valor) {
    // Utiliza toLocaleString para formatar o número
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function converterParaDuasCasas(valor) {
    return valor.toFixed(2).replace('.', ',');
}

let selicValue; // Definindo a variável global
let trValue;
let rentPoupanca;

async function getSelic() {
    try {
        // Faz a solicitação usando a API Fetch
        const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');

        // Verifica se a resposta da API foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao obter os dados. Status: ' + response.status);
        }

        // Obtém o valor SELIC da resposta
        const data = await response.json();
        selicValue = data[0].valor; // Definindo o valor da variável global

        // Retorna o valor SELIC
        return selicValue;
    } catch (error) {
        // Lança o erro para ser tratado pelo chamador da função
        throw error;
    }
}

async function getTRMediaMensal() {
    try {
        // Data de hoje
        const dataFinal = new Date();

        // Data inicial (30 dias atrás)
        const dataInicial = new Date();
        dataInicial.setDate(dataInicial.getDate() - 30);

        // Formata as datas
        const dataInicialFormatada = formatDate(dataInicial);
        const dataFinalFormatada = formatDate(dataFinal);

        // URL da API com as datas formatadas
        const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.226/dados?formato=json&dataInicial=${dataInicialFormatada}&dataFinal=${dataFinalFormatada}`;

        // Faz a solicitação usando a API Fetch
        const response = await fetch(url);

        // Verifica se a resposta da API foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao obter os dados. Status: ' + response.status);
        }

        // Obtém os dados da resposta
        const data = await response.json();

        // Calcula a média dos valores de TR
        const valores = data.map(item => parseFloat(item.valor));
        const soma = valores.reduce((acc, valor) => acc + valor, 0);
        const mediaTR = soma / valores.length;

        // Atualiza a variável trValue
        trValue = mediaTR;

        // Retorna a média
        return mediaTR;
    } catch (error) {
        // Lança o erro para ser tratado pelo chamador da função
        throw error;
    }
}

function getPoupancaRent() {

    if (selicValue < 8.5) {
        console.log('selic abaixo de 8.5%')
        rentPoupanca = selicValue * 0.7;
    } else {
        console.log('selic acima de 8.5%')
        let monthlyRate = 0.005; // 0.5% em decimal
        rentPoupanca = (Math.pow(1 + monthlyRate, 12) - 1) * 100; // Calcula a rentabilidade anual
    }
    return rentPoupanca;
}

// Função que será acionada quando o estado de um radio button mudar
function handleRadioChange(event) {
    const selectedValue = event.target.value;

    // Realiza ações específicas com base no valor selecionado
    switch (selectedValue) {
        case 'cdb_radio':
            showRendType()
            break;
        case 'lci_radio':
            showRendType()
            break;
        case 'tesouro_radio':
            showRendType()
            break;
        case 'poupanca_radio':
            hideRentType()
            let rentPoupanca = getPoupancaRent();

            document.getElementById('rent_pos').style.display = 'none';
            document.getElementById('rent_pre').style.display = 'none';
            document.getElementById('rent_ipca').style.display = 'none';
            document.getElementById('rent_poupanca').style.display = 'flex';
            document.getElementById('rent_input_poupanca').value = rentPoupanca.toFixed(2)
            
            break;
        default:
            console.log("Nenhuma opção válida selecionada");
            break;
    }
}

function hideRentType() {
    document.getElementById('unavailable_overlay').style.display = 'block';
    const rentabilidadeRadios = document.querySelectorAll('input[name="rentabilidade_tipo"]');
    rentabilidadeRadios.forEach(radio => {
        radio.checked = false;
    });
}

function showRendType() {
    document.getElementById('unavailable_overlay').style.display = 'none';

    document.getElementById('rent_pos').style.display = 'none';
    document.getElementById('rent_pre').style.display = 'none';
    document.getElementById('rent_ipca').style.display = 'none';
    document.getElementById('rent_poupanca').style.display = 'none';

    const rentabilidadeRadios = document.querySelectorAll('input[name="rentabilidade_tipo"]');
    rentabilidadeRadios.forEach(radio => {
        radio.checked = false;
    });
}

// Seleciona todos os inputs de radio
const radioButtons = document.querySelectorAll('input[name="investimento_tipo"]');

// Adiciona um event listener para cada radio button
radioButtons.forEach(radio => {
    radio.addEventListener('change', handleRadioChange);
});


function calcularInvestimento(valorInicial, valorMensal, prazoMeses, rentabilidadeInicial, calcularImposto) {

    valorInicial = valorInicial || 0;
    valorMensal = valorMensal || 0;

    // calcula a rentabilidade mensal com base na anual
    var rentabFinal = rentabilidadeInicial / 100;
    var rentabilidadeMensal = Math.pow(1 + rentabFinal, 1 / 12) - 1;

    // calcuma o valor futuro dos depósitos mensais
    var montanteFinal = 0;
    for (var i = 1; i <= prazoMeses; i++) {
        montanteFinal += valorMensal * Math.pow(1 + rentabilidadeMensal, prazoMeses - i);
    }

    // add o valor futuro do investimento inicial
    montanteFinal += valorInicial * Math.pow(1 + rentabilidadeMensal, prazoMeses);

    // arredonda para duas casas decimais
    montanteFinal = Math.round(montanteFinal * 100) / 100;

    // calcula o total bruto, o total investido e a rentabilidade
    var totalBruto = montanteFinal;
    var totalInvestido = valorInicial + (valorMensal * prazoMeses);
    var rentabilidade = totalBruto - totalInvestido;

    // calcula o imposto
    var aliquotaImposto = 0;
    var imposto = 0;
    var prazoDias = prazoMeses * 30;

    if (calcularImposto) {
        if (prazoDias < 180) {
            aliquotaImposto = 22.5;
            imposto = rentabilidade * 0.225;
        } else if (prazoDias < 360) {
            aliquotaImposto = 20;
            imposto = rentabilidade * 0.20;
        } else if (prazoDias < 720) {
            aliquotaImposto = 17.5;
            imposto = rentabilidade * 0.175;
        } else {
            aliquotaImposto = 15;
            imposto = rentabilidade * 0.15;
        }

        // arredonda o imposto para duas casas decimais
        imposto = Math.round(imposto * 100) / 100;
    }

    /* EXIBINDO OS TOTAis */ 
    var valorBrutoDiv = document.getElementById('valor_bruto');
    var totalInvestidoDiv = document.getElementById('total_investido');
    var rendimentoJurosDiv = document.getElementById('rendimento_juros');
    var aliquotaDiv = document.getElementById('aliquota_ir');
    var impostoRendaDiv = document.getElementById('imposto_renda');
    var totalLiquidoDiv = document.getElementById('total_liquido');

    var investimentoInicialP = document.getElementById('investimento_inicial_p');
    var investimentoMensalP = document.getElementById('investimento_mensal_p');
    var prazoP = document.getElementById('prazo_p');
    var rentabilidadeP = document.getElementById('rentabilidade_p');

    valorBrutoDiv.textContent = converterReais(montanteFinal);
    totalInvestidoDiv.textContent = converterReais(totalInvestido);
    rendimentoJurosDiv.textContent = converterReais(rentabilidade - imposto);
    aliquotaDiv.textContent = `${aliquotaImposto} %`;
    impostoRendaDiv.textContent = converterReais(imposto);
    totalLiquidoDiv.textContent = converterReais(montanteFinal - imposto);

    divSimulator.style.display = 'none';
    divSimularNovamente.style.display = 'flex';
    divResultados.style.display = 'block';

    investimentoInicialP.textContent = converterReais(valorInicial);
    investimentoMensalP.textContent = converterReais(valorMensal);
    prazoP.textContent = `${prazoMeses} ${translations[selectedLanguage]['months']}`;
    rentabilidadeP.textContent = `${converterParaDuasCasas(rentabilidadeInicial)}% ${translations[selectedLanguage]['perYear']}`;

}

function handleSimulation() {
    function converterParaFloat(valor) {
        // Remove o '.' que separa a casa milhar
        valor = valor.replace('.', '');
        return parseFloat(valor);
    }

    // Obtém os valores dos campos de entrada e converte para float usando a função converterParaFloat
    var valorInicial = converterParaFloat(document.getElementById('valor_inicial').value);
    var valorMensal = converterParaFloat(document.getElementById('valor_mensal').value);
    var rentabilidadePos = converterParaFloat(document.getElementById('rent_input_pos').value);
    var rentabilidadePre = converterParaFloat(document.getElementById('rent_input_pre').value);
    var rentabilidadeIpca = converterParaFloat(document.getElementById('rent_input_ipca').value);

    var prazo = parseFloat(document.getElementById('prazo').value);
    var prazoTipo = document.getElementById('time_period').value;
    var tipoInvestimentoElement = document.querySelector('input[name="investimento_tipo"]:checked');
    var tipoRentabilidadeElement = document.querySelector('input[name="rentabilidade_tipo"]:checked');


    if (tipoInvestimentoElement) {
        var tipoInvestimento = tipoInvestimentoElement.value;
    }

    if (tipoRentabilidadeElement) {
        var tipoRentabilidade = tipoRentabilidadeElement.value;
    }


    // tratamento de erros
    if (!valorInicial && !valorMensal) {
        notification(translations[selectedLanguage]['missingValueError'])
        return
    }

    if (tipoInvestimento !== "poupanca_radio") {

        if (!(tipoInvestimentoElement && tipoRentabilidadeElement)) {
            notification(translations[selectedLanguage]['selectTypeAndProfitError'])
            return
        }

    }

    if (!prazo) {
        notification(translations[selectedLanguage]['missingTermError'])
        return
    }


    // converter prazo para meses (caso em anos)
    if (prazoTipo === "2") {
        prazoFinal = prazo * 12;
    } else if (prazoTipo === "1") {
        prazoFinal = prazo;
    } else if (prazoTipo === "0") {
        prazoFinal = prazo / 30;
    }

    valorInicial = valorInicial || 0;
    valorMensal = valorMensal || 0;

    /* CDBs */
    if (tipoInvestimento === "cdb_radio") {

        /* CDB PÓS-FIXADO */
        if (tipoRentabilidade === "pos_radio") {

            if (!rentabilidadePos) {
                notification(translations[selectedLanguage]['missingProfitError'])
                return
            }

            // calcula a rentabilidade mensal com base na anual
            var cdiValue = selicValue - 0.1;
            var rentabilidade = rentabilidadePos * cdiValue / 100;

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidade, true)



            /* CDB PRÉ-FIXADO */
        } else if (tipoRentabilidade === "pre_radio") {

            if (!rentabilidadePre) {
                notification(translations[selectedLanguage]['missingProfitError'])
                return
            }

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidadePre, true)

            /* CDB IPCA */
        } else if (tipoRentabilidade === "ipca_radio") {

            if (!rentabilidadeIpca) {
                notification(translations[selectedLanguage]['missingProfitError'])
                return
            }

            notification(translations[selectedLanguage]['unavailableOptionError'])

        }

        /* LCIs */
    } else if (tipoInvestimento === "lci_radio") {

        /* LCI PÓS-FIXADO */
        if (tipoRentabilidade === "pos_radio") {

            if (!rentabilidadePos) {
                notification(translations[selectedLanguage]['missingProfitError'])
                return
            }

            // calcula a rentabilidade mensal com base na anual
            var cdiValue = selicValue - 0.1;
            var rentabilidade = rentabilidadePos * cdiValue / 100;

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidade)


            // rentabilidade pós-fixada
        } else if (tipoRentabilidade === "pre_radio") {

            if (!rentabilidadePre) {
                notification(translations[selectedLanguage]['missingProfitError'])
                return
            }

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidadePre)

        } else if (tipoRentabilidade === "ipca_radio") {

            if (!rentabilidadeIpca) {
                notification(translations[selectedLanguage]['missingProfitError'])
                return
            }

            notification(translations[selectedLanguage]['unavailableOptionError'])

        }

    } else if (tipoInvestimento === "tesouro_radio") {

        // rentabilidade pós-fixada
        if (tipoRentabilidade === "pos_radio") {

            if (!rentabilidadePos) {
                notification(translations[selectedLanguage]['missingProfitError'])
                return
            }

            // calcula a rentabilidade mensal com base na anual
            var cdiValue = selicValue - 0.1;
            var rentabilidade = rentabilidadePos * cdiValue / 100;

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidade, 'true')

            // rentabilidade pós-fixada
        } else if (tipoRentabilidade === "pre_radio") {

            if (!rentabilidadePre) {
                notification(translations[selectedLanguage]['missingProfitError'])
                return
            }

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidadePre, 'true')

        } else if (tipoRentabilidade === "ipca_radio") {

            if (!rentabilidadeIpca) {
                notification(translations[selectedLanguage]['missingProfitError'])
                return
            }
            notification(translations[selectedLanguage]['unavailableOptionError'])

        }

    } else if (tipoInvestimento === "poupanca_radio") {

        rentabilidade = getPoupancaRent()
        calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidade)
    }
}

// Calcular investimento ao clicar no botão "Simular"
document.getElementById('simularButton').addEventListener('click', handleSimulation);
