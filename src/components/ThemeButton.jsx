import { useTheme } from "@emotion/react"
import { Button } from "@mui/material"
import { tokens } from "../theme"

const ThemeButton = ({children,...props}) => {
    const theme = useTheme()
    const colors =tokens(theme.palette.mode)
  return (
    <Button
    {...props}
    variant="contained"
    color="primary"
    sx={{
      backgroundColor: theme.palette.mode === "dark" ? "#141b2d" : colors.grey[900],
      color: colors.grey[100],
      '&:hover': {
        backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : colors.grey[700] ,
      },
      padding: "10px 20px",
      borderRadius: "8px",
      fontWeight: "bold",
    }}
  >{children}</Button>
  )
}

export default ThemeButton