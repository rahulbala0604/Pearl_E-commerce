import React from 'react';

const Support = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-display font-semibold text-gray-900 mb-6">Customer Support</h1>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light leading-relaxed mb-12">
        Need help with your Pearl Aqua product? Our dedicated support team is available for installation, warranty claims, and routine servicing.
      </p>
      
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
        <h3 className="text-2xl font-display font-semibold text-gray-900 mb-8">Contact Information</h3>
        <div className="flex flex-col gap-6 text-left">
          <div className="flex items-center p-4 bg-[var(--color-bg-warm)] rounded-xl">
            <div className="bg-white p-3 rounded-full text-[var(--color-primary)] mr-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Helpline</p>
              <p className="text-lg font-bold text-gray-900">9443841435, 9894991683</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-[var(--color-bg-warm)] rounded-xl">
            <div className="bg-white p-3 rounded-full text-[var(--color-primary)] mr-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Email Support</p>
              <p className="text-lg font-bold text-gray-900">rahulbala0604@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
