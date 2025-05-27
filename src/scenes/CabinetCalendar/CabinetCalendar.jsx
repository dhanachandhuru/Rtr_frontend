import { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import * as Yup from "yup"
import listPlugin from "@fullcalendar/list";
import { formatDate } from "@fullcalendar/core"
import Dialog from '@mui/material/Dialog';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import axios from "../../config/axiosConfig"
import toast from "react-hot-toast";
import { Form, Formik } from "formik";
import { Close } from "@mui/icons-material";
import {AuthContext} from "../../context/AuthContext"

const CabinetCalendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {user} = useContext(AuthContext)
  const [Events, setEvents] = useState([]);
  const [dataModified, setDatamodified] = useState(false)
  const [open, setOpen] = useState(false)
  const [statusViewOpen,setStatusViewOpen] = useState(false)
  const [currentStatusData , setCurrentStatusData] = useState({})
  const [selectedDate, setSelectedDate] = useState()
  const [currentCalendarApi, setCurrentCalendarApi] = useState(null)


  useEffect(() => {
    getAllEvents();
  }, [])

  const getHex = (status)=>{
    switch (status) {
        case 0: // pending
            return "#FFA500"
        case 1: // approved
            return "#378006"
        case 2: // rejected
            return "#b60000"
        default:
            return "#b60000"
    }
} 

const handleStatusViewClose = ()=>{
  setStatusViewOpen(false)
}

  const handleDateClick = (selected) => {
    setOpen(true)
    setSelectedDate(selected.startStr)
    setCurrentCalendarApi(selected)
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      values.eventDate = selectedDate
      if (new Date(`1970-01-01T${values.eventTimeFrom}:00Z`) > new Date(`1970-01-01T${values.eventTimeTo}:00Z`)) {
        return toast.error("Start time cannot be more than End time")
      }
      const { data } = await axios.post(process.env.REACT_APP_BASE_URL + "api/cabinet/add-event", values)
      const calendarApi = currentCalendarApi.view.calendar;
      calendarApi.unselect();
      calendarApi.addEvent({
        id: String(data.resp.id) + "," + data.table,
        title: data.resp.eventName,
        start: data.resp.eventDate,
        end: data.resp.eventDate,
        allDay: true,
      });
      const NewEvent = {
        id: String(data.resp.id) + "," + data.table,
        title: data.resp.eventName,
        start: data.resp.eventDate,
        end: data.resp.eventDate,
        allDay: true
      }
      setEvents([...Events, NewEvent])
      setOpen(false)
      toast.success("Event Added")
      resetForm()
    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast("Failed to upload")
    }
  }

  const getAllEvents = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/cabinet/get-all-events");
      setEvents(res.data.map((e) => ({
        id: String(e.id) + "," + e.table,
        title: e.eventName,
        start: e.eventDate,
        end: e.eventDate,
        color: getHex(e.isApproved)
      })))

    } catch (error) {
      error.response ? toast.error(error.response.data.message) : toast.error("Failed to fetch events")
    }
  };

  const handleEventClick = async(selected) => {
    try {
      toast.loading("loading...")
      const [id, table] = selected.event.id.split(",")
      let res
      if(table == "club"){
        res = await axios.post(process.env.REACT_APP_BASE_URL + "api/club/get-event-with-id",{
          id
        })
      }
      else{
        res = await axios.post(process.env.REACT_APP_BASE_URL + "api/cabinet/get-event-with-id",{
          id
        })
      }
      setCurrentStatusData(res.data[0])
      setStatusViewOpen(true)
      toast.dismiss()
    } catch (error) {
      toast.dismiss()
      error.response ? toast.error(error.response.data.message) : toast.error("Network Error")
    }
  };

  const handleDelete = async()=>{
    try {
      toast.loading("Loading")
      const response = window.confirm("Are you sure to delete this event?")
      if(response){
        if(currentStatusData.table == "club"){
          await axios.post(process.env.REACT_APP_BASE_URL + "api/club/delete-event",{
          id:currentStatusData.id,
          table:currentStatusData.table
        })
        }
        else{
          await axios.post(process.env.REACT_APP_BASE_URL + "api/cabinet/delete-event",{
            id:currentStatusData.id,
            table:currentStatusData.table
        })
        }
        toast.dismiss()
        handleStatusViewClose()
      }
      toast.dismiss()
      getAllEvents()
    }
    catch (error) {
      toast.dismiss()
      error ? toast.error(error.response.data.message) : toast.error("Network Error")
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const validationSchema = Yup.object().shape({
    eventName: Yup.string().required('Name is required'),
    eventDescription: Yup.string().required("short Description is required"),
    eventTimeFrom: Yup.string().required('This field is required'),
    eventTimeTo: Yup.string().required('This field is required'),
  });

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  return (
    <Box m="20px">
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
          order={{ xs: 2, md: 1 }}
          mb={{ xs: "15px", md: 0 }}
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {Events.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: event.color,
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box order={{ xs: 2, md: 1 }} ml={{ xs: 0, md: '15px' }} flex="1 1 100%">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,listMonth",
            }}
            initialView="dayGridMonth"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={Events}
          />
        </Box>
        {
          dataModified ?
            <Button>Save</Button> : ""
        }
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
            <h2>Event Details</h2>
            <Formik
              initialValues={{
                eventName: "",
                eventDate: "",
                eventTimeFrom: "",
                eventTimeTo: "",
                eventDescription: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, handleChange, values }) => (
                <Form>
                  <Box mb={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Event Name"
                      onChange={handleChange}
                      value={values.eventName}
                      name="eventName"
                      error={!!touched.eventName && !!errors.eventName}
                      helperText={touched.eventName && errors.eventName}
                    />
                  </Box>
                  <Box mb={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Short Description"
                      onChange={handleChange}
                      value={values.eventDescription}
                      name="eventDescription"
                      error={!!touched.eventDescription && !!errors.eventDescription}
                      helperText={touched.eventDescription && errors.eventDescription}
                    />
                  </Box>
                  <Box mb={2}>
                    <label htmlFor="eventTimeTo">Event Start Time (24-hr)</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="time"
                      label=""
                      onChange={handleChange}
                      value={values.eventTimeFrom}
                      defaultValue={"00:01"}
                      name="eventTimeFrom"
                      error={!!touched.eventTimeFrom && !!errors.eventTimeFrom}
                      helperText={touched.eventTimeFrom && errors.eventTimeFrom}
                    />
                  </Box>
                  <Box mb={2}>
                    <label htmlFor="eventTimeTo">Event End Time (24-hr)</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="time"
                      label=""
                      defaultValue={"23:00"}
                      onChange={handleChange}
                      value={values.eventTimeTo}
                      name="eventTimeTo"
                      error={!!touched.eventTimeTo && !!errors.eventTimeTo}
                      helperText={touched.eventTimeTo && errors.eventTimeTo}
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
          </Box>
        </Modal>
      </Box>
      {/* Dialog for status View */}
      <BootstrapDialog
        onClose={handleStatusViewClose}
        aria-labelledby="customized-dialog-title"
        open={statusViewOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 ,minWidth:"400px"}}id="customized-dialog-title">
          {currentStatusData.eventName}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleStatusViewClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close/>
        </IconButton>
        <DialogContent dividers>
        <Typography my={1} variant="h4">
            Created By: { currentStatusData.createdusername } {currentStatusData.table == "club" ? "(Club)" : ""}
          </Typography>
          {/* <Typography my={1} > */}
            
          {/* </Typography> */}
          <Typography my={1} variant="h4">
            <Typography variant="h4">
              Event status: {(currentStatusData.isApproved == 0 ? <Typography color={getHex(0)} variant="h5">Pending</Typography> :
              (currentStatusData.isApproved == 1 ? <Typography color={getHex(1)} variant="h5">Approved</Typography> : <Typography color={getHex(2)} variant="h5">Rejected</Typography>))}
            </Typography>
          </Typography>
          <Typography my={1} variant="h4">
            Event Timing (24-hr):
          </Typography>
          <Typography my={1} variant="h4">
            <Typography variant="h5">
            {"From " + currentStatusData.eventTimeFrom + " To " + currentStatusData.eventTimeTo }
            </Typography>
          </Typography>
          <Typography my={1} variant="h4">
            Event Description:
          </Typography>
          <Typography my={1} >
            { currentStatusData.eventDescription }
          </Typography>
        </DialogContent>
        <DialogActions>
          {
            currentStatusData.createduserid === user.userId ?

            <Button color="error" onClick={handleDelete}>
            Delete Event
          </Button>
          :
          ""
          }
          <Button onClick={handleStatusViewClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  );
};

export default CabinetCalendar;
