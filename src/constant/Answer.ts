// import User from "./User";

export default interface Answer {
  id: number;
  content: string;
  userId: number;
  user: {
    id: number;
    name: string;
  };
  isAccepted: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}
