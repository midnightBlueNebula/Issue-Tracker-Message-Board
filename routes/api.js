/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;


var express = require('express')
var app = express();
var ObjectId  = require('mongodb').ObjectID;


function apiRoutes(app,db) {
  app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

  //Index page (static HTML)
  app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

  app.route('/api/issues/:project')
  
    .get(function (req, res, next){
      let issuetitle       = req.query.issue_title;//undefined if it is not in query
      let id               = req.query._id;
      let createdby        = req.query.created_by;
      let assignedto       = req.query.assigned_to;
      let openStatus       = req.query.open
      
      let resArray          = [];
      let filterArray       = [];
    
      if(issuetitle != undefined){
        filterArray.push([issuetitle,'issue_title'])
      }
      if(id != undefined){
          filterArray.push([id,"_id"])
      }
      if(createdby != undefined){
        filterArray.push([createdby,"created_by"])
      }
      if(assignedto != undefined){
        filterArray.push([assignedto,"assigned_to"])
      }
      if(openStatus != undefined){
        if(openStatus == 'true'){
          filterArray.push([true,"open"])
        }
        else{
          filterArray.push([false,"open"])
        }
      }
    
      db.collection('issues').find({project:req.params.project}).toArray((err,result)=>{
        if(err){
          res.send('toArray err')
        }
        else{
          if(issuetitle==undefined && id==undefined && createdby==undefined && assignedto==undefined && openStatus==undefined){
            res.send(result)
          }
          else{
           let counter = 0;
           result.forEach((d)=>{
             console.log(filterArray)
             filterArray.forEach((f)=>{
               for(let k in d){
                 if(k==f[1]){
                   if(d[k]==f[0]){
                     ++counter
                   }
                   else{
                   

                    counter = 0

                   }
                 }
               }
             })
             if(filterArray.length==counter){
               resArray.push(d)

               

               counter=0

             }
           })
           res.send(resArray)
          }
        }
      })
    })
    
    .post(function (req, res, next){
      var project = req.params.project;
      let id = new ObjectId();
      db.collection('issues').findOne({issue_title:req.body.issue_title},(err,result)=>{
        if(err){
          res.send('post err');
        }
        else if(result){
          res.send('Already added')
        }
        else{
          db.collection('issues').insertOne({_id:id,project:req.params.project,issue_title:req.body.issue_title,
                                             issue_text:req.body.issue_text,
                                             created_on:new Date(),
                                             created_by:req.body.created_by,assigned_to:req.body.assigned_to,
                                             open:true,
                                             status_text:req.body.status_text},(err,doc)=>{
                                                                                  if(err){
                                                                                    res.send('Err at insertOne')
                                                                                  }
                                                                                  else{
                                                                                    next(null,result);
                                                                                  }
                                                                                })
        }
        res.send({_id:id,issue_title:req.body.issue_title,issue_text:req.body.issue_text,
                                             created_on:new Date(),
                                             created_by:req.body.created_by,assigned_to:req.body.assigned_to,
                                             open:true,
                                             status_text:req.body.status_text})
      })
    })
    
    .put(function (req, res, next){
      let id          = req.body._id;
      let title       = req.body.issue_title;
      let text        = req.body.issue_text;
      let creator     = req.body.created_by;
      let assignedTo  = req.body.assigned_to;
      let statusText  = req.body.status_text;
      let openStatus  = !req.body.open;
    
      console.log(id,title,text,creator,assignedTo,statusText,openStatus)
    
      if(id==''){res.send('Please enter id')};
    
      db.collection('issues').findOne({_id:ObjectId(id)},(err,result)=>{
        if(err){
          res.send('Error at PUT route, findOne');
        }
        else if(!result.open){
          res.send('This issue already closed')
        }
        else if(result){
          if(title == '' && text == '' && creator == '' && assignedTo == '' && statusText == ''){
            res.send('no updated field sent');
          }
          else{
            db.collection('issues').findOneAndUpdate({_id:ObjectId(id)},{$set:{open:openStatus, updated_on:new Date()}})
            if(title != ''){
              db.collection('issues').findOneAndUpdate({_id:ObjectId(id)},{$set:{issue_title:title}})
            }
            if(text != ''){
              db.collection('issues').findOneAndUpdate({_id:ObjectId(id)},{$set:{issue_text:text}})
            }
            if(creator != ''){
              db.collection('issues').findOneAndUpdate({_id:ObjectId(id)},{$set:{created_by:creator}})
            }
            if(assignedTo != ''){
              db.collection('issues').findOneAndUpdate({_id:ObjectId(id)},{$set:{assigned_to:assignedTo}})
            }
            if(statusText != ''){
              db.collection('issues').findOneAndUpdate({_id:ObjectId(id)},{$set:{status_text:statusText}})
            }
            db.collection('issues').findOne({_id:ObjectId(id)},(err2,updatedResult)=>{
              if(err2){
                res.send('Error after update on issue at findOne');
              }
              else if(updatedResult){
                res.send(updatedResult)
              }
              else{
                res.send('Just updated this object and can\'t find already :(')
              }
            })
          }
        }
        else{
          res.send('Search error: No issue assigned to this id');
        }
      })
    })
    
    .delete(function (req, res, next){
      let id = req.body._id
      db.collection('issues').deleteOne({_id:ObjectId(id)});
      res.send('Issue with _id: '+id+' terminated');
    });
    
};




module.exports = apiRoutes

