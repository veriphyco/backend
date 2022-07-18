import express from "express";
import unirest from 'unirest';
import moment from 'moment';
const router = express.Router(); 

//let unirest = require('unirest');

// router.post("/lipanampesa", ()=>{
//     //console.log("halllo")
//     let req = unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=fQMsHOyoJgiHmpHjhGFhS7UC15crvQcx,9CPHLFbk4rq0AQVz ')
//     .headers({ 'Authorization': 'Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==' })
//     .send()
//     .end(res => {
//         if (res.error) throw new Error(res.error);
//         console.log(res.raw_body);
//     });    

// }

router.get('/api/authtoken', (req, res) => {
    console.log("hafkdfak")
    const timestamp= new Date().getTime();
    const consumerKey = "cHYwgfqEwgKhlxtRwtu74WxH6obZzHf7";
    const consumerSecret = "RsGqFn0fxM4ZNNih";
   // console.log(consumerKey+consumerSecret)
    const header = Buffer.from(consumerKey+consumerSecret).toString('base64')
  
  
    unirest.get(`https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`)
    .headers({ 'Authorization': `Basic Y0hZd2dmcUV3Z0tobHh0Und0dTc0V3hINm9iWnpIZjc6UnNHcUZuMGZ4TTRaTk5paA==` , 'Cookie': 'incap_ses_1025_2742146=K4pucr00i0aglU+/tIg5DgaQyWIAAAAAEU8ufPdrOHE7xfLMuTat+w==; visid_incap_2742146=InRgXgtmS7OVK/CKpTfDbefJwmIAAAAAQUIPAAAAAABX6axb6saJV4qUKum+U7K3' })
    .end((response) => {
      //make sure response should be a JSON object
      console.log('sucessscscscd')
      res.status(200).send(response.body)
    })
  //  req = unirest('GET', 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
  // .headers({
  //   'Authorization': 'Basic Y0hZd2dmcUV3Z0tobHh0Und0dTc0V3hINm9iWnpIZjc6UnNHcUZuMGZ4TTRaTk5paA==',
  //   'Cookie': 'incap_ses_1025_2742146=K4pucr00i0aglU+/tIg5DgaQyWIAAAAAEU8ufPdrOHE7xfLMuTat+w==; visid_incap_2742146=InRgXgtmS7OVK/CKpTfDbefJwmIAAAAAQUIPAAAAAABX6axb6saJV4qUKum+U7K3'
  // })
     
  // .end( (res) =>{ 
  //  // res.send({"data":res.raw_body})
  //   if (res.error) throw new Error(res.error); 
  //   console.log(res.raw_body);
  //   //res.json({"data":res.raw_body})
  // });
        
  });
router.post("/timestamp",(req, res)=>{
  // let nz_date_string = new Date().getTime();
  // const timestamp= new Date().getTime();
  const nz_date_string = new Date().getTime().now();
  console.log(nz_date_string)
  // var date = new Date();
  // var ts = String(Math.round(date.getTime() / 1000) + date.getTimezoneOffset() * 60);
  // console.log(ts)

})
  router.post("/api/stkpush", (req, res)=>{
    const timestamp= new Date().getTime();
    console.log(timestamp)
   req = unirest('POST', 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
  .headers({
    'Authorization': `Bearer ${req.body.access_token}`,
    'Content-Type': 'application/json',
    'Cookie': 'incap_ses_1025_2742146=K4pucr00i0aglU+/tIg5DgaQyWIAAAAAEU8ufPdrOHE7xfLMuTat+w==; visid_incap_2742146=InRgXgtmS7OVK/CKpTfDbefJwmIAAAAAQUIPAAAAAABX6axb6saJV4qUKum+U7K3'
  })
  .send(JSON.stringify({
    "BusinessShortCode": "4092497",
    "Password": "NDA5MjQ5NzU0NDA1Y2M5NmRjNTNjYjQ4YjhhY2E1M2VhOGY5YzE2MzViOTNkNGYyZTUyYTVjNzg4ZjliYzgyZDlhMWQ0MGUyMDIyMDcwOTE4MDc0MQ==",
    "Timestamp": "20220709180741",
    "TransactionType": "CustomerPayBillOnline",
    "Amount": "1",
     "PartyA": `${req.body.phoneNumber}`,
    "PartyB": "4092497",
    "PhoneNumber": `${req.body.phoneNumber}`,
    "CallBackURL": "https://www.veriphy.co",
    "AccountReference": "Payment for verification",
    "TransactionDesc": "Payment for verifications"
  }))
  .end( (response) => { 
   // if (res.error) throw new Error(res.error); 
   // console.log(res.error)
   res.status(200).send(response.body)
   // console.log(response.body);
  });

  });


  router.post("/api/stk/querry", (req, res)=>{
     req = unirest('POST', 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query')
    .headers({
      'Authorization': `Bearer ${req.body.access_token}`,
      'Content-Type': 'application/json',
      'Cookie': 'incap_ses_1024_2742146=WKgEPsCYukw+plfBOvs1DpcMzGIAAAAAQ/4fRvkYdIIT5B+v/b1Zng==; visid_incap_2742146=InRgXgtmS7OVK/CKpTfDbefJwmIAAAAAQUIPAAAAAABX6axb6saJV4qUKum+U7K3'
    })
    .send(JSON.stringify({
      "BusinessShortCode": "4092497",
      "Password": "NDA5MjQ5NzU0NDA1Y2M5NmRjNTNjYjQ4YjhhY2E1M2VhOGY5YzE2MzViOTNkNGYyZTUyYTVjNzg4ZjliYzgyZDlhMWQ0MGUyMDIyMDcwOTE4MDc0MQ==",
      "Timestamp": "20220709180741",
      "CheckoutRequestID": `${req.body.checkoutRequestId}`,
    }))
    .end( (response) => { 
     // if (res.error) throw new Error(res.error); 
     // console.log(res.raw_body);
     res.status(200).send(response.body)
    // console.log(response.body);
    });
  
  })

export default router;




