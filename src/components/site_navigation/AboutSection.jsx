import React from 'react';

const CircularText = ({ text }) => {
  const letters = text.split('');
  return (
    <div className="text-ring" style={{ '--total': letters.length }}>
      <span aria-hidden="true" className="animate-[spin_8s_linear_infinite] block">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="absolute top-1/2 left-1/2 text-black text-2xl font-bold"
            style={{
              '--index': index,
              transform: `
                translate(-50%, -50%) 
                rotate(calc(360deg / var(--total) * var(--index))) 
                translateY(-150px)
              `
            }}
          >
            {letter}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </div>
  );
};

const AboutSection = () => {
  return (
    <div className="relative bg-white border-4 border-black p-6">
      <h2 className="text-black text-2xl font-bold mb-4">ABOUT US</h2>
      <p className="text-black mb-8">
      Just launched! We're bringing the authentic vinyl experience to your digital doorstep. Our passion for music drives us to curate an exceptional collection of records, and we can't wait to share this journey with fellow music lovers. Here's to the countless musical discoveries that await us together.      </p>
      
      <div className="relative h-96 flex items-center justify-center">
        <CircularText text="SPINNING MOTION • SPINNING MOTION • "/>
      </div>

      <style jsx>{`
        .text-ring {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text-ring > span:first-child {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AboutSection;