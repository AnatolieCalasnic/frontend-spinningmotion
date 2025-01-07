import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../components/admin/AdminLayout';
import AddRecordModal from '../components/admin/AddRecordModal';
import RecordsTable from '../components/admin/RecordsTable';
import RecordForm from '../components/admin/RecordForm';

const AdminRecords = () => {
  const [records, setRecords] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newRecords, setNewRecords] = useState([{
    title: '',
    artist: '',
    genreId: '',
    price: '',
    releaseYear: '',
    condition: '',
    quantity: ''
  }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsResponse, genresResponse] = await Promise.all([
          axios.get('http://localhost:8080/records'),
          axios.get('http://localhost:8080/genres')
        ]);
        setRecords(recordsResponse.data);
        setGenres(genresResponse.data.genres || genresResponse.data);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRecordData = (record) => {
    return {
      ...record,
      releaseYear: record.releaseYear ? parseInt(record.releaseYear, 10) : null,
      price: parseFloat(record.price),
      quantity: parseInt(record.quantity) || 0,
      genreId: record.genreId ? parseInt(record.genreId, 10) : null
    };
  };

  const handleAddRecord = async () => {
    try {
      const validRecords = newRecords
        .filter(record => record.title && record.artist && record.price)
        .map(formatRecordData);

      const responses = await Promise.all(
        validRecords.map(record => 
          axios.post('http://localhost:8080/records', record)
        )
      );

      const newlyAddedRecords = responses.map(r => r.data);
      setRecords(prev => [...prev, ...newlyAddedRecords]);
      setIsAddModalOpen(false);
      setNewRecords([{
        title: '',
        artist: '',
        genreId: '',
        price: '',
        releaseYear: '',
        condition: '',
        quantity: ''
      }]);
    } catch (err) {
      console.error('Error adding records:', err);
      setError('Failed to add records');
    }
  };

  const handleEditRecord = async () => {
    try {
      const formData = new FormData();
      
      // Remove undefined or null values from recordData
      const recordData = {
        title: selectedRecord.title,
        artist: selectedRecord.artist,
        genreId: parseInt(selectedRecord.genreId),
        price: parseFloat(selectedRecord.price),
        releaseYear: selectedRecord.releaseYear ? parseInt(selectedRecord.releaseYear) : null,
        condition: selectedRecord.condition,
        quantity: parseInt(selectedRecord.quantity) || 0,
        imagesToDelete: selectedRecord.imagesToDelete || []
      };
  
      // Clean up recordData by removing null/undefined values
      Object.keys(recordData).forEach(key => {
        if (recordData[key] === null || recordData[key] === undefined) {
          delete recordData[key];
        }
      });
      
      // Create a blob from the cleaned record data
      const recordBlob = new Blob([JSON.stringify(recordData)], {
        type: 'application/json'
      });
      formData.append('record', recordBlob);
  
      // Handle new images if they exist
      if (selectedRecord.newImages && selectedRecord.newImages.length > 0) {
        selectedRecord.newImages.forEach(file => {
          // Check file size before appending
          if (file.size <= 5000000) { // 5MB limit
            formData.append('images', file);
          }
        });
      }
  
      console.log('Sending formData:', formData); // Debug log
  
      const response = await axios.put(
        `http://localhost:8080/records/${selectedRecord.id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Add timeout and max size settings
          timeout: 30000, // 30 seconds
          maxContentLength: 10485760, // 10MB
          maxBodyLength: 10485760 // 10MB
        }
      );
  
      setRecords(prev => 
        prev.map(record => 
          record.id === selectedRecord.id ? response.data : record
        )
      );
      setIsEditModalOpen(false);
      setSelectedRecord(null);
    } catch (err) {
      console.error('Error updating record:', err);
      if (err.response?.status === 413) {
        setError('File size too large. Please upload smaller images (max 5MB each).');
      } else {
        setError('Failed to update record: ' + err.message);
      }
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`http://localhost:8080/records/${id}`);
        setRecords(prev => prev.filter(record => record.id !== id));
      } catch (err) {
        console.error('Error deleting record:', err);
        setError('Failed to delete record');
      }
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
        </div>

    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center h-screen text-red-600 font-bold">
          Error: {error}
        </div>
    );
  }

  return (
      <div className="p-8">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="bg-black p-6">
            <h1 className="text-4xl font-bold text-white">Records Management</h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <RecordsTable 
            records={records}
            genres={genres}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onEdit={(record) => {
              setSelectedRecord(record);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteRecord}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        </motion.div>

        {isAddModalOpen && (
          <AddRecordModal 
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            newRecords={newRecords}
            setNewRecords={setNewRecords}
            handleAddRecord={handleAddRecord}
            genres={genres}
          />
        )}

        {isEditModalOpen && selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white p-6 max-w-2xl w-full border-8 border-black"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Edit Record</h2>
                <button 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedRecord(null);
                  }}
                  className="hover:bg-gray-100 p-2 rounded-full"
                >
                  <X />
                </button>
              </div>
              <RecordForm
                record={selectedRecord}
                index={0}
                isEdit={true}
                onChange={(_, field, value) => {
                  setSelectedRecord(prev => ({ ...prev, [field]: value }));
                }}
                genres={genres}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleEditRecord}
                  className="bg-black text-white px-4 py-2 hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
  );
};

export default AdminRecords;