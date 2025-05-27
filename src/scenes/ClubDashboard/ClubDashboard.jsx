import { Box, Button, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import StatBox from '../../components/StatBox'
import { Comment, Email } from '@mui/icons-material'
import { useTheme } from '@emotion/react'
import { tokens } from '../../theme'
import Groups2Icon from '@mui/icons-material/Groups2';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SourceIcon from '@mui/icons-material/Source';
import { LineChart } from '@mui/x-charts'
import axios from "../../config/axiosConfig"
import toast from 'react-hot-toast'
import Loading from "../../components/Loading"

const ClubDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:700px)")
  const [stats,setStats] = useState({})
  const [graphData,setGraphData] = useState([])
  const [inActiveUsers,setInactiveUsers] = useState([])
  const [loading,setLoading] = useState(true)
  const [Last6Months,setLast6Months] = useState(
    () => {
      const months = [];
      const date = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        months.push(d.toLocaleString('default', { month: 'short' }));
      }
      return months;
    }
  )


  function transformGraphData(graphData) {
    // Create a dictionary to store data by report type
    const reportData = {};
  
    // Get the current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-11, so add 1
  
    // Initialize report data with zero counts for each report type
    graphData.forEach(report => {
      if (!reportData[report.avenue]) {
        reportData[report.avenue] = Array(6).fill(0);
      }
    });
  
    // Process each report
    graphData.forEach(report => {
      const avenue = report.avenue;
      const year = parseInt(report.year);
      const month = parseInt(report.month);
      const reportCount = parseInt(report.report_count);
  
      // Calculate the index in the data array (0 to 5 for the last 6 months)
      const monthDiff = (currentYear - year) * 12 + (currentMonth - month);
      if (0 <= monthDiff && monthDiff < 6) {
        reportData[avenue][5 - monthDiff] = reportCount;
      }
    });
  
    // Convert the dictionary to the desired format
    const result = Object.keys(reportData).map(avenue => ({
      data: reportData[avenue],
      label: getAvenue(avenue) 
    }));
  
    return result;
  }

  const getAvenue = (id) =>{
    if(id == 1){
      return "Club Service"
    }
    else if(id == 2)
    {
      return "Professional Service"
    }
    else if(id == 3)
    {
      return "Community Service"
    }
    else if(id == 4)
    {
      return "International Service"
    }
    else if(id == 5)
    {
      return "District Event Participation"
    }
    else if(id == 6)
    {
      return "District Priorities"
    }
    else if(id == 7)
    {
      return "Rotary Priorities"
    }
    else if(id == 8)
    {
      return "Others"
    }
    else
    {
      return "Others"
    }
  }

  const getAllStats = async() =>{
    try {
      const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/stats/get-club-stats");
      setStats(res.data)
      // set the graph data
      const data = transformGraphData(res.data.graphData)
      setGraphData(data)
      setInactiveUsers(res.data.inactiveusers)
    } catch (error) {
      error.response ? toast.error(error.response.data.message)  : toast.error("Network error")
    }
  }

  useEffect(()=>
  {
    getAllStats();
    setLoading(false)
  },[])


  if(loading){
    return <Loading/>
}

  return (
    <Box m={"20px"}>
      <Grid
        container
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          
        </Grid>
        {/* ROW 1 */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          lg={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={stats.totalMembers}
            subtitle="Total Members"
            progress="0.75"
            increase="+14%"
            icon={
              <Groups2Icon
              />
            }
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          lg={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={stats.activeMembers}
            subtitle="Active Members"
            progress="0.50"
            increase="+21%"
            icon={
              <VerifiedUserIcon
              />
            }
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          lg={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={stats.inactiveMembers}
            subtitle="Inactive Members"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonOffIcon
              />
            }
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          lg={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={stats.totalProjects}
            subtitle="Total Projects"
            progress="0.80"
            increase="+43%"
            icon={
              <SourceIcon
              />
            }
          />
        </Grid>

      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={3}
        lg={3}
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={"25px"}
      >
      </Grid>
      <Grid
        container
      >
        <Grid
          item
          sm={12}
          md={12}
          lg={12}
          mt={1}
        >
          <Box
            display={"flex"}
            alignItems={"start"}
            justifyContent={"space-between"}
            width={"95%"}
          >
            <Box
              backgroundColor={colors.primary[400]}

            >
              <LineChart
                xAxis={[{
                  scaleType: "point",
                  data: Last6Months
                }]}
                series={graphData}
                
                width={window.innerWidth - 320}
                height={500}
              />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          backgroundColor={colors.primary[400]}
          sm={12}
          md={12}
          lg={12}
          mt={1}
          minHeight={"500px"}
        >
          <Box>
            <Typography variant='h4' textAlign={"center"} mt={2} >Unverified Members</Typography>
          </Box>
          {
            inActiveUsers.length === 0 ? <Typography variant='h6' textAlign={"center"} mt={2}>No Unverified Members</Typography>:

            inActiveUsers.map((user,i)=>(
          <Box
            key={i}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Box>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
              >
                Name: {user.userName}
              </Typography>
              {/* <Typography color={colors.grey[100]}>
                Club : {user.clubName}
              </Typography> */}
            </Box>
            <Box color={colors.grey[100]} maxWidth={"400px"} overflow={"clip"}>{user.userEmail}</Box>
            {/* <Button
              color={"info"}
              p="5px 10px"
              borderRadius="4px"
              disabled
            >
              Send Notification
            </Button> */}
          </Box>
            ))
          }
        </Grid>
      </Grid>
    </Box>
  )
}

export default ClubDashboard