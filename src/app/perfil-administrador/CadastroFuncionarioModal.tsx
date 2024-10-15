"use client";

import { useState } from 'react';

export default function CadastroFuncionarioModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await fetch('/api/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Funcionário cadastrado com sucesso!');
        onClose();
      } else {
        alert('Erro ao cadastrar o funcionário.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar o funcionário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-500 font-bold focus:outline-none"
      >
        X
      </button>
      <h1 className="text-2xl font-bold mb-4 text-center text-black">Cadastro de Funcionário</h1>
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
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Funcionário'}
        </button>
      </form>
    </div>
  );
}
