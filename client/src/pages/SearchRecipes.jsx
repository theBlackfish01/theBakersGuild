// client/src/pages/SearchRecipes.jsx
import { useState } from "react";
import searchIcon from "../assets/jobSearchIcon.svg";
import RecipeCard from "../components/RecipeCard.jsx";
import useRecipes from "../hooks/useRecipes.js";
import debounce from "lodash-es/debounce";
import { Stack, Grid, Typography, Input, Alert } from "@mui/joy";
import Pagination from "@mui/material/Pagination";


export default function SearchRecipes() {
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useRecipes(q, page);
    const recipes = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;

    const debounced = debounce((val) => {
        setQ(val);
        setPage(1);
    }, 300);

    return (
        <Stack spacing={0}>
            {/* hero */}
            <Grid container justifyContent="center" sx={{ backgroundColor: "#F8F9FA", p: 6 }}>
                <Grid item xs={12} md={8}>
                    <Typography level="h1" mb={2}>Discover Recipes</Typography>
                    <Typography mb={4}>Browse the latest creations from our bakers.</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <Input fullWidth placeholder="Search by title…" onChange={(e) => debounced(e.target.value)} startDecorator={<img src={searchIcon} alt="search" style={{ height: 24 }} />} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* feed */}
            <Grid container justifyContent="center" sx={{ p: 6 }}>
                <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                        {recipes.map((r) => <RecipeCard key={r._id} recipe={r} />)}
                        {!isLoading && recipes.length === 0 && <Alert>No recipes found.</Alert>}
                        {isError && <Alert variant="soft" color="danger">Unable to load recipes.</Alert>}
                        {totalPages > 1 && <Pagination page={page} count={totalPages} onChange={(_, p) => setPage(p)} />}
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    );
}