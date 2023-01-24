require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

//Mongoose
const mongoose = require("mongoose")
const Users = require("./user")
mongoose.set("strictQuery", false)
mongoose.connect("mongodb://localhost/secretsDB")

console.log(process.env.SECRET);
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
    
    Users.create({ email: request.body.username, password: request.body.password }, function(err) {
        if (err) return console.error(err.message)
        respond.render("secrets")
    })

})

app.post("/login", function(request, respond) {
    Users.findOne( { email: request.body.username } , function(err, usr){
        if (err) return console.error(err.message)
        if (!usr) return //Not found
        if (usr.password === request.body.password) return respond.render("secrets")
    })
})

app.listen(3000)