"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SolicitarManutencaoPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({ titulo: "", comodo: "", descricao: "" });
  const [inquilinoId, setInquilinoId] = useState<number | null>(null);
  const [imovelId, setImovelId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInquilinoEImovel = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/inquilinos?email=${session.user.email}`);
        const data = await res.json();

        if (data && data.length > 0) {
          const inquilino = data[0];
          setInquilinoId(inquilino.id
          );
          setImovelId(inquilino.imovelId);
        } else {
          alert("Inquilino não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar inquilino e imóvel:", error);
        alert("Erro ao buscar dados do inquilino. Tente novamente mais tarde.");
      }
    };

    if (session) {
      fetchInquilinoEImovel();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imovelId || !inquilinoId) {
      alert("Imóvel ou Inquilino não encontrado.");
      return;
    }

    try {
      const res = await fetch("/api/manutencoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, imovelId, inquilinoId }),
      });

      if (res.ok) {
        alert("Solicitação de manutenção enviada com sucesso.");
        router.push("/perfil-inquilino");
      } else {
        const errorData = await res.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao enviar solicitação de manutenção:", error);
      alert("Erro interno. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Solicitar Manutenção
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Título da Manutenção:
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg shadow-sm w-full p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Digite o título"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Cômodo:
            </label>
            <input
              type="text"
              name="comodo"
              value={formData.comodo}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg shadow-sm w-full p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: Sala, Cozinha, Quarto"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Descrição da Manutenção:
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg shadow-sm w-full p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Descreva o problema detalhadamente"
              rows={4}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg shadow-lg hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-green-400 transition-transform transform hover:scale-105"
          >
            Enviar Solicitação
          </button>
        </form>
      </div>
    </div>
  );
}
