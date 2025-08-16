'use server'

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });  // ensures it loads from your file

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const client = new MongoClient(uri);

async function start() {
  await client.connect();
  const db = client.db("test");
  const collection = db.collection("messages");

  // Listen for new inserts
  const changeStream = collection.watch([{ $match: { operationType: "insert" } }]);
  changeStream.on("change", (change) => {
    io.emit("newMessage", change.fullDocument);
  });

  server.listen(3001, () => console.log("Server running"));
}

start();

io.on("connection", (socket) => {
  console.log("Client connected");
});