import React from 'react';
import { Plus, X } from 'lucide-react';
import RecordForm from './RecordForm';

const AddRecordModal = ({ 
  isOpen, 
  onClose, 
  newRecords, 
  setNewRecords, 
  handleAddRecord,
  genres 
}) => {
  if (!isOpen) return null;

  const handleInputChange = (index, field, value) => {
    const updated = [...newRecords];
    // Special handling for releaseYear
    if (field === 'releaseYear') {
      updated[index] = { 
        ...updated[index], 
        [field]: value === null ? null : parseInt(value, 10)
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setNewRecords(updated);
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
              quantity: ''
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