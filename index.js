//import required modules
const express = require("express");
const path = require("path");

//set up Express object and port
const app = express();
const port = process.env.PORT || "8888";

//set up Express object to know where views folder is located and which templating engine is being used
app.set("views",path.join(__dirname, "views"));
app.set("view engine", "pug");

//points express object to public folder which holds static files
app.use(express.static(path.join(__dirname, "public")));

//routing
app.get("/", (req, res) => {
    res.render("index", {title: "Home"});
});

app.get("/about", (req, res) => {
    res.render("about", {title: "About"});
});

//set up server listening
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})