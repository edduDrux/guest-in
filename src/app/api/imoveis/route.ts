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

    // Validação básica
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
        proprietarioId: 1, // Ajuste esse valor para obter o proprietário correto.
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
    // Busca todos os imóveis no banco de dados com inquilinos e proprietário
    const imoveis = await prisma.imovel.findMany({
      include: {
        proprietario: true, // Inclui detalhes do proprietário
        inquilinos: true,   // Inclui os inquilinos vinculados ao imóvel
      },
    });

    // Retorna os imóveis como JSON
    return NextResponse.json(imoveis, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar imóveis.' },
      { status: 500 }
    );
  }
}
