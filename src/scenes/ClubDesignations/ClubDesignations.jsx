import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DesignationComp from './DesignationComp';
import toast from 'react-hot-toast';
import axios from '../../config/axiosConfig';
import { uploadProfileImageToS3 } from '../../helpers/imageUpload';

const ClubDesignations = () => {
  const [designations, setDesignations] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newDesignation, setNewDesignation] = useState({ designation: "", member: ""});
  // const [sample,setSample] = useState(null);

  useEffect(() => {
    fetchDesignations();
    fetchUsers();
  }, [newDesignation]);

  const fetchDesignations = async () => {
    try {
      const { data } = await axios.get(process.env.REACT_APP_BASE_URL + "api/club/get-all-designations");
      setDesignations(data);
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Failed to fetch designations");
    }
  };
  // const handleOpen1 = async() => {
  //   if(!sample) {
  //     return toast.error("select atleast one image")
  //   }
  //   const res = await uploadProfileImageToS3(sample)
  //   console.log(res)
  // }

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(process.env.REACT_APP_BASE_URL + "api/club/get-all-members");
      setUsers(data.data);
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Failed to fetch users");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddDesignation = async () => {
    try {
      if(newDesignation.designation == "" || newDesignation.member == ""){
        toast.error("All fields are required");
        return;
      }
      const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/club/create-designation", {designationName:newDesignation.designation,member:newDesignation.member});
      const newData = {designationName:res.designationName, userid:res.member, id: res.id}
      handleClose();
      toast.success("Designation created successfully");
      setDesignations([...designations, newData]);
      setNewDesignation({ designation: '', userName: '', id: null });
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Failed to create designation");
    }
  };

  return (
    <Box>
      <Typography variant="h3" my={3} sx={{ textAlign: "center" }} gutterBottom>
        Manage Designations
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="20px">
      {/* <TextField
                variant="filled"
                type="file"
                accept="image/*"
                onChange={(e) => setSample(e.target.files[0])}
      /> */}
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Designation
        </Button>
        {designations.map((designation) => (
          <DesignationComp
            key={designation.id}
            data={designation}
            users={users}
            setDesignations={setDesignations}
            designations={designations}
          />
        ))}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Designation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Designation"
            placeholder='Enter Designation'
            type="text"
            fullWidth
            value={newDesignation.designation}
            onChange={(e) => setNewDesignation({...newDesignation,designation: e.target.value })}
          />
          <FormControl variant="filled" sx={{ width: 150, mt: 2 }}>
            <InputLabel>Assign Member</InputLabel>
            <Select
            onChange={(e) => setNewDesignation({...newDesignation,member: e.target.value })}
            >
                <MenuItem value=""></MenuItem>
              {users && users.map((user, index) => (
                <MenuItem key={index} value={user.id}>{user.userName}</MenuItem>
              ))
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddDesignation} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClubDesignations;
