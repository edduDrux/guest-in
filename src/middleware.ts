import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware para proteger rotas autenticadas
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Verifica se estamos em ambiente de desenvolvimento
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Se for desenvolvimento ou o token existir, permite o acesso
  if (isDevelopment) {
    return NextResponse.next();
  }

  // Verifica se o token é válido
  if (token) {
    console.log("Token encontrado:", token);

    const { role } = token;

    // Define regras específicas para cada tipo de role
    const url = req.nextUrl.pathname;

    if (role === "funcionario" && url.startsWith("/perfil-administrador")) {
      return NextResponse.next(); // Funcionários têm acesso à área do administrador
    }

    if (role === "inquilino" && url.startsWith("/inquilinos")) {
      return NextResponse.next(); // Inquilinos têm acesso às suas páginas
    }

    // Caso o usuário tente acessar uma rota restrita ao seu role
    console.warn(`Acesso negado para role ${role} na rota ${url}`);
    return NextResponse.redirect(new URL('/login?error=forbidden', req.url));
  }

  // Redireciona para login se não autenticado
  console.warn("Acesso negado: Token não encontrado");
  return NextResponse.redirect(new URL('/login', req.url));
}

// Configuração do matcher para proteger rotas específicas
export const config = {
  matcher: [
    '/perfil-administrador/:path*', // Protege o perfil do administrador
    '/inquilinos/:path*', // Protege rotas de inquilinos
    '/funcionarios/:path*', // Protege rotas de funcionários
  ],
};
