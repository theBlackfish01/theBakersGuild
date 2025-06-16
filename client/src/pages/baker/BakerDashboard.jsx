import { useState, useEffect } from "react";
import { Grid, Typography, Stack, Alert } from "@mui/joy";
import api from "../../lib/api.js";
import { apiRoutes } from "../../routes.js";
import RecipeCard from "../../components/RecipeCard.jsx"; // reuse simple card

export default function BakerDashboard() {
    const [mine,setMine] = useState([]);
    const [error,setError] = useState(null);
    useEffect(()=>{
        (async()=>{
            try {
                const res = await api.get(apiRoutes.recipes.mine);
                setMine(res.data);
            } catch {
                setError("Could not load your recipes");
            }
        })();
    },[]);

    return (
        <Grid container justifyContent="center" sx={{ p:6 }}>
            <Grid item xs={12} md={8}>
                <Typography level="h1" mb={4}>My Recipes</Typography>
                <Stack spacing={2}>
                    {mine.map(r=> <RecipeCard key={r._id} recipe={r} />)}
                    {mine.length === 0 && !error && <Alert>No recipes yet.</Alert>}
                    {error && <Alert variant="soft" color="danger">{error}</Alert>}
                </Stack>
            </Grid>
        </Grid>
    );
}


