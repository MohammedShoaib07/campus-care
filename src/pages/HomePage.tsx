import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Users, MessageSquare, Shield, CheckCircle, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  React.useEffect(() => {
    if (currentUser && userData) {
      if (userData.role === 'student') {
        navigate('/student/dashboard');
      } else if (userData.role === 'faculty') {
        navigate('/faculty/dashboard');
      }
    }
  }, [currentUser, userData, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Campus Care</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Smart Complaint Management System
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline campus issue reporting and resolution with our comprehensive platform 
            designed for students and faculty collaboration.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Reporting</h3>
            <p className="text-gray-600">Submit complaints with detailed descriptions and photo evidence for faster resolution.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mb-4">
              <Clock className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
            <p className="text-gray-600">Monitor complaint status in real-time from submission to resolution.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Resolution</h3>
            <p className="text-gray-600">Efficient faculty dashboard for managing and resolving campus issues promptly.</p>
          </div>
        </div>

        {/* Login Portals */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <GraduationCap className="h-12 w-12 text-blue-100 mr-4" />
              <div>
                <h3 className="text-2xl font-bold">Student Portal</h3>
                <p className="text-blue-100">Report campus issues and track status</p>
              </div>
            </div>
            <ul className="space-y-2 mb-8 text-blue-100">
              <li>• Submit complaints with categories</li>
              <li>• Upload supporting images</li>
              <li>• Track complaint status</li>
              <li>• Anonymous reporting option</li>
            </ul>
            <button
              onClick={() => navigate('/student/login')}
              className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Student Login
            </button>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <Users className="h-12 w-12 text-teal-100 mr-4" />
              <div>
                <h3 className="text-2xl font-bold">Faculty Portal</h3>
                <p className="text-teal-100">Manage and resolve student complaints</p>
              </div>
            </div>
            <ul className="space-y-2 mb-8 text-teal-100">
              <li>• View all student complaints</li>
              <li>• Update complaint status</li>
              <li>• Add resolution comments</li>
              <li>• Analytics dashboard</li>
            </ul>
            <button
              onClick={() => navigate('/faculty/login')}
              className="w-full bg-white text-teal-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Faculty Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;