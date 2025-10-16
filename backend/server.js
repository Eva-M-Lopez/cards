require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variables
const url = process.env.MONGODB_URL || 'mongodb+srv://RickL:COP4331@cluster0.rfuugai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);

// Connect to MongoDB
client.connect().then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Resend email service
const resend = new Resend(process.env.RESEND_API_KEY || 're_dMUewD2W_Mgg2B9gHzFC8QnRBZvSmjJpd');
console.log('✅ Resend email service ready');

app.use((req, res, next) => 
{
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

app.get("/api/ping", (req, res, next) => {
    res.status(200).json({ message: "Hello World" });
});

app.post('/api/addcard', async (req, res, next) =>
{
    const { userId, card } = req.body;
    const newCard = {Card:card,UserId:userId};
    var error = '';
    
    try
    {
        const db = client.db('COP4331Cards');
        const result = await db.collection('Cards').insertOne(newCard);
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
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            const lastUser = await db.collection('Users')
                .find()
                .sort({UserID: -1})
                .limit(1)
                .toArray();
            
            const nextUserId = lastUser.length > 0 ? lastUser[0].UserID + 1 : 1;
            
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

            // Send verification email
            try {
                const { data, error } = await resend.emails.send({
                    from: 'noreply@evalopez.xyz',
                    to: 'eva.m.lopez2004@gmail.com', // Hardcoded for testing
                    subject: 'Verify Your Account - COP 4331 Cards',
                    html: `
                        <h2>Welcome to COP 4331 MERN Stack Demo!</h2>
                        <p>Hi ${firstName},</p>
                        <p>User: ${login}</p>
                        <p>Their email: ${email}</p>
                        <p>Verification code:</p>
                        <h1 style="color: #4CAF50; letter-spacing: 5px;">${verificationCode}</h1>
                        <p>This code will expire in 24 hours.</p>
                    `
                });
                
                if (error) {
                    console.error('❌ Resend error:', error);
                } else {
                    console.log('✅ Verification email sent');
                }
            } catch (emailError) {
                console.error('❌ Email send failed:', emailError);
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
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});