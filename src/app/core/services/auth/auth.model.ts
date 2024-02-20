export interface AuthResponse {
  user: {
    image: string;
    username: string;
    password: string;
    role: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  token: string;
  message: string;
}
