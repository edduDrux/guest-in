import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Busca um inquilino específico por ID (método GET)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const inquilinoId = parseInt(params.id);

  try {
    const inquilino = await prisma.inquilino.findUnique({
      where: { id: inquilinoId },
      include: { imovel: true }, // Inclui detalhes do imóvel associado
    });

    if (!inquilino) {
      return NextResponse.json(
        { error: 'Inquilino não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json(inquilino, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar inquilino:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar inquilino.' },
      { status: 500 }
    );
  }
}

// Atualiza um inquilino específico (método PUT)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const inquilinoId = parseInt(params.id);

  try {
    const { nome, email, telefone, cpf, dataNascimento } = await request.json();

    // Validação básica
    if (!nome || !email || !cpf || !dataNascimento) {
      return NextResponse.json(
        { error: 'Nome, e-mail, CPF e data de nascimento são obrigatórios.' },
        { status: 400 }
      );
    }

    // Convertendo o `dataNascimento` para um objeto Date
    const dataNascimentoDate = new Date(dataNascimento);

    // Atualiza o inquilino no banco de dados
    const updatedInquilino = await prisma.inquilino.update({
      where: { id: inquilinoId },
      data: {
        nome,
        email,
        telefone,
        cpf,
        dataNascimento: dataNascimentoDate,
      },
    });

    return NextResponse.json(updatedInquilino, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar inquilino:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar inquilino.' },
      { status: 500 }
    );
  }
}
