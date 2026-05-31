export interface ChatMessage {
  id: string;
  missionId: string;
  senderId: string;
  type: string;
  content: string | null;
  fileUrl: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}
