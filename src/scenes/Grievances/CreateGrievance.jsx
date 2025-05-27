import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography, useMediaQuery } from '@mui/material'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as yup from "yup"
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import toast from 'react-hot-toast';
import axios from '../../config/axiosConfig'
import { GridExpandMoreIcon } from '@mui/x-data-grid';

const CreateGrievance = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [grievances, setGrievances] = useState([])

    useEffect(() => {
        getMyGrievances();
    }, [])

    const getMyGrievances = async () => {
        try {
            const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/admin/get-grievances");
            setGrievances(res.data.grievances)
        } catch (error) {
            error.response ? toast.error(error.response.data.message) : toast.error("Network error");
        }
    }

    const handleFormSubmit = async (values) => {
        try {
            const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/admin/create-grievance", {
                name: values.name,
                description: values.description
            });
            toast.success("Grievance Reported")
        } catch (error) {
            error.response ? toast.error(error.response.data.message) : toast.error("Failed")
        }
    };

    const initialValues = {
        name: "",
        description: "",
    }

    const checkoutSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
    });

    return (
        <Box>
            <Typography variant='h2' mb={2}>Create New Grievance</Typography>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
                resetForm
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Grievance Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={!!touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                    sx={{ gridColumn: "span 1" }}
                                />
                                <TextareaAutosize
                                    aria-label="Description"
                                    rows={30}
                                    placeholder='describe your grievance in detail'
                                    bgcolor="background.paper"
                                    onChange={handleChange}
                                    style={{
                                        gridColumn: "span 4",
                                        fontSize: "1rem",
                                        width: "100%",
                                        height: "calc(3 * 1.5rem)",
                                    }}
                                    name='description'
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Create New Grievance
                                </Button>
                            </Box>
                        </form>
                    )
                }}
            </Formik>
            <Typography variant="h4" textAlign={"center"} mt={3} mb={3}>Your Grievances</Typography>
            {
                grievances.map((grievance) => (
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<GridExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"

                        >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                {grievance.name}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>Status:&ensp;</Typography>
                            <Typography sx={{ color: `${grievance.isViewed ? "green" : "red"}` }}>{grievance.isViewed ? " Responded" : " Pending"}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            description: &ensp; {grievance.description}
                            <br></br>
                            <br></br>
                            {
                            grievance.isViewed ?
                            <>
                            Response Message: &ensp; {grievance.response}
                            </>
                            :""
                            }
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </Box>
    )
}

export default CreateGrievance