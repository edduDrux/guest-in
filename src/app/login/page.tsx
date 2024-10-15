"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "", role: "inquilino" }); // Novo campo `role`
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email: userInfo.email.trim(),
      password: userInfo.password.trim(),
      role: userInfo.role, // Envia o tipo de usuário para o backend
      redirect: false,
    });

    console.log("Resposta do login:", res);

    if (res?.error) {
      console.log("Erro no login:", res.error);
      alert("Erro no login: " + res.error);
    } else {
      // Redirecionamento baseado no tipo de usuário
      if (userInfo.role === "inquilino") {
        router.push("/perfil-inquilino");
      } else {
        router.push("/perfil-administrador"); // Funcionário vai para a página do administrador
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#333B3F]">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Login</h2>
        <p className="text-sm text-center text-gray-600">
          Entre com suas credenciais para acessar o painel
        </p>

        {/* Campo de e-mail */}
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
            required
          />
        </div>

        {/* Campo de senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            value={userInfo.password}
            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
            required
          />
        </div>

        {/* Opção de tipo de usuário */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Eu sou:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="inquilino"
                checked={userInfo.role === "inquilino"}
                onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
                className="mr-2"
              />
              Inquilino
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="funcionario"
                checked={userInfo.role === "funcionario"}
                onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
                className="mr-2"
              />
              Funcionário
            </label>
          </div>
        </div>

        {/* Botão de login */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-105"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
