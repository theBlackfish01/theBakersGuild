// ────────────────────────────
// File: client/src/components/RecipeCard.jsx
// ────────────────────────────
import { Stack, Typography } from "@mui/joy";

export default function RecipeCard({ recipe }) {
    return (
        <Stack spacing={1} p={3} bgcolor="#FFFFFF" borderRadius={8} boxShadow="sm">
            <Typography level="title-lg">{recipe.title}</Typography>
            <Typography level="body-sm" color="neutral">
                {recipe.description?.slice(0, 160)}…
            </Typography>
            <Typography level="body-xs" color="neutral">
                By {recipe.postedBy?.name ?? "Anonymous"} •{" "}
                {new Date(recipe.createdAt).toLocaleDateString()}
            </Typography>
        </Stack>
    );
}
