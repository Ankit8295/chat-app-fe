export type IRoutes = {
  HOME: string;
  NOT_FOUND: string;
  LOGIN: string;
  SIGNUP: string;
  CONVERSATION: (id: string) => string;
};

export const ROUTES: IRoutes = {
  HOME: "/",

  NOT_FOUND: "/not-found",

  LOGIN: "/login",
  SIGNUP: "/signup",

  CONVERSATION: (id) => `/${id}`,
};
