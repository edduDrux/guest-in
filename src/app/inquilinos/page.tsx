"use client";

import { useEffect, useState } from "react";

interface Inquilino {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf: string;
  dataNascimento: string;
  imovel?: { nomeImovel: string }; // Imóvel associado
}

export default function ListaInquilinos() {
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [selectedInquilino, setSelectedInquilino] = useState<Inquilino | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch inicial para buscar inquilinos
  useEffect(() => {
    async function fetchInquilinos() {
      try {
        const res = await fetch("/api/inquilinos");
        if (!res.ok) throw new Error("Erro ao buscar inquilinos");

        const data = await res.json();
        setInquilinos(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os inquilinos.");
      }
    }
    fetchInquilinos();
  }, []);

  const handleInquilinoClick = (inquilino: Inquilino) => {
    setSelectedInquilino(inquilino);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedInquilino) {
      setSelectedInquilino({
        ...selectedInquilino,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = async () => {
    if (!selectedInquilino) return;

    try {
      const res = await fetch(`/api/inquilinos/${selectedInquilino.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedInquilino),
      });

      if (!res.ok) throw new Error("Erro ao atualizar inquilino");

      setInquilinos((prev) =>
        prev.map((inquilino) =>
          inquilino.id === selectedInquilino.id ? selectedInquilino : inquilino
        )
      );
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar as alterações.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Inquilinos Cadastrados</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <table className="w-full border border-gray-300 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-6 py-3 text-black">Nome</th>
            <th className="px-6 py-3 text-black">Email</th>
            <th className="px-6 py-3 text-black">Telefone</th>
            <th className="px-6 py-3 text-black">Imóvel</th>
            <th className="px-6 py-3 text-black">Ações</th>
          </tr>
        </thead>
        <tbody>
          {inquilinos.map((inquilino) => (
            <tr key={inquilino.id} className="border-b">
              <td className="px-6 py-3">{inquilino.nome}</td>
              <td className="px-6 py-3">{inquilino.email}</td>
              <td className="px-6 py-3">{inquilino.telefone || "N/A"}</td>
              <td className="px-6 py-3">
                {inquilino.imovel ? inquilino.imovel.nomeImovel : "N/A"}
              </td>
              <td className="px-6 py-3">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handleInquilinoClick(inquilino)}
                >
                  Visualizar/Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedInquilino && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-black">Editar Inquilino</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="nome"
                value={selectedInquilino.nome}
                onChange={handleInputChange}
                placeholder="Nome Completo"
                className="w-full border rounded px-3 py-2 text-black"
              />
              <input
                type="email"
                name="email"
                value={selectedInquilino.email}
                onChange={handleInputChange}
                placeholder="E-mail"
                className="w-full border rounded px-3 py-2 text-black"
              />
              <input
                type="text"
                name="telefone"
                value={selectedInquilino.telefone || ""}
                onChange={handleInputChange}
                placeholder="Telefone"
                className="w-full border rounded px-3 py-2 text-black"
              />
              <input
                type="text"
                name="cpf"
                value={selectedInquilino.cpf}
                onChange={handleInputChange}
                placeholder="CPF"
                className="w-full border rounded px-3 py-2 text-black"
              />
              <input
                type="date"
                name="dataNascimento"
                value={new Date(selectedInquilino.dataNascimento).toISOString().split('T')[0]}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-black"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
