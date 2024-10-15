import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Atualiza um imóvel (método PUT)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const imovelId = parseInt(params.id);

  try {
    const { nomeImovel, tipoPropriedade, rua, numero, cep, bairro, cidade, tamanho } = await request.json();

    // Validação básica
    if (!nomeImovel || !tipoPropriedade || !rua || !numero || !cep || !bairro || !cidade || !tamanho) {
      return NextResponse.json(
        { error: 'Nome do imóvel, tipo de propriedade, endereço e tamanho são obrigatórios.' },
        { status: 400 }
      );
    }

    // Atualiza o imóvel no banco de dados
    const updatedImovel = await prisma.imovel.update({
      where: { id: imovelId },
      data: {
        nomeImovel,
        tipoPropriedade,
        rua,
        numero,
        cep,
        bairro,
        cidade,
        tamanho,
      },
    });

    return NextResponse.json(updatedImovel, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error);
    return NextResponse.json({ error: 'Erro ao atualizar imóvel.' }, { status: 500 });
  }
}
