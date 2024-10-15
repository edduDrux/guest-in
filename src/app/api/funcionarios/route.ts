import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const funcionarios = await prisma.funcionario.findMany();
    return NextResponse.json(funcionarios);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar funcionários.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nome, email, telefone, senha } = await request.json();

    // Verificar se o e-mail já está cadastrado
    const existingFuncionario = await prisma.funcionario.findUnique({
      where: { email },
    });

    if (existingFuncionario) {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 400 });
    }


    // Salvar funcionário no banco de dados
    const funcionario = await prisma.funcionario.create({
      data: {
        nome,
        email,
        telefone,
        senha,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao cadastrar funcionário.' }, { status: 500 });
  }
}
