# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala compatibilidade para sharp e módulos nativos
RUN apk add --no-cache libc6-compat

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install --legacy-peer-deps

# Copia o código fonte
COPY . .

# Build de produção do Next.js + Payload
ARG NEXT_PUBLIC_SERVER_URL=https://unitinscti.com.br
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Ferramentas de manutenção (ex.: importação da programação a partir da planilha)
# Publicada pelo CI como <imagem>-tools; executada sob demanda via serviço "tools" do compose.
FROM node:20-alpine AS tools

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/package*.json /app/tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

ENV NODE_ENV=production

CMD ["npm", "run", "import:schedule:2026"]

# Stage 3: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache curl libc6-compat

# Cria usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia arquivos necessários do builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

CMD ["node", "server.js"]
