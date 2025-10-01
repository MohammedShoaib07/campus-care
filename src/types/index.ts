export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'hostel' | 'classroom' | 'food' | 'other';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  imageUrl?: string;
  isAnonymous: boolean;
  timestamp: Date;
  lastUpdated: Date;
  facultyComments?: string[];
}

export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'student' | 'faculty';
  rollNumber?: string;
  department?: string;
  designation?: string;
}