const express = require('express')
const app = express()
const port = 6000

// Dummy book data
const books = [
  {
    isbn: '1234567890',
    title: 'Book 1',
    author: 'Author 1',
    reviews: ['Great book!', 'Highly recommended']
  },
  {
    isbn: '0987654321',
    title: 'Book 2',
    author: 'Author 2',
    reviews: ['Enjoyed it!', 'Interesting plot']
  },
  {
    isbn: '2345678901',
    title: 'Book 3',
    author: 'Author 1',
    reviews: ["Couldn't put it down!", 'Amazing']
  }
]

const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' }
]

// Route to get all books
app.get('/books', (req, res) => {
  res.json(books)
})

app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const book = books.filter(book => book.isbn === isbn)

  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

app.get('/books/:author', (req, res) => {
  const author = req.params.author
  const authorBooks = books.filter(book => book.author === author)
  res.json(authorBooks)
})

app.get('/books/title/:title', (req, res) => {
  const title = req.params.title
  const titleBooks = books.filter(book => book.title === title)

  if (titleBooks.length > 0) {
    res.json(titleBooks)
  } else {
    res.status(404).json({ error: 'Books not found with the specified title' })
  }
})

app.get('/books/reviews/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const book = books.filter(book => book.isbn === isbn)

  if (book) {
    res.json({ reviews: book.reviews })
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

app.post('/register', (req, res) => {
  const { username, email, password } = req.body

  // Check if the username or email is already registered
  if (users.some(user => user.username === username || user.email === email)) {
    return res
      .status(409)
      .json({ error: 'Username or email already registered' })
  }

  // Create a new user object
  const newUser = { username, email, password }
  users.push(newUser)

  res
    .status(201)
    .json({ message: 'User registered successfully', user: newUser })
})

app.post('/login', (req, res) => {
  const { username, password } = req.body

  // Check if the user exists
  const user = users.find(
    u => u.username === username && u.password === password
  )

  if (user) {
    res.json({ message: 'Login successful', user })
  } else {
    res.status(401).json({ error: 'Invalid username or password' })
  }
})

app.post('/books/reviewsdd/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const review = req.body.review

  const book = books.find(book => book.isbn === isbn)

  if (book) {
    // Check if the review already exists, then modify it; otherwise, add a new review
    const reviewIndex = book.reviews.findIndex(
      existingReview => existingReview === review
    )

    if (reviewIndex !== -1) {
      book.reviews[reviewIndex] = review
    } else {
      book.reviews.push(review)
    }

    res.json({
      message: 'Review added/modified successfully',
      reviews: book.reviews
    })
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

app.delete('/books/reviews/:isbn/:username', (req, res) => {
  const isbn = req.params.isbn
  const username = req.params.username

  const book = books.find(book => book.isbn === isbn)

  if (book && book.reviews[username]) {
    // Delete the review associated with the specified user
    delete book.reviews[username]
    res.json({ message: 'Review deleted successfully', reviews: book.reviews })
  } else {
    res.status(404).json({ error: 'Review not found' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
