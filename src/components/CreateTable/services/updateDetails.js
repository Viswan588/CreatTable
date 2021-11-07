import axios from 'axios';


const updateDetails = (body, isNewRecord) => {
    if (!isNewRecord) {
      return  axios.post(`http://172.20.3.113:9009/api/all_tables`, [body]);
    } else {
       return axios.put(`http://172.20.3.113:9009/api/all_tables`, [body]);
    }
}

export default updateDetails;