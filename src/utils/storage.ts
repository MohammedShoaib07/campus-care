import { Complaint } from '../types';

// Demo storage utilities using localStorage
export const getComplaints = (): Complaint[] => {
  const complaints = localStorage.getItem('campusCareComplaints');
  const parsed = complaints ? JSON.parse(complaints) : [];
  if (!Array.isArray(parsed)) return [] as Complaint[];
  return parsed.map((c: any) => ({
    ...c,
    timestamp: c.timestamp ? new Date(c.timestamp) : new Date(),
    lastUpdated: c.lastUpdated ? new Date(c.lastUpdated) : new Date()
  })) as Complaint[];
};

export const saveComplaints = (complaints: Complaint[]): void => {
  localStorage.setItem('campusCareComplaints', JSON.stringify(complaints));
};

export const addComplaint = (complaint: Omit<Complaint, 'id' | 'timestamp' | 'lastUpdated'>): Complaint => {
  const complaints = getComplaints();
  const newComplaint: Complaint = {
    ...complaint,
    id: `complaint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    lastUpdated: new Date()
  };
  
  complaints.unshift(newComplaint);
  saveComplaints(complaints);
  return newComplaint;
};

export const updateComplaint = (id: string, updates: Partial<Complaint>): void => {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === id);
  if (index !== -1) {
    complaints[index] = {
      ...complaints[index],
      ...updates,
      lastUpdated: new Date()
    };
    saveComplaints(complaints);
  }
};

export const getUserComplaints = (userId: string): Complaint[] => {
  const complaints = getComplaints();
  return complaints.filter(c => c.userId === userId);
};

// Demo image upload simulation
export const uploadImage = async (file: File): Promise<string> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a blob URL for demo purposes
  return URL.createObjectURL(file);
};