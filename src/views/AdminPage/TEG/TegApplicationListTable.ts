import axios from 'axios';

export async function logSearchQuery(searchQuery: string, status: string) {
    try {
      const response = await axios.post('/teg_application/update_status', {
        uuid: searchQuery,
        status: status
      });
      
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }
  }
  