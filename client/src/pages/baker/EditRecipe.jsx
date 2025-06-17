// client/src/pages/baker/EditRecipe.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Box, Typography, Stack, FormControl, FormLabel, Input, Textarea, Button, Alert } from "@mui/joy";
import api from "../../lib/api.js";
import { apiRoutes, clientRoutes } from "../../routes.js";

export default function EditRecipe() {
    const { id } = useParams();
    const nav = useNavigate();

    const [title, setTitle] = useState("");
    const [ingredients, setIngr] = useState("");
    const [instructions, setInst] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /* load */
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get(apiRoutes.recipes.single(id));
                const r = res.data;
                setTitle(r.title);
                setIngr(r.ingredients.join("\n"));
                setInst(r.instructions);
            } catch { setError("Failed to load recipe"); }
        })();
    }, [id]);

    const submit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.patch(apiRoutes.recipes.update(id), { title, ingredients: ingredients.split("\n"), instructions });
            nav(clientRoutes.bakerDashboard);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update");
        } finally { setLoading(false); }
    };

    return (
        <Grid container justifyContent="center" sx={{ minHeight: "90vh", p: 6 }}>
            <Grid item xs={12} md={6}>
                <Typography level="h1" mb={2}>Edit Recipe</Typography>
                <Box component="form" onSubmit={submit}>
                    <Stack gap={3}>
                        <FormControl required><FormLabel>Title</FormLabel><Input value={title} onChange={(e) => setTitle(e.target.value)} /></FormControl>
                        <FormControl required><FormLabel>Ingredients (one per line)</FormLabel><Textarea minRows={4} value={ingredients} onChange={(e) => setIngr(e.target.value)} /></FormControl>
                        <FormControl required><FormLabel>Instructions</FormLabel><Textarea minRows={6} value={instructions} onChange={(e) => setInst(e.target.value)} /></FormControl>
                        <Button type="submit" loading={loading} sx={{ backgroundColor: "#F5A25D" }}>Update</Button>
                        {error && <Alert variant="soft" color="danger">{error}</Alert>}
                    </Stack>
                </Box>
            </Grid>
        </Grid>
    );
}