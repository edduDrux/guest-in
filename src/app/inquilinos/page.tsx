"use client";

import { useEffect, useState } from "react";

interface Inquilino {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf: string;
  dataNascimento: string;
}

export default function ListaInquilinos() {
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInquilinos() {
      try {
        const res = await fetch("/api/inquilinos");
        if (!res.ok) {
          throw new Error("Erro ao buscar inquilinos");
        }
        const data = await res.json();
        setInquilinos(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os inquilinos. Por favor, tente novamente.");
      }
    }

    fetchInquilinos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Inquilinos Cadastrados
        </h1>

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Nome do Inquilino
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Telefone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    CPF
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Data de Nascimento
                  </th>
                </tr>
              </thead>
              <tbody>
                {inquilinos.map((inquilino) => (
                  <tr key={inquilino.id} className="border-b">
                    <td className="px-6 py-4 text-gray-600">{inquilino.nome}</td>
                    <td className="px-6 py-4 text-gray-600">{inquilino.email}</td>
                    <td className="px-6 py-4 text-gray-600">{inquilino.telefone || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600">{inquilino.cpf}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(inquilino.dataNascimento).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
