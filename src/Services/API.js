const API_KEY = 'c1b1b239d47cea201b39e3d0b15e982c'
const BASE_URL = 'https://api.themoviedb.org/3'

export default function fetchMoviesByKeyword(keyword) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(keyword)}`

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Ошибка запроса к серверу')
      }
      return res.json()
    })
    .then((data) => data.results)
}
