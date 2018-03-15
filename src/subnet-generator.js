const fs = require('fs');
const ip = require('ip');

module.exports = {
  settingsPath: 'servers',

  newSubnetwork: (options) => {
    let subnet = ip.cidrSubnet(options.lastSubnetwork + "/" + options.subnetworkSize);
    let nextNetworkAddress = ip.fromLong(ip.toLong(subnet.broadcastAddress) + 1);
    if (!ip.cidrSubnet(options.network).contains(nextNetworkAddress)) {
      nextNetworkAddress = ip.cidrSubnet(options.network);
    }
    return nextNetworkAddress;
  },

  readServer: (server) => {
    let settingsFile = 'servers/' + server + '.json';
    return new Promise((resolve, reject) => {
      console.log('Reading server: ' + server);
      console.log('Reading file: ' + settingsFile);
      fs.readFile(settingsFile, (err, data) => {
        if (err) {
          reject("File reading error: " + settingsFile);
        }
        try {
          let result = JSON.parse(data);
          console.log(result);
          if (!ip.isV4Format(result.lastSubnetwork)) {
            throw('Last server IP is malformatted');
          }
          if (!result.name) {
            throw('Name should be provided');
          }
          resolve(result);
        }
        catch (e) {
          console.log(e);
          reject(e);
        }
      });
    });
  },

  writeServer: (data) => {
    let settingsFile = 'servers/' + data.name + '.json';
    console.log('Writing server settings: ' + settingsFile);
    console.log(data);
    return new Promise((resolve, reject) => {
      fs.writeFile(settingsFile, JSON.stringify(data, null, 4), (err) => {
        if (err) reject("Failed writing settings for server:" + server);
        resolve(data);
      });
    });
  },

  listServers: () => {

  }
}
