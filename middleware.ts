import { type NextRequest, NextResponse } from 'next/server'

const isDev = process.env.NODE_ENV !== 'production'
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

function backendOrigin() {
  try {
    if (!BACKEND_URL) return ''
    return new URL(BACKEND_URL).origin
  } catch {
    return ''
  }
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // SEGURANÇA: Headers de proteção
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  // CORRETO: Adiciona Access-Control-Allow-Origin para evitar problemas de CORS via rede local
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // CSP - Content Security Policy
  // Em desenvolvimento, o React usa eval() para recursos de debug.
  // Em produção, não devemos permitir unsafe-eval.
  const beOrigin = backendOrigin()

  // CSP MELHORADO: Aceita fetch via self e qualquer protocolo em dev (http, https, ws)
  const connectSrcDev = "connect-src 'self' http: https: ws: wss: data:;"
  const connectSrcProd = beOrigin ? `connect-src 'self' ${beOrigin};` : "connect-src 'self';"

  const csp = isDev
    ? `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; ${connectSrcDev} img-src 'self' https: data:; font-src 'self' data:;`
    : `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; ${connectSrcProd} img-src 'self' https:; font-src 'self';`

  response.headers.set('Content-Security-Policy', csp)

  // SEGURANÇA: Proteger rotas autenticadas
  const pathname = request.nextUrl.pathname
  
  // Rotas que requerem autenticação
  const protectedRoutes = ['/dashboard']
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Verificar se tem cookie de sessão
    const sessionToken = request.cookies.get('session_token')
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

// Aplicar middleware a todas as rotas, exceto as estáticas
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)']
}
