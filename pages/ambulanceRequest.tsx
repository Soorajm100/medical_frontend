import React, { useState, useEffect } from 'react';
import { 
  Ambulance, 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  Navigation, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Hospital,
  Bell
} from 'lucide-react';
import { useAppSelector } from '@/reduxstore/hooks/hooks';
import axios from 'axios';
import { useRouter } from 'next/router';

const AmbulanceRequest = () => {
  // Replace with actual ambulance_id from logged in driver
  const ambulance_id = useAppSelector((state)=>state.auth.ambulance_id)

  const name = useAppSelector(state=>state.auth.name);
  const user_id = useAppSelector((state)=>state.auth.user_id)
  const mobilenumber = useAppSelector((state)=>state.auth.mobilenumber); 
  const [driverInfo] = useState({
    driver_id: user_id,
    driver_name: name,
    driver_phone: '+91-9876543210'
  });

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeIncident, setActiveIncident] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter(); 

 const fetchActiveIncidentAfterAccept = async ()=>{
     try {
       const response:any = await axios.get("http://localhost:5000/api/ambulances/afteraccept"); 
       setActiveIncident(response?.data?.data); 
    } catch (error) {
      console.error('Error fetching active incident:', error);
    }

 }

  useEffect(()=>{
     fetchActiveIncidentAfterAccept(); 
  }, [])
  // Fetch incoming requests
  useEffect(() => {
    fetchIncomingRequests();
    // const interval = setInterval(fetchIncomingRequests, 30000); // Refresh every 10 seconds
    // return () => clearInterval(interval);
  }, []);

  

  const fetchIncomingRequests = async () => {
    try {
      // Sample data - replace with actual API call
      const response = await axios.get(`http://localhost:5000/api/ambulances/incidents/${ambulance_id}`);
      const Finaldata = response?.data?.data || []; 
      
      // Mock data
     
      setIncomingRequests(Finaldata);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchActiveIncident = async () => {
    try {
      // const response = await fetch(`/api/ambulance/active-incident/${driverInfo.driver_id}`);
      // const data = await response.json();
      // if (data.success) {
      //   setActiveIncident(data.data);
      // }
    } catch (error) {
      console.error('Error fetching active incident:', error);
    }
  };

  const handleAcceptRequest = async (incident:any) => {
    setLoading(true);
    try {
      // API call to accept incident
      const response = await axios.post('http://localhost:5000/api/ambulances/accept-incident', {
          incident_id: incident.incident_id,
          ambulance_driver_id: user_id,
          ambulance_driver_name:name,
          ambulance_driver_phone: mobilenumber 

      });

      const data = response.data ; 


      if (data.success) {
        alert('Request accepted successfully!');
        setActiveIncident(data.data);
        // Remove from incoming requests
        setIncomingRequests(prev => 
          prev.filter((req:any) => req.incident_id !== incident.incident_id)
        );
      } else {
        alert('Failed to accept request: ' + data.message);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Error accepting request');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = (incident:any) => {
    // For now just remove from list
    // You can add an API call to formally reject if needed
    setIncomingRequests(prev => 
      prev.filter((req:any) => req.incident_id !== incident.incident_id)
    );
  };

  const formatTime = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-md">
                <Ambulance className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ambulance Dashboard</h1>
                <p className="text-sm text-gray-500">Manage emergency requests</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                {incomingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {incomingRequests.length}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{driverInfo.driver_name}</p>
                <p className="text-xs text-gray-500">{ambulance_id}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {driverInfo.driver_name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
                <p className="text-3xl font-bold text-blue-600">{incomingRequests.length}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Incidents</p>
                <p className="text-3xl font-bold text-green-600">{activeIncident ? 1 : 0}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ambulance Status</p>
                <p className="text-lg font-bold text-purple-600">
                  {activeIncident?.length > 0 ? 'On Duty' : 'Available'}
                </p>
              </div>
              <Ambulance className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Active Incident Banner */}
       {activeIncident && activeIncident.length > 0 && (
  <div className="space-y-6 mb-8">
    {activeIncident.map((incident:any) => (
      <div
        key={incident.incident_id}
        className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Navigation className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Active Emergency</h3>
              <p className="text-green-100">Incident ID: {incident.incident_id}</p>
            </div>
          </div>

          <button
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            onClick={() => router.push(`activeIncident?incident_id=${incident.incident_id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    ))}
  </div>
)}

        {/* Incoming Requests Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-700">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Bell className="w-6 h-6" />
              <span>Incoming Emergency Requests</span>
            </h2>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No pending requests</p>
              <p className="text-gray-400 text-sm mt-2">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {incomingRequests.map((request:any) => (
                <div 
                  key={request.incident_id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Section - Patient & Emergency Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-red-100 p-3 rounded-full">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              Emergency Request
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(request.created_at)} at {formatTime(request.created_at)}
                            </p>
                          </div>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-200">
                          URGENT
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Patient Info */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-semibold text-gray-500 uppercase">Patient</span>
                          </div>
                          <p className="font-semibold text-gray-900">{request.user_name}</p>
                          <p className="text-sm text-gray-600">{request.user_email}</p>
                        </div>

                        {/* Hospital Info */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Hospital className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-semibold text-gray-500 uppercase">Hospital</span>
                          </div>
                          <p className="font-semibold text-gray-900">{request.hospital_name}</p>
                          <p className="text-sm text-gray-600">{request.hospital_email}</p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Patient Location</p>
                            <p className="text-sm text-gray-600">
                              Lat: {request.location.latitude.toFixed(6)}, 
                              Lng: {request.location.longitude.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Distance, ETA & Actions */}
                    <div className="flex flex-col justify-between">
                      <div className="space-y-4 mb-6">
                        {/* Distance */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center space-x-3 mb-2">
                            <Navigation className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-900">Distance</span>
                          </div>
                          <p className="text-3xl font-bold text-purple-600">{request.distance_km} km</p>
                        </div>

                        {/* ETA */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                          <div className="flex items-center space-x-3 mb-2">
                            <Clock className="w-5 h-5 text-orange-600" />
                            <span className="text-sm font-semibold text-orange-900">ETA</span>
                          </div>
                          <p className="text-3xl font-bold text-orange-600">{request.eta_minutes} mins</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => handleAcceptRequest(request)}
                          disabled={loading || request.incident_accepted}
                          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                            loading || request.incident_accepted
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>{loading ? 'Accepting...' : 'Accept Request'}</span>
                        </button>

                        <button
                          onClick={() => handleRejectRequest(request)}
                          disabled={loading}
                          className="w-full bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-300 hover:border-red-300"
                        >
                          <XCircle className="w-5 h-5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Incident ID at bottom */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Incident ID: <span className="font-mono font-semibold text-gray-700">{request.incident_id}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Banner */}
        {!activeIncident && incomingRequests.length === 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Ambulance className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Ready for Service</h3>
                <p className="text-sm text-blue-700">
                  Your ambulance is available and ready to respond to emergency requests. 
                  New requests will appear here automatically.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbulanceRequest;