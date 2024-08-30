import axios from "axios";
export const upload = async (file) => {

    try{
        console.log("Uploading file:", file);

        // musimy stworzyc formdata, bo nie da sie przeslac pliku bezposrednio do api

        const formData = new FormData();
        formData.append("file", file)
        const res = await axios.post("/upload", formData, {
            withCredentials: true,
        });
        return res.data

    } catch(err) {
        console.log(err);
    }
};