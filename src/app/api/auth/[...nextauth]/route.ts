import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../lib/prisma"; // Caminho correto para o Prisma

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize (credentials: Record<"email" | "password" | "role", string> | undefined) {
        console.log("Tentativa de login com:", credentials);

        if (!credentials || !credentials.email || !credentials.password || !credentials.role) {
          console.log("Credenciais incompletas.");
          throw new Error("Por favor, preencha todos os campos.");
        }

        let user = null;

        try {
          // Busca na tabela correta com base no role
          switch (credentials.role) {
            case "inquilino":
              user = await prisma.inquilino.findUnique({
                where: { email: credentials.email },
              });
              break;
            case "funcionario":
              user = await prisma.funcionario.findUnique({
                where: { email: credentials.email },
              });
              break;
            case "proprietario":
              user = await prisma.proprietario.findUnique({
                where: { email: credentials.email },
              });
              break;
            default:
              throw new Error("Role inválido.");
          }

          if (!user) {
            console.log("Nenhum usuário encontrado.");
            throw new Error("Nenhum usuário encontrado com este e-mail.");
          }

          if (credentials.password.trim() !== user.senha.trim()) {
            console.log("Senha incorreta.");
            throw new Error("Senha incorreta.");
          }

          console.log("Login bem-sucedido:", user);

          // Retorna os dados do usuário autenticado
          return {
            id: String(user.id),
            email: user.email,
            role: credentials.role,
          };
        } catch (error) {
          console.error("Erro na autenticação:", error);
          throw new Error("Erro interno na autenticação.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id);
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = session.user || {};
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  debug: true,
};

// Exportação correta para o App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
