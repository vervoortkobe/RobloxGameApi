const fetch = require("node-fetch");
const hostname = "";

fetch(`//${hostname}/api/snumbers`, {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    key: "test",
    name: "Test3"
  })
}).then((res) => {
  return res.json();
}).then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
});