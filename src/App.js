import React from 'react'
import { Row, Col } from 'antd'

import fetchMoviesByKeyword from './Services/API'
import MovieCard from './Components/MovieCard'
import styles from './App.module.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
    }
  }

  componentDidMount() {
    fetchMoviesByKeyword('return').then((movies) => {
      this.setState({ movies })
    })
  }

  render() {
    const { movies } = this.state

    return (
      <div className={styles.appContainer}>
        <Row gutter={[24, 24]}>
          {movies.map((movie) => (
            <Col key={movie.id} xs={24} sm={24} md={12} lg={12}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}

export default App
