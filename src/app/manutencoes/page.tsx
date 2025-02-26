"use client";

import { useState, useEffect } from "react";

interface Manutencao {
  id: number;
  titulo: string;
  comodo: string;
  descricao: string;
  imovel: {
    nomeImovel: string;
  };
  inquilino: {
    nome: string;
  };
}

export default function ManutencoesPage() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManutencoes = async () => {
      try {
        const res = await fetch("/api/manutencoes");

        if (!res.ok) {
          throw new Error("Erro ao buscar manutenções");
        }

        const data = await res.json();
        setManutencoes(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Erro ao carregar manutenções. Tente novamente.");
      }
    };

    fetchManutencoes();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Manutenções Pendentes</h1>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : manutencoes.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma manutenção pendente.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {manutencoes.map((manutencao) => (
            <div
              key={manutencao.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-bold mb-2">{manutencao.titulo}</h2>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Cômodo:</strong> {manutencao.comodo}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Descrição:</strong> {manutencao.descricao}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Inquilino:</strong> {manutencao.inquilino.nome}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Imóvel:</strong> {manutencao.imovel.nomeImovel}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
