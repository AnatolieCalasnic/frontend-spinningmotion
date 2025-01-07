import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, CreditCard, Info, Play, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import EmbeddedCheckoutButton from '../components/EmbeddedCheckoutButton';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [images, setImages] = useState([]);

 // In your fetchProduct function, after getting the response:
useEffect(() => {
  const fetchProductAndImages = async () => {
    try {
      setLoading(true);
      // Fetch product details
      const productResponse = await axios.get(`http://localhost:8080/records/${id}`);
      setProduct(productResponse.data);

     // Fetch images if the product has any
     if (productResponse.data.images && productResponse.data.images.length > 0) {
      const imagesPromises = productResponse.data.images.map(async (image) => {
        try {
          const imageResponse = await axios.get(
            `http://localhost:8080/records/images/${image.id}`,
            { responseType: 'blob' }
          );
          return {
            url: URL.createObjectURL(imageResponse.data),
            id: image.id,
            type: image.imageType
          };
        } catch (error) {
          console.error('Error fetching image:', error);
          return null;
        }
      });

      const loadedImages = await Promise.all(imagesPromises);
      setImages(loadedImages.filter(img => img !== null));
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    setError('Failed to load product');
  } finally {
    setLoading(false);
  }
};

fetchProductAndImages();

// Cleanup image URLs
return () => {
  images.forEach(image => {
    if (image?.url) {
      URL.revokeObjectURL(image.url);
    }
  });
};
}, [id]);

// Update the addToBasket function:
const addToBasket = async () => {
  try {
    if (product.quantity < 1) {
      toast.error('This item is currently out of stock');
      return;
    }
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
        toast.success(`Updated quantity of "${product.title}" in basket`);
      } else {
        toast.warning('Not enough stock available');
      }
    } else {
      
      // Check if requested quantity is available before adding
      if (quantity > product.quantity) {
        toast.warning('Not enough stock available');
        return;
      }
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
      toast.success(`Added "${product.title}" to basket`);
    }

    // Total amount
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
    
  } catch (err) {
    console.error('Error adding to basket:', err);
    toast.error(err.message || 'Failed to add item to basket');
  }
};
const getQuickBuyItem = () => {
  if (!product) return null;
  
  return [{
    recordId: parseInt(product.id),
    title: product.title,
    artist: product.artist,
    price: parseFloat(product.price),
    quantity: quantity,
    availableStock: product.quantity,
    condition: product.condition
  }];
};


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
          <div className="relative aspect-square">
        {images.length > 0 ? (
          <img 
            src={images[activeImage].url}
            alt={`${product.title} - Image ${activeImage + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
            {images.length > 1 && (
              <>
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
              </>
            )}
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                className={`border-4 ${activeImage === index ? 'border-blue-600' : 'border-black'} p-1`}
                onClick={() => setActiveImage(index)}
              >
                 <img
                src={image.url}
                alt={`${product.title} - Thumbnail ${index + 1}`}
                className="aspect-square object-cover"
                />
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
                    <div className="p-4 border-b-2 border-black bg-yellow-600">
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
            <EmbeddedCheckoutButton 
              className="w-full bg-black text-white p-6 flex items-center justify-center font-bold hover:bg-gray-900 transition-colors text-lg"
              items={getQuickBuyItem()}
              disabled={product.quantity < 1}
              quickBuy={true}            >
              <CreditCard className="mr-2" size={24} />
              Quick Buy
            </EmbeddedCheckoutButton>
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