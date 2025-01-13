import React from 'react';

const FAQ = () => {
  const questions = [
    { question: "What is Spinning Motion?", answer: "An avant-garde record store redefining your music experience." },
    { question: "How do I place an order?", answer: "Simply browse, add to basket, and proceed to checkout!" },
    { question: "Can I track my shipment?", answer: "Yes, tracking details are sent to your email post-dispatch." },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-yellow-500 text-5xl font-extrabold text-center mb-12">
          FAQ
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {questions.map((item, index) => (
            <div
              key={index}
              className="relative p-8 bg-red-600 text-white border-4 border-blue-500"
            >
              <h2 className="text-2xl font-bold mb-4">{item.question}</h2>
              <p className="text-lg">{item.answer}</p>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-500 transform rotate-45"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
