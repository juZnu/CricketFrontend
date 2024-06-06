import axios from "axios";

const teamnameAPI = async(teamID) => {
    try{
        const response = await axios.get(`http://localhost:8000/api/team/`,{
            headers:{
                "Team-ID": teamID
            }
        });
        return response.data;
    }catch (error) {
        console.error(`Error fetching team with ID ${teamID}:`, error);
        return null
    }
}
export default teamnameAPI ;