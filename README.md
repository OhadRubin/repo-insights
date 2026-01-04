# Gitingest Replica

A client-side replica of [gitingest.com](https://gitingest.com) built with React, TypeScript, and Tailwind CSS. This tool allows you to turn any Git repository into a text digest suitable for LLMs.

## Features

- ⚛️ **Client-Side Analysis**: Directly interacts with GitHub API from your browser.
- 🌳 **Recursive Tree View**: Visualizes repository structure.
- 📄 **Smart Ingestion**: Concatenates code files while filtering binaries and lock files.
- 📊 **Token Estimation**: Estimates token count for LLMs.
- 🎨 **Premium Dark Theme**: Designed for a modern developer experience.
- 🚀 **GitHub Pages Ready**: Deployed instantly to GitHub Pages.

## Usage

### Development

1.  **Start the development server:**
    ```bash
    npm start
    ```
2.  **Build for production:**
    ```bash
    npm run build
    ```

### Deployment

To deploy updates to GitHub Pages, you can use the automated script or the manual command:

**Option 1: Automated Script (Recommended)**
```bash
npm run auto-deploy
```
This script checks dependencies, builds the project, and deploys it.

**Option 2: Manual Deployment**
```bash
npm run deploy
```
Use this if you just want to run the `gh-pages` command (requires a previous build).

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- Framer Motion (Animations)
- GPT Tokenizer

## License

MIT