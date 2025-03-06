const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  let exist = (username) => {
    let samename = users.filter((user) => {
      return user.username === username;
    });

    if (samename.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  if (username && password) {
    if (!exist(username)) {
        users.push({"username": username, "password": password});
      return res.status(200).json({message: "Succefull register"})
    } else {
      return res.status(404).json({message: "User exists"})
    }
  }
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    // Simulating an external API call (use your actual API endpoint if needed)
    const response = await axios.get(books); // Adjust URL if necessary
    res.json(response.data);
} catch (error) {
    res.status(500).json({ error: "Error fetching books" });
}
});
  
  


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let authorskeys = Object.keys(books);
  let authorbook = [];
  for (let key of authorskeys) {
    if (books[key].author === author) {
      authorbook.push(books[key]);
    }
  }
  if (authorbook.length > 0) {
    res.json(authorbook); 
  } else {
    res.status(404).json({ message:"wrong author"})
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let titlekey = Object.keys(books);
  let titlebook = [];
  for (let key of titlekey) {
    if (books[key].title === title) {
      titlebook.push(books[key]);
    }
  }
  if (titlebook.length > 0) {
    res.json(titlebook);
  } else {
    res.status(404).json({ message:"wrong title"})
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = books[isbn];
  const end = review.reviews;
  res.json(end);
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
