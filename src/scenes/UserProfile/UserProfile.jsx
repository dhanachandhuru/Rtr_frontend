import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import ThemeButton from "../../components/ThemeButton"
import { AuthContext } from '../../context/AuthContext';
import { Formik } from 'formik';
import * as yup from "yup";
import axios from "../../config/axiosConfig"
import toast from 'react-hot-toast';
import { Edit, Label } from '@mui/icons-material';
import { uploadProfileImageToS3 } from '../../helpers/imageUpload';
import Loading from '../../components/Loading';

const UserProfile = () => {
    const [isDisabled, setIsDisabled] = useState(true);
    const isNonMobile = useMediaQuery("(min-width:600px)")
    const { user } = useContext(AuthContext)
    const [userData, setUserData] = useState([])
    const [profileFile, setProfileFile] = useState(null);
    const [changePassword, setChangePassword] = useState(false)
    const [loading,setLoading] = useState(true)

    const getUserData = async () => {
        try {
            const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/user/get-user");
            setUserData(res.data)
        }
        catch (error) {
            error.response ? toast.error(error.response.data.message) : toast.error("Fetching failed")
        }
    }

    useEffect(() => {
        getUserData()
        setLoading(false)
    }, [])

    const initialValues = {
        userName: userData?.userName || "",
        userEmail: userData?.userEmail || "",
        riId: userData?.riId || "",
        yearOfRotraction: userData?.yearOfRotraction || "",
        designation: userData?.designation || "",
        bloodGroup: userData?.bloodGroup || '',
        address: userData?.address || "",
        facebookHandle: userData?.facebookHandle || "",
        instaHandle: userData?.instaHandle || "",
        linkedinHandle: userData?.linkedinHandle || "",
        userMobile: userData?.userMobile || "",
        oldPassword: "",
        userPassword: "",
        confirmPassword: "",

    };

    const enableEditing = () => {
        setIsDisabled(false)
    }

    const phoneReg = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/

    const checkoutSchema = yup.object().shape({
        userName: !isDisabled ? yup.string().required("Full Name is required"):"",
        yearOfRotraction: !isDisabled ? yup.number().max(100, "Input Error"):"",
        riId: !isDisabled ? yup.string().required("RI ID is required"):"",
        userEmail: !isDisabled ? yup.string().email("Invalid email").required("Email is required"):"",
        designation: !isDisabled ? yup.string().required("Designation is required"):"",
        bloodGroup: !isDisabled ? yup.string().required("Blood Group is required"):"",
        address: !isDisabled ? yup.string().required("Address is required"):"",
        facebookHandle: !isDisabled ? yup.string().required("Facebook Handle is required"):"",
        instaHandle: !isDisabled ? yup.string().required("Instagram Handle is required"):"",
        linkedinHandle: !isDisabled ? yup.string().required("Linkedin Handle is required"):"",
        userMobile:!isDisabled ? yup
            .string().required("Phone number is required").matches(phoneReg, "Phone number is not valid").min(10, "Invalid Number").max(10, "invalid Number"):"",
        oldPassword: changePassword ? yup.string().required("Password is required").min(8, "Atleast 8 characters required") : "",
        userPassword: changePassword ? yup.string().required("Password is required").min(8, "Atleast 8 characters required") : "",
        confirmPassword: changePassword ? yup
            .string().required("Confirm Password is required")
            .oneOf([yup.ref('userPassword'), null], 'Passwords must match') : "",

    });

    const handleFormSubmit = async (values) => {
        try {
            await axios.post(process.env.REACT_APP_BASE_URL+"api/user/update-user", values);
            toast.success("Updated Successfully")
        }
        catch (err) {
            err.response ? toast.error(err.response.data.message) : toast.error("Failed")
        }
    };

    const changeCover = () => {
        // simulate the click
        document.getElementById("cover").click();
    }

    const changeProfile = (e) => {
        document.getElementById("profile").click();
    }

    // const handleCoverChange = (e) => {
    //     if (e.target.files.length > 0) {
    //         setCoverFile(e.target.files[0]);
    //         uploadFile(e.target.files[0], 'cover');
    //     }
    // }

    const handleProfileChange = (e) => {
        if (e.target.files.length > 0) {
            if (e.target.files[0].size > 400000) {
                return toast.error("File size should be less than 400kb")
            }
            if (!e.target.files[0].type === "image/jpeg" || !e.target.files[0].type === "image/png") {
                return toast.error("File type should be jpeg or png")
            }
            setProfileFile(e.target.files[0]);
            uploadFile(e.target.files[0]);
        }
    }

    const uploadFile = async (file) => {
        try {
            toast.loading("Uploading...")
            const imageRes = await uploadProfileImageToS3(file);
            await axios.post(process.env.REACT_APP_BASE_URL + "api/user/update-user-profile", {
                profilePhoto: imageRes.imageUrl
            })
            setUserData(userData => ({...userData, profilePhoto: imageRes.imageUrl}))
            toast.dismiss()
            toast.success("Updated Successfully")
        }
        catch (err) {
            err.response ? toast.error(err.response.data.message) : toast.error("Failed")
        }
    }

    if(loading){
        return <Loading/>
    }

    return (
        <Grid container spacing={3} px={"10px"}>
            <Grid item md={12} sm={12} xs={12} style={{ position: "sticky" }}>
                <Paper >
                    <Box position="relative" height={200} width="100%">
                        <input type="file" id='profile' accept="image/*" onChange={handleProfileChange} style={{ display: "none" }} />
                        {/* <input type="file" id="cover" accept="image/*" onChange={handleCoverChange} style={{display:"none"}}/> */}
                        <img
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                            src="https://png.pngtree.com/thumb_back/fh260/background/20221108/pngtree-faceless-unrecognizable-man-vanishing-into-dust-one-time-john-doe-photo-image_20443818.jpg"
                            alt=""
                        />
                        <img
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                objectFit: "cover",
                                borderRadius: "100%",
                                border: "3px solid white"
                            }}
                            width={200}
                            height={200}
                            src={userData.profilePhoto ? userData.profilePhoto :  "https://placehold.co/600x400@2x.png"}
                            alt=""
                        />
                        {/* <Button
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "black",
                                opacity:"80%",
                                borderRadius: "10%",
                                minWidth: "auto",
                                padding: "6px"
                            }}
                            onClick={changeCover}
                        >
                            Edit Cover
                        </Button> */}
                        <Button
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "black",
                                opacity: "80%",
                                borderRadius: "10%",
                                minWidth: "auto",
                                padding: "6px"
                            }}
                            onClick={changeProfile}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                </Paper>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
                <Paper>
                    <Box display={"flex"} alignItems={"center"} flexDirection={"row"} justifyContent={"space-between"}>
                        <Button sx={{ maxWidth: "200px", maxHeight: "50px" }} onClick={enableEditing}>Edit Details</Button>
                        <Typography variant='h3' textAlign={"center"} padding={"30px"}>User Details</Typography>
                        <Button onClick={() => { setChangePassword(true) }} sx={{ maxWidth: "200px", maxHeight: "50px" }}>Change Password</Button>
                    </Box>
                    {/* form */}
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={checkoutSchema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    px={"10px"}
                                    pb={"10px"}
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        disabled={true}
                                        onMouseDown={() => { toast.error("Editing this field need admin access") }}
                                        label="User Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.userName}
                                        name="userName"
                                        error={!!touched.userName && !!errors.userName}
                                        helperText={touched.userName && errors.userName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        disabled={true}
                                        onMouseDown={() => { toast.error("Editing this field need admin access") }}
                                        label="User Email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.userEmail}
                                        name="userEmail"
                                        error={!!touched.userEmail && !!errors.userEmail}
                                        helperText={touched.userEmail && errors.userEmail}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        disabled={true}
                                        onMouseDown={() => { toast.error("Editing this field need admin access") }}
                                        label="RI ID"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.riId}
                                        name="riId"
                                        error={!!touched.riId && !!errors.riId}
                                        helperText={touched.riId && errors.riId}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        disabled={true}
                                        onMouseDown={() => { toast.error("Editing this field need admin access") }}
                                        label="Years Of Rotraction"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.yearOfRotraction}
                                        name="yearOfRotraction"
                                        error={!!touched.yearOfRotraction && !!errors.yearOfRotraction}
                                        helperText={touched.yearOfRotraction && errors.yearOfRotraction}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        disabled={true}
                                        onMouseDown={() => { toast.error("Editing this field need admin access") }}
                                        label="Designation"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.designation}
                                        name="designation"
                                        error={!!touched.designation && !!errors.designation}
                                        helperText={touched.designation && errors.designation}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <FormControl fullWidth variant="filled"
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        <InputLabel>Blood Group</InputLabel>
                                        <Select
                                            value={values.bloodGroup}
                                            disabled={isDisabled}
                                            onChange={handleChange}
                                            name="bloodGroup"
                                            error={!!touched.bloodGroup && !!errors.bloodGroup}
                                            helperText={touched.bloodGroup && errors.bloodGroup}
                                        >
                                            <MenuItem value={""}></MenuItem>
                                            <MenuItem value={"O-ve"}>o-ve</MenuItem>
                                            <MenuItem value={"O+ve"}>O+ve</MenuItem>
                                            <MenuItem value={"A-ve"}>A-ve</MenuItem>
                                            <MenuItem value={"A+ve"}>A+ve</MenuItem>
                                            <MenuItem value={"B-ve"}>B-ve</MenuItem>
                                            <MenuItem value={"B+ve"}>B+ve</MenuItem>
                                            <MenuItem value={"AB-ve"}>AB-ve</MenuItem>
                                            <MenuItem value={"AB+ve"}>AB+ve</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        disabled={isDisabled}
                                        label="Address"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.address}
                                        name="address"
                                        error={!!touched.address && !!errors.address}
                                        helperText={touched.address && errors.address}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        disabled={isDisabled}
                                        label="Mobile Number"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.userMobile}
                                        name="userMobile"
                                        error={!!touched.userMobile && !!errors.userMobile}
                                        helperText={touched.userMobile && errors.userMobile}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        disabled={isDisabled}
                                        label="Facebook Handle"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.facebookHandle}
                                        name="facebookHandle"
                                        error={!!touched.facebookHandle && !!errors.facebookHandle}
                                        helperText={touched.facebookHandle && errors.facebookHandle}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        disabled={isDisabled}
                                        label="Instagram Handle"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.instaHandle}
                                        name="instaHandle"
                                        error={!!touched.instaHandle && !!errors.instaHandle}
                                        helperText={touched.instaHandle && errors.instaHandle}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        disabled={isDisabled}
                                        label="Linkedin Handle"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.linkedinHandle}
                                        name="linkedinHandle"
                                        error={!!touched.linkedinHandle && !!errors.linkedinHandle}
                                        helperText={touched.linkedinHandle && errors.linkedinHandle}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    {
                                        changePassword &&
                                        <>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                type="password"
                                                label="Current Password"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.oldPassword}
                                                name="oldPassword"
                                                error={!!touched.oldPassword && !!errors.oldPassword}
                                                helperText={touched.oldPassword && errors.oldPassword}
                                                sx={{ gridColumn: "span 2" }}
                                            />
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                type="password"
                                                label="New Password"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.userPassword}
                                                name="userPassword"
                                                error={!!touched.userPassword && !!errors.userPassword}
                                                helperText={touched.userPassword && errors.userPassword}
                                                sx={{ gridColumn: "span 2" }}
                                            />
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                type="password"
                                                label="Confirm New Password"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.confirmPassword}
                                                name="confirmPassword"
                                                error={!!touched.confirmPassword && !!errors.confirmPassword}
                                                helperText={touched.confirmPassword && errors.confirmPassword}
                                                sx={{ gridColumn: "span 2" }}
                                            />
                                        </>
                                    }
                                </Box>
                                {
                                    (!isDisabled || changePassword) &&
                                    <Box display="flex" justifyContent="end" m="20px">
                                        <Button type="submit" color="secondary" variant="contained">
                                            Save Changes
                                        </Button>
                                    </Box>
                                }
                            </form>
                        )}
                    </Formik>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default UserProfile
