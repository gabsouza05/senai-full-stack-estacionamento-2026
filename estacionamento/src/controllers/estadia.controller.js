const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const todosRegistros = await prisma.estadia.findMany();
    return res.json(todosRegistros);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const registro = await prisma.estadia.findUnique({
        where: { id: Number(id) }
    });

    return res.json(registro);
};

const cadastrar = async (req, res) => {
    const novaEstadia = await prisma.estadia.create({
        data: req.body
    });

    return res.status(201).json(novaEstadia);
};

const atualizar = async (req, res) => {
    const { id } = req.params;

    const dadosAtuais = await prisma.estadia.findUnique({
        where: { id: Number(id) }
    });

    if (dadosAtuais == null) {
        return res.status(404).json({ error: "O registro de estadia solicitado não existe." });
    }

    let corpoRequisicao = req.body;

    if (corpoRequisicao.saida) {
        const tempoEntrada = new Date(dadosAtuais.entrada).getTime();
        const tempoSaida = new Date(corpoRequisicao.saida).getTime();

        const totalHoras = (tempoSaida - tempoEntrada) / 3600000;

        corpoRequisicao.valorTotal = totalHoras * dadosAtuais.valorHora;
    }

    const registroAtualizado = await prisma.estadia.update({
        where: { id: Number(id) },
        data: corpoRequisicao
    });

    return res.json(registroAtualizado);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const registroDeletado = await prisma.estadia.delete({
        where: { id: Number(id) }
    });

    return res.json(registroDeletado);
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};