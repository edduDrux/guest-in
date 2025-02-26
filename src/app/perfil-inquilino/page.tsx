"use client";

import { useSession } from 'next-auth/react'; // Para obter a sessão
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Imovel {
  id: number;
  nomeImovel: string;
  proprietario: {
    telefone: string;
  };
}

export default function PerfilInquilino() {
  const { data: session } = useSession(); // Obtém a sessão do NextAuth
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [inquilinoNome, setInquilinoNome] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Estado para controlar carregamento
  const router = useRouter();

  // Função para buscar o nome do inquilino e os dados do imóvel associado
  useEffect(() => {
    const fetchDadosInquilino = async () => {
      try {
        if (!session) return;

        const inquilinoId = session.user?.id;

        // Busca o nome do inquilino com base na sessão
        const resInquilino = await fetch(`/api/inquilinos/${inquilinoId}`);
        const inquilino = await resInquilino.json();
        setInquilinoNome(inquilino?.nome || 'Inquilino');

        // Busca o imóvel associado ao inquilino
        const resImovel = await fetch('/api/imoveis'); // Ajuste para pegar o imóvel
        const data = await resImovel.json();
        setImovel(data[0]); // Assumindo que o inquilino tem um único imóvel
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchDadosInquilino();
  }, [session]);

  // Função para abrir o WhatsApp com o telefone do proprietário
  const iniciarWhatsApp = () => {
    if (imovel?.proprietario.telefone) {
      window.open(`https://wa.me/${imovel.proprietario.telefone}`, '_blank');
    }
  };

  // Redireciona para a página de solicitação de manutenção
  const solicitarManutencao = () => {
    router.push('/perfil-inquilino/solicitar-manutencao');
  };

  // Se a sessão ainda estiver carregando
  if (loading) {
    return <p>Carregando...</p>;
  }

  // Se a sessão não estiver disponível
  if (!session) {
    return <p>Você não está autenticado.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-6">
            Bem-vindo, {inquilinoNome || 'Inquilino'} {/* Exibe o nome do inquilino */}
          </h1>

          {imovel ? (
            <div className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-xl">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Imóvel Alugado: <span className="text-indigo-600">{imovel.nomeImovel}</span>
              </h2>

              <div className="flex flex-col space-y-4">
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={iniciarWhatsApp}
                >
                  Conversar com o Proprietário via WhatsApp
                </button>
                <button
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  onClick={solicitarManutencao}
                >
                  Solicitar Manutenção
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-8">Carregando dados do imóvel...</p>
          )}
        </div>
      </div>
    </div>
  );
}
