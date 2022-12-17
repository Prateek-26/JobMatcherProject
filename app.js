const { urlencoded } = require('body-parser');
const bodyParser = require('body-parser');
const express = require('express');
const res = require('express/lib/response');
const mysql = require('mysql');
const SqlString = require('mysql/lib/protocol/SqlString');
const _ = require('lodash');
const { result, get } = require('lodash');
const e = require('express');
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


// function display(request) {
//     console.log(request);
//     if(request === "crud_seeker"){
//         console.log("Heeloo seeker");
//         let display_query = "SELECT * FROM seeker_info;";
//         mysql_connection.query(display_query,(err,result)=>{
//             if(err) throw err;
//             // console.log("jhkfjdhfjad");
//             console.log(result);
//             return result;
//         })
//     }
//     else{
//         console.log("Heello provider");
//     }
// }

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/views/index.html")
});

// old way

app.get("/details", (req,res)=>{
    res.render("data_manip",{});
});

// app.post("/",(req,res)=>{
//     let id = req.body.e_id;
//     let name = req.body.e_name;
//     const sql = "INSERT INTO employee (emp_no,name) VALUES (?,?);";
//     mysql_connection.query(sql,[id,name],(err,result)=>{
//         if(err) throw err;
//         console.log("Inserted");
//     });
// });

/*

app.post("/:job_data_provider", (req,res)=>{
    const operation = req.body.operation;
    const person = _.lowerCase(req.params.job_data_provider);

    console.log(operation + "  " + person);

    // if(person === "seeker"){
        if(operation === "select"){
            let query;
            if(person === "seeker")
            query = "SELECT * FROM employee"; // add seeker
            else
            query = "SELECT * FROM salary"; // add provider
            mysql_connection.query(query,(err,result)=>{
                if(err) throw err;
                console.log(result);
                res.render("_select",{data : result, pp: person});
            });
        }
        else if(operation === "insert"){
            res.render(person+"_insert",{});
        }
        else if(operation === "delete"){
            res.render("_delete",{pp:person});
        }
        else if(operation === "update"){
            res.render(person+"_update",{});
        }
        else{
            res.send("Galat Maal he tumhara");
        }
    // }
});


app.post("/:person/operations/:operation_from_form",(req,res)=>{

    let operation = _.lowerCase(req.params.operation_from_form);
    const person = _.lowerCase(req.params.person);

    if(operation === "select"){
        mysql_connection.query("SELECT * FROM employee",(err,result)=>{
            if(err) throw err;
            console.log(result);
            res.render(person+"_select",{
                data : result
            });
        });
    }
    if(person==="seeker"){
        // let display_query = "SELECT * FROM seeker_info"
        if(operation === "insert"){
            console.log(req.body);
            let query = "INSERT INTO salary (emp_no, name) VALUES (?,?);";
            mysql_connection.query(query,[req.body.e_id, req.body.e_name], (err,result)=>{
                if(err) throw err;
                console.log("Inserted Successfully");
            });
        } 
        else if(operation === "delete"){
            console.log(req.body);
            let query = "DELETE FROM employee WHERE emp_no = ?;";
            mysql_connection.query(query,[req.body.id],(err,result)=>{
                if(err) throw err;
                console.log("Record Deleted");
            });
        }
        else if(operation === "update"){
            console.log(req.body);
            let query = "UPDATE employee SET name = ? WHERE emp_no = ?;";
            mysql_connection.query(query,[req.body.name, req.body.id],(err,result)=>{
                if(err) throw err;
                console.log("Record Updated");           
            });
        }
    }
    else if(person==="provider"){
        if(operation === "insert"){
            console.log(req.body);
            let query = "INSERT INTO employee (emp_no, name) VALUES (?,?);";
            mysql_connection.query(query,[req.body.e_id, req.body.e_name], (err,result)=>{
                if(err) throw err;
                console.log("Inserted Successfully");
            });
        } 
        else if(operation === "delete"){
            console.log(req.body);
            let query = "DELETE FROM employee WHERE emp_no = ?;";
            mysql_connection.query(query,[req.body.id],(err,result)=>{
                if(err) throw err;
                console.log("Record Deleted");
            });
        }
        else if(operation === "update"){
            console.log(req.body);
            let query = "UPDATE employee SET name = ? WHERE emp_no = ?;";
            mysql_connection.query(query,[req.body.name, req.body.id],(err,result)=>{
                if(err) throw err;
                console.log("Record Updated");           
            });
        }
    }

});


*/

// new way
// Assume 'request' to be a person(either seeker o provide) who is trying to request


let display_query_seeker = "SELECT * FROM seeker_info;";
let display_query_provider = "SELECT * FROM provider_info;";

app.get("/crud_initial",(req,res)=>{
    res.render("crud_initial",{});
})

app.get("/:crud_request",(req,res)=>{
    let request = req.params.crud_request;
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
});

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