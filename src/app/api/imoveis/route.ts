import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Adiciona um novo imóvel (método POST)
export async function POST(request: Request) {
  try {
    const {
      nomeImovel,
      tipoPropriedade,
      rua,
      numero,
      cep,
      bairro,
      cidade,
      tamanho,
    } = await request.json();

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!nomeImovel || !tipoPropriedade || !rua || !numero || !cep || !bairro || !cidade || !tamanho) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    // Cria um novo imóvel no banco de dados
    const novoImovel = await prisma.imovel.create({
      data: {
        nomeImovel,
        tipoPropriedade,
        rua,
        numero,
        cep,
        bairro,
        cidade,
        tamanho,
        proprietarioId: 1, // Ajuste conforme necessário para o proprietário.
      },
    });

    return NextResponse.json(novoImovel, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar imóvel:', error);
    return NextResponse.json(
      { error: 'Erro interno ao cadastrar imóvel.' },
      { status: 500 }
    );
  }
}

// Lista todos os imóveis (método GET)
export async function GET() {
  try {
    const imoveis = await prisma.imovel.findMany({
      include: {
        proprietario: true, // Inclui detalhes do proprietário
        inquilinos: true,   // Inclui os inquilinos vinculados
      },
    });

    return NextResponse.json(imoveis, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar imóveis.' },
      { status: 500 }
    );
  }
}
