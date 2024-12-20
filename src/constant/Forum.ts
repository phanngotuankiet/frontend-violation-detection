export interface UserForForum {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentForForum {
  id: number;
  content: string;
  userId: number;
  answerId: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user: UserForForum;
}

export interface AnswerForForum {
  id: number;
  content: string;
  userId: number;
  questionId: number;
  isAccepted: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user: UserForForum;
  comments: CommentForForum[];
}

export interface QuestionForForum {
  id: number;
  title: string;
  content: string;
  userId: number;
  user: UserForForum;
  answers: AnswerForForum[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}
