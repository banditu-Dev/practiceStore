import { useEffect, useRef, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

function Checkout() {
  const location = useLocation();
  const cart = location.state?.cart || [];
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const emailRef = useRef('');
  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const container = document.getElementById("paypal-button-container");

    if (container && container.children.length === 0 && window.paypal) {
      const buttonInstance = window.paypal.Buttons({
        onInit: (data, actions) => {
          actions.disable();
          const emailInput = document.getElementById("email");
          const validate = () => {
            if (isValidEmail(emailInput.value)) {
              actions.enable();
            } else {
              actions.disable();
            }
          };
          emailInput.addEventListener("input", validate);
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: total }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            navigate('/success', {
              state: {
                orderDetails: details,
                email: emailRef.current,
                cart 
              }
            });
          });
        },
        onError: (err) => {
          console.error('PayPal Error:', err);
        }
      });

      buttonInstance.render('#paypal-button-container');
    }
  }, [cart, total, navigate]);

  // 🔁 Sync ref with input value
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    emailRef.current = e.target.value;
  };

  return (
    <div className="hold">
        <div className="checkout-page">
      <h1>Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item, idx) => (
              <li key={idx}>
                {item.name} - {item.price}$
              </li>
            ))}
          </ul>
          <p>Total: {total}$</p>

          <div className="email-form">
            <label htmlFor="email">Your Email for Delivery:</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div id="paypal-button-container" style={{ marginTop: '20px' }}></div>
        </>
      )}
      <Link to="/" className="back">← Back to Store</Link>
    </div>
    </div>
  );
}

export default Checkout;