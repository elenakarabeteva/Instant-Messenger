import * as express from 'express';
import  bcrypt from 'bcrypt';
import { User } from "../models/user";

export const register = async (request: express.Request, response: express.Response) => {
  const { username, password, email, name } = request.body;
    
  if (!username || username.length < 4) {
    return response.status(400).json({ message: "Username must be at least 4 characters." });
  }
  if (!password || password.length < 6) {
     return response.status(400).json({ message: "Password must be at least 6 characters." });
  }
  if (!email || !email.includes('@')) {
     return response.status(400).json({ message: "Invalid email address." });
  }
  if (!name || name.length < 3) {
     return response.status(400).json({ message: "Name must be at least 3 characters." });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
       return response.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
    //   id: uuidv4(),
      username,
      password: hashedPassword,
      email,
      name,
      last_active: new Date().toISOString(),
      profile_pic: "uploads/default.png"
    });

    await newUser.save();

    const { password: _, ...userSafe } = newUser.toObject();
    response.status(201).json({ message: 'User registered', user: userSafe });
  } catch (error) {
    response.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (request: express.Request, response: express.Response) => {
  const { email, password } = request.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return response.status(401).json({ message: 'Invalid credentials (user not found)' });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password);
    if (!passwordMatches) {
      return response.status(401).json({ message: 'Invalid credentials (wrong password)' });
    }

    user.last_active = new Date();
    await user.save();

    //const { password: _, ...userSafe } = user.toObject();
    response.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    response.status(500).json({ message: 'Server error', error });
  }
};

//export const profile = async (request: express.Request, response: express.Response) => {
//   try {
//     const user = await User.findOne({ email: request.params.email });
//     if (user) {
//       const { password: _, ...userSafe } = user.toObject();
//       response.json(userSafe);
//     } else {
//       response.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     response.status(500).json({ message: 'Server error', error });
//   }
// }