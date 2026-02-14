const generateToken = require("../../scripts/generateToken");
const { v7: uuidv7 } = require('uuid');
const bcrypt = require('bcrypt');
const { pool } = require("../../config/db.cofig");
const invalidParameter  = require("./../../scripts/invalidParameter");


class authenticationService {
    constructor() { }

    async signin(req, res) {
        const { username, password } = req.body;

        
        const invalidParams = invalidParameter({ username, password });
        if (!invalidParams.isValid) {
            
            return res.status(400).json({ error: invalidParams.message });
        }   

        try {
            
            const sql = 'SELECT _id, username, password FROM users WHERE username = ?';
            const [rows] = await pool.execute(sql, [username]);

            if (rows.length === 0) {
                console.log("User not found:", username);
                return res.status(404).json({ error: "User not found" });
            } 

            const user = rows[0];
           
            const passwordMatch = await bcrypt.compare(password, user.password);
            console.log(passwordMatch);
            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid username or password" });
            }

            // Generate and encrypt token using the logic we built earlier
            const token = generateToken({ id: user._id, username: user.username });
            const response = {
                message: "SignIn successful", 
                token: token,
                user: {
                    id: user._id,
                    username: user.username
                }
            }
            console.log(response);
            return res.status(200).json(response);
        } catch (error) {
            console.error("SignIn Database Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    async signup(req, res) {
        const { name, username, email, password } = req.body;

        // Validation check
        const newUser = {
            _id: uuidv7(),
            name,
            username,
            email,
            password: password
        };

        const invalidParams = invalidParameter(newUser);
        if (!invalidParams.isValid) {
            return res.status(400).json({ error: invalidParams.message });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = 'INSERT INTO users (_id, name, username, email, password) VALUES (?, ?, ?, ?, ?)';

            await pool.execute(sql, [
                newUser._id,
                name,
                username,
                email,
                hashedPassword
            ]);

            res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: newUser._id,
                    username,
                    email
                }
            });
        } catch (error) {
            if (error.errno === 1062) {
                return res.status(409).json({ error: "Username or Email already exists" });
            }
            console.error("Signup Database Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = authenticationService;