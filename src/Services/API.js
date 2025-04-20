const API_KEY = 'c1b1b239d47cea201b39e3d0b15e982c'
const BASE_URL = 'https://api.themoviedb.org/3'

export default function fetchMoviesByKeyword(keyword, page = 1) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(keyword)}&page=${page}`

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Ошибка запроса к серверу')
      }
      return res.json()
    })
    .then((data) => ({
      movies: data.results,
      total: data.total_results,
    }))
}
