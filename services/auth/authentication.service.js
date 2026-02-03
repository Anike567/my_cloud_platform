const generateToken = require("../../scripts/generateToken");
const { v7: uuidv7 } = require('uuid');
const bcrypt = require('bcrypt');
const { pool } = require("../../config/db.cofig");
const invalidParameter  = require("./../../scripts/invalidParameter");


class authenticationService {
    constructor() { }

    async signin(req, res) {
        const { username, password } = req.body;

        // Input validation
        const invalidParams = invalidParameter({ username, password });
        if (!invalidParams.isValid) {
            return res.status(400).json({ error: invalidParams.message });
        }   

        try {
            // Fetch user from db
            // MySQL is case-insensitive by default, but keeping table names consistent is good practice
            const sql = 'SELECT _id, username, password FROM users WHERE username = ?';
            const [rows] = await pool.execute(sql, [username]);

            if (rows.length === 0) {
                
                return res.status(401).json({ error: "Invalid username or password" });
            } 

            const user = rows[0];
            
            // Verify password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid username or password" });
            }

            // Generate and encrypt token using the logic we built earlier
            const token = generateToken({ id: user._id, username: user.username });

            return res.status(200).json({
                message: "SignIn successful", 
                token: token,
                user: {
                    id: user._id,
                    username: user.username
                }
            });
        } catch (error) {
            console.error("SignIn Database Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    async signup(req, res) {
        const { username, email, password } = req.body;

        // Validation check
        const newUser = {
            _id: uuidv7(),
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
            const sql = 'INSERT INTO users (_id, username, email, password) VALUES (?, ?, ?, ?)';

            await pool.execute(sql, [
                newUser._id,
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