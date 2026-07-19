// const express = require("express")
import express from "express";
import cors from "cors";
import "dotenv/config";

import fs from "fs";
import path from "path";

import { clerkMiddleware } from '@clerk/express';

import User from "./models/User.js";
import { connectDB } from "./lib/db.js";


const app = express();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(path.resolve(), "public");

app.use(express.json());
app.use(cors({origin:FRONTEND_URL, credentials:true}));
app.use(clerkMiddleware());

app.get("/health", (req,res) => {
    res.status(200).json({ok:true});
});

//if the public directory exists, serve the static files and handle all other routes by sending index.html
if (fs.existsSync(publicDir)) {

    app.use(express.static(publicDir));

    app.get("/{*any}", (req,res) => {
        res.sendFile(path.join(publicDir, "index.html") , (err) => next(err));
    });
};

app.listen (PORT, () => {
    connectDB();
    console.log ("server is up and running on PORT:",PORT);

    if (process.env.NODE_ENV === "production") {
        job.start();
    }
});
