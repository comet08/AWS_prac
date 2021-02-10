const mysql = require('mysql');
var db  = mysql.createPool({
    connectionLimit : 20,
    host     : 'instance1.ckrwhi64ijc3.us-east-2.rds.amazonaws.com',
    user     : 'admin',
    password : 'comet9808',
    port     : '3306',
    database : 'board'
});

const respon = (status, body) => ({
    statusCode: status,
     headers:{'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                    	},
    body: JSON.stringify(body),
   
  });


  exports.handler = function(event, context, callback) {
    console.log(event);
    const oper = event.httpMethod;
   var body = JSON.parse(event.body);
 
   db.getConnection(function(err, connection){
        if(err !== null)
           callback(err,respon(500,err));

    if(oper=="GET"){
        if(event.queryStringParameters){
            var q = Number(event.queryStringParameters.select);
                db.query(`select * from myboard where id=${q}`, (err,data)=>{
                if (err)    
                    context.fail();
                else
                    context.succeed(respon(200,data));
                });
                
            }
            else{
                db.query(`select * from myboard`, (err,data)=>{
                if (err)    
                    context.fail();
                else
                    context.succeed(respon(200,data));
                });
            }
             
            
    }
        if(oper=="POST"){
            var d = body.date, c = body.content, t = body.title;
               var q = `insert into myboard(date, content, title) values('${d}', '${c}', '${t}')`;
                db.query(q, function(err, data) {
                    if(err){
                        context.fail();
                    } else{
                        context.succeed(respon(200,data));
                    }
                })
        }
        connection.release();
    });
};

