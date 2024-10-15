let senhas = [];
let gerandoSenhas = false;
let proximoNumeroGeral = 1;
let proximoNumeroIdoso = 1;
let proximoNumeroPreferencial = 1;

function gerarSenha(tipo) {
    if (!gerandoSenhas) return;

    const prefixo = tipo.substring(0, 3).toUpperCase();
    let numero;

    switch (tipo) {
        case "Geral":
            numero = proximoNumeroGeral;
            proximoNumeroGeral++;
            break;
        case "Idoso":
            numero = proximoNumeroIdoso;
            proximoNumeroIdoso++;
            break;
        case "Preferencial":
            numero = proximoNumeroPreferencial;
            proximoNumeroPreferencial++;
            break;
    }

    const senha = `${prefixo}${numero.toString().padStart(3, "0")}`;

    if (!senhas.includes(senha)) {
        senhas.push(senha);
    }
    return senha;
}

function exibirSenhas() {
    const senhaLista = document.querySelector(".senhas-geradas");
    let senhasHTML = "<h3>Senhas Geradas:</h3>";

    for (let i = 0; i < senhas.length; i++) {
        senhasHTML += `<p>${senhas[i]}</p>`;
    }

    senhaLista.innerHTML = senhasHTML;
}

document.getElementById("geral-btn").addEventListener("click", function () {
    const senha = gerarSenha("Geral");
    exibirSenhas();
});

document.getElementById("idoso-btn").addEventListener("click", function () {
    const senha = gerarSenha("Idoso");
    exibirSenhas();
});

document
    .getElementById("preferencial-btn")
    .addEventListener("click", function () {
        const senha = gerarSenha("Preferencial");
        exibirSenhas();
    });

function obterProximaSenha() {
    const ordenado = [...senhas].sort((a, b) => {
        const prioridadeA = a.startsWith("IDO")
            ? 1
            : a.startsWith("PRE")
            ? 2
            : 3;
        const prioridadeB = b.startsWith("IDO")
            ? 1
            : b.startsWith("PRE")
            ? 2
            : 3;
        return prioridadeA - prioridadeB;
    });

    return ordenado.length > 0 ? ordenado[0] : null;
}

function removerSenha(senha) {
    let novasSenhas = [];

    for (let i = 0; i < senhas.length; i++) {
        if (senhas[i] !== senha) {
            novasSenhas.push(senhas[i]);
        }
    }

    senhas = novasSenhas;
    exibirSenhas();
}

document.getElementById("login-btn").addEventListener("click", function () {
    const geralBtn = document.getElementById("geral-btn");
    const idosoBtn = document.getElementById("idoso-btn");
    const preferencialBtn = document.getElementById("preferencial-btn");

    geralBtn.classList.add("senha-ativa");
    idosoBtn.classList.add("senha-ativa");
    preferencialBtn.classList.add("senha-ativa");

    gerandoSenhas = true;

    const guiches = document.querySelectorAll(".guiche p:last-child");
    guiches.forEach(function (status) {
        status.innerHTML = '<button class="atender-btn">Atender</button>';
    });

    document.querySelectorAll(".atender-btn").forEach(function (button, index) {
        button.addEventListener("click", function () {
            const guiche = document.querySelectorAll(".guiche")[index];
            if (button.textContent === "Atender") {
                const proximaSenha = obterProximaSenha();
                if (proximaSenha) {
                    guiche.querySelector(
                        "p:first-child"
                    ).textContent = `Guichê ${
                        index + 1
                    } (atendendo ${proximaSenha})`;
                    button.textContent = "Finalizar Atendimento";
                    removerSenha(proximaSenha);
                }
            } else {
                const textoAtendimento =
                    guiche.querySelector("p:first-child").textContent;
                const senhaAtendida = textoAtendimento
                    .split("atendendo ")[1]
                    .replace(")", "");
                guiche.querySelector("p:first-child").textContent = `Guichê ${
                    index + 1
                }`;
                button.textContent = "Atender";

                const atendimentosConcluidos = document.querySelector(
                    ".lista-atendimentos-concluidos"
                );
                atendimentosConcluidos.innerHTML += `<p>${senhaAtendida}</p>`;
            }
        });
    });
});

document.getElementById("logout-btn").addEventListener("click", function () {

    const guiches = document.querySelectorAll(".guiche p:first-child");

    let atendimentoEmAndamento = false;
    for (let i = 0; i < guiches.length; i++) {
        if (guiches[i].textContent.includes("atendendo")) {
            atendimentoEmAndamento = true;
            break;
        }
    }

    if (atendimentoEmAndamento) {
        alert("Por favor, finalize todos os atendimentos antes do Logout.");
        return;
    }

    const geralBtn = document.getElementById("geral-btn");
    const idosoBtn = document.getElementById("idoso-btn");
    const preferencialBtn = document.getElementById("preferencial-btn");

    geralBtn.classList.remove("senha-ativa");
    idosoBtn.classList.remove("senha-ativa");
    preferencialBtn.classList.remove("senha-ativa");

    gerandoSenhas = false;
    proximoNumeroGeral = 1;
    proximoNumeroIdoso = 1;
    proximoNumeroPreferencial = 1;

    const guicheStatus = document.querySelectorAll(".guiche p:last-child");
    guicheStatus.forEach(function (status) {
        status.textContent = "Status: Deslogado";
    });

    senhas = [];
    exibirSenhas();

    const atendimentosConcluidos = document.querySelector(
        ".lista-atendimentos-concluidos"
    );
    atendimentosConcluidos.innerHTML = "<p>Nenhum cliente atendido</p>";
});
