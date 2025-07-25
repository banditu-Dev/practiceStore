import './App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const sampleProducts = [
  {
    id: 1,
    name: 'Ebook - How to Dev',
    price: 10,
    file: '/files/Ebook.docx'
  },
  {
    id: 2,
    name: '3D Asset Pack',
    price: 15,
    file: '/files/3D.docx'
  },
  {
    id: 3,
    name: 'Ultimate UI Kit',
    price: 20,
    file: '/files/UI.docx'
  }
];


function Store() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const addToCart = (product) => {
    setCart(prev => {
      const alreadyInCart = prev.find(p => p.id === product.id);
      if (alreadyInCart) return prev;
      return [...prev, product];
    });
  };


  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  return (
    <div className="hold">
      <div className="store">
        <h1>🛒 Digital Product Store</h1>
        <div className="products">
          {sampleProducts.map(product => (
            <div className="product" key={product.id}>
              <h2>{product.name}</h2>
              <p>{product.price}$</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>

        <Link to="/reviews" className="back">🌟 Read & Leave a Review</Link>
        <Link to="/admin" className="back">🤖 Admin Pannel</Link>

        <div className="cart">
          <h2>Your Cart</h2>
          {cart.length === 0 ? <p>Cart is empty.</p> : (
            <>
              <ul>
                {cart.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.price}$ 
                    <button onClick={() => removeFromCart(item.id)}>❌</button>
                  </li>
                ))}
              </ul>
              <p>Total: {total}$</p>
              <button className="checkout" onClick={handleCheckout}>Checkout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Store;