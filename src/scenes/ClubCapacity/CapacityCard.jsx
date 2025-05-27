import React, { useState } from 'react'
import { Button, Card, CardActions, CardContent, CardMedia, Grid, TextField, Typography } from '@mui/material'
import axios from "../../config/axiosConfig"
import toast from 'react-hot-toast'

const CapacityCard = ({ club }) => {
    const [onEdit, setOnEdit] = useState(false)
    const [newCapacity, setNewCapacity] = useState(club.capacity)


    const handleSave = async () => {
        try {
            const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/cabinet/update-club-capacity",
                {
                    capacity: newCapacity,
                    clubId:club.id
                }
            )
            setOnEdit(false)
            toast.success("Capacity Updated")
            club.capacity = newCapacity
        } catch (error) {
            error.response ? toast.error(error.response.data.message) : toast.error("Network error");
        }
    }

    return (
        <Grid item xs={12} sm={6} md={3} lg={3}>
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={club.clubLogo ? club.clubLogo : null}
                    title={club.clubName}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {club.clubName} ({process.env.REACT_APP_ACCOUNT_ID + "c" + club.id})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Current Capacity: {club.capacity} members
                    </Typography>
                    {
                        onEdit ?
                            <TextField
                                variant="outlined"
                                sx={{ mt: 2, mb: 2 }}
                                type="number"
                                label="Capacity"
                                onChange={(e)=>{setNewCapacity(e.target.value)}}
                                value={newCapacity}
                                name="capacity"
                            /> : ""
                    }
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => { setOnEdit(true) }}>Edit</Button>
                    <Button size="small" disabled={!onEdit} onClick={handleSave}>Save</Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default CapacityCard