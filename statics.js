require("dotenv").config();

function statics(fs, app) {
  //STYLE.CSS
  app.get("/style.css", (req, res) => {
    res.sendFile(`${__dirname}/dash/style.css`);
  });
  
  //SCRIPT.JS
  app.get("/script.js", (req, res) => {
    res.sendFile(`${__dirname}/dash/script.js`);
  });

  //BOOTSTRAP DIR HOST
  let bootstraps = fs.readdirSync("./bootstrap-5.1.3-dist/css/themes/", { withFileTypes: true });
  bootstraps.forEach(b => {
    app.get(`/bootstrap-5.1.3-dist/css/themes/${encodeURI(`${b.name}`)}`, (req, res) => {
      res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/css/themes/${decodeURI(`${b.name}`)}`);
    });
  });
  
  //BOOTSTRAP JS
  app.get("/bootstrap-5.1.3-dist/js/bootstrap.min.js", (req, res) => {
    res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/js/bootstrap.min.js`);
  });
  
  //BOOTSTRAP JS MAP
  app.get("/bootstrap-5.1.3-dist/js/bootstrap.min.js.map", (req, res) => {
    res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/js/bootstrap.min.js.map`);
  });
}

module.exports = { statics };