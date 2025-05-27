import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import FileCard from './FileCard';
import { AuthContext } from '../../context/AuthContext';
import { uploadResourceToS3 } from "../../helpers/fileUpload"
import axios from "../../config/axiosConfig"
import toast from 'react-hot-toast';

const Resources = () => {
    const { user } = useContext(AuthContext)
    const [viewForm, setViewForm] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [uploadfile, setUploadfile] = useState(null)
    const [resources, setResources] = useState([])

    const fetchResources = async () => {
        try {
            const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/admin/get-all-resources")
            setResources(res.data)
        } catch (error) {
            error.response ? toast.error(error.response.data.message) : toast.error("Failed to fetch resources Try again later");
        }
    }

    console.log(process.env)

    useEffect(() => {
        fetchResources();
    },[])

    const uploadFile = async () => {
        try {
            toast.loading("Uploading...")
            if (name == "" || description == "") {
                return toast.error("File Name and description is required")
            }
            if (!uploadfile) {
                return toast.error("Please select a file")
            }
            const { fileUrl, fileName } = await uploadResourceToS3(uploadfile)
            const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/admin/upload-resource", {
                name,
                description,
                filelink: fileUrl,
            })
            fetchResources();
            setDescription("");
            setName("");
            setUploadfile(null);
            toast.dismiss()
            setViewForm(false)
            toast.success("Uploaded Successfully")
        } catch (error) {
            error.response ? toast.error(error.response.data.message) : toast.error("Failed to upload image Try again later");
        }
    }
    return (
        <>
            <Typography variant='h2' textAlign={"center"} mb={2}>Resources
                {
                    user.userType == 1 ?
                        <Button variant="contained" color="secondary" onClick={() => { setViewForm(true) }} sx={{ m: 2 }}>Upload Resource</Button>
                        :
                        ""
                }
            </Typography>
            {
                viewForm ?
                    <Box display={"flex"} gap={2} px={2} my={2}>
                        <TextField
                            name='name'
                            label="File Name"
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                        />
                        <TextField
                            name='description'
                            label="Description"
                            value={description}
                            onChange={(e) => { setDescription(e.target.value) }}
                        />
                        <TextField
                            name='uploadfile'
                            type='file'
                            onChange={(e) => { setUploadfile(e.target.files[0]) }}
                        />
                        <Button variant="contained" color="secondary" onClick={uploadFile}>Upload</Button>
                    </Box>
                    :
                    ""
            }
            <Grid container px={2} spacing={2}>
                {
                    resources.map((resource) => (
                        <Grid key={resource.id} item xs={12} sm={3}>
                            <FileCard  data={resource}/>
                        </Grid>
                    ))
                }
            </Grid>
        </>
    )
}

export default Resources