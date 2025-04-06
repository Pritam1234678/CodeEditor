const express = require("express");
const path = require("path");
const bodyP = require("body-parser");
const compiler = require("compilex");
const cors = require("cors");

const app = express();

// Initialize compiler with Linux paths
const options = { 
  stats: true,
  tempDir: "/tmp"  // Use Render's temp directory
};
compiler.init(options);

app.use(cors());
app.use(bodyP.json());
app.use(express.static(path.join(__dirname)));

// Serve static files
app.use("/codemirror-5.65.19", express.static(path.join(__dirname, "codemirror-5.65.19")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.send({ status: "OK", compiler: "Ready" });
});

// Compilation endpoint
app.post("/compile", (req, res) => {
  const { code, input, lang } = req.body;

  if (!code) return res.status(400).send({ output: "No code provided" });

  try {
    const envData = {
      OS: "linux",
      options: { timeout: 10000 }
    };

    const callback = (data) => res.send(data);

    switch(lang) {
      case "Cpp":
        envData.cmd = "/usr/bin/g++";
        input 
          ? compiler.compileCPPWithInput(envData, code, input, callback)
          : compiler.compileCPP(envData, code, callback);
        break;
      case "Java":
        envData.cmd = "/usr/bin/javac";
        input
          ? compiler.compileJavaWithInput(envData, code, input, callback)
          : compiler.compileJava(envData, code, callback);
        break;
      case "Python":
        envData.cmd = "/usr/bin/python3";
        input
          ? compiler.compilePythonWithInput(envData, code, input, callback)
          : compiler.compilePython(envData, code, callback);
        break;
      default:
        res.status(400).send({ output: "Unsupported language" });
    }
  } catch (err) {
    console.error("Compiler error:", err);
    res.status(500).send({ output: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
