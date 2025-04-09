const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const HTMLToReactConverter = require('./Conversion.js');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.post('/api/convert', async (req, res) => {
  try {
    const htmlCode = req.body.code;
    const tempId = uuidv4();
    const tempDir = path.join(__dirname, 'tmp', tempId);
    const inputHtmlPath = path.join(tempDir, 'input.html');

    fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(inputHtmlPath, htmlCode);

    const converter = new HTMLToReactConverter(inputHtmlPath, tempDir, {
      componentName: 'CanvasComponent'
    });
    await converter.convert();

    const zipPath = path.join(tempDir, 'react-app.zip');

    res.download(zipPath, 'react-app.zip', (err) => {
      if (err) {
        console.error("❌ Error sending ZIP:", err);
      }
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log("🧹 Cleaned up temp files.");
      } catch (cleanupErr) {
        console.error("⚠️ Failed to clean temp folder:", cleanupErr);
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal server error");
  }
});

app.listen(5050, () => console.log("✅ Backend running on http://localhost:5050"));
