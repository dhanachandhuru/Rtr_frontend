import { Box, Button, Typography } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import axios from "../../config/axiosConfig"
import { getSignedUrlsForCabinetReports } from '../../helpers/getImage'
import generateClubReportPdf from '../../helpers/generatePdf'
import toast from 'react-hot-toast'
import { pdf } from '@react-pdf/renderer'
import Loading from "../../components/Loading"

const ViewCabinetReports = () => {
  const [data, setData] = useState([]);
  const [loading,setLoading] = useState(true)
  
  useEffect(() => {
    getCabinetReports();
    setLoading(false)
  }, [])

  const getCabinetReports = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BASE_URL + "api/admin/get-cabinet-reports");
      setData(response.data);
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Failed to get reports");
    }
  }

  const downloadReport = async (row) => {
    // // get the signed images url
    // try {
    //   toast.loading("Plase wait...")
    //   const response = await getSignedUrlsForCabinetReports(row.photographs)
    //   row.photographs = response.signedUrls
    //   const blob = await pdf(generateClubReportPdf(row)).toBlob();
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = `${row.reportName}.pdf`;
    //   a.click();
    //   URL.revokeObjectURL(url);
    //   toast.dismiss()
    // } catch (error) {
    //   toast.dismiss()
    //   toast.error("Some error occured, Please contact support");
    // }
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
        field: "venue",
        headerName: "Venue",
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
      field: "hoursSpend",
      headerName: "No. of Hours Spent",
      flex: 1,
    },
    {
      field: "gDriveFolder",
      headerName: "Google Drive Folder Link",
      flex: 1,
    },
  ];

  if(loading){
    return <Loading/>
  }

  return (
    <Box>
      <Typography px={2} variant="h2">Download Cabinet Reports</Typography>
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
          loading={loading}
        />
      </Box>
    </Box>
  )
}

export default ViewCabinetReports