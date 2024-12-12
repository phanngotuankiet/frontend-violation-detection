export default interface Comment {
  id: number;
  content: string;
  userId: number;
  user: {
    id: number;
    name: string;
    role: string;
  };
  isEdited: boolean;
  createdAt: string;
}
