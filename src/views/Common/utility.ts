import axios from 'axios';
import { ref } from 'vue';

// Define the structure of the returned data
interface UserData {
  id: string;
  user_name: string;
  key : string;
}

// Function to fetch the data and prepare the options for `el-select`
export function useUserOptions() {
  const userOptions = ref<{ value: string; label: string, key : string }[]>([]);

  const fetchUserOptions = async () => {
    try {
      const response = await axios.get('/user/get_user_list');  // Replace with your actual URL

      // Assume the response data is an array of users
      const users: UserData[] = response.data;

      // Map the data to format suitable for el-options
      userOptions.value = users.map((user) => ({
        value: user.id,
        label: user.user_name,
        key : user.id
      }));
    } catch (error) {
      console.error('Failed to fetch user options:', error);
    }
  };

  // Fetch user options when the function is called
  fetchUserOptions();

  return {
    userOptions
  };
}
