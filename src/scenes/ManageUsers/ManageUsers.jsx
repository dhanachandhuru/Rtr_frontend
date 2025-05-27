import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ThemeButton from '../../components/ThemeButton';
import AddUsers from './AddUsers';
import ViewUsers from './ViewUsers';
import axios from './../../config/axiosConfig';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [mode, setMode] = useState("view-users") // there are two modes view members and add members
  const [clubs,setClubs] =useState([]) 

  const changeMode = () => {
    if(mode == "add-members"){
      setMode("view-members")
    }
    else{
      setMode("add-members")
    }
  }

  const fetchAllClubs = async()=>{
    try{
      const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/club/get-all-clubs")
      setClubs(res.data)
    }
    catch(err){
      err.response ? toast.error(err.response.data.message) : toast.error("Failed To fetch Clubs") 
    }
  }
  
  useEffect(()=>{
    fetchAllClubs()
  },[])

  return (<>
    <Typography variant='h3' mx={2} sx={{ cursor: "default" }}>Manage Users</Typography>
    <Box display={"flex"} mt={2} mb={7} mx={15} justifyContent={"end"}>
      <ThemeButton onClick={()=>{changeMode()}}>{mode == "add-members" ? "View Members" : "Add Members"}</ThemeButton>
    </Box>
    {
      mode == "add-members"?
      <AddUsers allClubs={clubs}/> :
      <ViewUsers/>
    }
  </>
  )
}

export default ManageUsers