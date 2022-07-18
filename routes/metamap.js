import express from "express";
import unirest from 'unirest';
import crypto from "crypto";
import timeout from 'connect-timeout'

const router = express.Router(); 

router.post("/authtoken", (req, res)=>{
     req = unirest('POST', 'https://api.getmati.com/oauth')
      .headers({
        'Authorization': 'Basic NjI2YWNkZTQ2N2I0MzEwMDFiNDg2OTkzOjU4WTZFR1BQN0FIQlREVVlBS0NYTldaOTFOOUNFWUha',
        'Content-Type': 'application/x-www-form-urlencoded'
      })
      .send('grant_type=client_credentials')
      .end( (response) =>{ 
        res.status(200).send(response.body)
        console.log("sent")
      });
    

  });

  router.post("/startverification", (req, res)=>{
     req = unirest('POST', 'https://api.getmati.com/v2/verifications/')
      .headers({
        'Authorization': `Bearer ${req.body.access_token}`,
        'Content-Type': 'application/json'
      })
      .send(JSON.stringify({
        "flowId": "62bc6671e1ec51001cbe0466",
        "metadata": {
          "user": "User ONE",
          "id": "verihpy 001"
        }
      }))
      .end( (response)=> { 
       console.log("req.body.access_token")
        res.status(200).send(response.body)
      });
    
   

 });
 router.post("/sendinputs", (req, res)=>{
    let qs =   'ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=JSON&ZOHO_ERROR_FORMAT=JSON&ZOHO_API_KEY=dummy1234&ticket=dummy9876&ZOHO_API_VERSION=1.0';

 req = unirest('POST', `https://api.getmati.com/v2/identities/${req.body.identityId}/send-input`)
      .headers({
        'Authorization': `Bearer ${req.body.access_token}`,
        'Content-Type': 'multipart/form-data',
        'Content-Length': qs.length
      })
      .field('inputs', '﻿[\n{\n"inputType":"selfie-photo",\n"data":{"type":"selfie-photo",\n"country":"KE",\n"filename":"1.jpeg"}\n},\n{\n"inputType":"document-photo",\n"group":0,\n"data":{"type":"national-id",\n"country":"KE",\n"page":"front",\n"filename":"3.jpeg"}\n},\n{\n"inputType":"document-photo",\n"group":0,\n"data":{"type":"national-id",\n"country":"KE",\n"page":"back",\n"filename":"2.jpeg"}\n}\n]')
      .attach('file', `${req.body.selfie}`)
      .attach('file', `/${req.body.frontpage}`)
      .attach('file', `/${req.body.backpage}`)
      .end( (response, err) => { 
      //  if(err) console.log(err)
     // console.log(req.body.identityId)
        res.status(200).send(response.body)

      });


    

  

});

const wait = (req,res, next)=>{
 setTimeout(() => {
   console.log("waited for 30000")
   next()
 },180000);

}
router.post("/hotel_veriphy_co/webhook", (req, res)=>{
 // console.log(req.headers.host)
 // let host = req.headers.host
  let userID= req.body.userId
  let email = req.body.email
  let verificationId = req.body.verificationId
  let access_token = req.body.access_token
  console.log(req.body)
  setTimeout(() => {
    console.log("hsfsdfffffffad")
    req = unirest('get', `https://api.getmati.com/v2/verifications/${req.body.verificationId}`)
    .headers({
      'Authorization': `Bearer ${req.body.access_token}`,
      'Accept': 'application/json',
      "Content-Type":"application/json",
    })
    .end( (response) => { 
    //  if(err) console.log(err)
  //console.log(response.body)

  JSON.stringify((response.body))
     // const { computed, documents, expired, flow, identity, steps, id,deviceFingerprint, hasProblem}= JSON.stringify(response.body);
      // console.log( response.body.documents[0].steps[0].id)
      // console.log(response.body.documents[0].steps[6].error)
     // console.log(response.body.computed.age.data)
    //   console.log(selfieURl)
       if(response.body.computed.age.data){
        console.log(response.body.computed.age.data)
        let idNumber=response.body.documents[0].steps[5].data.documentNumber.value;
   //   console.log(idNumber)
       let fullNamesFromMeta= response.body.documents[0].steps[5].data.fullName.value;
       let dochasProblem =response.body.hasProblem;
       let docidentity = response.body.identity.status;
       let documentType= response.body.documents[0].steps[5].data.documentType.value;
      let age= response.body.computed.age.data;
      let docExpired = response.body.expired;
       let dateOFBirth= response.body.documents[0].steps[5].data.dateOfBirth.value;
       const sex= response.body.documents[0].steps[5].data.sex.value;
       let faceMatchScore = response.body.documents[0].steps[3].data.score;
      let AlterationDetected = response.body.hasProblem;
      let onWatchList= response.body.documents[0].steps[6].error;
       let validationFrom=  response.body.documents[0].steps[0].id;
      let pdfLink = 'none';
      let  selfieURl=response.body.steps[0].data.selfiePhotoUrl;
       let expirationDate= response.body.documents[0].steps[5].data.expirationDate.value;
       console.log(validationFrom)
       console.log(dochasProblem)
       console.log(expirationDate) 
        setTimeout(() => {
          console.log('udating database from backned')
          //  console.log(`${host}/users/onboarding/register/selfie/62cff6a006dbfc968862c3ac`)
             req = unirest('PATCH', `https://www.demo.veriphy.co/users/onboarding/updatemanyregister/${userID}`)
             .headers({
               'Content-Type': 'application/json'
             })
             .send(JSON.stringify({
               "idNumber": idNumber,
               "dochasProblem":dochasProblem,
               "docidentity":docidentity,
               "age":age,
               "docExpired":docExpired,
               "dateOFBirth":dateOFBirth,
               "sex":sex,
               "documentType":documentType,
               "onWatchList":onWatchList,
               "fullNamesFromMeta":fullNamesFromMeta,
               "faceMatchScore":faceMatchScore,
               "validationFrom":validationFrom,
               "selfieURl":selfieURl,
               "AlterationDetected":AlterationDetected,
               "pdfLink":pdfLink
     
             }))
            .end( (response) => { 
              console.log(response.body)
          setTimeout(() => {
            if(response.body){
              console.log("send email now")     
              var req = unirest('POST', 'https://www.demo.veriphy.co/users/metamap/sendemail')
              .headers({
              'Content-Type': 'application/json'
          })
          .send(JSON.stringify({
          "email": email,
        "docidentity": docidentity,
        "fullNamesFromMeta":fullNamesFromMeta,
        "idNumber": idNumber,
        "documentType": documentType,
        "dateOFBirth": dateOFBirth,
        "onWatchList": onWatchList
          }))
         .end( (res) => { 
       // if (res.error) throw new Error(res.error); 
        console.log(res.raw_body);
          });

            }
          }, 30000);
            
          //  if(err) console.log(err)
           // console.log(req.body.identityId)
         // res.status(200).send(response.body)
           
         
         });
        }, 60000);

       }else{
        console.log("no computed found")
       }
    
    });
  }, 1);


  
 
})






export default router;