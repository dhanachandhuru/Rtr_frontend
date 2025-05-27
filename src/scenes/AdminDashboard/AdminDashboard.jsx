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
import { BarChart } from '@mui/x-charts'

const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:700px)")
  const [stats, setStats] = useState({})
  const [graphData, setGraphData] = useState([])
  const [graph2Data,setGraph2Data] = useState({})
  const [inActiveUsers, setInactiveUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [Last6Months, setLast6Months] = useState(
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

  const convertGraph2Data = (data) => {
    // Define all possible months
    const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    // Get the unique months present in the data, ordered as in allMonths
    const uniqueMonths = Array.from(new Set(data.map(item => item.month)));
    uniqueMonths.sort((a, b) => allMonths.indexOf(a) - allMonths.indexOf(b));
  
    // Initialize the data structure for each group
    const groups = [1, 2, 3, 4]; // Assuming you have these 4 groups
    const series = groups.map((g) => ({ data: new Array(uniqueMonths.length).fill(0) , label: "Group "+String(g)}));
  
    // Fill the data structure with the actual values from the input data
    data.forEach(({ groupid, month, userscount }) => {
      const groupIndex = groups.indexOf(groupid);
      const monthIdx = uniqueMonths.indexOf(month);
      if (groupIndex !== -1 && monthIdx !== -1) {
        series[groupIndex].data[monthIdx] = parseInt(userscount, 10);
      }
    });
  
    return {
      series,
      xAxis: [{ data: uniqueMonths, scaleType: 'band' }],
      height: 290,
      margin: { top: 10, bottom: 30, left: 40, right: 10 },
    };
  };
  


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

  const getAvenue = (id) => {
    if (id == 1) {
      return "Club Service"
    }
    else if (id == 2) {
      return "Professional Service"
    }
    else if (id == 3) {
      return "Community Service"
    }
    else if (id == 4) {
      return "International Service"
    }
    else if (id == 5) {
      return "District Event Participation"
    }
    else if (id == 6) {
      return "District Priorities"
    }
    else if (id == 7) {
      return "Rotary Priorities"
    }
    else if (id == 8) {
      return "Others"
    }
    else {
      return "Others"
    }
  }

  const getAllStats = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/stats/get-admin-stats");
      setStats(res.data)
      // set the graph data
      const data = transformGraphData(res.data.graphData)
      setGraphData(data)
      setInactiveUsers(res.data.inactiveusers)
      let data2 = convertGraph2Data(res.data.graphData2)
      setGraph2Data(data2)
    } catch (error)   {
      error.response ? toast.error(error.response.data.message) : toast.error("Network error")
    }
  }

  useEffect(() => {
    getAllStats();
    setLoading(false)
  }, [])


  if (loading) {
    return <Loading />
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
            title={stats.total}
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
            title={stats.active}
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
            title={(Number(stats.total) - Number(stats.active))}
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
            title={stats.reports}
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
        <Typography variant="h3" mb={0}>Reports Graph</Typography>
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
          <Typography variant="h3" mt={2} mb={0}>Membership Graph</Typography>
        <Grid
          item
          sm={12}
          md={12}
          lg={12}
          mt={1}
          backgroundColor={colors.primary[400]}
        >
        <BarChart
            series={graph2Data.series ? graph2Data.series : []}
            height={290}
            xAxis={graph2Data.xAxis}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard