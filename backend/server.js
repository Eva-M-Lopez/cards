require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { Resend } = require('resend');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

// Use environment variables
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

// Connect to MongoDB
client.connect().then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Resend email service
const resend = new Resend(process.env.RESEND_API_KEY);
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

    // Filter by BOTH user AND search term
    const results = await db.collection('Cards').find({
        "UserId": userId,
        "Card": {$regex:_search+'.*', $options:'i'}
    }).toArray();
    
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
                    to: email, // Hardcoded for testing
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

app.post('/api/request-password-reset', async (req, res, next) =>
{
    const { email } = req.body;
    var error = '';

    try
    {
        const db = client.db('COP4331Cards');
        
        // Find user by email
        const user = await db.collection('Users').findOne({ Email: email });
        
        if(!user)
        {
            error = 'No account found with that email address';
        }
        else
        {
            // Generate reset code
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Store reset code in database (expires in 1 hour)
            const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
            
            await db.collection('Users').updateOne(
                { Email: email },
                { $set: { 
                    ResetCode: resetCode,
                    ResetCodeExpires: expiresAt
                }}
            );
            
            // Send reset email
            try {
                const { data, error: emailError } = await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: 'eva.m.lopez2004@gmail.com', // Hardcoded for testing
                    subject: 'Password Reset Code - COP 4331 Cards',
                    html: `
                        <h2>Password Reset Request</h2>
                        <p>Hi ${user.FirstName},</p>
                        <p>User: ${user.Login}</p>
                        <p>Their email: ${email}</p>
                        <p>You requested a password reset. Use this code:</p>
                        <h1 style="color: #FF5722; letter-spacing: 5px;">${resetCode}</h1>
                        <p>This code expires in 1 hour.</p>
                        <p>If you didn't request this, ignore this email.</p>
                    `
                });
                
                if (emailError) {
                    console.error('❌ Resend error:', emailError);
                } else {
                    console.log('✅ Reset email sent');
                }
            } catch (emailError) {
                console.error('❌ Email send failed:', emailError);
            }
            
            console.log('🔑 Reset Code:', resetCode);
        }
    }
    catch(e)
    {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/reset-password', async (req, res, next) =>
{
    const { email, resetCode, newPassword } = req.body;
    var error = '';
    var success = false;

    try
    {
        const db = client.db('COP4331Cards');
        
        // Find user with matching email and reset code
        const user = await db.collection('Users').findOne({
            Email: email,
            ResetCode: resetCode
        });
        
        if(!user)
        {
            error = 'Invalid reset code';
        }
        else if(user.ResetCodeExpires < new Date())
        {
            error = 'Reset code has expired. Please request a new one.';
        }
        else
        {
            // Update password and remove reset code
            await db.collection('Users').updateOne(
                { Email: email },
                { 
                    $set: { Password: newPassword },
                    $unset: { ResetCode: "", ResetCodeExpires: "" }
                }
            );
            success = true;
            console.log('✅ Password reset for:', user.Login);
        }
    }
    catch(e)
    {
        error = e.toString();
    }

    var ret = { success: success, error: error };
    res.status(200).json(ret);
});

app.post('/api/generate-flashcards', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    // 3. This is the crucial prompt!
    const prompt = `
      You are an expert flashcard generation assistant.
      Generate 10 flashcards for the topic: "${topic}".
      
      Respond with ONLY a valid JSON array. Each object in the array
      must have exactly two keys: "question" and "answer".
      
      Do not include any other text, explanations, or markdown formatting
      outside of the JSON array.
    `;

    // 4. Call the Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();

    // 5. Send the JSON data back to the React frontend
    // The model should return a string that is valid JSON
    res.json(JSON.parse(jsonText)); 

  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: 'Failed to generate flashcards.' });
  }
});


 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});