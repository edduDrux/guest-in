import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Adiciona um novo inquilino (método POST)
export async function POST(request: Request) {
  try {
    const { nome, email, telefone, cpf, dataNascimento, imovelId } = await request.json();

    // Verifica se os campos obrigatórios estão preenchidos
    if (!nome || !email || !cpf || !dataNascimento || !imovelId) {
      return NextResponse.json(
        { error: "Nome, e-mail, CPF, data de nascimento e ID do imóvel são obrigatórios." },
        { status: 400 }
      );
    }

    // Verifica se o imóvel existe
    const imovel = await prisma.imovel.findUnique({
      where: { id: imovelId },
    });

    if (!imovel) {
      return NextResponse.json({ error: "Imóvel não encontrado." }, { status: 404 });
    }

    // Verifica se o e-mail ou CPF já estão cadastrados
    const existingInquilino = await prisma.inquilino.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    });

    if (existingInquilino) {
      return NextResponse.json(
        { error: "E-mail ou CPF já cadastrado." },
        { status: 400 }
      );
    }

    // Gera uma senha temporária com os primeiros 4 dígitos do CPF
    const senhaGerada = cpf.slice(0, 4);
    const dataNascimentoDate = new Date(dataNascimento);

    // Cria o novo inquilino vinculado ao imóvel
    const novoInquilino = await prisma.inquilino.create({
      data: {
        nome,
        email,
        telefone,
        cpf,
        dataNascimento: dataNascimentoDate,
        senha: senhaGerada,
        imovelId,
        isFirstLogin: true,
      },
    });

    return NextResponse.json(novoInquilino, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar inquilino:", error);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar inquilino." },
      { status: 500 }
    );
  }
}

// Lista todos os inquilinos (método GET)
export async function GET() {
  try {
    // Busca todos os inquilinos e inclui os detalhes do imóvel vinculado
    const inquilinos = await prisma.inquilino.findMany({
      include: {
        imovel: true, // Inclui os detalhes do imóvel
      },
    });

    return NextResponse.json(inquilinos, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar inquilinos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar inquilinos." },
      { status: 500 }
    );
  }
}
