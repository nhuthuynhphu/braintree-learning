const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const cors = require('cors');
const gateway = require('./config');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/client-token', (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response.clientToken);
    }
  });
});

app.post('/checkout', (req, res) => {
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const amount = req.body.amount;

  gateway.transaction.sale(
    {
      amount: amount,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else if (result.success) {
        res.send('Transaction ID: ' + result.transaction.id);
      } else {
        res.status(500).send(result.message);
      }
    }
  );
});

// Schedule the cron job to run every 10 minutes
cron.schedule('*/10 * * * * *', async () => {
  console.log('Checking transaction statuses...');
  const transactionResult = gateway.transaction.search((search) => {
    search.currency().is('AUD');
  });
  const transactionStatuses = {};
  await new Promise((resolve) => {
    transactionResult.on('data', (chunk) => {
      const { status, id } = JSON.parse(JSON.stringify(chunk));

      const currentTransactionIds = transactionStatuses[status] || [];
      transactionStatuses[status] = [...currentTransactionIds, id];

      resolve(null);
    });
  });

  console.log(transactionStatuses);
});

// Testing endpoints
app.post('/test-webhook/settled', (req, res) => {
  const result = gateway.testing.settle(req.body.transactionId);
  res.json(result);
});

app.post('/test-webhook/settlement-declined', (req, res) => {
  const result = gateway.testing.settlementDecline(req.body.transactionId);
  res.json(result);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
