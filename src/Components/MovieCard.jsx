import React, { useContext } from 'react'
import { Card, Tag, Rate } from 'antd'
import { format } from 'date-fns'

import truncateText from '../Utils/truncateText'
import GenreContext from '../Context/GenreContext'
import { rateMovie } from '../Services/API'
import './MovieCard.css'

function getRatingColor(vote) {
  if (vote >= 7) return '#66E900'
  if (vote >= 5) return '#E9D100'
  if (vote >= 3) return '#E97E00'
  return '#E90000'
}

function MovieCard({ movie, sessionId }) {
  const {
    id,
    title,
    overview,
    release_date: releaseDate,
    poster_path: posterPath,
    vote_average: rating,
    genre_ids: genreIds = [],
    rating: userRating,
  } = movie

  const genres = useContext(GenreContext)

  const genreTags = genreIds.map((gid) => {
    const genre = genres.find((g) => g.id === gid)
    return genre ? <Tag key={gid}>{genre.name}</Tag> : null
  })

  const onRate = (value) => {
    rateMovie(id, value * 2, sessionId).catch((e) => console.error(e))
  }

  return (
    <Card hoverable className="horizontal-card">
      <div className="card-content">
        <div className="poster">
          <img
            alt={title}
            src={
              posterPath
                ? `https://image.tmdb.org/t/p/w500${posterPath}`
                : 'https://via.placeholder.com/200x300?text=No+Image'
            }
          />
        </div>
        <div className="info">
          <div className="header">
            <h3>{title}</h3>
            <div className="rating-badge" style={{ borderColor: getRatingColor(rating) }}>
              {rating.toFixed(1)}
            </div>
          </div>
          <div className="meta">{releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : 'Дата неизвестна'}</div>
          <div className="tagContainer">{genreTags}</div>
          <p>{truncateText(overview, 180)}</p>
          <Rate allowHalf defaultValue={userRating ? userRating / 2 : 0} onChange={onRate} />
        </div>
      </div>
    </Card>
  )
}

export default MovieCard
