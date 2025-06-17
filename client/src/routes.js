// client/src/routes.js

// ----------------------
// API endpoints your front‑end calls
// ----------------------
export const apiRoutes = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    logout: "/auth/logout",
  },
  recipes: {
    list: "/recipes",          // GET  – public feed with ?q=&page=
    mine: "/recipes/mine",     // GET  – baker dashboard
    single: (id) => `/recipes/${id}`, // GET  – public detail
    create: "/recipes",        // POST – baker‑only
    update: (id) => `/recipes/${id}`,  // PATCH – baker‑only
    delete: (id) => `/recipes/${id}`,  // DELETE – baker‑only
  },
  upload: {
    image: "/upload",          // POST multipart/form‑data – image upload
  },
};

// ----------------------
// Client‑side (react‑router) paths
// ----------------------
export const clientRoutes = {
  // public
  home: "/",                   // <SearchRecipes />
  signup: "/signup",
  login: "/login",
  recipe: (id) => `/recipe/${id}`,      // <RecipeDetail />

  // baker‑protected
  bakerDashboard: "/baker/dashboard",
  postRecipe: "/baker/post",
  editRecipe: (id) => `/baker/edit/${id}`, // <EditRecipe />
};