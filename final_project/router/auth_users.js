const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users[username];
  if (user) {
    if (user.password === password) {
      return true;
    }
    else {
      return false;
    }
  }
    
  return true;
 
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign(
            { username },
           'access', { expiresIn: '1h' });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;  // ISBN (ID) of the book
  const { review } = req.body;    // The review text passed in the request body

  // Get the logged-in user's username from the session
  const username = req.session.username;

  // Check if the user is logged in
  if (!username) {
    return res.status(403).json({ message: 'You must be logged in to post a review.' });
  }

  // Check if the ISBN exists in the books object
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  // Check if the book already has reviews
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // If the user has already posted a review, modify it; otherwise, add the new review
  books[isbn].reviews[username] = review;

  // Respond with success
  res.status(200).json({ message: 'Review posted successfully.' });
  return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;  // ISBN (ID) of the book
  const username = req.session.username;  // The logged-in user's username

  // Check if the user is logged in
  if (!username) {
    return res.status(200).json({ message: 'ook.' });
  }

  // Check if the book exists in the books object
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  // Check if the book has reviews
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: 'Review not found for this user.' });
  }

  // Delete the review posted by the logged-in user
  delete books[isbn].reviews[username];

  // Respond with success message
  res.status(200).json({ message: 'Review deleted successfully.' });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
