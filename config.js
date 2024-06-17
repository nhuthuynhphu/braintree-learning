const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, // Use Sandbox for testing
  merchantId: 'ycjkrz224yt442t3',
  publicKey: 'zwdgxrkq6tphsdzx',
  privateKey: 'd98ca01931d7fd1da73a8d1be1dd9dd4',
});

module.exports = gateway;
