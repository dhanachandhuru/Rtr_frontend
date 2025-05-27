import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Topbar from '../global/Topbar';
import { AuthContext } from "../../context/AuthContext"
import toast from 'react-hot-toast';
import { redirect, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateInputs(email, password) {
  if (!email || !password) {
    toast.error("Email and password are required");
    return false;
  }
  if (!isValidEmail(email)) {
    toast.error("Enter a valid email");
    return false;
  }
  if (password.length < 8) {
    toast.error("Password should be at least 8 characters long");
    return false;
  }
  return true;
}

export default function Login({ user }) {

  useEffect(() => {
    if (user) {
      redirect("/")
    }
  }, [])

  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (values,{resetFrom}) => {
    if (!validateInputs(values.userEmail, values.userPassword)) {
      return;
    }

    try {
      toast.loading("Signing in...")
      const response = await login(values.userEmail, values.userPassword);
      if(response.userType == 1){
        navigate("/admin-dashboard");
        toast.dismiss();
      }
      else if(response.userType == 3)
      {
        navigate("/club-dashboard");
        toast.dismiss();
      }
      else if(response.userType == 2){
        navigate("/cabinet-dashboard");
        toast.dismiss();
      }
      else if(response.userType == 4)
      {
        navigate("/user-profile")
        toast.dismiss();
      }
      else
      {
        navigate("/")
        toast.dismiss();
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Login failed. Please try again.");
    }
  };


  return (
    <Container component="main" maxWidth="xs">
      <Topbar />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={process.env.PUBLIC_URL + '/assets/logo.png'} alt="" srcset="" width={300} />
        <Typography component="h1" variant="h3">
          Sign in
        </Typography>
        <Box noValidate sx={{ mt: 1 }}>
          {/* <TextField
              margin="normal"
              required
              fullWidth
              onChange = {(e)=>{setUserEmail(e.target.value)}}
              label="Email Address"
              name="userEmail"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              onChange = {(e)=>{setUserPassword(e.target.value)}}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            /> */}
          <Formik
            onSubmit={handleSubmit}
            initialValues={{userEmail:"",userPassword:""}}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Box
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Email*"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.userEmail}
                      name="userEmail"
                      error={!!touched.userEmail && !!errors.userEmail}
                      helperText={touched.userEmail && errors.userEmail}
                      sx={{marginBottom:"10px"}}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="password"
                      label="Password*"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.userPassword}
                      name="userPassword"
                      error={!!touched.userPassword && !!errors.userPassword}
                      helperText={touched.userPassword && errors.userPassword}
                    />
                  </Box>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </form>
              )
            }}
          </Formik>
          {/* <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign In
            </Button> */}
          {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
        </Box>
      </Box>
    </Container>
  );
}