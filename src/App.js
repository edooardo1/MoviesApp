import React from 'react'
import { Input, Pagination, Row, Col, Spin, Alert } from 'antd'
import debounce from 'lodash.debounce'
import fetchMoviesByKeyword from './Services/API'
import MovieCard from './Components/MovieCard'
import styles from './App.module.css'

const { Search } = Input

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      total: 0,
      query: '',
      currentPage: 1,
      loading: false,
      error: null,
    }

    this.debouncedSearch = debounce(this.handleSearch, 500)
  }

  componentDidMount() {
    this.loadMovies()
  }

  componentWillUnmount() {
    this.debouncedSearch.cancel()
  }

  handleSearchInput = (e) => {
    const query = e.target.value
    this.setState({ query, currentPage: 1 }, () => {
      this.debouncedSearch()
    })
  }

  handleSearch = () => {
    this.loadMovies()
  }

  loadMovies = () => {
    const { query, currentPage } = this.state

    if (!query.trim()) {
      this.setState({ movies: [], total: 0, loading: false })
      return
    }

    this.setState({ loading: true, error: null })

    fetchMoviesByKeyword(query, currentPage)
      .then(({ movies, total }) => {
        this.setState({ movies, total, loading: false })
      })
      .catch((err) => {
        this.setState({ error: err.message, loading: false })
      })
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page }, () => {
      this.loadMovies()
    })
  }

  render() {
    const { movies, total, loading, error, query, currentPage } = this.state

    return (
      <div className={styles.appContainer}>
        <Search
          placeholder="Введите название фильма"
          onChange={this.handleSearchInput}
          value={query}
          allowClear
          style={{ marginBottom: 24 }}
        />

        {error && (
          <Alert
            message="Ошибка при загрузке фильмов"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Spin size="large" tip="Загрузка фильмов..." />
          </div>
        ) : movies.length === 0 && query.trim() ? (
          <Alert message="Ничего не найдено по вашему запросу" type="info" showIcon />
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {movies.map((movie) => (
                <Col key={movie.id} xs={24} sm={24} md={12} lg={12}>
                  <MovieCard movie={movie} />
                </Col>
              ))}
            </Row>

            {total > 20 && (
              <Pagination
                current={currentPage}
                total={total}
                pageSize={20}
                onChange={this.handlePageChange}
                style={{ marginTop: 24, textAlign: 'center' }}
              />
            )}
          </>
        )}
      </div>
    )
  }
}

export default App
