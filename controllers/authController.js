const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.register = async (req, res) => {
   const { name, email, password } = req.body;

//    try {
//       // Check if user already exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//          return res.status(400).json({ message: 'Email already exists' });
//       }

//       // Hash password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       // Create new user
//       const user = new User({
//          name,
//          email,
//          password: hashedPassword,
//       });

//       await user.save();
//       res.status(201).json({ message: 'User registered successfully' });
//    } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//    }
// };
try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
        name,
        email,
        password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT token
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
} catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
}
}
// User Login
exports.login = async (req, res) => {
   const { email, password } = req.body;

   try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate JWT Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: '1h',
      });

      res.status(200).json({ token });
   } catch (error) {
      res.status(500).json({ message: 'Server error' });
   }
};
    