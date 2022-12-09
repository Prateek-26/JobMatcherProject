const { urlencoded } = require('body-parser');
const bodyParser = require('body-parser');
const express = require('express');
const res = require('express/lib/response');
const mysql = require('mysql');
const SqlString = require('mysql/lib/protocol/SqlString');
const _ = require('lodash');
const { result } = require('lodash');
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
    res.render('home',{});
});

app.get("/details", (req,res)=>{
    res.render("student",{});
});

app.get("/student/insert",(req,res)=>{
    res.render()
});

app.post("/",(req,res)=>{
    let id = req.body.e_id;
    let name = req.body.e_name;
    const sql = "INSERT INTO employee (emp_no,name) VALUES (?,?);";
    mysql_connection.query(sql,[id,name],(err,result)=>{
        if(err) throw err;
        console.log("Inserted");
    });
});

app.post("/:job_data_provider", (req,res)=>{
    const operation = req.body.operation;
    const person = _.lowerCase(req.params.job_data_provider);

    console.log(operation + "  " + person);

    if(person === "seeker"){
        if(operation === "select"){
            mysql_connection.query("SELECT * FROM employee",(err,result)=>{
                if(err) throw err;
                res.render("student_select",{
                    data : result
                });
            });
        }
        else if(operation === "insert"){
            res.render("student_insert",{});
        }
        else if(operation === "delete"){
            res.render("student_delete",{});
        }
        else if(operation === "update"){
            res.render("student_update",{});
        }
        else{
            res.send("Galat Maal he tumhara");
        }
    }


});

app.post("/student/operations/:operation_from_form",(req,res)=>{

    let operation = _.lowerCase(req.params.operation_from_form);

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
});


app.listen(3000,()=>{
    console.log("Listening on port 3000");
});