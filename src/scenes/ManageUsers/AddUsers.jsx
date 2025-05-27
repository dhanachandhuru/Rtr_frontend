import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import UserForm from "./UserForm";
import ClubForm from "./ClubForm";
import * as yup from "yup"

const AddMembers = ({ allClubs }) => {
  const [formType, setFormType] = useState('user-form')
  const [userType , setUserType] = useState();

  const handleFormType = (userType) => {
    if (userType == 3) {
      setFormType("club-form")
    }
    else {
      setFormType("user-form")
    }
  }
  return (
    <Box m="20px">
      <Typography variant="h3" my={3} sx={{ textAlign: "center" }} gutterBottom>
        Add Users
      </Typography>
            <Box display={"flex"} justifyContent={"center"} flexDirection={"column"}>

              <FormControl fullWidth variant="filled"
                sx={{ maxWidth:"200px", minWidth:"150px",mx:"auto"}}
                >
                <InputLabel>User Type</InputLabel>
                <Select
                  onChange={(event) => {handleFormType(event.target.value);setUserType(event.target.value)}}
                  name="userType"
                  >
                  <MenuItem value={1}>Admin</MenuItem>
                  <MenuItem value={2}>Cabinet</MenuItem>
                  <MenuItem value={3}>Club</MenuItem>
                  <MenuItem value={4} selected>Member</MenuItem>
                </Select>
              </FormControl>
              {
                formType == "user-form" ? 
                <UserForm userType={userType} allClubs={allClubs}></UserForm>
                :
                <ClubForm userType={userType} yup={yup}/>
              }
            </Box>
    </Box>
  );
};

export default AddMembers;