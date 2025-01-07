import React from 'react';
import { Plus, X } from 'lucide-react';
import RecordForm from './RecordForm';
import axios from 'axios';

const AddRecordModal = ({ 
  isOpen, 
  onClose, 
  newRecords, 
  setNewRecords,
  genres 
}) => {
  if (!isOpen) return null;

  const handleInputChange = (index, field, value) => {
    const updated = [...newRecords];
    if (field === 'releaseYear') {
      updated[index] = { 
        ...updated[index], 
        [field]: value === null ? null : parseInt(value, 10)
      };
    } else if (field === 'newImages') {
      // Handle new images being added
      updated[index] = {
        ...updated[index],
        newImages: value // This will be an array of files
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setNewRecords(updated);
  };

  const handleAddRecord = async () => {
    try {
      // Validate records before submission
      for (const record of newRecords) {
        if (!record.title || !record.artist || !record.genreId || !record.price || !record.condition) {
          alert('Please fill in all required fields');
          return;
        }
      }

      // Process each record
      for (const record of newRecords) {
        const formData = new FormData();
        
        // Add the record data as a JSON string
        const recordData = {
          title: record.title,
          artist: record.artist,
          genreId: parseInt(record.genreId),
          price: parseFloat(record.price),
          year: record.releaseYear ? parseInt(record.releaseYear) : null,
          condition: record.condition,
          quantity: parseInt(record.quantity) || 0
        };
        
        // Add the record data as a Blob
        const recordBlob = new Blob([JSON.stringify(recordData)], {
          type: 'application/json'
        });
        formData.append('record', recordBlob);

        // Add images if they exist
        if (record.newImages && record.newImages.length > 0) {
          record.newImages.forEach((file) => {
            formData.append('images', file);
          });
        }

        // Log the FormData contents for debugging
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        // Send the request
        const response = await axios.post('http://localhost:8080/records', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        console.log('Record created:', response.data);
      }

      // Close modal and reset form after successful submission
      onClose();
      setNewRecords([{
        title: '',
        artist: '',
        genreId: '',
        price: '',
        releaseYear: '',
        condition: '',
        quantity: '',
        newImages: []
      }]);
      
    } catch (error) {
      console.error('Error creating records:', error);
      alert('Failed to create records. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Records</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {newRecords.map((record, index) => (
          <RecordForm
            key={index}
            record={record}
            index={index}
            isEdit={false}
            onChange={handleInputChange}
            genres={genres}
          />
        ))}

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setNewRecords([...newRecords, { 
              title: '',
              artist: '',
              genreId: '',
              price: '',
              releaseYear: '',
              condition: '',
              quantity: '',
              newImages: []  // Initialize empty images array
            }])}
            className="bg-blue-600 text-white px-4 py-2"
          >
            Add Another Record
          </button>
          <button
            onClick={handleAddRecord}
            className="bg-black text-white px-4 py-2"
          >
            Save All Records
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecordModal;