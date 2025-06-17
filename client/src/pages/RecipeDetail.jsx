// client/src/pages/RecipeDetail.jsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api.js";
import { apiRoutes } from "../routes.js";
import { Grid, Typography, Stack, CircularProgress, Alert } from "@mui/joy";

export default function RecipeDetail() {
    const { id } = useParams();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["recipe", id],
        queryFn: () => api.get(apiRoutes.recipes.single(id)).then((r) => r.data),
    });

    if (isLoading)
        return <Stack alignItems="center" sx={{ p: 6 }}><CircularProgress /></Stack>;
    if (isError)
        return <Alert variant="soft" color="danger">Failed to load recipe</Alert>;

    const r = data;

    return (
        <Grid container justifyContent="center" sx={{ p: 6 }}>
            <Grid item xs={12} md={8}>
                <Stack spacing={2}>
                    <Typography level="h1">{r.title}</Typography>
                    {r.imageUrl && <img src={r.imageUrl} alt={r.title} style={{ width: "100%", borderRadius: 12 }} />}
                    <Typography level="body-sm" sx={{ whiteSpace: "pre-wrap" }}>{r.description}</Typography>
                    <Typography level="h4">Ingredients</Typography>
                    <ul>{r.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                    <Typography level="h4">Instructions</Typography>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>{r.instructions}</Typography>
                    <Typography level="body-xs" color="neutral">By {r.postedBy?.name ?? "Anonymous"} • {new Date(r.createdAt).toLocaleDateString()}</Typography>
                </Stack>
            </Grid>
        </Grid>
    );
}