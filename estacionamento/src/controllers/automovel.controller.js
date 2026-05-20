const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const dados = await prisma.automovel.findMany();
    return res.json(dados);
};

const cadastrar = async (req, res) => {
    const novoReg = await prisma.automovel.create({
        data: req.body
    });

    return res.status(201).json(novoReg);
};

const buscar = async (req, res) => {
    const { placa } = req.params;

    const resultado = await prisma.automovel.findUnique({
        where: { placa: placa }, 
        include: { estadias: true }
    });

    if (resultado == null) { 
        return res.status(404).json({ erro: "Nenhum automóvel encontrado" });
    }

    return res.json(resultado);
};

const atualizar = async (req, res) => {
    const { placa } = req.params;

    try {
        const registro = await prisma.automovel.findUnique({
            where: { placa }
        });

        if (!registro) {
            return res.status(404).json({ erro: "Nenhum automóvel encontrado" });
        }

        const dadosAtualizados = await prisma.automovel.update({
            where: { placa },
            data: req.body
        });

        return res.json(dadosAtualizados);

    } catch (err) { 
        return res.status(500).json({ erro: "Não foi possível atualizar o automóvel" });
    }
};

const excluir = async (req, res) => {
    const { placa } = req.params;

    try {
        const registro = await prisma.automovel.findUnique({
            where: { placa }
        });

        if (!registro) {
            return res.status(404).json({ erro: "Nenhum automóvel encontrado" });
        }

        const dadosExcluidos = await prisma.automovel.delete({
            where: { placa }
        });

        return res.json(dadosExcluidos);

    } catch (err) { 
        return res.status(500).json({ erro: "Não foi possível excluir o automóvel" });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};