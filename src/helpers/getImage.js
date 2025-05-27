import axios from "../config/axiosConfig";
import { toast } from "react-hot-toast";
const getSignedUrlsForClubReports = async (imageNames) => {
    try {
        const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/upload/get-signedurls-club", { imageNames });
        return res.data
    } catch (error)
    {
        error.response.data ? toast.error(error.response.data.message) : toast.error("Failed to get images Try again later");
    }
}

const getSignedUrlsForCabinetReports = async (imageNames) => {
    try {
        const res = await axios.post(process.env.REACT_APP_BASE_URL + "api/upload/get-signedurls-cabinet", { imageNames });
        return res.data
    } catch (error)
    {
        error.response.data ? toast.error(error.response.data.message) : toast.error("Failed to get images Try again later");
    }
}

export { getSignedUrlsForClubReports , getSignedUrlsForCabinetReports}