import { useState, useEffect } from "react";
import { Stack, Grid, Typography, Input, Button, Alert } from "@mui/joy";
import searchIcon from "../assets/jobSearchIcon.svg";
import { apiRoutes } from "../routes.js";
import api from "../lib/api.js";
import RecipeCard from "../components/RecipeCard.jsx";


export default function SearchRecipes() {
    const [recipes, setRecipes]   = useState([]);
    const [visible, setVisible]   = useState([]);
    const [q, setQ]               = useState("");
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const res = await api.get(apiRoutes.recipes.list);
                setRecipes(res.data);
                setVisible(res.data);
            } catch {
                setError("Unable to load recipes.");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const search = () => {
        const term = q.trim().toLowerCase();
        if (!term) return setVisible(recipes);
        setVisible(recipes.filter(r => r.title.toLowerCase().includes(term)));
    };

    return (
        <Stack spacing={0}>
            {/* Hero */}
            <Grid container justifyContent="center" sx={{ backgroundColor:"#F8F9FA", p:6 }}>
                <Grid item xs={12} md={8}>
                    <Typography level="h1" mb={2}>Discover Recipes</Typography>
                    <Typography mb={4}>Browse the latest creations from our bakers.</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={9}><Input fullWidth placeholder="Search by title…" value={q} onChange={e=>setQ(e.target.value)} startDecorator={<img src={searchIcon} alt="search" style={{height:24}}/>}/></Grid>
                        <Grid item xs={3}><Button fullWidth loading={loading} onClick={search}>Search</Button></Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* Feed */}
            <Grid container justifyContent="center" sx={{ p:6 }}>
                <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                        {visible.map(r => <RecipeCard key={r._id} recipe={r} />)}
                        {!loading && visible.length === 0 && <Alert>No recipes found.</Alert>}
                        {error && <Alert variant="soft" color="danger">{error}</Alert>}
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    );
}
