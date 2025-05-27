import React, { useEffect, useState } from 'react'
import { Box, Button, Link, Modal, Switch, TextField, } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Facebook, Instagram, LinkedIn } from '@mui/icons-material';
import *  as Yup from "yup"
import { Field, Form, Formik } from 'formik';
import axios from "../../config/axiosConfig"
import toast from 'react-hot-toast';


const ViewMembers = () => {
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [Data, setData] = useState([])

  // Get the users data from the 

  const fetchUserData = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/club/get-all-members");
      setData(res.data.data)
    }
    catch (err) {
      err.response ? toast.error(err.response.data.message) : toast.error("Failed to fetch the users")
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleActivate = async(status,userId)=>{
    let isActive
    if(status){
      isActive = 1
    }
    else{
      isActive = 0
    }
    try {
      await axios.post(process.env.REACT_APP_BASE_URL + "api/club/activate-user" ,{
          userId,
          isActive
      })
      if(isActive)
      {
        toast.success("User Activated")
      }
      else
      {
        toast.success("User Deactivated")
      }
      return true
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Network Error")
      return false
    }

  }

  const handleOpen = (row) => {
    setCurrentRow(row);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required('Name is required'),
    userEmail: Yup.string().email("Enter Valid Email").required("Email is required"),
    riId: Yup.string().required('RI ID is required'),
    yearOfRotraction: Yup.number().required('Years of Rotraction is required').min(0, 'Years of Rotraction must be a positive number').max(100, "Invalid input")
  });

  const columns = [
    { field: "id", headerName: "user id",
    filterable: false,
    renderCell:(e) =>{
      return (<div>{ process.env.REACT_APP_ACCOUNT_ID + "c"+ e.id}</div>)
    }
  },
    {
      field: "userName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "userEmail",
      headerName: "Email",
      type: "text",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "riId",
      headerName: "RI ID",
      flex: 1,
    },
    {
      field: "bloodGroup",
      headerName: "Blood Group",
      flex: 1,
    },
    {
      field: "userMobile",
      headerName: "Mobile Number",
      flex: 1,
    },
    {
      field: "yearOfRotraction",
      headerName: "Years of Rotraction",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "instaHandle",
      headerName: "Links",
      flex: 1,
      renderCell: ({ row: { instaHandle, linkedinHandle, facebookHandle } }) => {
        return (
          <Box
            display={"flex"}
            flexDirection={"row"}
            gap={2}
          >
            <Link href={instaHandle} target="_blank"><Instagram /></Link>
            <Link href={linkedinHandle} target="_blank"><LinkedIn /></Link>
            <Link href={facebookHandle} target="_blank"><Facebook /></Link>
          </Box>
        )
      }
    },
    {
      headerName: "Action / User Status",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box display={"flex"}
            flexDirection={"row"}
            gap={2}
          >
            <Button sx={{ marginTop: "7px" }} onClick={() => handleOpen(row)}><Edit color='primary' /></Button>
            <Switch
              color='info'
              defaultChecked={row.isActive == 1 ? true : false}
              onChange={async(e) => 
              {const result = await handleActivate(e.target.checked,row.id);
              if(!result){
                e.stopPropagation() // prevent handleActivate from being called
                e.preventDefault()  // prevent the Switch from being toggled
                e.target.click()
              }
              }}
              inputProps={{ 'aria-label': 'Activate User' }}
            />
          </Box>
        )
      }
    },
  ];

  const handleSubmit = async(values) => {
    // Implement your update logic here
    try {
      await axios.post(process.env.REACT_APP_BASE_URL + "api/club/update-member-detail",values)
      toast.success("Successfully Updated")
      handleClose();
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Network Error")
    }
  };

  return (
    <Box m="20px">
      <Box
        m="40px 0 0 0"
        height="75vh"
      >
        <DataGrid rows={Data} columns={columns}/>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="20%"
          left="45%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="background.paper"
          border="2px solid #000"
          boxShadow={24}
          p={4}
        >
          <h2>Edit Member</h2>
          {currentRow && (
            <Formik
              initialValues={{
                userId: currentRow.id,
                userName: currentRow.userName,
                userEmail: currentRow.userEmail,
                riId: currentRow.riId,
                yearOfRotraction: currentRow.yearOfRotraction,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="userName"
                      label="Name"
                      fullWidth
                      error={touched.userName && Boolean(errors.userName)}
                      helperText={touched.userName && errors.userName}
                    />
                  </Box>
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="riId"
                      label="RI ID"
                      fullWidth
                      error={touched.riId && Boolean(errors.riId)}
                      helperText={touched.riId && errors.riId}
                    />
                  </Box>
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="userEmail"
                      label="Email"
                      fullWidth
                      error={touched.userEmail && Boolean(errors.userEmail)}
                      helperText={touched.userEmail && errors.userEmail}
                    />
                  </Box>
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="yearOfRotraction"
                      label="Years of Rotraction"
                      fullWidth
                      type="number"
                      error={touched.yearOfRotraction && Boolean(errors.yearOfRotraction)}
                      helperText={touched.yearOfRotraction && errors.yearOfRotraction}
                    />
                  </Box>
                  <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" type="submit">
                      Save
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Modal>
    </Box>
  )
}

export default ViewMembers