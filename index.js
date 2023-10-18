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
app.get("/menulinks", async (request, response) => {
    let menulinks = await getAllMenuLinks();
    response.json(menulinks); 
})

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
    await deleteTutorSignUp();
    await deleteLearnerSignUp();
    await changeTutorLoginToLogout();
    await deleteLearnerLogin();
    await deleteAdminLogin();
    response.redirect(`${process.env.VITE_CLIENT_URL}/tutorprofiletutorview/${newTutor._id}`);
})

app.post("/admin/tutors/add/submit", async (request, response) => {

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

    response.redirect(`${process.env.VITE_CLIENT_URL}/admin/tutorlist`);
})

//Delete a tutor
app.get("/admin/tutors/delete", async (request, response) => {
    //get tutorId value and save to variable called id
    let id = request.query.tutorId;
    // console.log(id);
    //calls the delete Tutor function while passing in the value of tutorId
    await deleteTutor(id);
    response.redirect(`${process.env.VITE_CLIENT_URL}/admin/tutorlist`);
})

//Delete a tutor from Admin Dashboard
app.get("/tutors/delete", async (request, response) => {
    //get tutorId value and save to variable called id
    let id = request.query.tutorId;
    // console.log(id);
    //calls the delete Tutor function while passing in the value of tutorId
    await deleteTutor(id);
    response.redirect(`${process.env.VITE_CLIENT_URL}/tutorlist`);
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

    response.redirect(`${process.env.VITE_CLIENT_URL}/tutorprofiletutorview/${request.body.tutorId}`);
})
//Edit Tutor form Admin Dashboard
app.post("/admin/tutors/edit/submit", async (request, response) => {
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

    response.redirect(`${process.env.VITE_CLIENT_URL}/admin/tutorlist`);
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
    await deleteTutorSignUp();
    await deleteLearnerSignUp();
    await changeTutorLoginToLogout();
    await deleteLearnerLogin();
    await deleteAdminLogin();
    response.redirect(`${process.env.VITE_CLIENT_URL}/learnerprofilelearnerview/${newLearner._id}`);

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
    await logout();
    response.redirect(`${process.env.VITE_CLIENT_URL}/`);
})

//Delete a learner from Admin Dashboard
app.get("/admin/learners/delete", async (request, response) => {
    //get learnerId value and save to variable called id
    let id = request.query.learnerId;
    // console.log(id);
    //calls the delete Tutor function while passing in the value of tutorId
    await deleteLearner(id);
    response.redirect(`${process.env.VITE_CLIENT_URL}/admin/tutorlist`);
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

    await editLearner (idFilter, learner); //calls mongodb function

    response.redirect(`${process.env.VITE_CLIENT_URL}/learnerprofilelearnerview/${request.body.learnerId}`);
})

//LOGIN
app.post("/tutor/login", async (request, response) => {

    let email = request.body.email;
    let password = request.body.password;

    let tutor=await tutorLogin (email, password); //checks tutors db for email and password and returns a tutor if there is a match
    console.log(tutor);

    if(tutor[0]){
        await updateTutorStatus(tutor[0]._id);
        await deleteTutorSignUp();
        await deleteLearnerSignUp();
        await changeTutorLoginToLogout();
        await deleteLearnerLogin();
        await deleteAdminLogin();

        response.redirect(`${process.env.VITE_CLIENT_URL}/tutorprofiletutorview/${tutor[0]._id}`);
    } else {
        response.redirect(`${process.env.VITE_CLIENT_URL}/tutor/login`);
    }
})

app.post("/learner/login", async (request, response) => {

    let email = request.body.email;
    let password = request.body.password;

    let learner=await learnerLogin (email, password); //checks learners db for email and password and returns a learner if there is a match
    console.log(learner);

    if(learner[0]){
        await updateLearnerStatus(learner[0]._id);
        await deleteTutorSignUp();
        await deleteLearnerSignUp();
        await changeTutorLoginToLogout();
        await deleteLearnerLogin();
        await deleteAdminLogin();

        response.redirect(`${process.env.VITE_CLIENT_URL}/learnerprofilelearnerview/${learner[0]._id}`);
    } else {
        response.redirect(`${process.env.VITE_CLIENT_URL}/learner/login`);
    }
})

