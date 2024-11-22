export default interface Comment {
  id: number;
  content: string;
  userId: number;
  user: {
    id: number;
    name: string;
  };
  isEdited: boolean;
  createdAt: string;
}
