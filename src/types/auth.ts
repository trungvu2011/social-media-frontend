// Login types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

// Register types
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

export interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
}

export interface User {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
  avatar?: string;
  backgroundImage?: string;
  role?: "user" | "admin";
}