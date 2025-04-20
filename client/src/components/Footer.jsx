import React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

const Footer = () => {
    return (
        <Box
            display={"flex"}
            alignItems={"center"}
            p={1}
            flexDirection={"column"}
        >
            <Typography level="body-sm" mt={1}>
                {"© "}
                {new Date().getFullYear()} {"The Bakers Guild"}
            </Typography>
        </Box>
    );
};

export default Footer;
