const API_KEY = 'c1b1b239d47cea201b39e3d0b15e982c'
const BASE_URL = 'https://api.themoviedb.org/3'

export function fetchMoviesByKeyword(query, page = 1) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`

  return fetch(url)
    .then((res) => res.json())
    .then((data) => ({
      movies: data.results,
      total: data.total_results,
    }))
}

export function fetchRatedMovies(sessionId, page = 1) {
  const url = `${BASE_URL}/guest_session/${sessionId}/rated/movies?api_key=${API_KEY}&page=${page}`

  return fetch(url)
    .then((res) => res.json())
    .then((data) => ({
      movies: data.results,
      total: data.total_results,
    }))
}

export function fetchGenres() {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.genres)
}

export function rateMovie(movieId, value, sessionId) {
  const url = `${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${sessionId}`

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ value }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Ошибка при голосовании')
    }
    return res.json()
  })
}

export function createGuestSession() {
  const url = `${BASE_URL}/authentication/guest_session/new?api_key=${API_KEY}`

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.guest_session_id)
}
