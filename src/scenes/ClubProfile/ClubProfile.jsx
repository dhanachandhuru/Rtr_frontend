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

const ClubProfile = () => {
    const [isDisabled, setIsDisabled] = useState(true);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { user } = useContext(AuthContext)
    const [clubTypeHandler, setClubTypeHandler] = useState(1)
    const [clubData, setClubData] = useState([])
    const [users, setUsers] = useState([])
    const [assets, setAssets] = useState([])
    const [currentClubAssets, setCurrentClubAssets] = useState([])
    const [profileFile, setProfileFile] = useState(null);
    const [loading,setLoading] = useState(true)

    // handle loading
    const getAllAssets = async () => {
        try {
            const data = await axios.get(process.env.REACT_APP_BASE_URL + "api/club/get-assets");
            setAssets(data.data)
        }
        catch (err) {
            err.response ? toast.error(err.response.data.message) : toast.error("Fetching failed")
        }
    }
    const getClubData = async () => {
        try {
            const data = await axios.get(process.env.REACT_APP_BASE_URL + "api/club/get-club-data");
            setClubData(data.data[0])
            setClubTypeHandler(data.data[0].clubType)
            const assets = data.data[0].assets
            if (assets) {
                const assetIdString = assets.split(",").map(Number);
                setCurrentClubAssets(assetIdString)
            }
        }
        catch (error) {
            error.response ? toast.error(error.response.data.message) : toast.error("Fetching failed")
        }
    }
    const getAllUsers = async () => {
        try {
            const data = await axios.get(process.env.REACT_APP_BASE_URL + "api/club/get-all-cabinets");
            setUsers(data.data)
        }
        catch (error) {
            error.response ? toast.error(error.response.data.message) : toast.error("Fetching failed")
        }
    }
    const updateAssets = async () => {
        try {
            const value = currentClubAssets.join(",")
            const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/club/update-club-assets", { assets: value });
            toast.success("Updated Successfully")
        }
        catch (err) {
            err.response ? toast.error(err.response.data.message) : toast.error("Failed")
        }
    }

    const isAssetAvailable = (id) => {
        if (currentClubAssets.includes(id)) {
            return true
        }
        else {
            return false
        }
    }

    useEffect(() => {
        getAllAssets()
        getClubData()
        getAllUsers()
        setLoading(false)
    }, [])

    const initialValues = {
        clubName: clubData?.clubName || "",
        userEmail: clubData?.userEmail || "",
        charterId: clubData?.charterId || "",
        charterDate: clubData?.charterDate || "",
        groupId: clubData?.groupId || "",
        installationDate: clubData?.installationDate || "",
        parentRotaryName: clubData?.parentRotaryName || "",
        staffCoordinator: clubData?.staffCoordinator || "",
        staffCoordinatorNumber: clubData?.staffCoordinatorNumber || "",
        cabinetMentor: clubData?.cabinetMentor || "",
        facebookHandle: clubData?.facebookHandle || "",
        instagramHandle: clubData?.instagramHandle || "",
        linkedinHandle: clubData?.linkedinHandle || "",
        clubType: clubData?.clubType || ""
    };

    const enableEditing = () => {
        setIsDisabled(false)
    }

    // const checkoutSchema = yup.object().shape({
    //     userName: yup.string().required("Full Name is required"),
    //     yearOfRotraction: yup.number().max(100, "Input Error"),
    //     riId: yup.string().required("RI ID is required"),
    //     charterId:yup.string().required("Charter ID is required"),
    //     groupId:yup.string().required("Group is required"),
    //     parentRotaryName:yup.string().required("Enter parent rotary name"),
    //     staffCoordinator: clubTypeHandler == 1 ? yup.string().required("This field is required") : "",
    //     staffCoordinatorNumber: clubTypeHandler == 1 ? yup.string().required("This field is required") : "",
    //     facebookHandle: yup.string().required("This field is required"),
    //     instagramHandle: yup.string().required("This field is required"),
    //     linkedinHandle: yup.string().required("This field is required"),
    // });

    const handleFormSubmit = async (values) => {
        try {
            const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/club/update-club", values);
            await updateAssets()
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
            if(e.target.files[0].size > 400000){
                return toast.error("File size should be less than 400kb")
            }
            if(!e.target.files[0].type === "image/jpeg" || !e.target.files[0].type === "image/png"){
                return toast.error("File type should be jpeg or png")
            }
            setProfileFile(e.target.files[0]);
            uploadFile(e.target.files[0]);
        }
    }

    const uploadFile = async (file) => {
        try{
            toast.loading("Uploading...")
            const imageRes = await uploadProfileImageToS3(file);
            const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/club/update-club", {
                clubLogo: imageRes.imageUrl
            })
            // update the club logo
            setClubData(clubData => ({...clubData, clubLogo: imageRes.imageUrl}))
            toast.dismiss()
            toast.success("Updated Successfully")
        }
        catch(err){
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
                        <input type="file" id='profile' accept="image/*" onChange={handleProfileChange} style={{display:"none"}}/>
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
                            src={clubData.clubLogo || "https://placehold.co/600x400@2x.png"}
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
                                opacity:"80%",
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
                    <Typography variant='h3' textAlign={"center"} padding={"30px"}>Club Details <IconButton onClick={enableEditing}><Edit></Edit></IconButton></Typography>
                    {/* form */}
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        enableReinitialize={true}
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
                                        disabled={isDisabled}
                                        label="Club Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.clubName}
                                        name="clubName"
                                        error={!!touched.clubName && !!errors.clubName}
                                        helperText={touched.clubName && errors.clubName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        disabled={isDisabled}
                                        type="text"
                                        label="Email"
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
                                        disabled={isDisabled}
                                        type="text"
                                        label="Charter Id"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.charterId}
                                        name="charterId"
                                        error={!!touched.charterId && !!errors.charterId}
                                        helperText={touched.charterId && errors.charterId}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        disabled={isDisabled}
                                        type="date"
                                        label="Charter Date"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.charterDate}
                                        name="charterDate"
                                        error={!!touched.charterDate && !!errors.charterDate}
                                        helperText={touched.charterDate && errors.charterDate}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <FormControl fullWidth variant="filled"
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        <InputLabel>Group</InputLabel>
                                        <Select
                                            disabled={isDisabled}
                                            value={values.groupId}
                                            onChange={handleChange}
                                            name="groupId"
                                            error={!!touched.groupId && !!errors.groupId}
                                            helperText={touched.groupId && errors.groupId}
                                        >
                                            <MenuItem value={1}>Group 1</MenuItem>
                                            <MenuItem value={2}>Group 2</MenuItem>
                                            <MenuItem value={3}>Group 3</MenuItem>
                                            <MenuItem value={4}>Group 4</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        disabled={isDisabled}
                                        type="date"
                                        label="Installation Date"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.installationDate}
                                        name="installationDate"
                                        error={!!touched.installationDate && !!errors.installationDate}
                                        helperText={touched.installationDate && errors.installationDate}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        disabled={isDisabled}
                                        type="text"
                                        label="Parent Rotary Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.parentRotaryName}
                                        name="parentRotaryName"
                                        error={!!touched.parentRotaryName && !!errors.parentRotaryName}
                                        helperText={touched.parentRotaryName && errors.parentRotaryName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <FormControl fullWidth variant="filled"
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        <InputLabel>Club Type</InputLabel>
                                        <Select
                                            value={values.clubType}
                                            disabled={isDisabled}
                                            onChange={(e) => { handleChange(e); setClubTypeHandler(e.target.value) }}
                                            name="clubType"
                                            error={!!touched.clubType && !!errors.clubType}
                                            helperText={touched.clubType && errors.clubType}
                                        >
                                            <MenuItem value={1}>College</MenuItem>
                                            <MenuItem value={2}>Community</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {
                                        (clubTypeHandler == 1) ?
                                            <>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    disabled={isDisabled}
                                                    type="text"
                                                    label="Staff Co-ordinator"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.staffCoordinator}
                                                    name="staffCoordinator"
                                                    error={!!touched.staffCoordinator && !!errors.staffCoordinator}
                                                    helperText={touched.staffCoordinator && errors.staffCoordinator}
                                                    sx={{ gridColumn: "span 2" }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    disabled={isDisabled}
                                                    type="text"
                                                    label="Staff Co-ordinator Number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.staffCoordinatorNumber}
                                                    name="staffCoordinatorNumber"
                                                    error={!!touched.staffCoordinatorNumber && !!errors.staffCoordinatorNumber}
                                                    helperText={touched.staffCoordinatorNumber && errors.staffCoordinatorNumber}
                                                    sx={{ gridColumn: "span 2" }}
                                                />

                                            </>
                                            :
                                            ""
                                    }
                                    <FormControl fullWidth variant="filled"
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        <InputLabel>Cabinet Mentor</InputLabel>
                                        <Select
                                            value={values.cabinetMentor}
                                            disabled={isDisabled}
                                            onChange={(e) => { handleChange(e) }}
                                            name="cabinetMentor"
                                            error={!!touched.cabinetMentor && !!errors.cabinetMentor}
                                            helperText={touched.cabinetMentor && errors.cabinetMentor}
                                        >
                                            {
                                                users.map((user) =>
                                                    <MenuItem value={user.id}>{user.userName}</MenuItem>
                                                )
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        disabled={isDisabled}
                                        type="text"
                                        label="Facebook Handle Link"
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
                                        disabled={isDisabled}
                                        type="text"
                                        label="Instagram Handle Link"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.instagramHandle}
                                        name="instagramHandle"
                                        error={!!touched.instagramHandle && !!errors.instagramHandle}
                                        helperText={touched.instagramHandle && errors.instagramHandle}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        disabled={isDisabled}
                                        type="text"
                                        label="Linkedin Handle Link"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.linkedinHandle}
                                        name="linkedinHandle"
                                        error={!!touched.linkedinHandle && !!errors.linkedinHandle}
                                        helperText={touched.linkedinHandle && errors.linkedinHandle}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <Box>
                                        <FormLabel>Club Assets</FormLabel>
                                        <FormGroup row sx={{ gridColumn: "span 4" }}>
                                            {
                                                assets.map((asset) => {
                                                    return (
                                                        <FormControlLabel key={asset.id} disabled={isDisabled} control={<Checkbox value={asset.id} defaultChecked={isAssetAvailable(asset.id)} onChange={(e) => { setCurrentClubAssets(() => [...currentClubAssets, asset.id]) }} />} label={asset.assetName} />
                                                    )
                                                }
                                                )
                                            }
                                        </FormGroup>
                                    </Box>
                                </Box>
                                {
                                    !isDisabled &&
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

export default ClubProfile
