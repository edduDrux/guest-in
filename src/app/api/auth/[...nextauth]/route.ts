import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../lib/prisma"; // Certifique-se de que o prisma está configurado corretamente

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, role } = credentials;

        let user = null;

        switch (role) {
          case "inquilino":
            user = await prisma.inquilino.findUnique({ where: { email } });
            break;
          case "funcionario":
            user = await prisma.funcionario.findUnique({ where: { email } });
            break;
          case "proprietario":
            user = await prisma.proprietario.findUnique({ where: { email } });
            break;
          default:
            throw new Error("Tipo de usuário inválido.");
        }

        if (!user || user.senha !== password) {
          return null; // Retorna null se as credenciais estiverem erradas
        }

        return { id: user.id, email: user.email, role };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
