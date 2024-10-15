"use client";

import { useState } from 'react';

export default function CadastroImovelModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nomeImovel: '',
    tipoPropriedade: 'Residencial',
    rua: '',
    numero: '',
    cep: '',
    bairro: '',
    cidade: '',
    tamanho: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Imóvel cadastrado com sucesso!');
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar imóvel:', error);
      alert('Erro ao cadastrar imóvel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-red-500 font-bold">
        X
      </button>
      <h1 className="text-2xl font-bold mb-4 text-black">Cadastro de Imóvel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nomeImovel"
          placeholder="Nome do Imóvel"
          value={formData.nomeImovel}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <select
          name="tipoPropriedade"
          value={formData.tipoPropriedade}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
        >
          <option value="Residencial">Residencial</option>
          <option value="Comercial">Comercial</option>
        </select>
        <input
          type="text"
          name="rua"
          placeholder="Rua"
          value={formData.rua}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <input
          type="text"
          name="numero"
          placeholder="Número"
          value={formData.numero}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <input
          type="text"
          name="cep"
          placeholder="CEP"
          value={formData.cep}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <input
          type="text"
          name="bairro"
          placeholder="Bairro"
          value={formData.bairro}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <input
          type="text"
          name="cidade"
          placeholder="Cidade"
          value={formData.cidade}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <input
          type="text"
          name="tamanho"
          placeholder="Tamanho (m²)"
          value={formData.tamanho}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Imóvel'}
        </button>
      </form>
    </div>
  );
}
