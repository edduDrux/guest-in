"use client";

import { useState, useEffect } from 'react';

interface Imovel {
  id: number;
  nomeImovel: string;
  rua: string;
  numero: string;
}

export default function CadastroInquilinoModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    imovelId: 0, // Armazenado como número
  });
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(false);

  // Busca imóveis ao montar o componente
  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        const response = await fetch('/api/imoveis');
        if (!response.ok) throw new Error('Erro ao carregar imóveis');
        const data = await response.json();
        setImoveis(data);
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error);
      }
    };
    fetchImoveis();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'imovelId' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/inquilinos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Inquilino cadastrado com sucesso!');
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar inquilino:', error);
      alert('Erro ao cadastrar inquilino.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-red-500 font-bold">
        X
      </button>
      <h1 className="text-2xl font-bold mb-4 text-black">Cadastro de Inquilino</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome Completo"
          value={formData.nome}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={formData.telefone}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={formData.cpf}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <select
          name="imovelId"
          value={formData.imovelId}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        >
          <option value={0}>Selecione um Imóvel</option>
          {imoveis.map((imovel) => (
            <option key={imovel.id} value={imovel.id}>
              {imovel.nomeImovel} - {imovel.rua}, {imovel.numero}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Inquilino'}
        </button>
      </form>
    </div>
  );
}
