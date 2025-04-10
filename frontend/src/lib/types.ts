
export interface Course {
  id: string;
  title: string;
  details: string;
  category: string;
  available: boolean;
  image?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
}
