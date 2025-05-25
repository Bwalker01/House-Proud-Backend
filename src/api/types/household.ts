import { user } from './user';

export type household = {
  id: string;
  created: Date;
  name: string;
  memberIds: string[];
  inviteCode: string;
  quoteSettings: {
    randomMode: boolean;
    customQuote?: string;
  };
};

export type announcement = {
  id: string;
  householdId: string;
  message: string;
  created: Date;
  edited: boolean;
  authorId: string;
};

export type task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  created: Date;
  completed: boolean;
  householdId: string;
  authorId: string;
};

export type calendarEvent = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  authorId: string;
  allDay: boolean;
  householdId: string;
};

export type receipt = {
  id: string;
  fileName: string;
  fileUrl: string;
  uploaded: Date;
  householdId: string;
  authorId: string;
  extractedData: {
    vendor: string;
    date: Date;
    totalAmount: number;
  };
};
