import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, CreditCard, Info, Play, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

 // In your fetchProduct function, after getting the response:
useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/records/${id}`);
      console.log('API Response:', response.data); // For debugging
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);

// Update the addToBasket function:
const addToBasket = async () => {
  try {
    const savedBasket = localStorage.getItem('guestBasket');
    const currentBasket = savedBasket ? JSON.parse(savedBasket) : { items: [], totalAmount: 0 };
    
    // Log for debugging
    console.log('Current product:', product);
    console.log('Current basket before update:', currentBasket);
    
    // Check if item already exists in basket
    const existingItemIndex = currentBasket.items.findIndex(item => 
      parseInt(item.recordId) === parseInt(product.id)
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      const newQuantity = currentBasket.items[existingItemIndex].quantity + quantity;
      if (newQuantity <= product.quantity) {
        currentBasket.items[existingItemIndex].quantity = newQuantity;
      } else {
        throw new Error('Not enough stock available');
      }
    } else {
      // Add new item
      currentBasket.items.push({
        recordId: parseInt(product.id),
        title: product.title,
        artist: product.artist,
        price: parseFloat(product.price),
        quantity: quantity,
        availableStock: product.quantity,
        year: product.year,
        condition: product.condition
      });
    }

    // Update total amount
    currentBasket.totalAmount = currentBasket.items.reduce(
      (sum, item) => sum + (parseFloat(item.price) * item.quantity), 
      0
    );

    // Log for debugging
    console.log('Updated basket before saving:', currentBasket);

    // Save to localStorage
    localStorage.setItem('guestBasket', JSON.stringify(currentBasket));
    
    // Log for verification
    const verifyBasket = localStorage.getItem('guestBasket');
    console.log('Verified basket in localStorage:', JSON.parse(verifyBasket));
    
    alert('Item added to basket successfully!');
  } catch (err) {
    console.error('Error adding to basket:', err);
    alert(err.message || 'Failed to add item to basket');
  }
};

  const handleQuickBuy = async () => {
    await addToBasket();
    navigate('/basket'); // Redirect to basket page
  };
  const images = [
    { color: 'bg-blue-600' },
    { color: 'bg-red-600' },
    { color: 'bg-yellow-400' },
    { color: 'bg-black' }
  ];


  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !product) {
    return <div className="flex justify-center items-center h-screen text-red-600">{error || 'Product not found'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto bg-white p-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Images */}
        <div className="col-span-7 space-y-8">
          {/* Main Image */}
          <div className="border-8 border-black">
            <div className="relative">
              <div className={`aspect-square ${images[activeImage].color}`} />
              {/* Image Navigation */}
              <button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 border-4 border-black hover:bg-yellow-400"
                onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 border-4 border-black hover:bg-yellow-400"
                onClick={() => setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <button
                key={index}
                className={`border-4 ${activeImage === index ? 'border-blue-600' : 'border-black'} p-1`}
                onClick={() => setActiveImage(index)}
              >
                <div className={`aspect-square ${img.color}`} />
              </button>
            ))}
          </div>

          {/* Additional Info Boxes */}
          <div className="grid grid-cols-1 gap-4">
            <div className="border-4 border-black p-4 bg-red-600 text-white">
              <h3 className="font-bold mb-2 flex items-center">
                <Info className="mr-3" /> Product Details
              </h3>
                <div className="border-4 border-black">
                    <div className="grid grid-cols-2">
                    <div className="p-4 border-r-2 border-b-2 border-black bg-yellow-600">
                        <span className="font-bold">Format:</span> Vinyl
                    </div>
                    <div className="p-4 border-b-2 border-b-2 border-black bg-yellow-600">
                        <span className="font-bold">Release Year:</span> {product.releaseYear}
                    </div>
                    <div className="p-4 border-r-2 border-b-2 border-black bg-brown-400">
                        <span className="font-bold">Condition:</span> {product.condition}
                    </div>
                    <div className="p-4 border-b-2 border-black bg-red-600 text-white">
                        <span className="font-bold">Speed:</span> 33 RPM
                    </div>
                    <div className="p-4 border-r-2 border-black bg-blue-600 text-white">
                        <span className="font-bold">Weight:</span> 180g
                    </div>
                    <div className="p-4 bg-black text-white">
                        <span className="font-bold">Size:</span> 12"
                    </div>
                    </div>
                </div>
            </div>
            
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="col-span-5 space-y-6">
          {/* Title Section */}
          <div className="border-8 border-black p-6 bg-white">
            <div className="bg-red-600 text-white p-4 mb-4">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <p className="text-xl">{product.artist}</p>
            </div>
            <div className="bg-yellow-400 p-4 text-black">
              <div className="text-3xl font-bold">€{product.price.toFixed(2)}</div>
              <div className="text-sm">Including VAT</div>
            </div>
          </div>

          {/* Quantity Section */}
          <div className="border-4 border-black">
            <div className="bg-blue-600 text-white p-4 font-bold">
              Select Quantity
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="bg-black text-white p-2 hover:bg-gray-800"
                    disabled={quantity <= 1}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="font-bold text-xl">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="bg-black text-white p-2 hover:bg-gray-800"
                    disabled={quantity >= product.quantity}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="text-sm">
                  <span className="font-bold">{product.quantity}</span> available
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              className="w-full bg-black text-white p-6 flex items-center justify-center font-bold hover:bg-gray-900 transition-colors text-lg"
              onClick={handleQuickBuy}
            >
              <CreditCard className="mr-2" size={24} />
              Quick Buy
            </button>
            <button 
              className="w-full border-4 border-black p-6 flex items-center justify-center font-bold hover:bg-gray-100 transition-colors text-lg"
              onClick={addToBasket}
            >
              <ShoppingCart className="mr-2" size={24} />
              Add to Cart
            </button>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;