# MATERNALLE API - Express + Prisma + Supabase

Este projeto é uma API construída com **Express.js** e **Prisma ORM**, utilizando **PostgreSQL via Supabase** como banco de dados.  

O objetivo é fornecer uma API organizada, escalável e de fácil manutenção, com suporte a **migrations** e **Prisma Client** para administração do banco.


---

## Arquitetura e Tecnologias

- **Express.js**: framework leve para criar a API REST.  
- **Prisma**: ORM para interagir com o banco PostgreSQL de forma tipada e segura.  
- **Supabase (PostgreSQL)**: banco de dados relacional hospedado na nuvem.  
- **Nodemon**: para desenvolvimento, reinicia o servidor automaticamente ao salvar alterações.  

---

## Conexão com o Supabase

O projeto utiliza **duas URLs diferentes** para o PostgreSQL:

1. **DIRECT_URL** (porta 5432)  
   - Conexão direta para **migrations e alterações de schema**  
   - Exemplo: `postgresql://usuario:senha@host:5432/postgres`  

2. **DATABASE_URL** (porta 6543 com `pgbouncer=true`)  
   - Conexão com **pooling** para uso pela API  
   - Exemplo: `postgresql://usuario:senha@host:6543/postgres?pgbouncer=true`  

> Estratégia: Prisma usa `DIRECT_URL` para criar ou alterar tabelas.  
> A aplicação Express usa `DATABASE_URL` para realizar queries de forma eficiente.

---

## Scripts Úteis (package.json)

```json
{
  "scripts": {
    "start": "node server.js", 
    "dev": "nodemon server.js", 
    "prisma:generate": "prisma generate",
    "prisma:migrate": "set DATABASE_URL=%DIRECT_URL% && npx prisma migrate dev --name init",
  }
}
```
| Script            | Comando                                                   | O que faz                                                                               |
| ----------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `start`           | `node server.js`                                          | Inicia a API normalmente em modo produção ou desenvolvimento simples.                   |
| `dev`             | `nodemon server.js`                                       | Inicia a API em modo desenvolvimento, reiniciando automaticamente ao salvar alterações. |
| `prisma:generate` | `prisma generate`                                         | Gera o **Prisma Client**, permitindo que você interaja com o banco via código.          |
| `prisma:migrate`  | `set DATABASE_URL=%DIRECT_URL% && npx prisma migrate dev --name init` | Executa as migrações usando a **conexão direta**, criando/alterando tabelas e colunas no banco de dados. |
