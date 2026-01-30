# Simple-EAM (Enterprise Architecture Management)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./VERSION)

> **🤖 AI-Generated Project**: This code was fully created with GitHub Copilot in Agent mode. The entire project, including architecture, implementation and documentation, was realized through AI-assisted development.

A modern Enterprise Architecture Management system that helps organizations manage, visualize and optimize their IT landscape.

## 🚀 Features

- **Visual Representation**: IT architecture visualization with Excalidraw
- **Component Management**: Manage applications, services, databases and infrastructure
- **Relationship Mapping**: Display dependencies between components
- **Multi-Language Support**: German and English
- **Modern Tech Stack**: Next.js 15, Material-UI 7, Neo4j, GraphQL
- **Runtime Configuration**: Change settings without rebuilding
- **Secure Authentication**: Keycloak integration with role-based access control

## 🛠️ Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **Material-UI 7**: UI component library
- **TypeScript**: Type-safe development
- **Tanstack Table V8**: Advanced table functionality
- **Tanstack Form**: Powerful form creation
- **Apollo Client**: GraphQL client
- **Excalidraw**: Diagram editor

### Backend

- **GraphQL**: API layer
- **Neo4j**: Graph database for architecture models
- **Node.js**: Server runtime

### Infrastructure

- **Docker**: Containerization
- **Keycloak**: Authentication and authorization
- **Yarn Berry**: Package manager

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Yarn Berry (automatically configured)

## 🚀 Installation

1. **Clone repository**

```bash
git clone https://github.com/marcus-friedrich/simple-eam.git
cd simple-eam
```

2. **Install dependencies**

```bash
yarn install
```

3. **Configure environment variables**

```bash
cp env.sample .env
# Adjust variables as needed
```

4. **Start Docker services**

```bash
docker-compose up -d
```

5. **Start development server**

```bash
cd client
yarn dev
```

The application is then available at: http://localhost:3000

## 📁 Project Structure

```
simple-eam/
├── auth/                   # Keycloak configuration
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   └── graphql/       # GraphQL queries
├── db/                     # Neo4j database
├── server/                 # GraphQL server
├── templates/              # Entity templates
├── scripts/               # Automation scripts
└── docs/                  # Documentation
```

## 🎯 Entity Generation

The project uses a template system for automatic generation of new entities:

```bash
./scripts/create-entity.sh [entity-name]
```

Example:

```bash
./scripts/create-entity.sh companies
```

## 🔧 Development

### Available Scripts

```bash
# Frontend Development
yarn dev              # Start development server
yarn build            # Create production build
yarn lint             # Run ESLint

# Version Management
yarn version          # Show current version
yarn version:patch    # Increment patch version (1.0.0 -> 1.0.1)
yarn version:minor    # Increment minor version (1.0.0 -> 1.1.0)
yarn version:major    # Increment major version (1.0.0 -> 2.0.0)

# Entity Management
./scripts/create-entity.sh [name]  # Create new entity

# Docker
docker-compose up -d   # Start all services
docker-compose down    # Stop all services
```

### Code Standards

- **TypeScript**: Strict typing
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

## 📚 Documentation

Detailed documentation can be found in the [`docs/`](./docs/) directory:

- [Architecture Overview](./docs/README.md)
- [Entity Pattern](./docs/ENTITY-IMPLEMENTATION-PATTERN.md)
- [Development Guidelines](./docs/CONTRIBUTING.md)
- [Runtime Configuration](./docs/RUNTIME_CONFIG.md)
- [Branding and Theming](./docs/BRANDING.md)

## 🌐 Services

- **Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:4000/graphql
- **Neo4j Browser**: http://localhost:7474
- **Keycloak Admin**: http://localhost:8080

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Created with GitHub Copilot Agent mode
- Material-UI for UI components
- Neo4j for graph database
- Excalidraw for diagram functionality
