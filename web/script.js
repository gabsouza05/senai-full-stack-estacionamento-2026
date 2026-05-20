const API_AUTO = "http://localhost:3000/automovel";
const API_EST = "http://localhost:3000/estadia";

const formEst = document.getElementById("formEstadia");
const listaEst = document.getElementById("listaEstadias");
const formAuto = document.getElementById("formAutomovel");
const listaAuto = document.getElementById("listaAutomoveis");

let placaSendoEditada = null;

formEst.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payloadEstadia = {
        placa: document.getElementById("placaEstadia").value,
        valorHora: Number(document.getElementById("valorHora").value)
    };

    if (!window.estadiaEditando) {
        await fetch(`${API_EST}/cadastrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadEstadia)
        });
    }

    if (window.estadiaEditando) {
        await fetch(`${API_EST}/atualizar/${window.estadiaEditando}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadEstadia)
        });
        window.estadiaEditando = null;
    }

    formEst.reset();
    listarEstadias();
});

async function listarEstadias() {
    const resposta = await fetch(`${API_EST}/listar`);
    const listaDados = await resposta.json();

    listaEst.innerHTML = "";

    listaDados.forEach(reg => {
        listaEst.innerHTML += `
        <tr>
            <td>${reg.id}</td>
            <td>${reg.placa}</td>
            <td>${new Date(reg.entrada).toLocaleString()}</td>
            <td>${reg.saida ? new Date(reg.saida).toLocaleString() : "Em aberto"}</td>
            <td>${reg.valorTotal ? "R$ " + reg.valorTotal.toFixed(2) : "-"}</td>
            <td>
                <button onclick="prepararEdicaoEstadia(${reg.id}, '${reg.placa}', ${reg.valorHora})">Editar</button>
                <button onclick="finalizar(${reg.id})">Finalizar</button>
                <button onclick="excluirEst(${reg.id})">Excluir</button>
            </td>
        </tr>`;
    });
}

function prepararEdicaoEstadia(id, placa, valorHora) {
    document.getElementById("placaEstadia").value = placa;
    document.getElementById("valorHora").value = valorHora;
    window.estadiaEditando = id;
}

async function finalizar(id) {
    await fetch(`${API_EST}/atualizar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saida: new Date() })
    });

    listarEstadias();
}

async function excluirEst(id) {
    await fetch(`${API_EST}/excluir/${id}`, { method: "DELETE" });
    listarEstadias();
}



formAuto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const objAuto = {
        placa: document.getElementById("placa").value,
        proprietario: document.getElementById("proprietario").value,
        tipo: document.getElementById("tipo").value,
        modelo: document.getElementById("modelo").value,
        marca: document.getElementById("marca").value,
        cor: document.getElementById("cor").value || null,
        ano: document.getElementById("ano").value ? Number(document.getElementById("ano").value) : null,
        telefone: document.getElementById("telefone").value
    };

    let urlBase = `${API_AUTO}/cadastrar`;
    let tipoMetodo = "POST";

    if (placaSendoEditada) {
        urlBase = `${API_AUTO}/atualizar/${placaSendoEditada}`;
        tipoMetodo = "PUT";
    }

    await fetch(urlBase, {
        method: tipoMetodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objAuto)
    });

    placaSendoEditada = null;
    formAuto.reset();
    listarAutomoveis();
});

async function listarAutomoveis() {
    const resposta = await fetch(`${API_AUTO}/listar`);
    const listaDados = await resposta.json();
    
    listaAuto.innerHTML = listaDados.map(reg => `
        <tr>
            <td>${reg.placa}</td>
            <td>${reg.proprietario}</td>
            <td>${reg.modelo}</td>
            <td>
                <button onclick="prepararEdicaoAuto('${reg.placa}','${reg.proprietario}','${reg.tipo}','${reg.modelo}','${reg.marca}','${reg.cor || ''}','${reg.ano || ''}','${reg.telefone}')">Editar</button>
                <button onclick="excluirAuto('${reg.placa}')">Excluir</button>
            </td>
        </tr>
    `).join("");
}

function prepararEdicaoAuto(placa, proprietario, tipo, modelo, marca, cor, ano, telefone) {
    placaSendoEditada = placa;
    document.getElementById("placa").value = placa;
    document.getElementById("proprietario").value = proprietario;
    document.getElementById("tipo").value = tipo;
    document.getElementById("modelo").value = modelo;
    document.getElementById("marca").value = marca;
    document.getElementById("cor").value = cor;
    document.getElementById("ano").value = ano;
    document.getElementById("telefone").value = telefone;
}

async function excluirAuto(placa) {
    const confirmarExclusao = confirm("Deseja excluir este veículo?");
    if (confirmarExclusao) {
        await fetch(`${API_AUTO}/excluir/${placa}`, { method: "DELETE" });
        listarAutomoveis();
    }
}

listarEstadias();
listarAutomoveis();