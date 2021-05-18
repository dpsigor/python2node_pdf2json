const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Deletar arquivos que ficaram sobrando, caso haja
fs.readdirSync(__dirname).filter(x => x.startsWith('tmp_')).forEach(tmpfile => fs.unlinkSync(tmpfile));

const filenames = fs.readdirSync(path.join(__dirname, "pdfs")).map((x) => `pdfs/${x}`);

const toJSON = async (filename) => {
  return new Promise(resolve => {
    const py = spawn("python3", ["leitor.py", filename]);
    py.stdout.on("data", jsonFilename => {
      resolve(jsonFilename.toString().replace('\n', ''))
    });
    py.stderr.on("data", (data) => {
      console.error(`stderr: ${data.toString()}`);
      resolve('');
    });
    // py.on("close", (code) => {});
  })
};

const multipleToJSON = async (filenames) => {
  return new Promise(resolve => {
    const py = spawn("python3", ["leitor.py", ...filenames]);
    py.stdout.on("data", jsonFilename => {
      resolve(jsonFilename.toString().replace('\n', ''))
    });
    py.stderr.on("data", (data) => {
      console.error(`stderr: ${data.toString()}`);
      resolve('');
    });
    // py.on("close", (code) => {});
  })
}

const getJSON = filename => {
  const filepath = path.join(__dirname, filename);
  const json = fs.readFileSync(filepath, 'utf-8');
  const leituras = JSON.parse(json);
  console.log(leituras);
  fs.unlinkSync(filepath);
}

const lerUmPorVez = async (filenames) => {
  const jsonFiles = [];
  for (const filename of filenames) {
    console.time(filename);
    const jsonFilename = await toJSON(filename);
    jsonFiles.push(jsonFilename);
    console.timeEnd(filename);
  }
  for (const jsonFile of jsonFiles) {
    getJSON(jsonFile);
  }
}

const lerVariosPorVez = async (filenames) => {
  // Não ler mais que 10 por vez
  if (filenames.length < 2) throw 'Ler varios por vez exige mais de um filename';
  const jsonFilename = await multipleToJSON(filenames);
  getJSON(jsonFilename);
}

// (async() => {
//   await lerVariosPorVez(filenames.slice(0, 2));
// })();
