const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Array to store registered users

// Check if the username already exists
const isValid = (username) => {
    // Returns true if username exists in the users array
    return users.some(user => user.username === username);
}

// Check if username and password match a registered user
const authenticatedUser = (username, password) => {
    // Returns true if a user with this username AND password exists
    return users.some(user => user.username === username && user.password === password);
}
//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    // Generate a JWT token
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
    // Save the token in the session
    if (req.session) {
        req.session.authorization = { accessToken };
    }

    return res.status(200).json({
        message: "User logged in successfully",
        token: accessToken
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user?.username; // set by auth middleware
    const review = req.query.review;     // review comes from request query

    // Check if user is logged in
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review text is required in query" });
    }

    // Add or update review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user?.username; // obtained from auth middleware

    // Check if user is logged in
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully",
        reviews: books[isbn].reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
