const generator = require('../src/subnet-generator.js');

test('if network added we should start from beginning', () => {
  let server = {
        'name': 'default-192',
        'network': '192.168.0.0/16',
        'subnetworkSize': '24',
        'lastSubnetwork': '192.168.255.0'
      };
  expect(generator.newSubnetwork(server)).toBe('192.168.0.0');
});

test('network generated properly', () => {
  let server = {
    'name': 'default-192',
    'network': '192.168.0.0/16',
    'subnetworkSize': '24',
    'lastSubnetwork': '192.168.0.0'
  };
  expect(generator.newSubnetwork(server)).toBe('192.168.1.0');
});

test('CIDR masks', () => {
  let server = {
    'name': 'default-192',
    'network': '192.168.0.0/16',
    'subnetworkSize': '23',
    'lastSubnetwork': '192.168.0.0'
  };
  server.lastSubnetwork = generator.newSubnetwork(server);
  expect(server.lastSubnetwork).toBe('192.168.2.0');
  expect(generator.newSubnetwork(server)).toBe('192.168.4.0');

});