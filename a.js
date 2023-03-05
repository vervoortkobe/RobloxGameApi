
require("node-fetch")("https://localhost.vervoortkobe.ga/api/snumbers", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: "test"
    })
  }).then(function (response) {
      return response.json();
    })
    .then(function (data) {
console.log(data);
    })
    .catch(function (err) {
      console.log(err);
    });