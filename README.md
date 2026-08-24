# Plataforma Multi-Edição — Semana de Ciência, Tecnologia e Inovação (UNITINS)

Repositório oficial da plataforma web multi-edição da Semana de Ciência, Tecnologia e Inovação da Universidade Estadual do Tocantins (UNITINS). Conta com Painel Administrativo (Payload CMS 3.x), roteamento dinâmico por edição (`/{ano}`), banco PostgreSQL e revalidação instantânea de cache (*On-Demand Tag Revalidation*).

---

## 🛠️ Stack Tecnológica

- **Framework Frontend:** Next.js 15 (App Router, Turbopack, React 19, TypeScript)
- **CMS & Backend:** Payload CMS 3.x (Self-hosted, Local API, REST & GraphQL)
- **Estilização & UI:** Tailwind CSS v4, Radix UI, Motion, Embla Carousel
- **Banco de Dados:** PostgreSQL 16
- **Armazenamento de Mídia:** Backblaze B2 via `@payloadcms/storage-s3` (com fallback local em dev)
- **Infraestrutura:** Docker, Nginx (Reverse Proxy), Certbot (SSL Let's Encrypt), Automated Postgres Backup

---

## 🐳 Execução via Docker (Recomendado)

Você pode rodar toda a stack (Next.js + Postgres) diretamente pelo Docker em dois modos:

### 1. Modo Desenvolvimento (com Hot-Reloading)

Neste modo, o código local é sincronizado em tempo real com o container (`npm run dev` com Turbopack):

```bash
# Inicia o Postgres e o Next.js em modo desenvolvimento
npm run docker:dev
# ou: docker compose up
```

Acesse:
- **Site:** [http://localhost:3000](http://localhost:3000) (redireciona para a edição ativa `/2025`)
- **Histórico de Edições:** [http://localhost:3000/edicoes](http://localhost:3000/edicoes)
- **Painel Administrativo:** [http://localhost:3000/admin](http://localhost:3000/admin)

#### Popular os Dados Iniciais (Seed via Docker):
Com os containers de desenvolvimento rodando, execute:
```bash
npm run docker:seed
```
*Isso cria o usuário administrador inicial (`admin@unitins.br` / `Unitins@2025`), cadastra a edição 2025 e importa toda a grade do `schedule.json`.*

Para parar os containers de dev:
```bash
npm run docker:dev:down
```

---

### 2. Modo Produção (Standalone + Nginx + Backup)

Para rodar a compilação standalone de alta performance com Nginx como proxy reverso e backup automático diário:

```bash
# Constrói a imagem standalone e inicia todos os serviços em background
npm run docker:prod:build
# ou: docker compose -f docker-compose.prod.yml up -d --build
```

Acesse:
- **Site via Nginx:** [http://localhost](http://localhost) ou [https://unitinscti.com.br](https://unitinscti.com.br)

Para visualizar os logs ou parar:
```bash
npm run docker:prod:logs
npm run docker:prod:down
```

---

## 💻 Execução Local Híbrida (Sem Docker para o Next.js)

Se preferir rodar o Next.js diretamente na sua máquina host:

1. **Suba apenas o banco Postgres:**
   ```bash
   docker compose up -d db
   ```
2. **Execute o seed inicial:**
   ```bash
   npm run seed
   ```
3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## 🔐 Painel Administrativo (/admin)

- **URL:** `http://localhost:3000/admin`
- **Usuário Padrão:** `admin@unitins.br`
- **Senha Padrão:** `Unitins@2025` *(configure `ADMIN_INITIAL_PASSWORD` no `.env` para alterar)*

---

## 👥 Colaboradores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Matheus-Nardi" target=_blank>
        <img src="https://avatars.githubusercontent.com/u/131494232?v=4" width="100px;" alt="Matheus Alexandre Profile Picture"/><br>
        <sub>
          <b>Matheus Alexandre</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/italobeckman" target=_blank>
        <img src="https://avatars.githubusercontent.com/u/142343482?v=4" width="100px;" alt="Italo Picture"/><br>
        <sub>
          <b>Italo Beckman</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
