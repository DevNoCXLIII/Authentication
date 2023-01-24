require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

//Mongoose
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const rounds = 10
const Users = require("./user")
mongoose.set("strictQuery", false)
mongoose.connect("mongodb://localhost/secretsDB")


//APP:GET

app.get("/", (request, respond) => {
    respond.render("home")
})
app.get("/register", (request, respond) => {
    respond.render("register")
})
app.get("/login", (request, respond) => {
    respond.render("login")
})

//APP:POST

app.post("/register", async function(request, respond) {
    bcrypt.hash(request.body.password, rounds, function(bycryptError, hash){
        if (bycryptError) return console.error(bycryptError.message)
        Users.create({ email: request.body.username, password: hash }, function(mongooseError) {
            if (mongooseError) return console.error(mongooseError.message)
            respond.render("secrets")
        })
    })
})

app.post("/login", function(request, respond) {
    
    Users.findOne( { email: request.body.username } , function(mongooseError, usr){
        if (mongooseError) return console.error(mongooseError.message)
        if (!usr) return //Not found
        bcrypt.compare(request.body.password, usr.password, function(bycryptError, bcryptResponse){
            if (bcryptResponse === true) { respond.render("secrets") }
        })
    })
})

app.listen(3000)