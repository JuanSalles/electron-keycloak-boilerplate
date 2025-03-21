# Electron Keycloak Boilerplate

This is a boilerplate for projects using **Electron**, **TypeScript**, and **Keycloak** for authentication. It provides a solid foundation for developing secure and modern desktop applications.

[![Read in Portuguese](https://img.shields.io/badge/README-Português-blue)](README.md)

## Features

- **Electron**: Framework for building cross-platform desktop applications.
- **TypeScript**: Static typing support for increased safety and productivity.
- **Keycloak**: Integration with Keycloak for authentication and user management.

## Prerequisites

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/) (recommended LTS version)
- [Yarn](https://yarnpkg.com/) or npm

## Demonstration

![App demonstration](repository_content/aplicacao_gif.gif)

## Installation

1. Clone the repository:

    ```markdown
    Use this repository as a template by clicking the "Use this template" button on GitHub.
    ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```


3. Setup:
    ```markdown
    Create the `.env` file in the project root, using the `example.env` file as a base.
    ```
## Usage

1. Configure Keycloak in the appropriate configuration file.

2. Build:

   ```bash
   yarn build
   # or
   npm run build
   ```

3. Start the development environment:

   ```bash
   yarn start
   # or
   npm start
    ```
   

## Project Structure

```plaintext
electron-keycloak-boilerplate/
├── src/               # Main source code
├── public/            # Static files
├── package.json       # Project configurations
└── README.md          # Project documentation
```

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
