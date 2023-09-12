const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;
const bookApiUrl = 'http://localhost:5000/';

public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "This account successfully added!"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }else{
    return res.status(404).json({message: "Unable to register user."});
  }
  
});

// Get the book list available in the shop
 public_users.get('/', async (req, res) =>{
  try {
    const response = await new Promise((resolve,reject)=>{
      resolve(books);
    });
    res.send(JSON.stringify({response},null,4));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book data' });
  }
 });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  function searchBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found')); 
      }
    });
  }
  
  const methCall = new Promise((resolve, reject) => {
    
  
    searchBookByISBN(isbn)
      .then((book) => {
        resolve(book);
      })
      .catch((err) => {
        reject(err);
      });
  });
  
  methCall
    .then((book) => {
      res.send('Book details:', book);
    })
    .catch((err) => {
      res.send('Error:', err.message);
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  function searchBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      const matchingBooks = [];
  
      for (const isbn in books) {
        if (books[isbn].author === author) {
          matchingBooks.push(books[isbn]);
        }
      }
  
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error('No books found for the author'));
      }
    });
  }
  
  const methCall = new Promise((resolve, reject) => {
    const author = req.params.author;
  
    searchBooksByAuthor(author)
      .then((books) => {
        resolve(books);
      })
      .catch((err) => {
        reject(err);
      });
  });
  
  methCall
    .then((books) => {
      res.send('Books by the author:', books);
    })
    .catch((err) => {
      res.send('Error:', err.message);
    });
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  
function searchBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];

    for (const isbn in books) {
      if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
        matchingBooks.push(books[isbn]);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks); 
    } else {
      reject(new Error('No books found with the specified title')); 
    }
  });
}

const methCall = new Promise((resolve, reject) => {
  const title = req.params.title;

  searchBooksByTitle(title)
    .then((books) => {
      resolve(books);
    })
    .catch((err) => {
      reject(err);
    });
});

methCall
  .then((books) => {
    res.send('Books with matching title:', books);
  })
  .catch((err) => {
    res.send('Error:', err.message);
  });
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]['reviews'])
});

module.exports.general = public_users;
