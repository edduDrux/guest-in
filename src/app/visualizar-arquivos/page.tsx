"use client";

import { useEffect, useState } from "react";

interface Arquivo {
  id: number;
  nome: string;
  url: string;
  createdAt: string;
}

export default function VisualizarArquivos() {
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArquivos = async () => {
      try {
        const response = await fetch("/api/arquivos");
        if (!response.ok) throw new Error("Erro ao carregar arquivos.");

        const data = await response.json();
        setArquivos(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar arquivos.");
      }
    };

    fetchArquivos();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Arquivos Salvos</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <ul className="space-y-4">
        {arquivos.map((arquivo) => (
          <li key={arquivo.id} className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold">{arquivo.nome}</h2>
            <p>Data de Upload: {new Date(arquivo.createdAt).toLocaleString()}</p>
            <a
              href={arquivo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Baixar/Visualizar
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
