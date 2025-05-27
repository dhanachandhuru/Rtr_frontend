import { Box, Typography } from '@mui/material'
import React from 'react'
import UploadReportForm from './UploadReportForm'

const CabinetReporting = () => {
    return (
        <Box>
            <Typography variant="h2" textAlign={"center"}>Cabinet Reporting</Typography>
            <UploadReportForm/>
        </Box>
    )
}

export default CabinetReporting