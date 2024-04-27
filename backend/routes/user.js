const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db/db")
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware/middleware");

const router = express.Router();

const signupSchema = z.object({
    username: z.string().email(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string()
});

router.post("/signup", async (req, res)=>{
    const { success } = signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg: "Email already taken / Incorrect Inputs"
        })
    }
    const existingUser = await User.findOne({
        username: req.body.username
    });
    if(existingUser){
        return res.status(411).json({
            msg: "Email already taken / Incorrect Inputs"
        })
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({userId}, JWT_SECRET);

    res.status(200).json({
        msg: "User created successfully",
        token: token
    })
});

const signinSchema = z.object({
    username: z.string().email(),
    password: z.string()
});

router.post("/signin", async (req, res)=>{
    const { success } = signinSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg: "Incorrect Inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        return res.status(200).json({
            token: token
        })
    }

    res.status(411).json({
        msg: "Error while logging in"
    })
});

const updateSchema = z.object({
    password: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional()
});

router.put("/", authMiddleware, async (req, res)=>{
    const {success} = updateSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg: "Error while updating information"
        })
    }
        
    await User.updateOne({_id: req.UserId}, req.body);

    return res.status(200).json({
        msg: "Updated successfully"
    });
});

router.get("/bulk", async (req, res)=>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or:[{
            firstname:{
                "$regex": filter
            }
        },{
            lastname: {
                "$regex": filter
            }
        }]
    });

    res.status(200).json({
        user: users.map(user=>({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    });
});


module.exports = router;