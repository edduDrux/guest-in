"use client";

import { useState, useEffect } from 'react';

type Imovel = {
  id: number;
  nomeImovel: string;
  tipoPropriedade: string;
  endereco: string;
  tamanho: string;
  // Outros campos conforme necessário
};

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        const response = await fetch('/api/imoveis', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch imóveis');
        }

        const data = await response.json();
        setImoveis(data);
      } catch (err) {
        console.error("Erro ao buscar imóveis:", err);
        setError("Erro ao carregar imóveis. Por favor, tente novamente.");
      }
    };
    fetchImoveis();
  }, []);

  const handleImovelClick = async (id: number) => {
    try {
      const res = await fetch(`/api/imoveis/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch imovel details');
      }
      const data = await res.json();
      setSelectedImovel(data);
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do imóvel:', error);
      setError("Erro ao carregar detalhes do imóvel. Por favor, tente novamente.");
    }
  };

  const closeModal = () => {
    setSelectedImovel(null);
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedImovel) {
      setSelectedImovel({
        ...selectedImovel,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = async () => {
    if (selectedImovel) {
      try {
        const res = await fetch(`/api/imoveis/${selectedImovel.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedImovel),
        });
        if (!res.ok) {
          throw new Error('Failed to update imovel');
        }

        setImoveis((prevImoveis) =>
          prevImoveis.map((imovel) =>
            imovel.id === selectedImovel.id ? selectedImovel : imovel
          )
        );
        closeModal();
      } catch (error) {
        console.error('Erro ao atualizar imóvel:', error);
        setError("Erro ao atualizar imóvel. Por favor, tente novamente.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8">Imóveis Cadastrados</h1>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : imoveis.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum imóvel cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {imoveis.map((imovel) => (
            <div
              key={imovel.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleImovelClick(imovel.id)}
            >
              <h2 className="text-xl font-bold mb-2">{imovel.nomeImovel}</h2>
              <p className="text-sm text-gray-700"><strong>Tipo:</strong> {imovel.tipoPropriedade}</p>
              <p className="text-sm text-gray-700"><strong>Endereço:</strong> {imovel.endereco}</p>
              <p className="text-sm text-gray-700"><strong>Tamanho:</strong> {imovel.tamanho}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedImovel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Detalhes do Imóvel</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Nome do Imóvel:</label>
                <input
                  type="text"
                  name="nomeImovel"
                  value={selectedImovel.nomeImovel}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Tipo de Propriedade:</label>
                <input
                  type="text"
                  name="tipoPropriedade"
                  value={selectedImovel.tipoPropriedade}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Endereço:</label>
                <input
                  type="text"
                  name="endereco"
                  value={selectedImovel.endereco}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Tamanho:</label>
                <input
                  type="text"
                  name="tamanho"
                  value={selectedImovel.tamanho}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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
