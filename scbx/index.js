const express = require('express')
const app = express()
const port = 3333
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const saltRounds = 10;
const db = require("./models/index");
const { verifyToken } = require('./middleware');
const secret = process.env.SECRET;
const axios = require('axios');

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if(!(email. password, firstName, lastName)) {
    return res.status(404).send("Please fill all the required information")
  }

  const existedUser = await db.User.findOne({
    where: {
      email: email
    }
  });

  if(existedUser) {
    console.log("hi");
    return res.status(404).json({message: "User Already Existed"});
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const token = jwt.sign({email, role: "user"}, secret, {expiresIn: "1h"})

    return res.status(200).json({
      message: "Registered",
      token: token
    })
  } catch (error) {
    return res.redirect("/register");
  }
});

app.post('/login', async(req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({
                  where: {
                    email: email
                  }
                });
    bcrypt.compare(password, user.password, function(err, isLogin) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Error occurred while comparing passwords"
        });
      }

      if (isLogin) {
        const token = jwt.sign({email, role: "user"}, secret, {expiresIn: "1h"});
        return res.status(200).json({
          message: "Logged In",
          token: token
        });
      } else {
        return res.status(401).json({
          message: "Password is not correct"
        });
      }
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(403).json({
      message: "Logged In fail",
      error
    })
  }
});

app.post("/home", verifyToken, async(req, res) => {
  const sortedBy = req.body.sortedBy;
  const uniqueTagsResponse = await axios.get('http://localhost:3333/tags');
  const tags = uniqueTagsResponse.data;
  let order = [];

  switch(sortedBy) {
    case 'postedDate_DESC':
      order = [['postedAt', 'DESC']];
      break;
    case 'postedDate_ASC':
      order = [['postedAt', 'ASC']];
      break;
    case 'title_A-Z':
      order = [["title", "ASC"]];
      break;
    case 'title_Z-A':
      order = [["title", "DESC"]];
      break;
  }

  db.Article.findAll({
    order: order,
    raw: true
  })
  .then(articles => {
    res.status(200).json({
      message: "Verify Succeeded",
      posts: articles,
      tags: tags
    });
  })
  .catch(error => {
    console.error('Error fetching articles:', error);
    console.log('Error details:', error.message);
  });
});

app.get("/tags", async (req, res) => {
  db.Article.findAll({
    attributes: ['tags'],
    raw: true
  })
  .then(articles => {
    const allTags = articles.map(a => a.tags).flat().filter(tag => tag !== 'no-tags');
    const uniqueTags = [...new Set(allTags)];
    res.status(200).json(uniqueTags);
  })
  .catch(error => {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Error fetching tags' });
  });
});


app.post("/post/:id", verifyToken, async(req, res) => {
  const postId = req.params.id;
  db.Article.findOne({
    where: {
      id: postId
    },
    raw: true
  })
  .then(article => {
    res.status(200).json({
      message: "Verify Succeeded",
      post: article
    });
  })
  .catch(error => {
    console.error('Error fetching articles:', error);
    console.log('Error details:', error.message);
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
