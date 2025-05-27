import toast from "react-hot-toast";
import axios from "../config/axiosConfig";
// helper function to upload image to the s3 bucket
// bucketName : type STRING
// image : type Array
// return : type STRING
const uploadProfileImageToS3 = async(image) => {
    try {
        const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/upload/get-url");
        await fetch(res.data.uploadURL,{
            method:"PUT",
            headers:{
                "Content-Type":"multipart/form-data"
            },
            body: image,
        });
        const imageUrl = res.data.uploadURL.split("?")[0];
        return {imageUrl,imageName:res.data.imageName}
    } catch (error) {
        error.response.data ? toast.error(error.response.data.message) : toast.error("Failed to upload image Try again later");
    }
}

const uploadClubReportImageToS3 = async(image) => {
    try {
        const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/upload/club-report-url-get");
        await fetch(res.data.uploadURL,{
            method:"PUT",
            headers:{
                "Content-Type":"multipart/form-data"
            },
            body: image,
        });
        return {imageName:res.data.imageName}
    } catch (error) {
        error.response.data ? toast.error(error.response.data.message) : toast.error("Failed to upload image Try again later");
    }
}

const uploadCabinetReportImageToS3 = async(image) => {
    try {
        const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/upload/cabinet-report-url-get");
        await fetch(res.data.uploadURL,{
            method:"PUT",
            headers:{
                "Content-Type":"multipart/form-data"
            },
            body: image,
        });
        return {imageName:res.data.imageName}
    } catch (error) {
        error.response.data ? toast.error(error.response.data.message) : toast.error("Failed to upload image Try again later");
    }
}
export {uploadProfileImageToS3,uploadClubReportImageToS3,uploadCabinetReportImageToS3}