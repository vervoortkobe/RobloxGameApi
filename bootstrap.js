require("dotenv").config();

function bootstrap(fs, app) {
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

module.exports = { bootstrap };