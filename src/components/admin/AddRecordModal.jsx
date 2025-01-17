import React from 'react';
import { Plus, X } from 'lucide-react';
import RecordForm from './RecordForm';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddRecordModal = ({ 
  isOpen, 
  onClose, 
  newRecords, 
  setNewRecords,
  genres 
}) => {
  if (!isOpen) return null;
  const validateRecord = (record) => {
    const errors = {};
    
    // Title validation (1-255 characters)
    if (!record.title?.trim()) {
      errors.title = "Title is required";
    } else if (record.title.length < 1 || record.title.length > 255) {
      errors.title = "Title must be between 1 and 255 characters";
    }

    // Artist validation (1-255 characters)
    if (!record.artist?.trim()) {
      errors.artist = "Artist name is required";
    } else if (record.artist.length < 1 || record.artist.length > 255) {
      errors.artist = "Artist name must be between 1 and 255 characters";
    }

    // Genre validation
    if (!record.genreId) {
      errors.genreId = "Genre is required";
    }

    // Price validation (minimum €0.01)
    if (!record.price) {
      errors.price = "Price is required";
    } else if (parseFloat(record.price) < 0.01) {
      errors.price = "Price must be at least €0.01";
    }

    if (!record.year) {
      errors.year = "Year is required";
    } else {
      const yearNum = parseInt(record.year, 10);
      if (isNaN(yearNum) || yearNum < 1900) {
        errors.year = "Release year must be 1900 or later";
      }
    }

    // Condition validation (matching backend)
    if (!record.condition) {
      errors.condition = "Condition is required";
    } else if (!['Mint', 'Near Mint', 'Very Good', 'Good'].includes(record.condition)) {
      errors.condition = "Condition must be one of: Mint, Near Mint, Very Good, Good";
    }

    // Quantity validation (minimum 1)
    if (record.quantity === undefined || record.quantity === '') {
      errors.quantity = "Quantity is required";
    } else if (parseInt(record.quantity, 10) < 1) {
      errors.quantity = "Quantity must be at least 1";
    }

    // Image validation
    if (record.newImages?.length > 0) {
      for (const file of record.newImages) {
        if (!file.type.startsWith('image/')) {
          errors.images = `File "${file.name}" is not an image`;
        } else if (file.size > 5 * 1024 * 1024) { // 5MB limit
          errors.images = `File "${file.name}" exceeds 5MB size limit`;
        }
      }
    }

    return errors;
  };


  const handleInputChange = (index, field, value) => {
    const updated = [...newRecords];
    if (field === 'releaseYear') {
      updated[index] = { 
        ...updated[index], 
        [field]: value === null ? null : parseInt(value, 10)
      };
    } else if (field === 'newImages') {
      // handling new images being added
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
      const allErrors = newRecords.map(validateRecord);
      const hasErrors = allErrors.some(errors => Object.keys(errors).length > 0);
      
      if (hasErrors) {
        const errorMessages = allErrors
          .map((errors, index) => {
            const errorList = Object.values(errors);
            return errorList.length > 0 
              ? `Record ${index + 1}: ${errorList.join(', ')}` 
              : null;
          })
          .filter(Boolean)
          .join('\n');
          
        toast.error(errorMessages);
        return;
      }

      // Processing each record
      for (const record of newRecords) {
        const formData = new FormData();
        
        const recordData = {
          title: record.title.trim(),
          artist: record.artist.trim(),
          genreId: parseInt(record.genreId),
          price: parseFloat(record.price),
          year: record.year ? parseInt(record.year) : null,
          condition: record.condition,
          quantity: parseInt(record.quantity)
        };
        
        const recordBlob = new Blob([JSON.stringify(recordData)], {
          type: 'application/json'
        });
        formData.append('record', recordBlob);

        if (record.newImages?.length > 0) {
          record.newImages.forEach((file) => {
            formData.append('images', file);
          });
        }

        const response = await axios.post('http://localhost:8080/records', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        toast.success(
          <div>
            <p>"{record.title}" added successfully!</p>
            <p className="text-sm mt-1">Subscribers will be notified about this new release.</p>
          </div>
        );
      }

      // Reseting form after successful submission
      onClose();
      setNewRecords([{
        title: '',
        artist: '',
        genreId: '',
        price: '',
        year: '',
        condition: '',
        quantity: '',
        newImages: []
      }]);
      
    } catch (error) {
      console.error('Error creating records:', error);
      toast.error('Failed to create records. Please try again.');
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