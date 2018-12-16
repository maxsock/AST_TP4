# Project - Asynchronous Server Technology 

[![Build Status](https://travis-ci.org/maxsock/AST_TP4.svg?branch=master)](https://travis-ci.org/maxsock/AST_TP4)

## Introduction 
This project is a website allowing users to log in and monitor their metrics. They can add, update and delete them.

## Requirements
Node.js : https://nodejs.org/en/download/  
Node version : 8.9.4

## Run instruction
1. Clone the repository
2. run ```npm install```to install the dependencies
3. run ```npm run populate``` to populate the database
4. run ```npm run test```to run the unit tests
5. run ```npm start```to launch the application
6. run ```npm run dev```to launch the application in dev mode

## Routes
#### Sign up 
```
POST /user/signup
{
	"username":"test",
	"password":"test",
	"email":"test"
}
```
#### Login 
```
POST /login
{
	"username":"test",
	"password":"test"
}
```

#### Get User Info 
```
GET /user/:username

```

#### Get Metrics
```
GET /metrics
```
#### Add Metric 
```
POST /metrics
{
	"timestamp":"test",
	"value":"test"
}
```
#### Delete Metric 
```
POST /metrics/delete
{
	"timestamp":"test"
}
```

## Previous Labs
https://github.com/maxsock/AST_TP1  
https://github.com/maxsock/AST_TP2  
https://github.com/maxsock/AST_TP3

## Contributor
Maximilien Sock

