import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Box, Avatar } from '@mui/joy';
import { WorkspacePremium, AccessTime, DoneAll, Cancel, CheckCircle, PanoramaFishEye } from '@mui/icons-material';

const ApplicantCard = ({ applicant }) => {
    const getStatusIcon = () => {
        switch (applicant.status) {
            case 'shortlisted':
                return <CheckCircle sx={{ color: 'green' }} />;
            case 'undecided':
                return <PanoramaFishEye sx={{ color: 'grey' }} />;
            case 'rejected':
                return <Cancel sx={{ color: '#D44040' }} />;
            default:
                return null;
        }
    };

    const getInitials = (name) => {
        const parts = name.split(' ');
        return parts.map(part => part[0]).join('').toUpperCase();
    };

    return (
        <Link to={`/applicant/${applicant.id}`} style={{ textDecoration: 'none' }}>
            <Card sx={{ width: '400px', borderRadius: '20px', cursor: 'pointer' }}> {/* Adjust the width as needed */}
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, fontSize: 30, marginRight: '20px' }}>
                            {getInitials(applicant.name)}
                        </Avatar>
                        <Box>
                            <Typography variant="h1" color='#000000' fontWeight={500} fontSize={25} component="div">
                                {applicant.name}
                            </Typography>
                            {getStatusIcon() && (
                                <Box sx={{ position: 'absolute', top: 0, right: 0, margin: '10px' }}>
                                    {getStatusIcon()}
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Grid direction="column" container spacing={2} marginLeft={9}>
                        <Grid item>
                            <WorkspacePremium/>
                            {applicant.qualification}
                        </Grid>
                        <Grid item>
                            <AccessTime/>
                            {applicant.experience}
                        </Grid>
                        <Grid item>
                            <DoneAll/>
                            {applicant.skills}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ApplicantCard;
