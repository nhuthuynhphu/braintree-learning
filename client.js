const API_URL = 'http://localhost:3000';
const paymentMessage = document.getElementById('payment-message');
// Fetch client token from server
document.addEventListener('DOMContentLoaded', function () {
  fetch(API_URL + '/client-token')
    .then((response) => response.text())
    .then((clientToken) => {
      // Initialize Braintree Drop-in UI
      braintree.dropin.create(
        {
          authorization: clientToken,
          container: '#card-element',
        },
        (createErr, instance) => {
          if (createErr) {
            console.error(createErr);
            return;
          }

          document.querySelector('#submit').addEventListener('click', () => {
            instance.requestPaymentMethod(
              (requestPaymentMethodErr, payload) => {
                if (requestPaymentMethodErr) {
                  console.error(requestPaymentMethodErr);
                  return;
                }

                // Submit payload.nonce to your server
                fetch(API_URL + '/checkout', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    paymentMethodNonce: payload.nonce,
                    amount: '10.00',
                  }),
                })
                  .then((response) => response.text())
                  .then((result) => {
                    showMessage(result);
                  });
              }
            );
          });
        }
      );
    });
});

function showMessage(message) {
  paymentMessage.textContent = message;
  paymentMessage.classList.remove('hidden');
}
