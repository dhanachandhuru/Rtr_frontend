import toast from "react-hot-toast";
import axios from "../config/axiosConfig"

const uploadResourceToS3 = async(file) => {
    try {
        const fileExtension = "."+ file.name.split('.').pop();
        const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/upload/get-resource-upload-url",{
            params:{
                extension:fileExtension
            }
        });
        await fetch(res.data.uploadURL,{
            method:"PUT",
            headers:{
                "Content-Type":"multipart/form-data"
            },
            body: file,
        });
        const fileUrl = res.data.uploadURL.split("?")[0];
        return {fileUrl,fileName:res.data.fileName}
    } catch (error) {
        error.response.data ? toast.error(error.response.data.message) : toast.error("Failed to upload image Try again later");
    }
}

export {uploadResourceToS3}
