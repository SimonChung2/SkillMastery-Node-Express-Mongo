//import required modules
const express = require("express");
// const path = require("path");
const cors = require("cors"); // lets this API allow requests from other servers
const dotenv = require("dotenv");

dotenv.config();

//set up Express object and port
const app = express();
const port = process.env.PORT || "8888";

//MongoDB
const { MongoClient } = require("mongodb");
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/?retryWrites=true&w=majority`
const client = new MongoClient(dbUrl);
const { ObjectId } = require("mongodb");

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//allows requests from all servers
app.use(cors({
    origin: "*"
}));




//API endpoints
app.get("/tutors", async (request, response) => {
    let tutors = await getAllTutors();
    // console.log(tutors);
    response.json(tutors); //everytime a request is sent to /tutors, a response of an array of tutor json objects is received
}) 

app.get("/learners", async (request, response) => {
    let learners = await getAllLearners();
    response.json(learners); //everytime a request is sent to /learners, a response of an array of learner json objects is received
})

app.get("/tutors/display", async (request, response) => {
    let displayedTutors =  await getDisplayedTutors();
    response.json(displayedTutors);
})

//Route handling for other CRUD operations
//TUTORS
//Create a new tutor
app.post("/tutors/add/submit", async (request, response) => {

    let firstName =  request.body.firstName;
    let lastName = request.body.lastName;
    let skills = request.body.skills;
    let platforms = request.body.platforms;
    let hourlyRate = request.body.hourlyRate;
    let email = request.body.email;
    let password = request.body.password;
    let active = request.body.active;

    let newTutor = {"firstName": firstName, "lastName": lastName, "skills": skills, "platforms": platforms, "hourlyRate": hourlyRate, "email": email, "password": password, "active": active};
    await addTutor(newTutor);
    response.redirect(`http://localhost:5173/tutorprofiletutorview/${newTutor._id}`);
})

//Delete a tutor
app.get("/tutors/delete", async (request, response) => {
    //get tutorId value and save to variable called id
    let id = request.query.tutorId;
    // console.log(id);
    //calls the delete Tutor function while passing in the value of tutorId
    await deleteTutor(id);
    response.redirect(`http://localhost:5173/tutorlist`);
})

//Edit a tutor
app.get("/tutors/edit", async (request, response) => {
    if (request.query.tutorId) {
        let tutorToEdit = await getSingleTutor(request.query.tutorId);
        let tutors = await getAllTutors;

        response.json(tutorToEdit);
        // response.redirect("http://localhost:5173/edittutor");
    }
})

app.post("/tutors/edit/submit", async (request, response) => {
    let idFilter = { _id: new ObjectId (request.body.tutorId)};

    let tutor = {
        firstName : request.body.firstName,
        lastName : request.body.lastName,
        skills: request.body.skills,
        platforms: request.body.platforms,
        hourlyRate: request.body.hourlyRate,
        email: request.body.email,
        password: request.body.password,
        active: request.body.active
    };

    await editTutor (idFilter, tutor);

    response.redirect(`http://localhost:5173/tutorprofiletutorview/${request.body.tutorId}`);
})

//Search tutors by skill
app.get("/tutors/search", async (request, response) => {
    let skillsInput = request.query.skill_input; 
    // console.log(skillsInput);
    let tutors = await getTutorsBySkill(skillsInput);
    console.log(tutors);
    response.json(tutors);
})

//View tutor profile
app.get("/tutorprofilelearnerview", async (request, response) => {
    
        let tutorToView = await getSingleTutor(request.query.tutorId);

        response.json(tutorToView);
        // response.redirect("http://localhost:5173/edittutor");
    })


//set up server listening
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})


//LEARNERS
//Create a new learner

app.post("/learners/add/submit", async (request, response) => {

    let firstName =  request.body.firstName;
    let lastName = request.body.lastName;
    let email = request.body.email;
    let password = request.body.password;
    let active = request.body.active;

    let newLearner = {"firstName": firstName, "lastName": lastName, "email": email, "password": password, "active": active};
    await addLearner(newLearner);
    response.redirect(`http://localhost:5173/learnerprofilelearnerview/${newLearner._id}`);

})

//View learner profile
app.get("/learnerprofilelearnerview", async (request, response) => {
    
    let learnerToView = await getSingleLearner(request.query.learnerId);

    response.json(learnerToView);
})

//Delete a learner
app.get("/learners/delete", async (request, response) => {
    //get learnerId value and save to variable called id
    let id = request.query.learnerId;
    // console.log(id);
    //calls the delete Learner function while passing in the value of learnerId
    await deleteLearner(id);
    response.redirect(`http://localhost:5173/admin/learnerlist`);
})

//Edit a learner
app.get("/learners/edit", async (request, response) => {
    if (request.query.learnerId) {
        let learnerToEdit = await getSingleLearner(request.query.learnerId);

        response.json(learnerToEdit);
    }
})

app.post("/learners/edit/submit", async (request, response) => {
    let idFilter = { _id: new ObjectId (request.body.learnerId)};

    let learner = {
        firstName : request.body.firstName,
        lastName : request.body.lastName,
        email: request.body.email,
        password: request.body.password,
        active: request.body.active
    };

    await editLearner (idFilter, learner);

    response.redirect(`http://localhost:5173/learnerprofilelearnerview/${request.body.learnerId}`);
})

//Mongo Functions
async function connection() {
    db = client.db("skillmasterydb");
    return db;
}

//TUTORS
async function getDisplayedTutors(){
    db = await connection();
    let results = db.collection("tutors").find().sort({_id:-1}).limit(4); //sorts tutor objects from newest to oldest and gets the first 4
    res = await results.toArray();
    return res;
}

async function getAllTutors() {
    db = await connection();
    let results = db.collection("tutors").find({});
    res = await results.toArray();
    // console.log(res);
    return res; //returns an array of all the tutors as json objects
}

async function getTutorsBySkill(skill){
    db = await connection();
    let results = db.collection("tutors").find({ skills: {$regex: new RegExp(skill, 'i')}});
    res = await results.toArray();
    return res;
}

async function addTutor(tutor) {
    db = await connection();
    var status = await db.collection("tutors").insertOne(tutor);
    console.log("tutor added");
}

async function deleteTutor(id){
    db = await connection();
    const deleteId = { _id: new ObjectId(id) };
    const result = await db.collection("tutors").deleteOne(deleteId);
}

async function getSingleTutor(id){
    db = await connection();
    const editId = { _id: new ObjectId(id) };
    const result = await db.collection("tutors").findOne(editId);
    console.log(result);
    return result;
}

async function editTutor (filter, tutor) {
    db = await connection();

    const updateTutor = {
        $set: tutor
    };

    await db.collection("tutors").updateOne(filter, updateTutor);
}


//LEARNERS
async function getAllLearners() {
    db = await connection();
    let results = db.collection("learners").find({});
    res = await results.toArray();
    return res; //returns an array of all the learners as json objects
}

async function addLearner(learner) {
    db = await connection();
    var status = await db.collection("learners").insertOne(learner);
    console.log("learner added");
}

async function getSingleLearner(id){
    db = await connection();
    const editId = { _id: new ObjectId(id) };
    const result = await db.collection("learners").findOne(editId);
    console.log(result);
    return result;
}

async function editLearner (filter, learner) {
    db = await connection();

    const updateLearner = {
        $set: learner
    };

    await db.collection("learners").updateOne(filter, updateLearner);
}

async function deleteLearner(id){
    db = await connection();
    const deleteId = { _id: new ObjectId(id) };
    const result = await db.collection("learners").deleteOne(deleteId);
}
