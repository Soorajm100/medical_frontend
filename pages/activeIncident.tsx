import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, User, Ambulance, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ActiveIncident = () => {
  // Get incident_id from URL params
  const getIncidentIdFromUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('incident_id');
    }
    return null;
  };

  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const statuses = [
        'Dispatched',
      'En Route',
      'Arrived at Scene',
      'Patient Loaded',
      'En Route to Hospital',
      'Arrived at Hospital',
      'Completed'
  ];

  // Fetch incident data on component mount
  useEffect(() => {
    fetchIncidentData();
  }, []);

  // Function to fetch incident data
  const fetchIncidentData = async () => {
    const incidentId = getIncidentIdFromUrl();
    
    if (!incidentId) {
      setError('No incident ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(`https://medical-backend-dbt2.onrender.com/api/ambulances/getincident/${incidentId}`)

      setIncident(response.data.data[0]); 
      
    } catch (err:any) {
      setError(err.message);
      console.error('Error fetching incident:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update incident status
  const updateIncidentStatus = async (newStatus:any) => {
    if (!incident) return;

    try {
      setUpdating(true);
      
      const response = await axios.post(`https://medical-backend-dbt2.onrender.com/api/ambulances/update-status`, {
        
          incident_id : getIncidentIdFromUrl() , 
          new_status: newStatus,
          notes : "" ,        
      });

      const updatedIncident= response.data.data ; 
      
      // Update local state with the response
      setIncident(updatedIncident);
      
      // Show success message (you can use a toast library here)
      console.log('Status updated successfully to:', newStatus);
      
    } catch (err:any) {
      console.error('Error updating status:', err);
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusUpdate = (newStatus:any) => {
    updateIncidentStatus(newStatus);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading incident details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !incident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Error Loading Incident</h2>
          <p className="text-gray-600 text-center mb-6">{error || 'Incident not found'}</p>
          <button
            onClick={fetchIncidentData}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = incident.status;
  const getStatusIndex = (status:any) => statuses.indexOf(status);
  const currentStatusIndex = getStatusIndex(currentStatus);

  const formatDate = (dateString:any) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Add user phone number fallback
  const userPhone = incident.user_phone || incident.phone || 'Not available';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Active Incident</h1>
              <p className="text-gray-600 font-mono text-sm">{incident.incident_id}</p>
            </div>
            <div className="flex items-center gap-3 bg-red-100 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-semibold">Emergency Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient & Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Patient Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Patient Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-lg font-semibold text-gray-800">{incident.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </p>
                  <a href={`tel:${userPhone}`} className="text-lg font-semibold text-blue-600 hover:underline">
                    {userPhone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </p>
                  <p className="text-sm text-gray-700 break-all">{incident.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Emergency Type</p>
                  <p className="text-md font-semibold text-red-600">{incident.emergency_type}</p>
                </div>
              </div>
            </div>

            {/* Hospital & Ambulance Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-red-600" />
                Service Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Hospital</p>
                  <p className="text-lg font-semibold text-gray-800">{incident.hospital_name}</p>
                  <p className="text-sm text-gray-600">{incident.hospital_email}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Ambulance ID</p>
                  <p className="text-lg font-bold text-red-600">{incident.ambulance_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Driver</p>
                  <p className="text-md font-semibold text-gray-800">{incident.ambulance_driver_name}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Distance</p>
                    <p className="text-lg font-bold text-orange-600">{incident.distance_km} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      ETA
                    </p>
                    <p className="text-lg font-bold text-green-600">{incident.eta_minutes} min</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Location
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Latitude: {incident.location?.latitude}</p>
                <p className="text-sm text-gray-600">Longitude: {incident.location?.longitude}</p>
                <a 
                  href={`https://www.google.com/maps?q=${incident?.location?.latitude},${incident?.location?.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Status Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Incident Status Management</h2>
              
              {/* Status Timeline */}
              <div className="mb-8">
                <div className="relative">
                  {statuses.map((status, index) => {
                    const isCompleted = index < currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const isNext = index === currentStatusIndex + 1;
                    
                    return (
                      <div key={status} className="relative pb-8 last:pb-0">
                        {index < statuses.length - 1 && (
                          <div 
                            className={`absolute left-4 top-8 w-0.5 h-full -ml-px transition-colors duration-300 ${
                              isCompleted ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          />
                        )}
                        
                        <div className="relative flex items-center group">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-green-500 ring-4 ring-green-100' 
                              : isCurrent 
                              ? 'bg-blue-600 ring-4 ring-blue-100 animate-pulse' 
                              : 'bg-gray-200'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : (
                              <div className={`w-3 h-3 rounded-full ${
                                isCurrent ? 'bg-white' : 'bg-gray-400'
                              }`} />
                            )}
                          </div>
                          
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`font-semibold text-lg ${
                                isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-700' : 'text-gray-500'
                              }`}>
                                {status}
                              </p>
                              {isCurrent && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                  Current
                                </span>
                              )}
                            </div>
                            
                            {isNext && !isCompleted && (
                              <button
                                onClick={() => handleStatusUpdate(status)}
                                disabled={updating}
                                className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {updating ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  `Mark as ${status}`
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  Incident Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Created At</span>
                    <span className="text-sm text-gray-800">{formatDate(incident.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Accepted At</span>
                    <span className="text-sm text-gray-800">{formatDate(incident.accepted_at)}</span>
                  </div>
                  {incident.arrived_at_scene_at && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Arrived at Scene</span>
                      <span className="text-sm text-gray-800">{formatDate(incident.arrived_at_scene_at)}</span>
                    </div>
                  )}
                  {incident.patient_loaded_at && (
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Patient Loaded</span>
                      <span className="text-sm text-gray-800">{formatDate(incident.patient_loaded_at)}</span>
                    </div>
                  )}
                  {incident.arrived_at_hospital_at && (
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Arrived at Hospital</span>
                      <span className="text-sm text-gray-800">{formatDate(incident.arrived_at_hospital_at)}</span>
                    </div>
                  )}
                  {incident.completed_at && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Completed At</span>
                      <span className="text-sm text-gray-800">{formatDate(incident.completed_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveIncident;