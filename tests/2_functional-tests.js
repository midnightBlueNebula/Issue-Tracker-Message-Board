/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var ObjectId = require('mongodb').ObjectID;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, respond){
          assert.equal(respond.status, 200);
          assert.equal(respond.body.issue_title,'Title')
          assert.equal(respond.body.issue_text,'text');
          assert.equal(respond.body.created_by,'Functional Test - Every field filled in');
          assert.equal(respond.body.assigned_to,'Chai and Mocha')
          assert.equal(respond.body.status_text,'In QA')
          //fill me in too!
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
          chai.request(server)
        .post('api/issues/apitest')
        .send({issue_title: 'a?',issue_text: 'b',created_by: 'c',assigned_to: 'd',status_text: 'e'})
        .end(function(err,respond){
          assert.equal(respond.status, 200);
          assert.notEqual(respond.body.issue_title,'')
          assert.notEqual(respond.body.issue_text,'');
          assert.notEqual(respond.body.created_by,'');
          assert.notEqual(respond.body.assigned_to,'')
          assert.notEqual(respond.body.status_text,'')
          done()
        })
        
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('api/issues/apitest')
        .send({issue_title: '',issue_text: '',created_by: '',assigned_to: '',status_text: ''})
        .end(function(err,res){
          assert.notEqual(res.status,200)
          done()
        })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('api/issues/apitest')
        .send({_id:ObjectId('5cc5f310a4034a4d3c596730'),
               issue_title: '',issue_text: '',created_by: '',assigned_to: '',status_text: ''})
        .end(function(err,res){
          assert.equal(res.status,200)
          assert.equal(res.body,'no updated field sent')
          done()
        })
        
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('api/issues/apitest')
        .send({_id:ObjectId('5cc5f310a4034a4d3c596730'),
               issue_title: '',issue_text: '',created_by: '',assigned_to: 'YOU',status_text: ''})
        .end(function(err,res){
          assert.equal(res.status,200)
          assert.notEqual(res.body.issue_title,'')
          assert.equal(res.body.assigned_to,'YOU')
          done()
        })
        
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('api/issues/apitest')
        .send({_id:ObjectId('5cc5f310a4034a4d3c596730'),
               issue_title: '',issue_text: '',created_by: 'US',assigned_to: 'YOU',status_text: ''})
        .end(function(err,res){
          assert.equal(res.status,200)
          assert.notEqual(res.body.issue_title,'')
          assert.equal(res.body.assigned_to,'YOU')
          assert.equal(res.body.assigned_to,'US')
          done()
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({created_by:'us'})
        .end(function(err,res){
          assert.equal(res.status, 200)
          assert.equal(res.body[0].created_by,'us')
          done()
        })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({open:true,assigned_to:'you'})
        .end(function(err,res){
          assert.equal(res.status, 200)
          assert.equal(res.body[0].open,true)
          assert.equal(res.body[0].assigned_to,'you')
          done()
        })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .post('api/issues/apitest')
        .send({_id:''})
        .end(function(err,res){
          assert.notEqual(res.status,200)
          done()
        })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .post('api/issues/apitest')
        .send({_id:'5cc5f310a4034a4d3c596730'})
        .end(function(err,res){
          assert.equal(res.status,200)
          done()
        })
      });    
    });

});
