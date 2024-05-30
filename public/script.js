document.addEventListener('DOMContentLoaded', async function () {
    getSelic();
});

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
                    break;
                case 'pre_radio':
                    document.getElementById('rent_pre').style.display = 'flex';
                    document.getElementById('rent_pos').style.display = 'none';
                    document.getElementById('rent_ipca').style.display = 'none';
                    break;
                case 'ipca_radio':
                    document.getElementById('rent_ipca').style.display = 'flex';
                    document.getElementById('rent_pos').style.display = 'none';
                    document.getElementById('rent_pre').style.display = 'none';
                    break;
                default:
                    document.getElementById('rent_pos').style.display = 'block';
                    document.getElementById('rent_pre').style.display = 'none';
                    document.getElementById('rent_ipca').style.display = 'none';
            }
        }
    }
}

let selicValue; // Definindo a variável global

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

function calcularInvestimento(valorInicial, valorMensal, prazoMeses, rentabilidade, calcularImposto) {

    valorInicial = valorInicial || 0;
    valorMensal = valorMensal || 0;

    // calcula a rentabilidade mensal com base na anual
    var rentabFinal = rentabilidade / 100;
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

    // Exibindo os totais
    let mensagem = "Valor total bruto: R$ " + montanteFinal + "\n";
    mensagem += "Total investido: R$ " + totalInvestido + "\n";
    mensagem += "Impostos pagos: R$ " + imposto + "\n";
    mensagem += "Alíquota do imposto: " + aliquotaImposto + "%\n";
    mensagem += "Rendimento líquido: R$ " + (rentabilidade - imposto) + "\n";
    mensagem += "Total líquido: R$ " + (montanteFinal - imposto) + "\n";

    alert(mensagem);

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
        notification("Informe algum valor para calcular")
        return
    }

    if (!(tipoInvestimentoElement && tipoRentabilidadeElement)) {
        notification("Selecione o tipo de investimento e rentabilidade")
        return
    }

    if (!prazo) {
        notification("Digite o prazo em anos, meses ou dias")
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
                notification("Defina a rentabilidade do investimento")
                return
            }

            // calcula a rentabilidade mensal com base na anual
            var cdiValue = selicValue - 0.1;
            var rentabilidade = rentabilidadePos * cdiValue / 100;

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidade, true)



            /* CDB PRÉ-FIXADO */
        } else if (tipoRentabilidade === "pre_radio") {

            if (!rentabilidadePre) {
                notification("Defina a rentabilidade do investimento")
                return
            }

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidadePre, true)

            /* CDB IPCA */
        } else if (tipoRentabilidade === "ipca_radio") {

            if (!rentabilidadeIpca) {
                notification("Defina a rentabilidade do investimento")
                return
            }

            notification("Essa opção ainda está sendo desenvolvida")

        }

        /* LCIs */
    } else if (tipoInvestimento === "lci_radio") {

        /* LCI PÓS-FIXADO */
        if (tipoRentabilidade === "pos_radio") {

            if (!rentabilidadePos) {
                notification("Defina a rentabilidade do investimento")
                return
            }

            // calcula a rentabilidade mensal com base na anual
            var cdiValue = selicValue - 0.1;
            var rentabilidade = rentabilidadePos * cdiValue / 100;

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidade, false)


            // rentabilidade pós-fixada
        } else if (tipoRentabilidade === "pre_radio") {

            if (!rentabilidadePre) {
                notification("Defina a rentabilidade do investimento")
                return
            }

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidadePre, true)

        } else if (tipoRentabilidade === "ipca_radio") {

            if (!rentabilidadeIpca) {
                notification("Defina a rentabilidade do investimento")
                return
            }

            notification("Essa opção ainda está sendo desenvolvida")

        }

    } else if (tipoInvestimento === "tesouro_radio") {

        // rentabilidade pós-fixada
        if (tipoRentabilidade === "pos_radio") {

            if (!rentabilidadePos) {
                notification("Defina a rentabilidade do investimento")
                return
            }

            // calcula a rentabilidade mensal com base na anual
            var cdiValue = selicValue - 0.1;
            var rentabilidade = rentabilidadePos * cdiValue / 100;

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidade, true)

            // rentabilidade pós-fixada
        } else if (tipoRentabilidade === "pre_radio") {

            if (!rentabilidadePre) {
                notification("Defina a rentabilidade do investimento")
                return
            }

            calcularInvestimento(valorInicial, valorMensal, prazoFinal, rentabilidadePre, true)

        } else if (tipoRentabilidade === "ipca_radio") {

            if (!rentabilidadeIpca) {
                notification("Defina a rentabilidade do investimento")
                return
            }
            notification("Essa opção ainda está sendo desenvolvida")

        }

    } else if (tipoInvestimento === "poupanca_radio") {
        notification("Essa opção ainda está sendo desenvolvida")
    }
}

// Calcular investimento ao clicar no botão "Simular"
document.getElementById('simularButton').addEventListener('click', handleSimulation);
