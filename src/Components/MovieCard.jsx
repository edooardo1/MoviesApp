import React from 'react'
import { Card, Tag } from 'antd'
import { format } from 'date-fns'

import truncateText from '../Utils/truncateText'

import './MovieCard.css'

function MovieCard({ movie }) {
  const { title, overview, release_date: releaseDate, poster_path: posterPath } = movie

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
          <h3>{title}</h3>
          <div className="meta">{releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : 'Дата неизвестна'}</div>
          <div className="tagContainer">
            <Tag>Action</Tag>
            <Tag>Drama</Tag>
          </div>
          <p>{truncateText(overview, 180)}</p>
        </div>
      </div>
    </Card>
  )
}

export default MovieCard
