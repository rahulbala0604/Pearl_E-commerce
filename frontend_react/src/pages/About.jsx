import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-display font-semibold text-gray-900 mb-6">Why Choose Us</h1>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light leading-relaxed mb-12">
        At Pearl Aqua, we are dedicated to providing the most advanced, reliable, and efficient water purification systems for your home. Our multi-stage RO, UV, and UF technologies ensure that every drop you drink is safe, pure, and healthy.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
          <p className="text-gray-500 text-sm">Tested and certified for the highest standards of water safety.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Installation</h3>
          <p className="text-gray-500 text-sm">Professional setup by our trained technicians at your doorstep.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted Warranty</h3>
          <p className="text-gray-500 text-sm">Comprehensive coverage to give you complete peace of mind.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
