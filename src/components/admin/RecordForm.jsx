import ImageUpload from "./ImageUpload";
const RecordForm = ({ record, index, isEdit, onChange, genres }) => {
  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d{0,4}$/.test(value)) {
      onChange(index, 'releaseYear', value === '' ? null : parseInt(value, 10));
    }
  };
  
    const handlePriceChange = (e) => {
      const value = e.target.value;
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        onChange(index, 'price', value);
      }
    };
  
    const handleQuantityChange = (e) => {
      const value = e.target.value;
      if (value === '' || /^\d+$/.test(value)) {
        onChange(index, 'quantity', value);
      }
    };
    const handleImagesChange = (action, payload) => {
      if (action === 'add') {
        // For new images being added
        onChange(index, 'newImages', [...(record.newImages || []), ...payload]);
      } else if (action === 'remove') {
        const imageIndex = payload;
        const currentImages = record.images || [];
        
        // If removing existing image, mark for deletion
        if (imageIndex < currentImages.length) {
          const removedImage = currentImages[imageIndex];
          if (removedImage.id) {
            onChange(index, 'imagesToDelete', [...(record.imagesToDelete || []), removedImage.id]);
          }
          // Update current images array
          const updatedImages = [...currentImages];
          updatedImages.splice(imageIndex, 1);
          onChange(index, 'images', updatedImages);
        } else {
          // Remove from new images
          const newImageIndex = imageIndex - currentImages.length;
          const updatedNewImages = [...(record.newImages || [])];
          updatedNewImages.splice(newImageIndex, 1);
          onChange(index, 'newImages', updatedNewImages);
        }
      }
    };
    return (
      <div className="grid grid-cols-2 gap-4 p-4 border-4 border-black mb-4">
         <div className="col-span-2">
        <ImageUpload 
          existingImages={record.images || []}
          onChange={handleImagesChange}
          maxImages={4}
        />
      </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block font-bold mb-2">Title</label>
          <input
            type="text"
            value={record.title || ''}
            onChange={e => onChange(index, 'title', e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          />
        </div>
  
        <div className="col-span-2 md:col-span-1">
          <label className="block font-bold mb-2">Artist</label>
          <input
            type="text"
            value={record.artist || ''}
            onChange={e => onChange(index, 'artist', e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          />
        </div>
  
        <div>
          <label className="block font-bold mb-2">Genre</label>
          <select
            value={record.genreId || ''}
            onChange={e => onChange(index, 'genreId', e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          >
            <option value="">Select Genre</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>
  
        <div>
          <label className="block font-bold mb-2">Price (€)</label>
          <input
            type="text"
            value={record.price || ''}
            onChange={handlePriceChange}
            className="w-full border-2 border-black p-2"
            required
            placeholder="0.00"
          />
        </div>
  
        <div>
          <label className="block font-bold mb-2">Release Year</label>
          <input
            type="text"
            value={record.releaseYear || ''}
            onChange={handleYearChange}
            maxLength="4"
            className="w-full border-2 border-black p-2"
            placeholder="YYYY"
          />
        </div>
  
        <div>
          <label className="block font-bold mb-2">Condition</label>
          <select
            value={record.condition || ''}
            onChange={e => onChange(index, 'condition', e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          >
            <option value="">Select Condition</option>
            <option value="Mint">Mint</option>
            <option value="Near Mint">Near Mint</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
          </select>
        </div>
  
        <div className="col-span-2">
          <label className="block font-bold mb-2">Quantity</label>
          <input
            type="text"
            value={record.quantity || ''}
            onChange={handleQuantityChange}
            className="w-full border-2 border-black p-2"
            required
            placeholder="0"
          />
        </div>
      </div>
    );
  };
  
  export default RecordForm;