import React from 'react'
import { Input, Pagination, Row, Col, Spin, Alert, Tabs } from 'antd'
import debounce from 'lodash.debounce'

import { fetchMoviesByKeyword, fetchRatedMovies, createGuestSession, fetchGenres } from './Services/API'
import MovieCard from './Components/MovieCard'
import GenreContext from './Context/GenreContext'
import styles from './App.module.css'

const { Search } = Input
const { TabPane } = Tabs

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
      activeTab: 'search',
      sessionId: null,
      genres: [],
    }

    this.debouncedSearch = debounce(this.loadMovies, 500)
  }

  componentDidMount() {
    const session = localStorage.getItem('guest_session_id')

    if (session) {
      this.setState({ sessionId: session }, () => {
        this.loadGenres()
        this.loadMovies()
      })
    } else {
      createGuestSession().then((id) => {
        localStorage.setItem('guest_session_id', id)
        this.setState({ sessionId: id }, () => {
          this.loadGenres()
          this.loadMovies()
        })
      })
    }
  }

  componentWillUnmount() {
    this.debouncedSearch.cancel()
  }

  loadGenres = () => {
    fetchGenres().then((genres) => {
      this.setState({ genres })
    })
  }

  loadMovies = () => {
    const { query, currentPage, activeTab, sessionId } = this.state

    this.setState({ loading: true, error: null })

    const loadFn =
      activeTab === 'search'
        ? () => fetchMoviesByKeyword(query, currentPage)
        : () => fetchRatedMovies(sessionId, currentPage)

    loadFn()
      .then(({ movies, total }) => {
        this.setState({ movies, total, loading: false })
      })
      .catch((err) => {
        this.setState({ error: err.message, loading: false })
      })
  }

  handleSearchInput = (e) => {
    const query = e.target.value
    this.setState({ query, currentPage: 1 }, () => {
      this.debouncedSearch()
    })
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page }, () => {
      this.loadMovies()
    })
  }

  handleTabChange = (key) => {
    this.setState({ activeTab: key, query: '', currentPage: 1, movies: [] }, () => {
      this.loadMovies()
    })
  }

  renderContent(movies, loading, error, query, currentPage, total, sessionId) {
    if (error) {
      return (
        <Alert
          message="Ошибка при загрузке фильмов"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )
    }

    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Spin size="large" tip="Загрузка фильмов..." />
        </div>
      )
    }

    if (movies.length === 0 && query.trim()) {
      return <Alert message="Ничего не найдено по вашему запросу" type="info" showIcon />
    }

    return (
      <>
        <Row gutter={[24, 24]}>
          {movies.map((movie) => (
            <Col key={movie.id} xs={24} sm={24} md={12} lg={12}>
              <MovieCard movie={movie} sessionId={sessionId} />
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
    )
  }

  render() {
    const { movies, total, loading, error, query, currentPage, activeTab, sessionId, genres } = this.state

    return (
      <GenreContext.Provider value={genres}>
        <div className={styles.appContainer}>
          <Tabs activeKey={activeTab} onChange={this.handleTabChange}>
            <TabPane tab="Search" key="search">
              <Search
                placeholder="Введите название фильма"
                onChange={this.handleSearchInput}
                value={query}
                allowClear
                style={{ marginBottom: 24 }}
              />
              {this.renderContent(movies, loading, error, query, currentPage, total, sessionId)}
            </TabPane>

            <TabPane tab="Rated" key="rated">
              {this.renderContent(movies, loading, error, query, currentPage, total, sessionId)}
            </TabPane>
          </Tabs>
        </div>
      </GenreContext.Provider>
    )
  }
}

export default App
