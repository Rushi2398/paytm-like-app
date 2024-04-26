const express = require("express");
const { authMiddleware } = require("../middleware/middleware");
const { Account } = require("../db/db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res)=>{
    const account = await Account.findOne({
        userId: req.userId
    });
    res.status(200).json({
        balance: account.balance
    });
});

router.post("/transfer", authMiddleware, async(req, res)=>{
    // create session with mongoose
    const session = await mongoose.startSession();

    // start transaction
    session.startTransaction();
    const { to, amount } = req.body;

    const account = await Account.findOne({
        userId: req.userId
    }).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Insufficient balance"
        });
    }

    const toUser = await Account.findOne({
        userId: to
    }).session(session);

    if(!toUser){
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Invalid Account"
        });
    };

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    }).session(session);

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    }).session(session);

    // commit the transaction
    await session.commitTransaction();
    res.status(200).json({
        msg: "Transaction Successful"
    });
});

module.exports = router;