const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');


app.use(bodyParser.json()); 
app.use(cors())


var upload = multer();

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));


const zoho = require('zcrmsdk');

const config = require('./zoho.config.js');
const configJson = {
    "client_id": "1000.QAU4KEK64DOH8CZRNU11RLYTKURX0L", //mandatory
    "client_secret": "c60dc33b5337fee4f2556250a9c635f95d7b131ee4", //mandatory
    "redirect_url": "http:/localhost:4000", //mandatory
    "user_identifier": "info@vanillafarms.org",
    "base_url": "www.zohoapis.in", //optional ,"www.zohoapis.com" is default value
    "iamurl": "accounts.zoho.in", //optional ,"accounts.zoho.com" is default value
    "version": "v2.1", //optional ,"v2" is default value
    "tokenmanagement": `${__dirname}/tokenManagement.js`
}

async function createLead(name,phone,arrive,depart,email,people){
    data2 = {
        "data": [
            {
                "Last_Name": name,
                "Email":email,
                "Phone":phone,
                "No. of Guests":people,
                "Check In Date":arrive,
                "Check Out Date":depart,
            }
        ],
        "lar_id":""
    }
    const moduleResponse = await zoho.API.MODULES.post({
        module: 'Leads',
        body:data2,
    });
    return moduleResponse;
}



app.post('/try',async(req,res,next)=>{
    
    res.send(req.body);

})

app.post('/leads', async (req, res, next) => {
    num=1;
    await zoho.initialize(configJson);
    data = req.body;
    //await zoho.generateAuthTokenfromRefreshToken("info@vanillafarms.org","1000.c48c0dca613a512641cdc4500de180a1.89a181a664140e545a3581f7c51abbdc")
    while(num>=1 && num<4) {
        response1 = await createLead(data.name,data.phone,data.arrive,data.depart,data.email,data.people)
        if(response1.statusCode == 201){
            res.send(response1.statusCode)
            num=0;
            break
        }
        else{
            await zoho.generateAuthTokenfromRefreshToken("info@vanillafarms.org","1000.c48c0dca613a512641cdc4500de180a1.89a181a664140e545a3581f7c51abbdc")
            num+=1;
            if(num==3){
                res.send("Ooops!! error has occurred")
            }
            continue
        }
    }
    //res.send("error has occured")
    //esp = moduleResponse.json;
    //console.log(resp)
});
port ="3000";
//export default app;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })