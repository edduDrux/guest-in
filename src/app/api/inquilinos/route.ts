import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Adiciona um novo inquilino (método POST)
export async function POST(request: Request) {
  try {
    const { nome, email, telefone, cpf, dataNascimento, imovelId } = await request.json();

    if (!nome || !email || !cpf || !dataNascimento || !imovelId) {
      return NextResponse.json(
        { error: "Nome, e-mail, CPF, data de nascimento e ID do imóvel são obrigatórios." },
        { status: 400 }
      );
    }

    const imovel = await prisma.imovel.findUnique({ where: { id: imovelId } });

    if (!imovel) {
      return NextResponse.json({ error: "Imóvel não encontrado." }, { status: 404 });
    }

    const existingInquilino = await prisma.inquilino.findFirst({
      where: { OR: [{ email }, { cpf }] },
    });

    if (existingInquilino) {
      return NextResponse.json(
        { error: "E-mail ou CPF já cadastrado." },
        { status: 400 }
      );
    }

    const senhaGerada = cpf.slice(0, 4);
    const dataNascimentoDate = new Date(dataNascimento);

    const novoInquilino = await prisma.inquilino.create({
      data: { nome, email, telefone, cpf, dataNascimento: dataNascimentoDate, senha: senhaGerada, imovelId, isFirstLogin: true },
    });

    return NextResponse.json(novoInquilino, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar inquilino:", error);
    return NextResponse.json({ error: "Erro interno ao cadastrar inquilino." }, { status: 500 });
  }
}

// Busca inquilino por e-mail ou lista todos (método GET)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let inquilinos;

    if (email) {
      inquilinos = await prisma.inquilino.findMany({
        where: { email },
        include: { imovel: true },
      });
    } else {
      inquilinos = await prisma.inquilino.findMany({ include: { imovel: true } });
    }

    if (!inquilinos || inquilinos.length === 0) {
      return NextResponse.json({ error: "Inquilino não encontrado." }, { status: 404 });
    }

    return NextResponse.json(inquilinos, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar inquilinos:", error);
    return NextResponse.json({ error: "Erro ao buscar inquilinos." }, { status: 500 });
  }
}
