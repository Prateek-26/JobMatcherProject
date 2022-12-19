const { urlencoded } = require('body-parser');
const bodyParser = require('body-parser');
const express = require('express');
const res = require('express/lib/response');
const mysql = require('mysql');
const SqlString = require('mysql/lib/protocol/SqlString');
const _ = require('lodash');
const { result, get } = require('lodash');
const e = require('express');
const { query } = require('express');
// const alert = require('alert');
// import alert from 'alert'

const app = express();
const mysql_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jmcmd'
});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));



// old way

app.get("/details", (req,res)=>{
    res.render("data_manip",{});
});

// new way
// Assume 'request' to be a person(either seeker o provide) who is trying to request

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
    
});

app.get("/about",(req,res)=>{
    res.sendFile(__dirname + "/about.html");
})

let admin_authenticated = false;

let display_query_seeker = "SELECT * FROM seeker_info;";
let display_query_provider = "SELECT * FROM provider_info;";


app.get("/crud_initial",(req,res)=>{
    console.log(admin_authenticated);
    // res.sendFile(__dirname + "/crud-initial.html");
    if(admin_authenticated===true)
    res.render("crud-initial-two",{auth_color:"#00ED64"});
    else
    res.render("crud-initial-two",{auth_color:"red"});
});

app.post("/login-authenticate",(req,res)=>{

    
    let log = req.body.log;
    let username = req.body.uname;
    let password = req.body.pword;

    if(log==="logout"){
        admin_authenticated=false;
        res.redirect("/crud_initial");       
    }
    else{
        let auth_query = "SELECT id from admin where username=? and password=?";
        mysql_connection.query(auth_query,[username,password],(err,rows,result)=>{
            if(err) throw err;
            else
            {
                if(rows[0] === undefined){
                    admin_authenticated=false;
                    console.log(admin_authenticated);
                    // alert("finaaly")
                    // res.sendFile(__dirname + "/login-faliure.html");
                    res.redirect("/crud_initial");
                }
                else{
                    admin_authenticated=true;
                    console.log(admin_authenticated);
                    res.redirect("/crud_initial");
                }
            }
        });
    }

});

app.get("/:crud_request",(req,res)=>{
    let request = req.params.crud_request;

    // ChHANGE THIS 
    admin_authenticated=true;

    if(admin_authenticated===true){
        if(request === "crud_seeker"){
            mysql_connection.query(display_query_seeker,(err,result)=>{
                if(err) throw err;
                res.render("crud_seeker",{records:result});
            });
        }
        else{
                mysql_connection.query(display_query_provider,(err,result)=>{
                if(err) throw err;
                res.render("crud_provider",{records: result});
            })
        }
    }
    else{
        res.sendFile(__dirname + "/login-require.html");
    }

});

app.post("/finallist",(req,res)=>{
    // res.sendFile(__dirname + "/login-require.html");
    // console.log("Hello");
    // res.send("Aa gaya");
    let query_one = "DROP TABLE results;";
    let query_two = "CREATE TABLE results (SELECT si.s_id, si.s_name, si.s_email, si.s_branch, pi.job_designation FROM (seeker_info as si natural join skill_info) inner join provider_info as pi on skill_info.s_skill = pi.skill_req where skill_info.s_skill = pi.skill_req and si.s_cgpa >= pi.cgpa_req order by s_id, s_branch);";
    let query_three = "SELECT si.s_id, si.s_name, si.s_email, si.s_branch, pi.job_designation FROM (seeker_info as si natural join skill_info) inner join provider_info as pi on skill_info.s_skill = pi.skill_req where skill_info.s_skill = pi.skill_req and si.s_cgpa >= pi.cgpa_req order by s_id, s_branch";

//    let result_query = "SELECT si.s_id, si.s_name, si.s_email, si.s_branch, pi.job_designation FROM (seeker_info as si natural join skill_info) inner join provider_info as pi on skill_info.s_skill = pi.skill_req where skill_info.s_skill = pi.skill_req and si.s_cgpa >= pi.cgpa_req order by s_id, s_branch;";
    mysql_connection.query(query_one,(err,result)=>{
        if(err) throw err;
        else{
            // console.log(result);
            console.log("Part One Done");
            mysql_connection.query(query_two,(err,result)=>{
                console.log("Part two starts");
                mysql_connection.query(query_three,(err,result)=>{
                    console.log("Part three starts");
                    console.log(result);
                    res.render("final-page",{
                        records: result
                    });
                });
            });
        }
    });
            // mysql_connection.query(query_two,(err,result)=>{
            //     console.log("Part two starts");
            //     mysql_connection.query(query_three,(err,result)=>{
            //         console.log("Part three starts");
            //         console.log(result);
            //         res.render("final-page",{
            //             records: result
            //         });
            //     });
            // });
})

