# 🖌️ Sketch to React

**Convert hand-drawn canvas designs into functional React projects with a single click.**  
This tool lets you draw with basic shapes, then uses Gemini AI + backend magic to generate and download a full React codebase.

---

## 🚀 Features

- Canvas sketching with tools: select, square, circle, pencil, text, eraser
- Fill, stroke, line width and eraser size customization
- Backend API to process canvas → HTML → React
- AI-powered HTML generation using **Gemini**
- Zips the generated React project and downloads it
- Fully styled interface

---

## 🛠️ Installation

1. **Clone the repo**
    ```bash
    git clone https://github.com/your-username/SketchFlow
    cd sketch-to-react
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```
    > ✅ Note: Download if [Node JS](https://nodejs.org/en) isn't already install **globaly**.
3. **Set up environment variables**

    Create a `.env` file:
    ```env
    REACT_APP_GEMINI_API_KEY=your_google_generative_ai_key
    ```

    > ✅ Note: `.env` is already ignored via `.gitignore`.
4. **Download Required Libraries**

    ```bash
    npm install react react-dom react-router-dom react-scripts fabric file-saver html-to-react jszip cheerio dompurify cors @google/generative-ai web-vitals
    ```

5. **Start the backend**
    ```bash
    node server.js
    ```

    This runs on: [http://localhost:5050](http://localhost:5050)

6. **Start the frontend**
    ```bash
    npm start
    ```

    This runs the React app on: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Usage

- Draw using tools on the canvas  
- Click **Convert & Download ZIP**  
- Wait for the loading spinner while Gemini generates HTML  
- Download the full working React project zip  
- Unzip and:
    ```bash
    npm install && npm start
    ```

---

## 🧠 Powered by

- [Fabric.js](http://fabricjs.com/) – Canvas drawing
- [Gemini API](https://ai.google.dev/) – AI-based HTML generation
- [Cheerio](https://cheerio.js.org/) – HTML parsing
- [html-to-react](https://github.com/aknuds1/html-to-react) – Conversion helper
- [JSZip](https://stuk.github.io/jszip/) – Bundling for download

---

## 📁 Project Structure
```bash
├── src 
│ ├── components 
│ │ └── Gemini.js 
│ ├── pages 
│ │ └── Home.js 
│ └── index.js 
├── server.js 
├── conversion.js 
├── .env 
├── .gitignore 
└── README.md
```

---

## 🧹 Cleanup

- Backend **automatically deletes temporary folders** after ZIP download is complete.

---

## 🛡️ Security

- Never commit your `.env` file or real API keys.
- Add .env into ur gitignore File. (.env)

---

## 💡 Want to contribute?

Feel free to submit PRs to enhance UI, add export formats, or improve AI prompts.
