import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material";

// color tokens 

export const tokens = (mode) => ({
    ...(mode === "dark"
      ? {
          grey: {
            100: "#f5f5f5",
            200: "#e0e0e0",
            300: "#c2c2c2",
            400: "#a3a3a3",
            500: "#666666",
            600: "#525252",
            700: "#3d3d3d",
            800: "#292929",
            900: "#141414",
          },
          primary: {
            900: "#d0d1d5",
            800: "#a1a4ab",
            700: "#727681",
            600: "#434957",
            500: "#1f2937",
            400: "#141b2d",
            300: "#101624",
            200: "#0c101b",
            100: "#080b12",
          },
          greenAccent: {
            100: "#e0f7f5",
            200: "#b7e9e5",
            300: "#8edbd5",
            400: "#65cfc5",
            500: "#3dc3b5",
            600: "#2e9a8e",
            700: "#207168",
            800: "#124842",
            900: "#06201c",
          },
          redAccent: {
            100: "#f9e0e0",
            200: "#f3bcbc",
            300: "#ec9999",
            400: "#e67575",
            500: "#df5252",
            600: "#b94242",
            700: "#932f2f",
            800: "#6c1f1f",
            900: "#471010",
          },
          blue: {
            100: "#e3f2fd",
            200: "#bbdefb",
            300: "#90caf9",
            400: "#64b5f6",
            500: "#42a5f5",
            600: "#2196f3",
            700: "#1e88e5",
            800: "#1976d2",
            900: "#1565c0",
          },
        }
      : {
          grey: {
            100: "#141414",
            200: "#292929",
            300: "#3d3d3d",
            400: "#525252",
            500: "#666666",
            600: "#858585",
            700: "#a3a3a3",
            800: "#c2c2c2",
            900: "#e0e0e0",
          },
          primary: {
            100: "#040509",
            200: "#080b12",
            300: "#0c101b",
            400: "#f2f0f0",
            500: "#141b2d",
            600: "#434957",
            700: "#727681",
            800: "#a1a4ab",
            900: "#d0d1d5",
          },
          greenAccent: {
            100: "#e0f7f5",
            200: "#b7e9e5",
            300: "#8edbd5",
            400: "#65cfc5",
            500: "#3dc3b5",
            600: "#2e9a8e",
            700: "#207168",
            800: "#124842",
            900: "#06201c",
          },
          redAccent: {
            100: "#f9e0e0",
            200: "#f3bcbc",
            300: "#ec9999",
            400: "#e67575",
            500: "#df5252",
            600: "#b94242",
            700: "#932f2f",
            800: "#6c1f1f",
            900: "#471010",
          },
          blue: {
            100: "#e3f2fd",
            200: "#bbdefb",
            300: "#90caf9",
            400: "#64b5f6",
            500: "#42a5f5",
            600: "#2196f3",
            700: "#1e88e5",
            800: "#1976d2",
            900: "#1565c0",
          },
        })
  });
  

// theme settings

export const themeSettings = (mode) =>{
    const colors = tokens(mode);

    return {
        palette:{
            mode,
            ...( mode === "dark"
            ? {
                primary : {
                    main : colors.primary[900],
                },
                secondary: {
                    main : colors.greenAccent[500]
                },
                neutral:{
                    dark:colors.grey[700],
                    main:colors.grey[500],
                    light:colors.grey[100]
                },
                backgroud : {
                    default:colors.primary[500]
                }
            } :
            {
                primary : {
                    main : colors.primary[100],
                },
                secondary: {
                    main : colors.greenAccent[500]
                },
                neutral:{
                    dark:colors.grey[700],
                    main:colors.grey[500],
                    light:colors.grey[100]
                },
                backgroud : {
                    default:"#fcfcfc"
                }
            } 
            )
        },
        typography:{
            fontFamily:["Inter","sans-serif"].join(","),
            fontSize:12,
            h1:{
                fontFamily:["Inter","sans-serif"].join(","),
                fontSize:40
            },
            h2:{
                fontFamily:["Inter","sans-serif"].join(","),
                fontSize:32
            },
            h3:{
                fontFamily:["Inter","sans-serif"].join(","),
                fontSize:24
            },
            h4:{
                fontFamily:["Inter","sans-serif"].join(","),
                fontSize:20
            },
            h5:{
                fontFamily:["Inter","sans-serif"].join(","),
                fontSize:16
            },
            h6:{
                fontFamily:["Inter","sans-serif"].join(","),
                fontSize:14
            },
        }
    }
}

// context for color mode

export const colorModeContext = createContext({
    toggleColorMode: () => {}
})

export const useMode = () => {
    const [ mode , setMode ] = useState("dark");

    const colorMode = useMemo(
        ()=> ({
            toggleColorMode:() =>setMode((prev)=>(prev === "light" ? "dark" : "light"))
        }),
        []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)),[mode])

    return [theme,colorMode]
}