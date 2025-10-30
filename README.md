# 🧠 ScholarMate — Your AI-Powered Study Companion

**Study smarter with AI — instantly turn your notes and PDFs into clear summaries, interactive flashcards, and smart quizzes.**

🚀 Live App: https://scholarmate-rho.vercel.app  
🎥 Demo Video: https://youtu.be/4gqDGIvneWg?si=M-FXVkUH4USSG37I

---

## ✨ Features
- 📄 Upload PDFs or text notes  
- ⚡ Generate AI-powered summaries in seconds  
- 🎓 Create interactive flashcards for quick revision  
- 🧩 Generate smart quizzes to test your understanding  
- 💾 Runs locally in Chrome using on-device AI (no API keys required)  
- 🎨 Clean, responsive, and modern UI built with ShadCN + Tailwind  

---

## 🛠️ Tech Stack
- ⚛️ Next.js 15 (App Router)  
- ⚡ React 19  
- 🎨 Tailwind CSS + ShadCN/UI  
- 🎬 Framer Motion  
- 🧠 Chrome Prompt & Summarization APIs  
- ☁️ Vercel Hosting  

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository
git clone https://github.com/yourusername/scholarmate.git
cd scholarmate

### 2️⃣ Install Dependencies
npm install
or
yarn
or
pnpm install
or
bun install

### 3️⃣ Run Locally
npm run dev
Then open http://localhost:3000 in your browser.

### 4️⃣ Enable Chrome Experimental Flags
ScholarMate uses Chrome’s on-device AI (Gemini Nano) via the Prompt and Summarization APIs.
To enable these features, turn on the following flags in Chrome:

chrome://flags

### Enable the following:
prompt-api-for-gemini-nano

summarization-api-for-gemini-nano

optimization-guide-on-device-model

After enabling, restart Chrome and visit:
https://scholarmate-rho.vercel.app

#### Now your browser can generate AI summaries, flashcards, and quizzes locally — no external APIs required.

### 5️⃣ Usage
- Open ScholarMate in Chrome (with the flags enabled)
- Upload your PDFs or text notes
- ScholarMate will generate:
       🧠 Summaries of your content
       🎓 Flashcards for active recall
       🧩 Quizzes for self-testing
- You can re-upload, delete files, and switch between tabs seamlessly.

### 6️⃣ Developer Notes
✅ Supports text and PDF inputs
✅ AI runs fully on-device in Chrome (no backend or API keys)
✅ Best experience on the latest Chrome desktop version
✅ Works seamlessly with Vercel hosting or local builds

### 7️⃣ License
MIT License © 2025 ScholarMate Team

### 8️⃣ Contributing
Fork the repository
Create a new branch
git checkout -b feature/your-feature

Commit your changes
git commit -m "Add your feature"

Push to your branch
git push origin feature/your-feature

Open a Pull Request 🎉

---

Made with ❤️ and AI by the ScholarMate Team
