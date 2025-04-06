const express = require("express");
const path = require("path");
const bodyP = require("body-parser");
const compiler = require("compilex");
const cors = require("cors");
const os = require("os");

const app = express();

// Configure compiler with proper temp directory for Render
const options = { 
  stats: true,
  tempDir: os.tmpdir() // Use system temp directory
};
compiler.init(options);

// Middleware setup
app.use(cors());
app.use(bodyP.json());
app.use(express.static(path.join(__dirname)));

// Serve static files like CodeMirror
app.use("/codemirror-5.65.19", express.static(path.join(__dirname, "codemirror-5.65.19")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ output: 'Server error!' });
});

// Test endpoint to verify environment
app.get("/test", (req, res) => {
  compiler.flush(() => {
    res.send({
      status: 'Compiler ready',
      path: process.env.PATH,
      tempDir: os.tmpdir(),
      system: os.platform()
    });
  });
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Compilation endpoint
app.post("/compile", (req, res) => {
  const code = req.body.code;
  const input = req.body.input;
  const lang = req.body.lang;

  if (!code) {
    return res.status(400).send({ output: "No code provided" });
  }

  try {
    if (lang === "Cpp") {
      const envData = { 
        OS: "linux", // Changed from windows to linux for Render
        cmd: "g++",
        options: { timeout: 10000 } 
      };
      
      if (!input) {
        compiler.compileCPP(envData, code, (data) => res.send(data));
      } else {
        compiler.compileCPPWithInput(envData, code, input, (data) => res.send(data));
      }
    } 
    else if (lang === "Java") {
      const envData = { OS: "linux" }; // Changed to linux
      
      if (!input) {
        compiler.compileJava(envData, code, (data) => res.send(data));
      } else {
        compiler.compileJavaWithInput(envData, code, input, (data) => res.send(data));
      }
    } 
    else if (lang === "Python") {
      const envData = { OS: "linux" }; // Changed to linux
      
      if (!input) {
        compiler.compilePython(envData, code, (data) => res.send(data));
      } else {
        compiler.compilePythonWithInput(envData, code, input, (data) => res.send(data));
      }
    } 
    else {
      res.status(400).send({ output: "Unsupported language selected." });
    }
  } catch (err) {
    console.error("Compilation error:", err);
    res.status(500).send({ output: "Something went wrong during compilation!" });
  }
});

// Get port from environment or use 8000 locally
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Temp directory: ${os.tmpdir()}`);
  console.log(`System PATH: ${process.env.PATH}`);
});
