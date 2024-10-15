"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CadastroFuncionarioModal from './CadastroFuncionarioModal';
import CadastroInquilinoModal from './CadastroInquilinoModal';
import CadastroImovelModal from './CadastroImovelModal';

export default function PerfilAdministrador() {
  const [isFuncionarioModalOpen, setFuncionarioModalOpen] = useState(false);
  const [isInquilinoModalOpen, setInquilinoModalOpen] = useState(false);
  const [isImovelModalOpen, setImovelModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-black">
          Perfil do Administrador
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => setInquilinoModalOpen(true)}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            Cadastrar Inquilino
          </button>
          <button
            onClick={() => setImovelModalOpen(true)}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            Cadastrar Imóvel
          </button>
          <button
            onClick={() => setFuncionarioModalOpen(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            Cadastrar Funcionário
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <button
            onClick={() => router.push('/inquilinos')}
            className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-4 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            Visualizar Inquilinos
          </button>
          <button
            onClick={() => router.push('/imoveis')}
            className="bg-gradient-to-r from-teal-400 to-teal-600 text-white p-4 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            Visualizar Imóveis
          </button>
        </div>
      </div>

      {/* Modais de Cadastro */}
      {isFuncionarioModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <CadastroFuncionarioModal onClose={() => setFuncionarioModalOpen(false)} />
        </div>
      )}
      {isInquilinoModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <CadastroInquilinoModal onClose={() => setInquilinoModalOpen(false)} />
        </div>
      )}
      {isImovelModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <CadastroImovelModal onClose={() => setImovelModalOpen(false)} />
        </div>
      )}
    </div>
  );
}
