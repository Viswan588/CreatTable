import axios from 'axios';
import {SERVER_URL} from '../../../Constants/commonUrls';


const fetchExistingTableList = () =>  {
  return axios.get(`${SERVER_URL}/api/all_tables`)
     
  }

  export default fetchExistingTableList;