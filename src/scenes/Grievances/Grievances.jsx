import { Box } from '@mui/material'
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import ViewGrievance from './ViewGrievance'
import CreateGrievance from './CreateGrievance'

const Grievances = () => {
    const { user } = useContext(AuthContext)
  return (
    <Box p={4}>
        {
            user.userType == 1 ?
            <ViewGrievance/> :
            <CreateGrievance/>
        }
    </Box>
  )
}

export default Grievances