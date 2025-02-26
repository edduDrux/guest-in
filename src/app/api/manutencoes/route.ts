import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: Busca todas as manutenções
export async function GET() {
  try {
    const manutencoes = await prisma.manutencao.findMany({
      include: {
        imovel: true,
        inquilino: true,
      },
    });

    return NextResponse.json(manutencoes, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar manutenções:", error);
    return NextResponse.json({ error: "Erro ao buscar manutenções." }, { status: 500 });
  }
}

// POST: Cria uma nova solicitação de manutenção
export async function POST(request: Request) {
  try {
    const { titulo, comodo, descricao, imovelId, inquilinoId } = await request.json();

    if (!titulo || !comodo || !descricao || !imovelId || !inquilinoId) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    const imovel = await prisma.imovel.findUnique({ where: { id: imovelId } });

    if (!imovel) {
      return NextResponse.json({ error: "Imóvel não encontrado." }, { status: 404 });
    }

    const inquilino = await prisma.inquilino.findUnique({ where: { id: inquilinoId } });

    if (!inquilino || inquilino.imovelId !== imovelId) {
      return NextResponse.json({ error: "Inquilino não encontrado ou não associado ao imóvel." }, { status: 404 });
    }

    const novaManutencao = await prisma.manutencao.create({
      data: { titulo, comodo, descricao, imovelId, inquilinoId },
    });

    return NextResponse.json(novaManutencao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar solicitação de manutenção:", error);
    return NextResponse.json({ error: "Erro interno ao criar solicitação de manutenção." }, { status: 500 });
  }
}
