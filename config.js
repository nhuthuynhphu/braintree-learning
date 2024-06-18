const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, // Use Sandbox for testing
  merchantId: '',
  publicKey: '',
  privateKey: '',
});

module.exports = gateway;
