const RecordForm = ({ record, index, isEdit, onChange, genres }) => {
    const handleYearChange = (e) => {
      const value = e.target.value;
      if (value === '' || /^\d{0,4}$/.test(value)) {
        onChange(index, 'releaseYear', value);
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
  
    return (
      <div className="grid grid-cols-2 gap-4 p-4 border-4 border-black mb-4">
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