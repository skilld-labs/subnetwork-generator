const fs = require('fs');
const generator = require("./src/subnet-generator.js");

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log('Service started on: http://' + host + ':' + port);
});

app.get('/new/:id*?', function (request, response) {
  let server = ((request.params.id) ? request.params.id : 'default');
  generator.readServer(server)
      .then((settings) => {
        settings.lastSubnetwork = generator.newSubnetwork(settings);
        generator.writeServer(settings)
            .then((settings) => {
              console.log('New network for server ' + server + ': ' + settings.lastSubnetwork);
              response.send(settings.lastSubnetwork + '/' + settings.subnetworkSize);
            })
            .catch((err) => {
              console.log(err);
              response.status(503).send(err);
            });
      })
      .catch((err) => {
        console.log(err);
        response.status(503).send(err);
      })
});

app.get('/status/:id*?', function(request, response) {
  let server = ((request.params.id) ? request.params.id : 'default');
  generator.readServer(server)
      .then((settings) => {
        console.log(settings);
        response.status(200).send(settings);
      })
      .catch((err) => {
        console.log(err);
        response.status(503).send(err);
      })
});

app.get('*', function (req, res) {
  fs.readFile(settingsFile, (err, data) => {
    if (err) {
      throw('File not found');
    }

    var contents = fs.readFileSync('./assets/index.html', 'utf8');
  res.status(200).send(contents);
});

// Wrap unhandled exceptions to avoid system crash
process.on('uncaughtException', (err) => {
  if (err.response != undefined) {
    console.log(err.message);
    err.response.status(err.statusCode).send(err.message);
  }
  else {
    console.log(err);
  }
});

