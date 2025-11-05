import { useAppSelector } from '@/reduxstore/hooks/hooks'
import React, { useReducer, useState } from 'react'
import { AlertCircle, Phone, MapPin, Activity, Clock, Shield, Bell } from 'lucide-react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const data = useAppSelector((state) => state.auth)
  const [pulseAnimation, setPulseAnimation] = useState(false)

  const authToken = data.authToken
  const name = data.name
  const role = data.role
  const user_id = data.user_id
  const user_email = data.user_email;

  const router = useRouter();
  const handleEmergencyAlert = async () => {
    setPulseAnimation(true);

    // Get user's current location
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const data = {
        name: name,
        latitude: latitude,
        longitude: longitude,
        emergencyType: "Generic emergency  type",
        user_id: user_id,
        useremail: user_email
      };

      try {
        const response = await axios.post('http://localhost:5000/api/hospitals/trigger', data);
        // Handle response if needed

        toast.success('Emergency  button Triggered!', {
          position: 'top-right',
          autoClose: 3000,
          onClose: () => router.push("/incident")
        });
      } catch (err) {
        console.error("Error triggering emergency alert:", err);
      }
      finally {

      }

      setTimeout(() => setPulseAnimation(false), 1000);
    }, (error) => {
      console.error("Geolocation error:", error);
      setPulseAnimation(false);
    });
  };

 // const user_id = useAppSelector((state)=>state.auth.user_id)


  const quickActions = [
    { icon: Phone, label: 'Call 911', color: 'bg-red-500' },
    { icon: MapPin, label: 'Share Location', color: 'bg-blue-500' },
    { icon: Activity, label: 'Medical Info', color: 'bg-green-500' },
    { icon: Shield, label: 'Safety Tips', color: 'bg-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}

      <div className="bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex items-center justify-between">
      {/* Left Section - Logo and Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-lg shadow-md">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Alert</h1>
          <p className="text-sm text-gray-500">Your safety is our priority</p>
        </div>
      </div>

      {/* Right Section - Navigation and User Info */}
      <div className="flex items-center space-x-6">

          <button
           onClick={()=>router.push(`/ambulanceRequest`)}
          className="inline-flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-sm font-medium rounded-lg border border-red-200 transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Ambulance Request
        </button>

        {/* Incident Link */}
        <button
           onClick={()=>router.push(`/incident?user_id=${user_id}`)}
          className="inline-flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-sm font-medium rounded-lg border border-red-200 transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          View Incident List
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>

        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{role || 'Member'}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {(name || 'U').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
       </div>

       </div>

    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {name || 'User'}!
          </h2>
          <p className="text-gray-600">
            Stay safe and connected. Your emergency contacts are ready 24/7.
          </p>
        </div>

        {/* Emergency Alert Button - Hero Section */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="relative z-10 text-center">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-white mb-2">Emergency Situation?</h3>
              <p className="text-red-100">Press the button below to send an immediate alert</p>
            </div>
            <button
              onClick={handleEmergencyAlert}
              className={`bg-white text-red-600 px-12 py-6 rounded-full text-xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3 mx-auto ${pulseAnimation ? 'animate-pulse' : ''
                }`}
            >
              <AlertCircle className="w-8 h-8" />
              <span>SEND ALERT</span>
            </button>
            <p className="text-red-100 text-sm mt-4">
              This will notify your emergency contacts and share your location
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer border border-gray-100"
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
              <p className="text-sm text-gray-500">Quick access</p>
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Status */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Status</h3>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">Active</p>
            <p className="text-sm text-gray-500">Your emergency network is online</p>
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Avg Response</h3>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">2-5 min</p>
            <p className="text-sm text-gray-500">Emergency contact response time</p>
          </div>

          {/* Contacts Ready */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Contacts</h3>
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">5 Ready</p>
            <p className="text-sm text-gray-500">Emergency contacts available</p>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Safety Reminders</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className="text-gray-700">Keep your emergency contacts updated regularly</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className="text-gray-700">Ensure location services are enabled for faster response</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className="text-gray-700">Test the alert system monthly to ensure it works properly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard