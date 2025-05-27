import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, TextareaAutosize, useMediaQuery } from '@mui/material';
import { Formik } from 'formik';
import * as yup from "yup";
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FileUploader } from 'react-drag-drop-files';
import FsLightbox from 'fslightbox-react';
import axios from "../../config/axiosConfig"
import { uploadCabinetReportImageToS3, uploadClubReportImageToS3 } from '../../helpers/imageUpload';
const UploadReportForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [months, setMonths] = useState([]);
    const [photographs, setPhotographs] = useState([])
    const [imageViewerToggler , setImageViewerToggler] = useState(false)
    const [year,setYear] = useState()

    const getMonths = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const currentMonthName = monthNames[currentMonth];

        const newMonths = [{ name: currentMonthName, value: currentMonth + 1, year: currentYear }];

        if (currentDate.getDate() < 10) {
            let previousMonth = currentMonth - 1;
            let year = currentYear;
            if (previousMonth < 0) {
                previousMonth = 11; // December
                year -= 1;
            }
            const previousMonthName = monthNames[previousMonth];
            newMonths.push({ name: previousMonthName, value: previousMonth + 1, year: year });
        }

        setMonths(newMonths);
    };

    useEffect(() => {
        getMonths()
    }, [])

    // const handleFileChange = (files) => {
    //     for (let i = 0; i < files.length; i++) {
    //         if (files[i].size > 1000000) {
    //             return toast.error("File size should be less than 1mb")
    //         }
    //         if (files[i].type !== "image/jpeg" && files[i].type !== "image/png") {
    //             return toast.error("File type should be jpeg or png")
    //         }
    //     }
    //     setPhotographs(files);
    // };

    const handleFormSubmit = async (values,{resetForm}) => {
        try {
            values.year = year
            await axios.post(process.env.REACT_APP_BASE_URL + "api/cabinet/add-report", values)
            toast.dismiss();
            toast.success("Report uploaded successfully");
            setPhotographs([]);
            resetForm()
        }
        catch (err) {
            toast.dismiss();
            err.response ? toast.error(err.response.data.message) : toast.error("Failed")
        }
    };
    return (
        <Box m="20px">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
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
                                    label="Report Name *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.reportName}
                                    name="reportName"
                                    error={!!touched.reportName && !!errors.reportName}
                                    helperText={touched.reportName && errors.reportName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <FormControl fullWidth variant="filled"
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    <InputLabel>Report Type *</InputLabel>
                                    <Select
                                        value={values.reportType}
                                        onChange={handleChange}
                                        name="reportType"
                                        error={!!touched.reportType && !!errors.reportType}
                                        helperText={touched.reportType && errors.reportType}
                                    >
                                        <MenuItem value={1}>Event</MenuItem>
                                        <MenuItem value={2}>Project</MenuItem>
                                        <MenuItem value={3}>Initiative</MenuItem>
                                        <MenuItem value={4}>Meeting</MenuItem>
                                        <MenuItem value={5}>Participation</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="filled"
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    <InputLabel>Month *</InputLabel>
                                    <Select
                                        value={values.month}
                                        onChange={handleChange}
                                        name="month"
                                        error={!!touched.month && !!errors.month}
                                        helperText={touched.month && errors.month}
                                    >
                                        {
                                            months.map((e) => {
                                                return (
                                                    <MenuItem onClick={()=>{setYear(e.year)}} value={e.value} key={e.value}>{e.name + " " + e.year}</MenuItem>
                                                )
                                            }
                                            )
                                        }
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Venue *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.venue}
                                    name="venue"
                                    error={!!touched.venue && !!errors.venue}
                                    helperText={touched.venue && errors.venue}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Description *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.description}
                                    name="description"
                                    error={!!touched.description && !!errors.description}
                                    helperText={touched.description && errors.description}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="No. of. Rotaractors Attended *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.rotractorsAttended}
                                    name="rotractorsAttended"
                                    error={!!touched.rotractorsAttended && !!errors.rotractorsAttended}
                                    helperText={touched.rotractorsAttended && errors.rotractorsAttended}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="No. of. Rotarians Attended *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.rotariansAttended}
                                    name="rotariansAttended"
                                    error={!!touched.rotariansAttended && !!errors.rotariansAttended}
                                    helperText={touched.rotariansAttended && errors.rotariansAttended}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="No. of. Visiting Rotaractors *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.visitingRotractors}
                                    name="visitingRotractors"
                                    error={!!touched.visitingRotractors && !!errors.visitingRotractors}
                                    helperText={touched.visitingRotractors && errors.visitingRotractors}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="No. of. Guests Attended *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.guests}
                                    name="guests"
                                    error={!!touched.guests && !!errors.guests}
                                    helperText={touched.guests && errors.guests}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="No. of. Beneficiaries Attended *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.beneficiaries}
                                    name="beneficiaries"
                                    error={!!touched.beneficiaries && !!errors.beneficiaries}
                                    helperText={touched.beneficiaries && errors.beneficiaries}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="hoursSpent *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.hoursSpend}
                                    name="hoursSpend"
                                    error={!!touched.hoursSpend && !!errors.hoursSpend}
                                    helperText={touched.hoursSpend && errors.hoursSpend}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="gDriveFolder *"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.gDriveFolder}
                                    name="gDriveFolder"
                                    error={!!touched.gDriveFolder && !!errors.gDriveFolder}
                                    helperText={touched.gDriveFolder && errors.gDriveFolder}
                                    sx={{ gridColumn: "span 2" }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Submit
                                </Button>
                            </Box>
                        </form>
                    )
                }}
            </Formik>
            {/* <FileUploader
                multiple={true}
                handleChange={handleFileChange}
                name="photographs"
                types={["JPEG", "PNG", "JPG"]}
                label="Drop Your Photographs here"
                hoverTitle="Drop Here"
            />
            {
               photographs && photographs.length > 0 && (
                    <Button sx={{ mt: 2 }} onClick={()=> setImageViewerToggler(true)}>View Photos</Button>
                )
            }
            <FsLightbox
            toggler={imageViewerToggler}
            sources={Array.from(photographs).map(e => URL.createObjectURL(e))}
            /> */}
        </Box>
    )
}

const checkoutSchema = yup.object().shape({
    reportName: yup.string().required("Report Name is required"),
    description: yup.string().required("Description is required"),
    rotractorsAttended: yup.number().required("Rotractors Attended is required").min(0, "value cannot be negative"),
    rotariansAttended: yup.number().required("Rotarians Attended is required").min(0, "value cannot be negative"),
    visitingRotractors: yup.number().required("Visiting Rotractors is required").min(0, "value cannot be negative"),
    guests: yup.number().required("Guests is required").min(0, "value cannot be negative"),
    beneficiaries: yup.number().required("Beneficiaries is required").min(0, "value cannot be negative"),
    reportType: yup.number().required("Report Type is required").min(0, "value cannot be negative"),
    month: yup.number().required("Month is required"),
    venue: yup.string().required("venue is required"),
    gDriveFolder: yup.string().required("Please Provide Link to the G-Drive Folder"),
});

const initialValues = {
    reportName: "",
    description: "",
    rotractorsAttended: "",
    rotariansAttended: "",
    beneficiaries: "",
    visitingRotractors: "",
    hoursSpend:"",
    guests: "",
    venue: "",
    reportType: "",
    month: "",
    gDriveFolder: ""
};

export default UploadReportForm