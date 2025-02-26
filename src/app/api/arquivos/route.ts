import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Lista todos os arquivos
export async function GET() {
  try {
    const arquivos = await prisma.arquivo.findMany();
    return NextResponse.json(arquivos, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar arquivos:", error);
    return NextResponse.json({ error: "Erro ao buscar arquivos." }, { status: 500 });
  }
}

// Adiciona um novo arquivo
export async function POST(request: Request) {
  try {
    const { nome, url } = await request.json();

    if (!nome || !url) {
      return NextResponse.json({ error: "Nome e URL são obrigatórios." }, { status: 400 });
    }

    const novoArquivo = await prisma.arquivo.create({
      data: { nome, url },
    });

    return NextResponse.json(novoArquivo, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar arquivo:", error);
    return NextResponse.json({ error: "Erro ao salvar arquivo." }, { status: 500 });
  }
}
