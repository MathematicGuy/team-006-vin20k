# New Researcher MVP — Quick Start Guide for Beginners

Welcome to the **New Researcher MVP**! This is a SciSpace-inspired research assistant designed to guide students through the academic research cycle.

If you are new to web development, Node.js, and `npm`, this guide will walk you through exactly what to install, what commands to run, and why you are running them.

---

## Prerequisites (Install This First)

Before running the application, you need to install **Node.js** on your computer.
1. Download and install Node.js from the official website: [nodejs.org](https://nodejs.org/).
2. Choose the **LTS (Long Term Support)** version.
3. Installing Node.js automatically installs a tool called **npm** (Node Package Manager), which handles downloading code packages.

---

## Step 1: Set Up Your Keys (.env)

The server needs API keys to communicate with AI models (OpenAI, OpenRouter, or Gemini). 

1. Locate the main project folder (`ai20k-ux-workshop`).
2. Create a new text file directly inside that main folder and name it exactly `.env`.
3. Open the `.env` file in any text editor (like Notepad, VS Code) and add the following lines (replace with your actual keys):

```ini
# 1. Main LLM Provider (Active Model: gpt-5.4-nano)
OPENAI_API_KEY=your_openai_api_key_here

# 2. Fallback LLM Provider (Active Model: deepseek-v4-flash)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# 3. Gemini Fallback (Active Model: gemini-2.5-flash-lite)
GOOGLE_API_KEY=your_gemini_api_key_here
```

*Note: If you don't have keys yet, the application will automatically fall back to simulated mock data so you can still test it.*

---

## Step 2: Start the Application

To run this application, you must run both the **backend (server)** and the **frontend (client)** at the same time. This requires opening **two separate terminal/command prompt windows**.

### Why do I need to run both?
Modern web applications are split into two parts for security and performance:
*   **The Client (Frontend)**: This is the user interface that runs inside your web browser. It is responsible for what you see on the screen (buttons, layout panels, inputs). It runs on port `5173`.
*   **The Server (Backend)**: This is the engine that runs on your computer. It securely communicates with the AI models and handles session calculations. We keep this separate so that your secret AI API keys are never exposed to the web browser. It runs on port `3001`.

**How they interact**: When you type a prompt on the website (Client), the website sends a background request to the engine (Server). If the Server is not running, the website will show connection errors because it has no way to talk to the AI.

### Terminal 1: Run the Backend (Server)
The backend handles LLM calls, saves session data, and processes papers.

1. Open your first terminal window and navigate into the `server` folder:
   ```bash
   cd server
   ```
   *(Note: `cd` stands for "change directory" — it moves the terminal inside the server folder).*

2. Download and install all required packages:
   ```bash
   npm install
   ```
   *(Note: `npm install` reads the `package.json` file and downloads the required libraries into a `node_modules` folder).*

3. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *(Note: The server will run at `http://localhost:3001` and automatically restart whenever you make code changes).*

---

### Terminal 2: Run the Frontend (Client)
The frontend is the visual website interface you interact with.

1. Open a **second, separate terminal window** and navigate into the `client` folder:
   ```bash
   cd client
   ```

2. Download and install the frontend packages:
   ```bash
   npm install
   ```

3. Start the website interface:
   ```bash
   npm run dev
   ```
   *(Note: This starts the development server. The terminal will output a URL, typically `http://localhost:5173`).*

---

## Step 3: Open the App in Your Browser

1. Once both terminals say they are running successfully, open your web browser (Chrome, Edge, etc.).
2. Go to the address: **[http://localhost:5173](http://localhost:5173)**
3. You can now start using the Research Navigator!

---

## How to Run the Automated Tests

Tests are automated scripts that check if the server code is working correctly. You **do not** need to have the client or main server running to run these tests.

1. Open a terminal window and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Run the test command:
   ```bash
   npm run test
   ```
3. The terminal will run 10 checks and print the results (e.g., `pass 10`, `fail 0`).
