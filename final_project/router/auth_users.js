const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
      return res.status(404).json({message:"Error logging in!"});
  }
  if (authenticatedUser(username,password)){
      let accessToken = jwt.sign({
        data:password
      }, 'access',{ expiresIn:'1hr'});
      req.session.authorization = {
        accessToken,username
      }
      return res.status(200).json({message:"User Successully Login !"});
  }else{
      return res.status(404).json({message:"Invalid Login!"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn",function (req, res){
  //Write your code here
  const isbn = req.params.isbn;
  
  let filter_books = books[isbn]
  if (filter_books){
      let review = req.body.review;
      if (review){
        books['reviews'] = review
      }
      books[isbn]=filter_books;
      res.status(200).send(`The review for the book with ISBN ${isbn} has been added/Updated`);

  }else{
    return res.status(404).json({message: "Error the User Unable to update!"});
  }
  
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (isbn){
      delete books[isbn]
  }
  res.send(`Reviews for the ISBN ${isbn} posted by the user has been deleted.`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
