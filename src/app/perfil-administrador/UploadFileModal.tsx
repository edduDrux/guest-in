"use client";

import { useState } from "react";

export default function UploadFileModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Selecione um arquivo para fazer o upload.");
      return;
    }

    setLoading(true);
    try {
      // Simulando o upload (você pode integrar com um serviço de armazenamento real, como AWS S3 ou Firebase)
      const url = `/uploads/${file.name}`; // Exemplo de URL do arquivo (simulado)

      const response = await fetch("/api/arquivos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: file.name, url }),
      });

      if (response.ok) {
        alert("Arquivo enviado com sucesso!");
        onClose();
      } else {
        const error = await response.json();
        alert(`Erro ao salvar arquivo: ${error.error}`);
      }
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Erro ao enviar arquivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-red-500 font-bold">
        X
      </button>
      <h1 className="text-2xl font-bold mb-4 text-black">Upload de Arquivo</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="border p-2 w-full rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Arquivo"}
        </button>
      </form>
    </div>
  );
}
