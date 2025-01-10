const express = require('express')
const app = express();
const connection=require('./config/connection')
const dotenv=require('dotenv')
dotenv.config();
const jwt=require('jsonwebtoken')
const userModel=require('./models/user.model')
const cookieParser = require('cookie-parser');
const cors=require('cors')
const bcrypt=require('bcrypt')
const {generateToken }= require('./Utils/generateToken.js')
const TourModel=require('./models/Tour.model.js')


app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send('app is running anilesh bha') 
})

app.post('/register', async (req,res)=>{
  
    try {
        let cheak= await userModel.findOne({email:req.body.email})
        if(cheak){
          return res.status(400).json({message:"Email already exist"})
        }
        
        const { name, email, password,confirm_password } = req.body;
      
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const user= await userModel.create({
          name,
          email,
          password: hashedPassword,
          confirm_password:hashedPassword,
        });
      
        let token= generateToken(user);
      
        res.json({ message: 'Sign up successfully', token });

      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
})


app.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found. Please sign up first.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      } 

      const token = generateToken(user);
      res.cookie('token', token);
      res.json({ message: 'login succesfully', token });
      
  } catch (error) {
      
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post('/profile', async(req,res)=>{
        const {token}=req.body;
        const decoded = jwt.verify(token, process.env.JWT_KEY);   
        const email= decoded.email
        const user= await userModel.findOne({email})
        res.status(200).json({user})
})


app.get('/destination', async (req, res) => {
  try {
      const data = await TourModel.find(); 
      res.send(data)
  } catch (error) {
      res.status(500).send({ message: 'Error fetching data', error }); 
      console.error(error);  
  } 

});
app.get('/user',async(req,res)=>{
   try{
    const user=await userModel.find();
    res.send(user)
   }
   catch(error){
    res.status(400).json({message:'kkqdwk'})
   }
})

app.delete('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findByIdAndDelete(id); // Corrected deletion logic
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(process.env.PORT||3000);
