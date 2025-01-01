const express = require("express");
const zod = require('zod');
const app = express();

app.use(express.json());

// Create HTTP protocol using express
// Use in-memory array to store username and password of users
const User = [
   {
      username: 'ankit',
      password: '1234' // Note: Never store plain-text passwords in production
   }
];

// Schema for validation using Zod
const UserSchema = zod.object({
   username: zod.string().min(4, 'Username must have at least 4 characters'),
   password: zod.string().min(4, 'Password must have at least 4 characters')
});

app.get('/', (req, res) => {
   console.log('Hello there!');
   res.send(User);
});

// POST route to add new user
app.post('/', (req, res) => {
   // Validate the incoming request using Zod schema
   const parsed = UserSchema.safeParse(req.body);

   if (!parsed.success) {
      // Return validation errors to the client
      return res.status(400).json({
         error: 'Validation failed',
         issues: parsed.error.errors
      });
   }

   const { username, password } = parsed.data;

   // Check if the user already exists
   const userExists = User.find((user) => user.username === username);
   if (userExists) {
      return res.status(400).json({
         error: 'User already exists with this username'
      });
   }

   // Add new user to the list
   User.push({ username, password });
   res.status(201).json({
      message: 'User successfully added'
   });
});

app.listen(3000, () => {
   console.log('Server is running on port 3000');
});
