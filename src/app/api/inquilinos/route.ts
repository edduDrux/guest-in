import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Adiciona um novo inquilino (método POST)
export async function POST(request: Request) {
  try {
    const { nome, email, telefone, cpf, dataNascimento } = await request.json();

    if (!nome || !email || !cpf || !dataNascimento) {
      return NextResponse.json({ error: "Nome, e-mail, CPF e data de nascimento são obrigatórios." }, { status: 400 });
    }

    const existingInquilino = await prisma.inquilino.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    });

    if (existingInquilino) {
      return NextResponse.json({ error: "E-mail ou CPF já cadastrado." }, { status: 400 });
    }

    const senhaGerada = cpf.slice(0, 4);
    const dataNascimentoDate = new Date(dataNascimento);

    const novoInquilino = await prisma.inquilino.create({
      data: {
        nome,
        email,
        telefone,
        cpf,
        dataNascimento: dataNascimentoDate,
        senha: senhaGerada,
        isFirstLogin: true,
      },
    });

    return NextResponse.json(novoInquilino, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar inquilino:", error);
    return NextResponse.json({ error: "Erro interno ao cadastrar inquilino." }, { status: 500 });
  }
}

// Lista todos os inquilinos (método GET)
export async function GET() {
  try {
    const inquilinos = await prisma.inquilino.findMany();
    return NextResponse.json(inquilinos, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar inquilinos:", error);
    return NextResponse.json({ error: "Erro ao buscar inquilinos." }, { status: 500 });
  }
}
