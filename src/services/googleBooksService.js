import axios from 'axios';

const GOOGLE_API = 'https://www.googleapis.com/books/v1';

export async function searchBooks(query, startIndex = 0, maxResults = 20) {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const params = new URLSearchParams({
    q: query,
    startIndex,
    maxResults,
  });

  if (apiKey) {
    params.set('key', apiKey);
  }

  const url = `${GOOGLE_API}/volumes?${params.toString()}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getBookDetails(googleId) {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const params = new URLSearchParams();
  if (apiKey) {
    params.set('key', apiKey);
  }

  const suffix = params.toString() ? `?${params.toString()}` : '';
  const url = `${GOOGLE_API}/volumes/${googleId}${suffix}`;

  const { data } = await axios.get(url);
  return data;
}


