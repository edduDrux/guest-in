import { DefaultSession, DefaultUser } from "next-auth";

// Atualiza as definições de tipos para lidar com diferentes roles
declare module "next-auth" {
  interface User extends DefaultUser {
    id: number; 
    nomeCompleto: string;
    role: "proprietario" | "funcionario" | "inquilino"; // Adiciona role
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      nomeCompleto: string;
      role: "proprietario" | "funcionario" | "inquilino"; // Adiciona role
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nomeCompleto: string;
    role: "proprietario" | "funcionario" | "inquilino"; // Adiciona role
  }
}
