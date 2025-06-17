// client/src/hooks/useRecipes.js
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api.js";
import { apiRoutes } from "../routes.js";

export default function useRecipes(q = "", page = 1) {
    return useQuery({
        queryKey: ["recipes", q, page],
        queryFn: () => api.get(apiRoutes.recipes.list, { params: { q, page } }).then((r) => r.data),
        keepPreviousData: true,
    });
}