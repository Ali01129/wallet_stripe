Stripe with React Native and Nodejs expressjs
TypeScript instead of javascript

add this to backend:       npm install stripe --save

1-Backend route for client secret (backend/src/controllers/walletcontroller.ts)
   1.1-const stripe=require('stripe')(secret_key);
   1.2-in your api add stripe.paymentIntents.create and add {amount ,currency and automatic_payment_methods}
   1-3-send client secret key back to client-side



add this to frontend:   npx expo install @stripe/stripe-react-native

2-Frontend client side(app/transactions/deposit.tsx)
   2.1-wrap your main root file with stripeProvider with public key (<StripeProvider publishableKey={stripePublicKey}>)
      it was mendling with my routes so i added it in deposit file where i was going to use it
   2.2-call the api endpoint that you have created in backend
   2.3-Get initPaymentSheet and presentPaymentSheet form useStripe hook 
         const {initPaymentSheet,presentPaymentSheet}=useStripe();
   2.4-Initialize payment sheet
   2.5-Present Payment sheel
   2.6-Done