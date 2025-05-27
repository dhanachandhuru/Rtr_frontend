import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from "../../config/axiosConfig"
import CapacityCard from './CapacityCard'

const ClubCapacity = () => {
    const [allClub, setAllClub] = useState([])

    const getAllClub = async () => {
        const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/cabinet/get-club-capacity");
        setAllClub(res.data)
    }

    useEffect(() => {
        getAllClub()
    },[])
    return (
        <Box m={"20px"}>
            <Typography variant='h2' my={2}>Club Capacity</Typography>
            <Grid container spacing={2}>
                {
                    allClub.map((club) => (
                        <CapacityCard key={club.id} club={club} />
                    ))
                }
            </Grid>
        </Box>
    )
}

export default ClubCapacity