export type IRoutes = {
  HOME: string;
  NOT_FOUND: string;
  LOGIN: string;
  SIGNUP: string;
  SETTINGS: string;
  CHAT: (id: String) => string;
  GROUP_CHAT: (id: String) => string;
};

export const ROUTES: IRoutes = {
  HOME: "/",

  NOT_FOUND: "/not-found",

  LOGIN: "/login",
  SIGNUP: "/signup",

  SETTINGS: "/settings",

  CHAT: (id) => `/user/${id}`,
  GROUP_CHAT: (id) => `/group/${id}`,
};
