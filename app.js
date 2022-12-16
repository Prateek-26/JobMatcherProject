const { urlencoded } = require('body-parser');
const bodyParser = require('body-parser');
const express = require('express');
const res = require('express/lib/response');
const mysql = require('mysql');
const SqlString = require('mysql/lib/protocol/SqlString');
const _ = require('lodash');
const { result, get } = require('lodash');
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

    // if(operation === "select"){
    //     mysql_connection.query("SELECT * FROM employee",(err,result)=>{
    //         if(err) throw err;
    //         res.render(person+"_select",{
    //             data : result
    //         });
    //     });
    // }
    if(person==="seeker"){
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


// new way

app.get("/crud_initial",(req,res)=>{
    res.render("crud_initial",{});
})

app.get("/:crud_request",(req,res)=>{
    let request = req.params.crud_request;
    console.log(request);
    if(request==="crud_seeker")
        res.render("crud_seeker",{});
    else
    res.render("crud_provider",{});
})

app.listen(3000,()=>{
    console.log("Listening on port 3000")
});