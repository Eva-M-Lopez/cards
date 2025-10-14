const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const url = 'mongodb+srv://RickL:COP4331@cluster0.rfuugai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
//debugging
client.connect().then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

//Trying resend for email verification
const { Resend } = require('resend');
const resend = new Resend('re_dMUewD2W_Mgg2B9gHzFC8QnRBZvSmjJpd');  // Replace with your actual API key

console.log('✅ Resend email service ready');



 app.use((req, res, next) => 
{
    app.get("/api/ping", (req, res, next) => {
    res.status(200).json({ message: "Hello World" });
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
 }); 


 
 app.post('/api/addcard', async (req, res, next) =>
 {
    // incoming: userId, color
    // outgoing: error
    const { userId, card } = req.body;
    const newCard = {Card:card,UserId:userId};
    var error = '';
    
   try
   {
      const db = client.db('COP4331Cards');
      const result = db.collection('Cards').insertOne(newCard);
   }
   catch(e)
   {
      error = e.toString();
   }

   
   var ret = { error: error };
   res.status(200).json(ret);
   
 });

app.post('/api/login', async (req, res, next) =>
{
    var error = '';
    const { login, password } = req.body;
    
    const db = client.db('COP4331Cards');
    const results = await db.collection('Users').find({Login:login,Password:password}).toArray();
    
    var id = -1;
    var fn = '';
    var ln = '';
    
    if( results.length > 0 )
    {
        if(!results[0].IsVerified)
        {
            error = 'Please verify your email before logging in';
        }
        else
        {
            id = results[0].UserID;
            fn = results[0].FirstName;
            ln = results[0].LastName;
        }
    }
    else
    {
        error = 'Invalid user name/password';
    }
    
    var ret = { id:id, firstName:fn, lastName:ln, error:error};
    res.status(200).json(ret);
});
 
 
 app.post('/api/searchcards', async (req, res, next) => 
{
    // incoming: userId, search
    // outgoing: results[], error
    var error = '';
    const { userId, search } = req.body;
    var _search = search.trim();
    const db = client.db('COP4331Cards');
    const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'i'}}).toArray();
    var _ret = [];

    for( var i=0; i<results.length; i++ )
    {
      _ret.push( results[i].Card );
    }
     var ret = {results:_ret, error:error};
    res.status(200).json(ret);
 });

app.post('/api/signup', async (req, res, next) =>
{
    const { firstName, lastName, login, password, email } = req.body;
    var error = '';

    try
    {
        const db = client.db('COP4331Cards');
        
        // Check if username or email already exists
        const existingUser = await db.collection('Users').findOne({
            $or: [{Login: login}, {Email: email}]
        });
        
        if(existingUser)
        {
            error = existingUser.Login === login ? 
                'Username already exists' : 
                'Email already exists';
        }
        else
        {
            // Generate verification code
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Get the next UserID
            const lastUser = await db.collection('Users')
                .find()
                .sort({UserID: -1})
                .limit(1)
                .toArray();
            
            const nextUserId = lastUser.length > 0 ? lastUser[0].UserID + 1 : 1;
            
            // Create new user
            const newUser = {
                Login: login,
                Password: password,
                Email: email,
                UserID: nextUserId,
                FirstName: firstName,
                LastName: lastName,
                IsVerified: false,
                VerificationCode: verificationCode
            };
            
            await db.collection('Users').insertOne(newUser);

            // Send verification email with Resend
            try {
                await resend.emails.send({
                    from: 'noreply@evalopez.xyz',  // Resend's verified domain
                    to: email,
                    subject: 'Verify Your Account - COP 4331 Cards',
                    html: `
                        <h2>Welcome to COP 4331 MERN Stack Demo!</h2>
                        <p>Hi ${firstName},</p>
                        <p>Thank you for signing up. Please verify your email address using the code below:</p>
                        <h1 style="color: #4CAF50; letter-spacing: 5px;">${verificationCode}</h1>
                        <p>This code will expire in 24 hours.</p>
                        <p>If you didn't create this account, please ignore this email.</p>
                    `
                });
                console.log('✅ Verification email sent to:', email);
                console.log('📧 Email ID:', result.id);
                console.log('📬 Sent to:', email);
            } catch (emailError) {
                console.error('Email send failed:', emailError);
                console.error('Error details:', emailError);
                console.error('Error message:', emailError.message);
                console.error('Full error object:', JSON.stringify(emailError, null, 2));
            }

            console.log('🔑 Verification Code:', verificationCode);
        }
    }
    catch(e)
    {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/verify', async (req, res, next) =>
{
    const { login, verificationCode } = req.body;
    var error = '';
    var success = false;

    try
    {
        const db = client.db('COP4331Cards');
        const user = await db.collection('Users').findOne({
            Login: login,
            VerificationCode: verificationCode
        });
        
        if(user)
        {
            // Mark user as verified
            await db.collection('Users').updateOne(
                {Login: login},
                {$set: {IsVerified: true}, $unset: {VerificationCode: ""}}
            );
            success = true;
        }
        else
        {
            error = 'Invalid verification code';
        }
    }
    catch(e)
    {
        error = e.toString();
    }

    var ret = { success: success, error: error };
    res.status(200).json(ret);
});
 
 app.listen(5000); // start Node + Express server on port 5000