app.post("/:request/crud/:operation",(req,res)=>{
    
    let person = req.params.request;
    let operation = req.params.operation;

    console.log(person + " requests " + operation);

    if(person==="seeker"){
        if(operation === "insert"){
            console.log(req.body);
            let query = "INSERT INTO seeker_info (s_id,s_name,s_email,s_contact,s_branch,s_cgpa) VALUES (?,?,?,?,?,?);";
           mysql_connection.query(query,[req.body.sid, req.body.sname, req.body.semail, req.body.sphone, req.body.sbranch, req.body.scgpa], (err,result)=>{
                if(err) throw err;
                console.log("Inserted Successfully");
                let second_query = "INSERT INTO skill_info (s_id,s_skill) VALUES (?,?);";
                mysql_connection.query(second_query,[req.body.sid,req.body.skill],(err,result)=>{

                });
            }); 
            res.redirect("/crud_seeker");
        } 
        else if(operation === "delete"){
            console.log(req.body);
            let query = "DELETE FROM seeker_info WHERE s_id = ?;";
          mysql_connection.query(query,[req.body.sid],(err,result)=>{
                if(err) throw err;
                console.log("Record Deleted");
            });
            res.redirect("/crud_seeker");
        }
        else if(operation === "update"){
            console.log(req.body);
            let query = "UPDATE seeker_info SET s_id = ?, s_name = ?, s_email = ?, s_contact = ?, s_branch = ?, s_cgpa = ? WHERE s_id = ?;";
            mysql_connection.query(query,[req.body.sid, req.body.sname, req.body.semail, req.body.sphone, req.body.sbranch, req.body.scgpa, req.body.sid],(err,result)=>{
                if(err) throw err;
                console.log("Record Updated");          
            });
            res.redirect("/crud_seeker");
        }
    }

    else if(person==="provider"){
        if(operation === "insert"){
            console.log(req.body);
            let query = "INSERT INTO provider_info (job_no, job_designation, skill_req, cgpa_req) VALUES (?,?,?,?);";
            mysql_connection.query(query,[req.body.jid, req.body.jname, req.body.jskill, req.body.jcgpa], (err,result)=>{
                if(err) throw err;
                console.log("Inserted Successfully");
            });
            res.redirect("/crud_provider");
        } 
        else if(operation === "delete"){
            console.log(req.body);
            let query = "DELETE FROM provider_info WHERE job_no = ?;";
            mysql_connection.query(query,[req.body.jid],(err,result)=>{
                if(err) throw err;
                console.log("Record Deleted");
            });
            res.redirect("/crud_provider");
        }
        else if(operation === "update"){
            console.log(req.body);
            let query = "UPDATE provider_info SET job_no = ?, job_designation = ?, skill_req = ?, cgpa_req = ? WHERE job_no = ?;";
            mysql_connection.query(query,[req.body.jid, req.body.jname, req.body.jskill, req.body.jcgpa, req.body.jid],(err,result)=>{
                if(err) throw err;
                console.log("Record Updated");           
            });
            res.redirect("/crud_provider");
        }
    }
});

app.listen(3000,()=>{
    console.log("Listening on port 3000")
});