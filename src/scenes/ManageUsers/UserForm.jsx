import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "../../config/axiosConfig"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext"
import toast from "react-hot-toast";

const UserForm = ({ allClubs , userType }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [boardMember, setBoardMember] = useState(0)
  const [designations,setDesignations] = useState([])
  const { user } = useContext(AuthContext)

  const getDesignations = async()=>{
    try {
      const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/admin/get-designations")
      setDesignations(res.data)
    }
    catch (err) {
      err.response ? toast.error(err.response.data.message) : toast.error("Failed to fetch the designations")
    }
  }

  useEffect(()=>{
    getDesignations()
  },[])

  const handleFormSubmit = async (values,{resetForm}) => {
    try {
      values.userId = user.userId
      values.userType = userType
      if(userType == 1 || userType == 2){
        values.isboardMember = 1
      }
      else{
        values.isboardMember = 0
      }
      await axios.post(process.env.REACT_APP_BASE_URL + "api/auth/signup", values)
      toast.success("Account Created Successfully")
      resetForm()
    }
    catch (err) {
      err.response ? toast.error(err.response.data.message) : toast.error("Failed")
    }
  };
  return (
    <Box m="20px">
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
                  label="Email*"
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
                  variant="filled"
                  type="password"
                  label="Password*"
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
                  variant="filled"
                  type="password"
                  label="Confirm Password*"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  error={!!touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="User Full Name*"
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
                  variant="filled"
                  type="text"
                  label="RI ID*"
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
                  variant="filled"
                  type="text"
                  label="Year of Rotraction*"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.yearOfRotraction}
                  name="yearOfRotraction"
                  error={!!touched.yearOfRotraction && !!errors.yearOfRotraction}
                  helperText={touched.yearOfRotraction && errors.yearOfRotraction}
                  sx={{ gridColumn: "span 2" }}
                />
                <FormControl fullWidth variant="filled"
                  sx={{ gridColumn: "span 2" }}
                >
                  <InputLabel>Club</InputLabel>
                  <Select
                    value={values.clubId}
                    onChange={(event) => { handleChange(event); }}
                    name="clubId"
                    error={!!touched.clubId && !!errors.clubId}
                    helperText={touched.clubId && errors.clubId}
                  >
                    {
                      allClubs.map((club, index) => (
                        <MenuItem key={index} value={club.id} >{club.clubName}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Mobile Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.userMobile}
                  name="userMobile"
                  error={!!touched.userMobile && !!errors.userMobile}
                  helperText={touched.userMobile && errors.userMobile}
                  sx={{ gridColumn: "span 2" }}
                />
                {
                  boardMember ?

                    <FormControl fullWidth variant="filled"
                      sx={{ gridColumn: "span 2" }}
                    >
                      <InputLabel>Designation*</InputLabel>
                      <Select
                        value={values.designation}
                        onChange={(event) => { handleChange(event) }}
                        name="designation"
                        error={!!touched.designation && !!errors.designation}
                        helperText={touched.designation && errors.designation}
                      >
                      {
                        designations.map((designation, index) => (
                          <MenuItem key={index} value={designation.id} >{designation.designation}</MenuItem>
                        ))
                      }
                      </Select>
                    </FormControl>
                    :
                    ""
                }

                <FormControl fullWidth variant="filled"
                  sx={{ gridColumn: "span 2" }}
                >
                  <InputLabel>Blood Group</InputLabel>
                  <Select
                    value={values.bloodGroup}
                    onChange={handleChange}
                    name="bloodGroup"
                    error={!!touched.bloodGroup && !!errors.bloodGroup}
                    helperText={touched.bloodGroup && errors.bloodGroup}
                  >
                    <MenuItem></MenuItem>
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
                  variant="filled"
                  type="text"
                  label="Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  name="address"
                  error={!!touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                  sx={{ gridColumn: "span 4" }}
                />
                {/* <TextField
                  fullWidth
                  variant="filled"
                  type="file"
                  label=""
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.profilePhoto}
                  name="profilePhoto"
                  error={!!touched.profilePhoto && !!errors.profilePhoto}
                  helperText={touched.profilePhoto && errors.profilePhoto}
                  sx={{ gridColumn: "span 2" }}

                /> */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
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
                  variant="filled"
                  type="text"
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
                  variant="filled"
                  type="text"
                  label="LinkedIn Handle"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.linkedinHandle}
                  name="linkedinHandle"
                  error={!!touched.linkedinHandle && !!errors.linkedinHandle}
                  helperText={touched.linkedinHandle && errors.linkedinHandle}
                  sx={{ gridColumn: "span 2" }}
                />

              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Create New User
                </Button>
              </Box>
            </form>
          )
        }}
      </Formik>
    </Box>
  );
};

const phoneReg =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  userName: yup.string().required("Full Name is required"),
  userEmail: yup.string().email("Invalid email").required("Email is required"),
  userPassword: yup.string().required("Password is required").min(8, "Atleast 8 characters required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('userPassword'), null], 'Passwords must match')
    .required("Confirm Password is required"),
  userMobile: yup
    .string().matches(phoneReg, "Phone number is not valid").min(10, "Invalid Number").max(10, "invalid Number"),
  yearOfRotraction: yup.number().max(100, "Input Error"),
  riId: yup.string().required("RI ID is required"),


});

const initialValues = {
  userName: "",
  userEmail: "",
  userPassword: "",
  confirmPassword: "",
  riId: "",
  yearOfRotraction: "",
  userMobile: "",
  designation: null,
  bloodGroup: 0,
  address: "",
  clubId: "",
  profilePhoto: "",
  instaHandle: "",
  facebookHandle: "",
  linkedinHandle: "",
};

export default UserForm;
