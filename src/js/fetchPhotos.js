import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35161064-c268f2ccb62b66b361c8e4058';

async function fetchPhotos(nameQuery, page) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: nameQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40,
  });

  return await axios
    .get(`${BASE_URL}?${searchParams}`)
    .then(response => response.data);
}

export default { fetchPhotos };
