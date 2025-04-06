const express = require("express");
const app = express();
const bodyP = require("body-parser");
const compiler = require("compilex");
const cors = require("cors");
const path = require("path"); // Add this for resolving paths

const options = { stats: true };
compiler.init(options);

app.use(cors());
app.use(bodyP.json());

// Serve static files (e.g., codemirror and index.html)
app.use("/codemirror-5.65.19", express.static(path.join(__dirname, "codemirror-5.65.19")));
app.use(express.static(__dirname)); // Serve all static files from the project directory

// Serve index.html
app.get("/", function (req, res) {
  compiler.flush(() => {
    console.log("Deleted previous files.");
  });
  res.sendFile(path.join(__dirname, "index.html")); // Use relative path
});

// Compilation logic remains unchanged
app.post("/compile", function (req, res) {
  const code = req.body.code;
  const input = req.body.input;
  const lang = req.body.lang;

  try {
    if (lang === "Cpp") {
      const envData = {
        OS: "windows",
        cmd: "g++",
        options: { timeout: 10000 },
      };

      const cb = (data) => {
        if (res.headersSent) return;
        res.send(data.error ? { output: data.error } : data);
      };

      if (!input) compiler.compileCPP(envData, code, cb);
      else compiler.compileCPPWithInput(envData, code, input, cb);

    } else if (lang === "Java") {
      const envData = { OS: "windows" };

      const cb = (data) => {
        if (res.headersSent) return;
        res.send(data.error ? { output: data.error } : data);
      };

      if (!input) compiler.compileJava(envData, code, cb);
      else compiler.compileJavaWithInput(envData, code, input, cb);

    } else if (lang === "Python") {
      const envData = { OS: "windows" };

      const cb = (data) => {
        if (res.headersSent) return;
        res.send(data.error ? { output: data.error } : data);
      };

      if (!input) compiler.compilePython(envData, code, cb);
      else compiler.compilePythonWithInput(envData, code, input, cb);

    } else {
      res.send({ output: "Unsupported language selected." });
    }
  } catch (err) {
    console.error("Unexpected error during compilation:", err);
    if (!res.headersSent) {
      res.send({ output: "Internal Server Error" });
    }
  }
});

app.listen(8000, () => {
  console.log("✅ Compiler API running on http://localhost:8000");
});
