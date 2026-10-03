import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-10">Account Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] rounded-full flex items-center justify-center text-4xl font-bold mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
            
            <button className="w-full py-2.5 px-4 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center">
               Sign Out
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Profile Information</h3>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center text-gray-700 border-b border-gray-50 pb-4">
                <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                  <User className="mr-3 text-[var(--color-primary)]" size={20} />
                  <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Full Name</span>
                </div>
                <div className="sm:w-2/3">
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center text-gray-700">
                <div className="flex items-center sm:w-1/3 mb-2 sm:mb-0">
                  <Mail className="mr-3 text-[var(--color-primary)]" size={20} />
                  <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Email</span>
                </div>
                <div className="sm:w-2/3">
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-warm)] rounded-2xl p-8 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-display font-semibold text-gray-900 mb-1">Your Orders</h3>
              <p className="text-sm text-gray-500">Track and manage your recent purifier purchases.</p>
            </div>
            <a href="/orders" className="btn-secondary whitespace-nowrap text-sm px-5 py-2.5">
              View Orders
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
