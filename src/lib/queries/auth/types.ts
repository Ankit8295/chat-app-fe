export type AuthResponse = {
  expiresInSeconds: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
