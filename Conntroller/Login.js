const jwt = require('jsonwebtoken');
const User  = require("../Model/Signup")
const bcrypt = require('bcrypt');

const generateAdminToken = (userId) => {
    // console.log("generating admin token")
    return jwt.sign({ userId, role: 'admin' }, process.env.ADMIN_SECRET_KEY);
  };
  
  const generateSubadminToken = (userId) => {
    return jwt.sign({ userId, role: 'subadmin' }, process.env.SUBADMIN_SECRET_KEY, { expiresIn: '12h' });
  };
  
  
  const generateUserToken = (userId) => {
    // console.log("generating user token")

    return jwt.sign({ userId, role: 'user' }, process.env.USER_SECRET_KEY);
  };


  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email, password)
  // console.log(username,"username")
      // Find the user in the database based on the username
      const user = await User.findOne({ email });
  
      // Check if the user exists and the password is correct
      if (!user ) {
        return res.status(401).json({ message: 'User not found' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

  
      // Generate a separate token based on the user's role
      let token;
      if (user.role === 'admin') {
        console.log(user.role)
        token = generateAdminToken(user._id);
      } else if (user.role === 'subadmin') {
        token = generateSubadminToken(user._id);
      } else {
        token = generateUserToken(user._id);
      }
  // console.log(token,"token")
      res.json({success:true , message :"Login successful", token,user });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  };
  
  module.exports = {
    login,
  };