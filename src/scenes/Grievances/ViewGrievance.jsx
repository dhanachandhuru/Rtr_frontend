import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextareaAutosize,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from "../../config/axiosConfig";
import { GridExpandMoreIcon } from '@mui/x-data-grid';

const ViewGrievance = () => {
  const [grievances, setGrievances] = useState([]);
  const [responseGrievanceId, setResponseGrievanceId] = useState(null);
  const [newRes, setNewRes] = useState('');

  const getAllGrievances = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/admin/get-grievances");
      setGrievances(res.data.grievances);
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Network error");
    }
  };

  useEffect(() => {
    getAllGrievances();
  }, []);

  const handleRespondClick = (grievanceId) => {
    if (responseGrievanceId === grievanceId) {
      submitResponse(grievanceId);
    } else {
      setResponseGrievanceId(grievanceId);
      setNewRes('');  // Clear previous response
    }
  };

  const submitResponse = async (grievanceId) => {
    try {
      const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/admin/update-grievance", {
        id: grievanceId,
        response: newRes
      })
      setNewRes('');
      setResponseGrievanceId(null);
      setGrievances(grievances.filter((grievance)=>(grievance.id !== grievanceId)));
      toast.success("Response Submitted");
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Network error");
    }
  };

  return (
    <>
      <Typography variant="h2" textAlign={"center"} mt={1} mb={3}>Grievances</Typography>
      {
        grievances.length === 0 && <Typography variant="h5" textAlign={"center"} mt={1} mb={3}>No Grievances Found</Typography>
      }
      {
        grievances.map((grievance) => (
          <Accordion key={grievance.id}>
            <AccordionSummary
              expandIcon={<GridExpandMoreIcon />}
              aria-controls="panel3-content"
              id={`panel3-header-${grievance.id}`}
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                {grievance.name}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Created By: {grievance.userName} of {grievance.clubName} Club</Typography>
            </AccordionSummary>
            <AccordionDetails>
              description: &ensp; {grievance.description}
              <br></br>
              <br></br>
              {
                responseGrievanceId === grievance.id &&
                <TextareaAutosize
                  aria-label="Description"
                  rows={5}
                  placeholder='Describe your grievance response in detail'
                  value={newRes}
                  onChange={(event) => setNewRes(event.target.value)}
                  style={{
                    fontSize: "1rem",
                    width: "100%",
                    height: "calc(3 * 1.5rem)",
                  }}
                  name='description'
                />
              }
            </AccordionDetails>
            <AccordionActions>
              <Button onClick={() => handleRespondClick(grievance.id)}>
                {responseGrievanceId === grievance.id ? "Submit" : "Respond"}
              </Button>
            </AccordionActions>
          </Accordion>
        ))
      }
    </>
  );
};

export default ViewGrievance;
