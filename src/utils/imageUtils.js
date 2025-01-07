import axios from 'axios';

export async function fetchImageUrl(imageId) {
    try {
      const response = await axios.get(
        `http://localhost:8080/records/images/${imageId}`,
        { responseType: 'blob' }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  }