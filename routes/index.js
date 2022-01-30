var express = require('express');
var router = express.Router();
var userModel  = require('./users');
var taskModel  = require('./task');
const { v4: uuidv4 } = require('uuid');
const XLSX =require('xlsx');
const ExcelJs =require('exceljs')
const path = require('path');


router.get('/', function(req, res, next) {
  userModel.find()
  .then(function(users){
    res.render('index', {users});
  })
  
});

router.get('/adduser',function(req,res){
  res.render('adduser')
})

router.post('/createuser',function(req,res){
  console.log(uuidv4);
  userModel.create({
    id:uuidv4(),
    mobile:req.body.mobile,
    name:req.body.name,
    email:req.body.email
  })
  .then(function(createduser){
    res.redirect('/')
  })
})

router.get('/createtask',function(req,res){
  userModel.find()
  .then(function(users){
    res.render('taskform' ,{users}) ; 
  })
})

router.post('/taskassign',function(req,res){
  taskModel.create({
    task_type:req.body.select1,
    task_name:req.body.task_name,
    user:req.body.select
  })
  .then(function(task){
    console.log(task);
    res.redirect('/addtask')
  })
})

router.get('/addtask',function(req,res){
  taskModel.find()
  .then(function(tasks){
    res.render('addtask',{tasks});
  })
})

router.get('/sheet', async (req, res, next) => {
  try {
      const users = await userModel.find();
      const tasks =await taskModel.find();
      const workbook = new ExcelJs.Workbook();
      const worksheet = workbook.addWorksheet('My Users');
      const worksheet2 =workbook.addWorksheet('Users Tasks')
      worksheet.columns = [
          {header: 'id', key: 'id', width: 30},
          {header: 'name', key: 'name', width: 30},
          {header: 'email', key: 'email', width: 30},
          {header: 'mobile', key: 'mobile', width: 30},
      ];
      worksheet2.columns = [
        {header: 'user', key: 'user', width: 30},
        {header: 'task name', key: 'task_name', width: 30},
        {header: 'task type', key: 'task_type', width: 30},
    ];

      users.forEach(user => {
          worksheet.addRow(user);
      });
      tasks.forEach(task=>{
        worksheet2.addRow(task);
      }
        );
      worksheet.getRow(1).eachCell((cell) => {
          cell.font = {bold: true};
      });
      worksheet2.getRow(1).eachCell((cell) => {
        cell.font = {bold: true};
    });
      const data = await workbook.xlsx.writeFile('users.xlsx')
      res.send('done');
    } catch (e) {
      res.status(500).send(e);
  }

});




module.exports = router;
