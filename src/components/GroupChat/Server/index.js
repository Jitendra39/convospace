const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const cors = require("cors");

const Groups = require("./models/Groups");
const Member = require("./models/Members");
const Message = require("./models/GroupMessage");

dotenv.config();

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else {
  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  app.use(cors());
  app.use(express.json());

  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

  app.use(express.static("public"));

  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
      socket.join(room);
    });

    socket.on(
      "sendMessage",
      async ({ text, room, groupId, senderId, date, time, photoURL }) => {
        const messageData = {
          text,
          room,
          groupId,
          senderId,
          dates: date,
          time,
          photoURL,
        };
        console.log("text", text);
        socket.join(room);
        io.in(room).emit("newMessage", messageData);

        try {
          await Message.findOneAndUpdate(
            { groups: groupId },
            {
              $addToSet: {
                message: {
                  senderId: senderId,
                  text,
                  dates: date,
                  time,
                  photoURL,
                },
              },
            },
            { upsert: true, new: true }
          );
        } catch (err) {}
      }
    );

    socket.on("deleteMessage", async ({ dates, groupId }) => {
      try {
        await Message.updateOne(
          { groups: groupId },
          { $pull: { message: { dates: new Date(dates) } } }
        );
      } catch (err) {}
    });
  });

  app.post("/api/createGp/", async (req, res) => {
    const { selectedFriends, groupName, uid, addGpId } = req.body;
    const validMembers = Object.values(selectedFriends);
    let newGroup;

    if (!addGpId) {
      newGroup = new Groups({
        groupName,
        admin: uid,
        members: validMembers,
      });
    } else {
      await Groups.findOneAndUpdate(
        { _id: addGpId },
        {
          $addToSet: {
            members: { $each: validMembers },
          },
        }
      );
    }

    try {
      let savedGroup;
      if (!addGpId) {
        savedGroup = await newGroup.save();
      }

      for (const member of validMembers) {
        try {
          await Member.findOneAndUpdate(
            { uid: member.uid },
            {
              $set: {
                name: member.name,
                photoURL: member.photoURL,
              },
              $addToSet: {
                groups: {
                  groupId: addGpId ? addGpId : savedGroup._id,
                },
              },
            },
            { upsert: true, new: true }
          );
        } catch (err) {
          if (err.code === 11000) {
            console.warn(
              `Duplicate key error for member ${member.uid}:`,
              err.message
            );
          } else {
            throw err;
          }
        }
      }

      if (savedGroup) {
        res.end("Done");
      } else {
        res.end("Not Done");
      }
      console.log("create is called");
    } catch (err) {
      console.error("Error saving group or updating members:", err);
    }
  });

  app.get("/api/members/:uid", async (req, res) => {
    try {
      const member = await Member.findOne({ uid: req.params.uid }).populate(
        "groups.groupId"
      );

      if (member) {
        res.json(member);
      }
    } catch (err) {
      // res.status(500).send(err.message);
    }
  });

  app.get("/api/groupMessages/:id", async (req, res) => {
    try {
      const messages = await Message.findOne({ groups: req.params.id });
      if (messages) {
        res.json(messages);
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.post("/api/deleteGpMember", async (req, res) => {
    const { gpName, gpId, id } = req.body;

    try {
      await Member.updateOne(
        { uid: id },
        { $pull: { groups: { groupId: gpId } } }
      );
      await Groups.updateOne(gpId ? { _id: gpId } : { groupName: gpName }, {
        $pull: { members: { uid: id } },
      });
    } catch (err) {
      console.log(err);
    } finally {
      res.send("Member deleted");
    }
  });

  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    console.log()
    console.log(`Worker ${process.pid} `);
    console.log("port", PORT);
  });
}
