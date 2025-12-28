import React, { useEffect, useState } from 'react'
import { AlertCircle, Clock, MapPin, Ambulance, Eye, ChevronLeft, ChevronRight, Phone, Navigation, Hospital, X } from 'lucide-react'
import axios from 'axios'
import { useAppSelector } from '@/reduxstore/hooks/hooks'
import { useRouter } from 'next/router'

const Incident = () => {
  // Sample data - replace with your API call
  const [incidents, setIncidents] = useState([])

   const router = useRouter();
  const { query_user_id } = router.query
  const user_id = useAppSelector(state=>state.auth.user_id) || query_user_id 

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const itemsPerPage = 5

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentIncidents = incidents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(incidents.length / itemsPerPage)

const fetchData = async () => {
  try {
    const data = {
        'user_id' : user_id
    }
    const response = await axios.post('https://medical-backend-dbt2.onrender.com/api/incidents/incidentlist' ,data );
    console.log('Data fetched:', response.data);

    setIncidents(response.data.incident_list)
    // You can process the data here
  } catch (error) {
    
    // Handle error (e.g., show a message to the user)
  } finally {
    console.log('Fetch attempt completed.');
    // Optional: cleanup, loading state reset, etc.
  }
};

  useEffect(()=>{
    fetchData(); 
  } , [])

  const formatDate = (dateString:any) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (dateString:any) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getStatusColor = (status:any) => {
    switch (status.toLowerCase()) {
      case 'en route':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'dispatched':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAmbulanceStatusColor = (status:any) => {
    switch (status.toLowerCase()) {
      case 'en route':
        return 'text-blue-600'
      case 'dispatched':
        return 'text-purple-600'
      case 'completed':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const handleViewDetails = (incident:any) => {
    setSelectedIncident(incident)
  }

  const closeModal = () => {
    setSelectedIncident(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Incident Tracking</h1>
              <p className="text-sm text-gray-500">Monitor and track all your emergency incidents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Incidents</p>
                <p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">En Route</p>
                <p className="text-2xl font-bold text-blue-600">
                  {incidents.filter((i:any) => i.status === 'En Route').length}
                </p>
              </div>
              <Ambulance className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {incidents.filter((i:any) => i.status === 'Completed').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Dispatched</p>
                <p className="text-2xl font-bold text-purple-600">
                  {incidents.filter((i:any) => i.status === 'Dispatched').length}
                </p>
              </div>
              <Navigation className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Your Incidents</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Incident ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Emergency Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ambulance ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ETA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentIncidents?.map((incident:any) => (
                  <tr key={incident?.incident_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{incident?.incident_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(incident?.created_at)}</div>
                      <div className="text-xs text-gray-500">{formatTime(incident?.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{incident?.emergency_type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-2">
                        <Hospital className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{incident?.hospital_name}</div>
                          <div className="text-xs text-gray-500">{incident?.hospital_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Ambulance className={`w-4 h-4 ${getAmbulanceStatusColor(incident?.status)}`} />
                        <span className="text-sm font-medium text-gray-900">{incident?.ambulance_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{incident?.distance_km} km</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident?.status)}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {incident.eta_minutes > 0 ? (
                        <span className="text-sm font-medium text-gray-900">{incident?.eta_minutes} mins</span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(incident)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, incidents.length)}
                </span>{' '}
                of <span className="font-medium">{incidents.length}</span> incidents
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  } transition-colors`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  } transition-colors`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Incident Details</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedIncident.status)}`}>
                  {selectedIncident.status}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(selectedIncident.created_at)} at {formatTime(selectedIncident.created_at)}
                </span>
              </div>

              {/* Incident Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Incident ID</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedIncident?.incident_id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Emergency Type</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedIncident?.emergency_type}</p>
                </div>
              </div>

              {/* Hospital Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Hospital className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-gray-900">Hospital Information</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Hospital Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedIncident.hospital_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact Email</p>
                    <p className="text-sm text-gray-900">{selectedIncident.hospital_email}</p>
                  </div>
                </div>
              </div>

              {/* Ambulance Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Ambulance className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold text-gray-900">Ambulance Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Ambulance ID</p>
                    <p className="text-sm font-medium text-gray-900">{selectedIncident.ambulance_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm font-medium text-gray-900">{selectedIncident.distance_km} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ETA</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedIncident.eta_minutes > 0 ? `${selectedIncident.eta_minutes} mins` : 'Arrived'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-gray-900">Location</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Latitude</p>
                    <p className="text-sm font-medium text-gray-900">{selectedIncident.location.latitude}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Longitude</p>
                    <p className="text-sm font-medium text-gray-900">{selectedIncident.location.longitude}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Track on Map</span>
                </button>
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Contact Hospital</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Incident