import { Box, Typography } from '@mui/material'
import React from 'react'
import UploadReportForm from './UploadReportForm'

const ClubReporting = () => {
  return (
    <Box>
      <Typography variant="h2" textAlign={"center"}>Club Reporting</Typography>
      <UploadReportForm/>
    </Box>
  )
}

export default ClubReporting