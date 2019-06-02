var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var port = 3000

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1249&q=80",
//         description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
//     }, (err, campground) => {
//         if(err){
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND: ")
//             console.log(campground);
//         }
//     }
// )

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1532720401185-3c5adeba363c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80"},
//     {name: "Granite Hill", image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1249&q=80"},
//     {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1537165410262-1abc68541d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80"}
// ]

app.get("/", (req,res) => {
    res.render("landing");
})

// Index Route
app.get("/campgrounds", (req,res) => {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    })
})

// Create Route
app.post("/campgrounds", (req,res) => {
    //Get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {name: name, image: image, description: desc};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //Redirect back to campgrounds
            res.redirect("/campgrounds");
        }
    })
});

// New Route
app.get("/campgrounds/new", (req,res) => {
    res.render("new");
});

// Show Route
app.get("/campgrounds/:id", (req,res) => {
    //Find the campground with the provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on PORT ${port}`);
})