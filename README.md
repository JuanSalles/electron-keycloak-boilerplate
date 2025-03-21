# Electron Keycloak Boilerplate

Este é um boilerplate para projetos utilizando **Electron**, **TypeScript** e **Keycloak** para autenticação. Ele fornece uma base sólida para iniciar o desenvolvimento de aplicações desktop seguras e modernas.

[![Read in English](https://img.shields.io/badge/README-English-blue)](README.en.md)

## Recursos

- **Electron**: Framework para criação de aplicações desktop multiplataforma.
- **TypeScript**: Suporte a tipagem estática para maior segurança e produtividade.
- **Keycloak**: Integração com Keycloak para autenticação e gerenciamento de usuários.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Yarn](https://yarnpkg.com/) ou npm

## Demostração

![Demonstração da Aplicação](repository_content/aplicacao_gif.gif)

## Instalação

1. Clone o repositório:
    ```markdown
    Use este repositorio como template, clicando no botão "Use this template" do github
    ```

2. Instale as dependências:

   ```bash
   yarn install
   # ou
   npm install
   ```

3. Setup:
    ```markdown
    Crie o .env na raiz do projeto, usando como base o arquivo example.env
    ```

## Uso

1. Configure o Keycloak no arquivo de configuração apropriado.
2. Compile:

   ```bash
   yarn build
   # ou
   npm run build
   ```

3. Inicie o ambiente de desenvolvimento:

   ```bash
   yarn start
   # ou
   npm start
   ```



## Estrutura do Projeto

```plaintext
electron-keycloak-boilerplate/
├── src/               # Código-fonte principal
├── public/            # Arquivos estáticos
├── package.json       # Configurações do projeto
└── README.md          # Documentação do projeto
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
