import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { axiosFetch } from '../../utils';
import { CheckoutForm } from '../../components';
import './Pay.scss';

// Load Stripe with the publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Pay = () => {
  const { _id } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      console.log('Fetching payment intent for _id:', _id); // Log the ID to verify
      try {
        const { data } = await axiosFetch.post(`/orders/create-payment-intent/${_id}`);
        console.log('API Response:', data); // Log the full response
        if (!data.clientSecret) {
          throw new Error('No clientSecret in response');
        }
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Payment intent error:', err.response ? err.response.data : err.message);
        setError(err.message || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [_id]);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="pay">
      <h2>Pay Securely with Stripe</h2>
      {loading ? (
        <p>Loading payment form...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p>Unable to load payment form. Please check the console for details.</p>
      )}
    </div>
  );
};

export default Pay;