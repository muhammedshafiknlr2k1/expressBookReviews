const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const Axios = require("axios")


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    // Check if username already exists
    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists. Please choose a different username." });
    }
    // Add new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully", users });
});
// // Get the book list available in the shop

// public_users.get('/', function (req, res) {
//     // Convert the books object to a JSON string with indentation for readability
//     const bookList = JSON.stringify(books, null, 4);
//     return res.status(200).send(bookList);
// });

public_users.get('/', (req, res) => {
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books); 
            }, 1000); 
        });
    };

    getBooks()
        .then((books) => {
            res.json(books);
        })
        .catch((err) => {
            res.status(500).json({ error: "An error occurred" });
        });
});



// public_users.get('/isbn/:isbn', function (req, res) {
//     const isbn = req.params.isbn;

//     if (books[isbn]) {
//         // Send the entire book object including title, author, reviews
//         return res.status(200).json(books[isbn]);
//     } else {
//         return res.status(404).json({ message: "Book not found" });
//     }
// });

public_users.get('/isbn/:isbn', (req, res) => {
    const ISBN = req.params.isbn;

    const booksBasedOnIsbn = (ISBN) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const book = books[ISBN]; 
                if (book) {
                    resolve(book);
                } else {
                    reject(new Error("Book not found"));
                }
            }, 1000);
        });
    };

    booksBasedOnIsbn(ISBN)
        .then((book) => {
            res.json(book);
        })
        .catch((err) => {
            res.status(404).json({ error: err.message });
        });
});
  
// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     const author = req.params.author; // get author from URL
//     const bookKeys = Object.keys(books); // get all ISBN keys
//     let authorBooks = [];

//     // Iterate over each book and check the author
//     bookKeys.forEach((key) => {
//         if (books[key].author.toLowerCase() === author.toLowerCase()) {
//             authorBooks.push(books[key]);
//         }
//     });

//     if (authorBooks.length > 0) {
//         return res.status(200).json(authorBooks);
//     } else {
//         return res.status(404).json({ message: "No books found by this author" });
//     }
// });

public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    const booksBasedOnAuthor = (auth) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const filteredbooks = Object.values(books).filter(b => b.author === auth);
                if (filteredbooks.length > 0) {
                    resolve(filteredbooks);
                } else {
                    reject(new Error("Book not found"));
                }
            }, 1000);
        });
    };

    booksBasedOnAuthor(author)
        .then((books) => res.json(books))
        .catch((err) => res.status(404).json({ error: err.message }));
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     const title = req.params.title; // get title from URL
//     const bookKeys = Object.keys(books); // get all ISBN keys
//     let titleBooks = [];

//     // Iterate over each book and check the title
//     bookKeys.forEach((key) => {
//         if (books[key].title.toLowerCase() === title.toLowerCase()) {
//             titleBooks.push(books[key]);
//         }
//     });

//     if (titleBooks.length > 0) {
//         return res.status(200).json(titleBooks);
//     } else {
//         return res.status(404).json({ message: "No books found with this title" });
//     }
// });

public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;

    const booksBasedOnTitle = (booktitle) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const filteredbooks = Object.values(books).filter(b => b.title === booktitle);
                if (filteredbooks.length > 0) {
                    resolve(filteredbooks);
                } else {
                    reject(new Error("Book not found"));
                }
            }, 1000);
        });
    };

    booksBasedOnTitle(title)
        .then((new_books) => res.json(new_books))
        .catch((err) => res.status(404).json({ error: err.message }));
});


//  Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        if (Object.keys(reviews).length > 0) {
            return res.status(200).json(reviews);
        } else {
            return res.status(200).json({ message: "No reviews available for this book" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
