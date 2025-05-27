import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, InputLabel, Link, MenuItem, Modal, Select, TextField, } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete, Edit, Facebook, Instagram, LinkedIn, Try } from '@mui/icons-material';
import *  as Yup from "yup"
import { Field, Form, Formik } from 'formik';
import axios from "../../config/axiosConfig"
import toast from 'react-hot-toast';


const ViewUsers = () => {
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [designations, setDesignations] = useState([])
  const [Data, setData] = useState([])

  // Get the users data from the table
  const fetchUserData = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/admin/get-all-users");
      setData(res.data)
    }
    catch (err) {
      err.response ? toast.error(err.response.data.message) : toast.error("Failed to fetch the users")
    }
  }

  // get the designations data
  const getDesignations = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/admin/get-designations")
      setDesignations(res.data)
    }
    catch (err) {
      err.response ? toast.error(err.response.data.message) : toast.error("Failed to fetch the designations")
    }
  }

  useEffect(() => {
    fetchUserData()
    getDesignations()
  }, [])

  const handleDelete = async(userId)=>{
    try {
      if (window.confirm("Are you sure to delete this user?")) {
        try {
          await axios.post(
            `${process.env.REACT_APP_BASE_URL}api/admin/delete-user`,
            { userId }
          );
          toast.success("Deleted Successfully");
          setData(Data.filter(user => user.id !== userId))
        } catch (error) {
          toast.error("Failed to delete user");
        }
      }
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Failed")
    }
  }

  const handleOpen = (row) => {
    setCurrentRow(row);
    console.log(row)
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
    {
      field: "id", headerName: "User Id",
      filterable: false,
      renderCell: (e) => {
        return (<div>{process.env.REACT_APP_ACCOUNT_ID + "" + e.row.id}</div>)
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
      field: "designation",
      headerName: "Designation",
      flex: 1
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
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box display={"flex"}
            flexDirection={"row"}
            gap={2}
          >
            <Button sx={{ marginTop: "7px" }} onClick={() => handleOpen(row)}><Edit color='primary' /></Button>
            <Button sx={{ marginTop: "7px" }} onClick={() => handleDelete(row.id)}><Delete color='error' /></Button>
          </Box>
        )
      }
    },
  ];

  const handleSubmit = async(values,{resetForm}) => {
    // Implement your update logic here
    try {
      values.userId = currentRow.id
      await axios.post(process.env.REACT_APP_BASE_URL + "api/admin/update-user", values);
      const matchingDesignation = designations.find((e) => e.id === values.designation);
      const newDesignation = matchingDesignation ? matchingDesignation.designation : undefined;
      setData(Data.map((item) => item.id === currentRow.id ? { ...item, userEmail:values.userEmail,userName:values.userName,riId:values.riId,yearOfRotraction:values.yearOfRotraction,designation:newDesignation,designationid:values.designation } : item))
      toast.success("Updated Successfully")
      handleClose();
      resetForm();
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Failed")
    }
  };

  return (
    <Box m="20px">
      <Box
        m="40px 0 0 0"
        height="75vh"
      >
        <DataGrid rows={Data} columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
        />
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
                userName: currentRow.userName,
                userEmail: currentRow.userEmail,
                riId: currentRow.riId,
                designation: currentRow.designationid,
                yearOfRotraction: currentRow.yearOfRotraction,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, handleChange }) => (
                <Form>
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="userName"
                      label="Name"
                      value={values.userName}
                      handleChange={handleChange}
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
                      value={values.riId}
                      handleChange={handleChange}
                      fullWidth
                      error={touched.riId && Boolean(errors.riId)}
                      helperText={touched.riId && errors.riId}
                    />
                  </Box>
                  {
                    currentRow.isBoardMember ? (
                      <Box mb={2}>
                    <FormControl fullWidth variant='outlined'
                      sx={{ gridColumn: "span 2" }}
                    >
                      <InputLabel>Designation</InputLabel>
                      <Select
                        value={values.designation}
                        onChange={handleChange}
                        name="designation"
                        error={!!touched.designation && !!errors.designation}
                        helperText={touched.designation && errors.designation}
                      >
                        {
                          designations.map((designation) => {
                            return (
                              <MenuItem key={designation.id} selected={values.designation == designation.id ? true : false} value={designation.id}>{designation.designation}</MenuItem>
                            )
                          }
                          )
                        }
                      </Select>
                    </FormControl>
                  </Box>
                    ) :""
                  }
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="userEmail"
                      label="Email"
                      handleChange={handleChange}
                      fullWidth
                      value={values.userEmail}
                      error={touched.userEmail && Boolean(errors.userEmail)}
                      helperText={touched.userEmail && errors.userEmail}
                    />
                  </Box>
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="yearOfRotraction"
                      label="Years of Rotraction"
                      value={values.yearOfRotraction}
                      handleChange={handleChange}
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

export default ViewUsers