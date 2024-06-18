import axios from 'axios';

export async function fetchQRCodeImage(uuid: string, imageType: string): Promise<string> {
    try {
      const response = await axios.get(`/teg_application/get_qr_image/${uuid}/${imageType}`, {
        responseType: 'blob'
      });      

      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Error fetching QR code image:', error);
      return '';
    }
  }