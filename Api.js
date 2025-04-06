const express = require("express");
const path = require("path");
const bodyP = require("body-parser");
const compiler = require("compilex");
const cors = require("cors");

const app = express();
const options = { stats: true };
compiler.init(options);

app.use(cors());
app.use(bodyP.json());

// Serve static files like CodeMirror
app.use("/codemirror-5.65.19", express.static(path.join(__dirname, "codemirror-5.65.19")));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Compilation logic (unchanged)
app.post("/compile", (req, res) => {
  const code = req.body.code;
  const input = req.body.input;
  const lang = req.body.lang;

  try {
    if (lang === "Cpp") {
      const envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
      if (!input) {
        compiler.compileCPP(envData, code, (data) => res.send(data));
      } else {
        compiler.compileCPPWithInput(envData, code, input, (data) => res.send(data));
      }
    } else if (lang === "Java") {
      const envData = { OS: "windows" };
      if (!input) {
        compiler.compileJava(envData, code, (data) => res.send(data));
      } else {
        compiler.compileJavaWithInput(envData, code, input, (data) => res.send(data));
      }
    } else if (lang === "Python") {
      const envData = { OS: "windows" };
      if (!input) {
        compiler.compilePython(envData, code, (data) => res.send(data));
      } else {
        compiler.compilePythonWithInput(envData, code, input, (data) => res.send(data));
      }
    } else {
      res.send({ output: "Unsupported language selected." });
    }
  } catch (err) {
    console.error(err);
    res.send({ output: "Something went wrong!" });
  }
});

app.listen(8000, () => {
  console.log("✅ Server running on http://localhost:8000");
});
