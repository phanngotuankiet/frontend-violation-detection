import Answer from "./Answer";
import User from "./User";

export default interface Question {
  id: number;
  title: string;
  content: string;
  userId: number;
  user: User;
  answers: Answer[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}
