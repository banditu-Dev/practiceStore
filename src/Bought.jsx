import './App.css';
import { Link, useLocation } from 'react-router-dom';

import emailjs from '@emailjs/browser';
import { useEffect, useRef } from 'react';

function Bought() {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;
  const email = location.state?.email;
  const purchasedProducts = location.state?.cart || [];

  const name = orderDetails?.payer?.name?.given_name || 'Customer';
  const transactionId = orderDetails?.id || 'Unavailable';

  const hasSentEmail = useRef(false);

  if (!orderDetails || !email || !purchasedProducts.length) {
    return (
      <div className="hold">
        <div className="bought-page">
          <h1>Oops!</h1>
          <p>Missing order info.</p>
          <Link to="/" className="back">← Return to Store</Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const emailKey = `email_sent_${transactionId}`;

    // Check both localStorage AND internal flag
    if (
      hasSentEmail.current ||                    // already sent in this session
      localStorage.getItem(emailKey) ||          // already sent in previous session
      !orderDetails ||
      !email ||
      !purchasedProducts.length
    ) return;

    hasSentEmail.current = true; // ⛔ prevent further sends in this component session

    const productLinks = purchasedProducts.map(p => {
      const fileName = p.file.split('/').pop();
      return `Download Link: http://localhost:4000/download/${fileName} | Name: ${p.name}`;
    }).join('\n');

    const templateParams = {
      name,
      email,
      product_list: productLinks,
      transaction_id: transactionId
    };

    emailjs.send(
      'service_f1q9q33',
      'template_m7pajzd',
      templateParams,
      'ekdslO5Spalk_1WMo'
    ).then((res) => {
      console.log('✅ Email sent!', res.status);
      localStorage.setItem(emailKey, 'true'); // ✅ set this AFTER send
    }).catch((err) => {
      console.error('❌ Email failed:', err);
      hasSentEmail.current = false; // let it retry on next mount if failed
    });
  }, [orderDetails, email, purchasedProducts, transactionId]);



  return (
    <div className="hold">
      <div className="bought-page">
      <h1>✅ Thank You, {name}!</h1>
      <p>Your products were sent to <strong>{email}</strong>.</p>
      <p><strong>Transaction ID:</strong> {transactionId}</p>

      <h2 style={{ marginTop: "40px" }}>📁 Your Downloads</h2>
      <div className="downloads">
        {purchasedProducts.map((item, idx) => (
          <div key={idx} className="file-card">
            <h3>{item.name}</h3>
            <p>Click below to download:</p>
            <a href={item.file} download className="download-btn">⬇️ Download</a>
          </div>
        ))}
      </div>

      <div className="support">
        <p><strong>Didn't arrive?</strong> Wrong email?</p>
        <p>Contact us at <a href="mailto:support@yourdomain.com">support@yourdomain.com</a></p>
      </div>

      <Link to="/" className="back">← Return to Store</Link>
    </div>
    </div>
  );
}

export default Bought;
