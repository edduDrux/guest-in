"use client";

import { useState, useEffect } from "react";

type Imovel = {
  id: number;
  nomeImovel: string;
  tipoPropriedade: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  tamanho: string;
  inquilinos: { id: number; nome: string }[]; // Inquilinos vinculados
};

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dos imóveis ao carregar a página
  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        const response = await fetch("/api/imoveis", { cache: "no-store" });
        if (!response.ok) throw new Error("Erro ao buscar imóveis");

        const data = await response.json();
        setImoveis(data); // Armazena os imóveis no estado
      } catch (err) {
        setError("Erro ao carregar imóveis.");
      }
    };
    fetchImoveis();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedImovel) {
      setSelectedImovel({
        ...selectedImovel,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = async () => {
    if (!selectedImovel) return;
    try {
      const res = await fetch(`/api/imoveis/${selectedImovel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedImovel),
      });

      if (!res.ok) throw new Error("Erro ao atualizar imóvel");

      setImoveis((prev) =>
        prev.map((imovel) =>
          imovel.id === selectedImovel.id ? selectedImovel : imovel
        )
      );
      setShowModal(false);
    } catch {
      setError("Erro ao salvar alterações.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Imóveis Cadastrados</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {imoveis.map((imovel) => (
          <div
            key={imovel.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-2 text-black">{imovel.nomeImovel}</h2>
            <p className="text-sm text-black">
              <strong>Tipo:</strong> {imovel.tipoPropriedade}
            </p>
            <p className="text-sm text-black">
              <strong>Endereço:</strong> {imovel.rua}, {imovel.numero}, {imovel.bairro}, {imovel.cidade}
            </p>
            <p className="text-sm text-black">
              <strong>Tamanho:</strong> {imovel.tamanho} m²
            </p>
            <p
              className={`mt-2 font-bold ${
                imovel.inquilinos.length > 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {imovel.inquilinos.length > 0 ? "Alugado" : "Disponível"}
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
              onClick={() => {
                setSelectedImovel(imovel);
                setShowModal(true);
              }}
            >
              Visualizar/Editar
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedImovel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-black">Editar Imóvel</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="nomeImovel"
                value={selectedImovel.nomeImovel}
                onChange={handleInputChange}
                placeholder="Nome do Imóvel"
                className="w-full border rounded px-3 py-2 text-black"
              />
              <input
                type="text"
                name="tipoPropriedade"
                value={selectedImovel.tipoPropriedade}
                onChange={handleInputChange}
                placeholder="Tipo de Propriedade"
                className="w-full border rounded px-3 py-2 text-black"
              />
              <input
                type="text"
                name="rua"
                value={selectedImovel.rua}
                onChange={handleInputChange}
                placeholder="Rua"
                className="w-full border rounded px-3 py-2 text-black"
              />
              <input
                type="text"
                name="numero"
                value={selectedImovel.numero}
                onChange={handleInputChange}
                placeholder="Número"
                className="w-full border rounded px-3 py-2 text-black"
              />
              <input
                type="text"
                name="bairro"
                value={selectedImovel.bairro}
                onChange={handleInputChange}
                placeholder="Bairro"
                className="w-full border rounded px-3 py-2 text-black"
              />
              <input
                type="text"
                name="cidade"
                value={selectedImovel.cidade}
                onChange={handleInputChange}
                placeholder="Cidade"
                className="w-full border rounded px-3 py-2 text-black"
              />
              <input
                type="text"
                name="tamanho"
                value={selectedImovel.tamanho}
                onChange={handleInputChange}
                placeholder="Tamanho (m²)"
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
