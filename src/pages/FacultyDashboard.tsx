import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Complaint } from '../types';
import { getComplaints, updateComplaint } from '../utils/storage';
import Navbar from '../components/Navbar';
import { Search, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

const FacultyDashboard: React.FC = () => {
  const { userData } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newComment, setNewComment] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const load = () => {
      const allComplaints = getComplaints();
      setComplaints(allComplaints);
      setLoading(false);
    };
    load();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'campusCareComplaints') {
        load();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.category === categoryFilter);
    }

    setFilteredComplaints(filtered);
  }, [complaints, searchTerm, statusFilter, categoryFilter]);

  const updateComplaintStatus = async (complaintId: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    setUpdating(true);
    try {
      updateComplaint(complaintId, { status: newStatus });
      
      // Update local state
      setComplaints(prev => prev.map(c => 
        c.id === complaintId ? { ...c, status: newStatus, lastUpdated: new Date() } : c
      ));
    } catch (error) {
      console.error('Error updating complaint status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const addComment = async (complaintId: string) => {
    if (!newComment.trim()) return;
    
    setUpdating(true);
    try {
      const complaint = complaints.find(c => c.id === complaintId);
      const updatedComments = [...(complaint?.facultyComments || []), `${userData?.name}: ${newComment.trim()}`];
      
      updateComplaint(complaintId, { facultyComments: updatedComments });
      
      // Update local state
      setComplaints(prev => prev.map(c => 
        c.id === complaintId 
          ? { ...c, facultyComments: updatedComments, lastUpdated: new Date() } 
          : c
      ));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hostel': return 'Hostel';
      case 'classroom': return 'Classroom';
      case 'food': return 'Food & Dining';
      case 'other': return 'Other';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage and resolve teachers complaints</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.filter(c => c.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.filter(c => c.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Search complaints..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="all">All Categories</option>
                <option value="hostel">Hostel</option>
                <option value="classroom">Classroom</option>
                <option value="food">Food & Dining</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Complaints ({filteredComplaints.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No complaints found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          <span className="ml-1 capitalize">{complaint.status.replace('-', ' ')}</span>
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getCategoryLabel(complaint.category)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{complaint.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                        <span>By: {complaint.userName}</span>
                        <span>Submitted: {complaint.timestamp.toLocaleDateString()}</span>
                        {complaint.lastUpdated && complaint.lastUpdated !== complaint.timestamp && (
                          <span>Updated: {complaint.lastUpdated.toLocaleDateString()}</span>
                        )}
                      </div>
                      
                      {complaint.imageUrl && (
                        <div className="mb-4">
                          <img
                            src={complaint.imageUrl}
                            alt="Complaint evidence"
                            className="h-32 w-32 object-cover rounded-md border border-gray-200"
                          />
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <button
                          onClick={() => updateComplaintStatus(complaint.id, 'pending')}
                          disabled={updating || complaint.status === 'pending'}
                          className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                            complaint.status === 'pending' 
                              ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed' 
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                        >
                          Mark Pending
                        </button>
                        
                        <button
                          onClick={() => updateComplaintStatus(complaint.id, 'in-progress')}
                          disabled={updating || complaint.status === 'in-progress'}
                          className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                            complaint.status === 'in-progress' 
                              ? 'bg-blue-200 text-blue-800 cursor-not-allowed' 
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          Mark In Progress
                        </button>
                        
                        <button
                          onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                          disabled={updating || complaint.status === 'resolved'}
                          className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                            complaint.status === 'resolved' 
                              ? 'bg-green-200 text-green-800 cursor-not-allowed' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          Mark Resolved
                        </button>
                        
                        <button
                          onClick={() => setSelectedComplaint(selectedComplaint?.id === complaint.id ? null : complaint)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Comment
                        </button>
                      </div>
                      
                      {/* Comments Section */}
                      {selectedComplaint?.id === complaint.id && (
                        <div className="border-t pt-4">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Add Comment
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                placeholder="Add a comment..."
                              />
                              <button
                                onClick={() => addComment(complaint.id)}
                                disabled={updating || !newComment.trim()}
                                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                          
                          {complaint.facultyComments && complaint.facultyComments.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Comments:</h4>
                              <div className="space-y-2">
                                {complaint.facultyComments.map((comment, index) => (
                                  <div key={index} className="p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                                    {comment}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;