import { Delete, Edit } from '@mui/icons-material';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from "../../config/axiosConfig"
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const DesignationComp = ({ data, users, designations, setDesignations }) => {
  const [disabled, setDisabled] = useState(true);
  const [designationName, setDesignationName] = useState(data.designationName);
  const [member, setMember] = useState(data.userid);

  const handleSave = async () => {
    try {
      if( !data.id || !designationName || !member){
        toast.error("Fields cannot be empty")
        return
      }
      const response = await axios.post(process.env.REACT_APP_BASE_URL + "api/club/edit-designation",
        { designationId: data.id, designationName: designationName, member: member }
      )
      if (response.status == 201) {
        toast.success("Designation edited successfully")
        const updatedDesignations = designations.map(d =>
          d.id === data.id ? { ...d, designation: designationName, userId: member } : d
        );
        setDesignations(updatedDesignations);
        setDisabled(true);
      }
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Failed to edit designation");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/club/delete-designation", { clubDesignationsId: data.id })
      const updatedDesignations = designations.filter(({ id }) => id !== data.id);
      setDesignations(updatedDesignations);
      toast.success("Designation deleted successfully");
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Failed to delete designation");
    }
  };

  return (
    <Box border={1} p={2} borderColor="grey" borderRadius={2} display="flex" gap={3} flexDirection="row" alignItems="center" justifyContent="center">
      <TextField
        disabled={disabled}
        onChange={(e) => setDesignationName(e.target.value)}
        value={designationName}
        placeholder='Designation Name'
      />
      <FormControl variant="filled" sx={{ width: 150 }}>
        <InputLabel>Assign Member</InputLabel>
        <Select
          value={member}
          onChange={(e) => setMember(e.target.value)}
          disabled={disabled}
        >
          {users && users.map((user, index) => (
            <MenuItem key={index} value={user.id}>{user.userName}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={() => setDisabled(false)}>
        <Edit />
      </Button>
      <Button onClick={()=>{
        if(window.confirm("Are you sure to delete the designation?")) handleDelete();
      }}>
        <Delete color="error" />
      </Button>
      {!disabled && (
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      )}
    </Box>
  );
};

export default DesignationComp;
