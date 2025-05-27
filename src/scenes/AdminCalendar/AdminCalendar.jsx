import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    TextareaAutosize,
    Typography
  } from '@mui/material';
  import React, { useEffect, useState } from 'react';
  import toast from 'react-hot-toast';
  import axios from "../../config/axiosConfig";
  import { GridExpandMoreIcon } from '@mui/x-data-grid';
  
  const AdminCalendar = () => {
    const [data, setData] = useState([]);
    const [responseGrievanceId, setResponseGrievanceId] = useState(null);
    const [newRes, setNewRes] = useState('');
  
    const getAllData = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/admin/get-all-event-requests");
        setData(res.data);
      } catch (error) {
        error.response ? toast.error(error.response.data.message) : toast.error("Network error");
      }
    };
  
    useEffect(() => {
      getAllData();
    }, []);
  

    const handleApprove = async (id,table) => {
      try {
        toast.loading("loading...")
        await axios.post(process.env.REACT_APP_BASE_URL + "api/admin/approve-event-requests", {
          id,
          table
        })
        getAllData()
        toast.dismiss()
        toast.success("Approved Successfully")
      } catch (error) {
        toast.dismiss()
        error.response ? toast.error(error.response.data.message) : toast.error("Network error");
      }
    }

    const handleReject = async (id,table) => {
      try {        
        toast.loading("loading...")
        await axios.post(process.env.REACT_APP_BASE_URL + "api/admin/reject-event-requests", {
        id,table
        })
        getAllData()
        toast.dismiss()
        toast.success("Rejected Successfully")
      } catch (error) {
        toast.dismiss()
        error.response ? toast.error(error.response.data.message) : toast.error("Network error");
      }
    }
  
    return (
      <Box m={2}>
        <Typography variant="h2" textAlign={"center"} mt={1} mb={3}>Event Requests</Typography>
        {
          !data.length && <Typography variant="h4" textAlign={"center"} mt={1} mb={3}>No Requests</Typography>
        }
        {
          data.map((event) => (
            <Accordion key={event.id}>
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
                aria-controls="panel3-content"
                id={`panel3-header-${event.id}`}
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  {event.eventName}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Created By: {event.creatorname} {event.table == "club" ? "(Club)" :""}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                description: &ensp; {event.eventDescription}
                <br></br>
                <br></br>
                Date: {event.eventDate}
                <br></br>
                Time (24-hr) :   From {event.eventTimeFrom} To {event.eventTimeTo}
              </AccordionDetails>
              <AccordionActions>
                <Button color='success' onClick={() => handleApprove(event.id,event.table)}>
                    Approve
                </Button>
                <Button color='error' onClick={() => handleReject(event.id,event.table)}>
                    Reject
                </Button>
              </AccordionActions>
            </Accordion>
          ))
        }
      </Box>
    );
  };
  
  export default AdminCalendar;
  