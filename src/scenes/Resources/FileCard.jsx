import React from 'react'
import { Box, Button, Card, CardActions, CardContent, CardMedia,Typography } from '@mui/material'

const FileCard = ({data}) => {
    const covers = {
        ".pdf":process.env.REACT_APP_PUBLIC_URL + '/assets/pdf_logo.jpg',
        ".xls":process.env.REACT_APP_PUBLIC_URL + '/assets/excel_logo.jpg',
        ".xlsx":process.env.REACT_APP_PUBLIC_URL + '/assets/excel_logo.jpg',
        ".xlsb":process.env.REACT_APP_PUBLIC_URL + '/assets/excel_logo.jpg',
        ".doc":process.env.REACT_APP_PUBLIC_URL + '/assets/doc_logo.jpg',
        ".docx":process.env.REACT_APP_PUBLIC_URL + '/assets/docx_logo.png',
        "other":process.env.REACT_APP_PUBLIC_URL + '/assets/other_logo.jpg',
    }
    const fileExtension = "."+ data.filelink.split('.').pop();
  return (
    <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    component="img"
                    alt="COVER IMAGE"
                    height="140"
                    image={covers[fileExtension] ? covers[fileExtension] : covers["other"]}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {data.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="medium" onClick={()=>{
                         const a = document.createElement('a');
                         a.href = data.filelink;
                         a.download = data.name;
                         document.body.appendChild(a);
                         a.click();
                         document.body.removeChild(a);
                    }}>Download</Button>

                </CardActions>
            </Card>
  )
}

export default FileCard