import { Box, Button, Typography } from '@mui/material'
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import axios from "../../config/axiosConfig"
import { getSignedUrlsForClubReports } from '../../helpers/getImage'
import generateClubReportPdf from '../../helpers/generatePdf'
import toast from 'react-hot-toast'
import { pdf } from '@react-pdf/renderer'
import Loading from "../../components/Loading"

const ViewClubReports = () => {
  const [data, setData] = useState([]);
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    getClubReports();
    setLoading(false)
  }, [])

  const getClubReports = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BASE_URL + "api/admin/get-club-reports");
      setData(response.data);
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Failed to get reports");
    }
  }

  const downloadReport = async (row) => {
    // get the signed images url
    try {
      toast.loading("Plase wait...")
      const response = await getSignedUrlsForClubReports(row.photographs)
      row.photographs = response.signedUrls
      const blob = await pdf(generateClubReportPdf(row)).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${row.reportName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.dismiss()
    } catch (error) {
      toast.dismiss()
      toast.error("Some error occured, Please contact support");
    }
  }

  const columns = [
    {
      field: "id", headerName: "Report ID",
      filterable: false,
      renderCell: (e) => {
        return (<div>{e.id}</div>)
      }
    },
    {
      field: "reportName",
      headerName: "Report Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "reportType",
      headerName: "Report Type",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
        field: "avenue",
        headerName: "Avenue",
        flex: 1,
        cellClassName: "name-column--cell",
      },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "userName",
      headerName: "Uploaded by",
      type: "text",
      headerAlign: "left",
      align: "left",
      flex: 1

    },
    //change later
    {
      field: "month",
      headerName: "Month",
      flex: 1,
    },
    {
      field: "year",
      headerName: "Year",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Uploaded At",
      type: "text",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        const date = new Date(params.row.createdAt);
        return date.toLocaleDateString();
      }
    },
    {
      field: "rotractorsAttended",
      headerName: "No. of Rotaractors Attended",
      flex: 1,
    },
    {
      field: "rotariansAttended",
      headerName: "No. of Rotarians Attended",
      flex: 1,
    },
    {
      field: "beneficiaries",
      headerName: "No. of Beneficiaries",
      flex: 1,
    },
    {
      field: "visitingRotractors",
      headerName: "No. of Visiting Rotractors",
      flex: 1,
    },
    {
      field: "guests",
      headerName: "No. of Guests Visited",
      flex: 1,
    },
    {
      field: "gDriveFolder",
      headerName: "Google Drive Folder Link",
      flex: 1,
      renderCell: (params) => {
        return (<a href={params.row.gDriveFolder} target="_blank">{params.value}</a>)
      }
    },
  ];

  if(loading){
    return <Loading/>
  }

  return (
    <Box>
      <Typography px={2} variant="h2">Download Club Reports</Typography>
      <Box
        m="40px"
        height="75vh"
      >
        <DataGrid isRowSelectable={false} rows={data} columns={columns}  
        slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          />
      </Box>
    </Box>
  )
}

export default ViewClubReports