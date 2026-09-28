# 🔒 GUIA RÁPIDO DE IMPLEMENTAÇÃO - SEGURANÇA

## 1️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8085
```

Para **produção**, altere para:
```bash
NEXT_PUBLIC_BACKEND_URL=https://seu-dominio-com.com
```

## 2️⃣ Atualizar next.config.ts (IMPORTANTE!)

Adicione os headers de segurança no `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gruporeciclo.com',
        pathname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'http://localhost:8085/:path*',
      },
    ];
  },
  // ✅ ADICIONE ISTO:
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

## 3️⃣ Backend - ATIVANDO HTTPS

**Produção**: Configure HTTPS no backend Java. Exemplo com Spring Boot:

```yaml
server:
  port: 8443
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: sua-senha
    key-store-type: PKCS12
```

## 4️⃣ Backend - Rate Limiting

Adicione rate limiting no Spring Boot:

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.github.bucket4j</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>7.6.0</version>
</dependency>
```

## 5️⃣ Testar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar .env.local
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8085" > .env.local

# 3. Executar em desenvolvimento
npm run dev

# 4. Acessar em http://localhost:3000
```

## 6️⃣ Antes de Fazer Deploy

- [ ] HTTPS ativado no backend
- [ ] Rate limiting no backend
- [ ] `.env.local` com URL de produção
- [ ] Headers de segurança configurados
- [ ] Testar login/registro/logout
- [ ] Cookie httpOnly funcionando
- [ ] Verificar Console do navegador (F12) para erros

## ⚠️ CHECKLIST CRÍTICO

- [ ] Backend respondendo em HTTPS
- [ ] `NEXT_PUBLIC_BACKEND_URL` configurado
- [ ] `next.config.ts` com headers de segurança
- [ ] Middleware ativo (`middleware.ts` na raiz)
- [ ] Testar em navegador privado/incógnito
- [ ] Verificar cookies no DevTools

---

**Dúvidas?** Consulte `SECURITY_AUDIT.md` para detalhes completos.
