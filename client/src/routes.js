export const apiRoutes = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    logout: "/auth/logout",
  },
  recipes: {
    list: "/recipes",                 // GET — public feed
    mine: "/recipes/mine",         // GET — baker dashboard
    single: (id) => `/recipes/${id}`,   // GET — public
    create: "/recipes",               // POST — baker‑only
    update: (id) => `/recipes/${id}`,   // PATCH — baker‑only
    delete: (id) => `/recipes/${id}`,   // DELETE — baker‑only
  },
};

export const clientRoutes = {
  home: "/",                 // SearchRecipes
  signup: "/signup",
  login: "/login",
  bakerDashboard: "/baker/dashboard",
  postRecipe: "/baker/post",
  recipe: (id) => `/recipe/${id}`,      // optional detail page
};