app.post("/admin/login", async (request, response) => {

    let email = request.body.email;
    let password = request.body.password;

    let admin=await adminLogin (email, password); //checks admin db for email and password and returns an admin if there is a match
    console.log(admin);

    if(admin[0]){

        await deleteTutorSignUp();
        await deleteLearnerSignUp();
        await changeTutorLoginToLogout();
        await deleteLearnerLogin();
        await deleteAdminLogin();
        response.redirect(`${process.env.VITE_CLIENT_URL}/admin/tutorlist`);
    } else {
        response.redirect(`${process.env.VITE_CLIENT_URL}/admin/login`);
    }
})

//Logout
app.get("/logout", async (request, response) => {
    await logout();
    response.redirect(`${process.env.VITE_CLIENT_URL}/`);
})


//Mongo Functions
async function connection() {
    db = client.db("skillmasterydb");
    return db;
}

//MENULINKS
async function getAllMenuLinks() {
    db = await connection();
    let results = db.collection("menuLinks").find({});
    res = await results.toArray();
    // console.log(res);
    return res; //returns an array of all the menuLinks as json objects
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

//Login
async function tutorLogin (email1, password1) {
    db = await connection();
    let result = db.collection("tutors").find({
        email: email1,
        password: password1
    });

        res = await result.toArray(result); //this is an array with one tutor object in it.
        return res;
}

async function learnerLogin (email1, password1) {
    db = await connection();
    let result = db.collection("learners").find({
        email: email1,
        password: password1
    });

        res = await result.toArray(result); //this is an array with one learner object in it.
        return res;
}

async function adminLogin (email1, password1) {
    db = await connection();
    let result = db.collection("admins").find({
        email: email1,
        password: password1
    });

        res = await result.toArray(result); //this is an array with one learner object in it.
        return res;
}


async function updateTutorStatus (id) {
    const filter = { _id: new ObjectId(id)};
    const update = {
        $set: {
            active: "yes"
        }
    };

    await db.collection("tutors").updateOne(filter, update);
}

async function updateLearnerStatus (id) {
    const filter = { _id: new ObjectId(id)};
    const update = {
        $set: {
            active: "yes"
        }
    };

    await db.collection("learners").updateOne(filter, update);
}

async function changeTutorLoginToLogout(){
    const linkFilter = { linkName: "Tutor Login"};
    const linkUpdate = {
        $set: {
            linkName: "Logout",
            path: `${process.env.VITE_SERVER_URL}/logout`
        }
    };

    await db.collection("menuLinks").updateOne(linkFilter, linkUpdate);

}

async function deleteLearnerLogin(){
    db = await connection();
    const result = await db.collection("menuLinks").deleteOne({"linkName" : "Learner Login"});
}

async function deleteAdminLogin(){
    db = await connection();
    const result = await db.collection("menuLinks").deleteOne({"linkName" : "Admin Login"});
}

async function deleteTutorSignUp(){
    db = await connection();
    const result = await db.collection("menuLinks").deleteOne({"linkName" : "Tutor Sign Up"});
}

async function deleteLearnerSignUp(){
    db = await connection();
    const result = await db.collection("menuLinks").deleteOne({"linkName" : "Learner Sign Up"});
}


//Logout
async function logout () {
    db=await connection();
    // const linkFilter = { linkName: "Logout"};
    // const linkUpdate = {
    //     $set: {
    //         linkName: "Tutor Login",
    //         path: "/tutor/login"
    //     }
    // };

    // await db.collection("menuLinks").updateOne(linkFilter, linkUpdate);
    const result = await db.collection("menuLinks").deleteOne({"linkName" : "Logout"});

    var status1 = await db.collection("menuLinks").insertOne({linkName: "Tutor Sign Up", path: "/tutorsignup"});
    var status2 = await db.collection("menuLinks").insertOne({linkName: "Learner Sign Up", path: "/learnersignup"});
    var status3 = await db.collection("menuLinks").insertOne({linkName: "Tutor Login", path: "/tutor/login"});
    var status4 = await db.collection("menuLinks").insertOne({linkName: "Learner Login", path: "/learner/login"});
    var status4 = await db.collection("menuLinks").insertOne({linkName: "Admin Login", path: "/admin/login"});

}