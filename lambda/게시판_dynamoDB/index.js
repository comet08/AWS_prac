var AWS = require('aws-sdk')

AWS.config.update({
    region: 'us-east-2',
 
})

const docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = function(event, context, callback) {
    console.log(event);
    const oper = event.httpMethod;
   var body = JSON.parse(event.body);


  if(oper=="GET"){
       if(event.queryStringParameters){
           var q = event.queryStringParameters.select;
            var params = {
                TableName: "Board_db",
                ProjectionExpression : "title, content",
                KeyConditionExpression: "id = :id",
                ExpressionAttributeValues:{
                    ":id" : q
                }
            }
            docClient.query(params, (err,data)=>{
            if (err)    
                  callback(err,null);
             else
                  callback(null, {
                    	statusCode:200,
                    	headers:{'Content-Type':'application/json',
                    	    'Access-Control-Allow-Origin':'*'
                    	},
                    	body : JSON.stringify(data)
                    });
        	});
            
        }
        else{
            var params = {
                TableName: "Board_db",
            };
             docClient.scan(params, (err,data)=>{
            if (err)    
                  callback(err,null);
             else
                  callback(null, {
                    	statusCode:200,
                    	headers:{'Content-Type':'application/json',
                    	    'Access-Control-Allow-Origin':'*'
                    	},
                    	body : JSON.stringify(data)
                    });
        	});
        }
        
         
   }
    if(oper=="POST"){
           var params = {
              TableName: "Board_db",
               Item: {
                "id": body.id,
               "title": body.title,
                "content" : body.content,
              "date": body.date
                }
            };
        
            docClient.put(params, function(err, data) {
                if(err){
                    callback(err, null);
                } else{
                    callback(null, {
                    	statusCode:200,
                    	headers:{'Content-Type':'application/json',
                    	    'Access-Control-Allow-Origin':'*'
                    	},
                    	body : JSON.stringify(data)
                    });
                }
            })
    }
     
    
}