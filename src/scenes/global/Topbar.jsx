import { Box, IconButton, useTheme } from "@mui/material"
import { useContext } from "react"
import { colorModeContext } from "../../theme"
import { LightModeOutlined } from "@mui/icons-material"
import { DarkModeOutlined } from "@mui/icons-material"
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from "../../context/AuthContext"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"


const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(colorModeContext)
  const { user , logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      toast.error("logout failed. Please try again.");
    }
  };

  return (
    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} p={2} >
      {/* User type */}
      <Box sx={{cursor:"default"}} >
        {/* <h2 fontWeight={3}>{userData ?( user.userType == "3" : "Hi"+userData. ):""}</h2> */}
      </Box>
      {/* Icons */}
      <Box display={"flex"} gap={3} alignItems={"center"}>
        <IconButton onClick={()=>{colorMode.toggleColorMode()}}>
          {theme.palette.mode === "dark" ? 
          ( <LightModeOutlined titleAccess="switch to light mode"/>) :
          <DarkModeOutlined titleAccess="switch to Dark mode"/>
          }
        </IconButton>
        {
          user &&
        <IconButton onClick={handleClick}>
          <LogoutIcon titleAccess="logout"/>
        </IconButton>
        }
        
        
      </Box>
    </Box>
  )
}

export default Topbar