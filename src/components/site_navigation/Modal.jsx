import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white max-w-md w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-5 text-3xl font-bold text-black hover:text-red-600"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;