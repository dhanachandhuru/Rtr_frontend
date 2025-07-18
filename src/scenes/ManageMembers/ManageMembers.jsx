import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ThemeButton from '../../components/ThemeButton';
import AddMembers from './AddMembers';
import ViewMembers from './ViewMembers';
import Loading from '../../components/Loading';
import AddMembersFromClub from './AddMembersFromClub';

const ManageMembers = () => {
  const [mode, setMode] = useState("view-members") // there are two modes view members and add members
  const [loading,setLoading] = useState(true)
  const changeMode = () => {
    if(mode == "add-members"){
      setMode("view-members")
    }
    else{
      setMode("add-members")
    }
  }
  useEffect(()=>{
    setLoading(false)
  },[])
  if(loading){
    return <Loading/>
}
  return (<>
    <Typography variant='h3' mx={2} sx={{ cursor: "default" }}>Manage Members</Typography>
    <Box display={"flex"} mt={2} mb={7} mx={15} justifyContent={"end"}>
      <ThemeButton onClick={()=>{changeMode()}}>{mode == "add-members" ? "View Members" : "Add Members"}</ThemeButton>
    </Box>
    {
      mode == "add-members"?
      <AddMembersFromClub/> :
      <ViewMembers/>
    }
  </>
  )
}

export default ManageMembers