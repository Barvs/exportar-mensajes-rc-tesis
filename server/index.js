import express from "express";
import bodyParser from "body-parser";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import path from "path";
import cors from "cors";

import {
  getChannelMembers,
  getChannels,
  getGroups,
  getGroupMembers,
  getGroupMessages,
  getGroupsSingle,
} from "./rocketchat/service.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve("public")));

app.get("/", async (req, res) => {
  const homeView = path.resolve("home.html");

  return res.sendFile(homeView);
});

app.get("/login", async (req, res) => {
  const loginView = path.resolve("login.html");

  return res.sendFile(loginView);
});

app.get("/rc/get-channels", async (req, res) => {
  return res.json(await getChannels());
});

app.get("/rc/get-channel-members", async (req, res) => {
  const channelId = req.body.channel_id || req.query.channel_id;

  return res.json(await getChannelMembers(channelId));
});

app.get("/rc/get-groups", async (req, res) => {
  return res.json(await getGroups());
});

app.get("/rc/get-group-members", async (req, res) => {
  const groupId = req.body.group_id || req.query.group_id;

  return res.json(await getGroupMembers(groupId));
});

app.get("/rc/get-group-messages", async (req, res) => {
  const groupId = req.body.group_id || req.query.group_id;
  const userId = req.body.user_id || req.query.user_id;
  const fromDate = req.body.from_date || req.query.from_date;
  const toDate = req.body.to_date || req.query.to_date;

  return res.json(
    await getGroupMessages(groupId, { userId, fromDate, toDate })
  );
});

app.get("/rc/export-group-messages", async (req, res) => {
  const groupId = req.body.group_id || req.query.group_id;
  const userId = req.body.user_id || req.query.user_id;
  const fromDate = req.body.from_date || req.query.from_date;
  const toDate = req.body.to_date || req.query.to_date;

  const result = await getGroupMessages(groupId, { userId, fromDate, toDate });

  var group = await getGroupsSingle(groupId);
  var groupName = group.name;
  const timestamp = `from_${fromDate}_to_${toDate}`;

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  if (result.messages) {
    const fileName = `group_${groupName}_messages_${timestamp}.txt`;
    const filePath = path.resolve(`exports/${fileName}`);

    result.messages.forEach((message) => {
      const formattedMessage = `Nombre: ${
        message.user_name
      }\nFecha y hora: ${formatDate(message.date)}\nMensaje: ${
        message.message
      }\n\n`;

      fs.appendFileSync(filePath, formattedMessage, { flag: "a" }, (error) => {
        if (error) {
          console.log(error);
        }
      });
    });

    return res.download(filePath);
  }

  return res.json(result);
});

app.get("/export-list", async (req, res) => {
  const dirPath = path.resolve(`exports/`);
  console.log(dirPath);
  const files = fs.readdirSync(dirPath);
  console.log(files);

  return res.json(files);
});

app.get("/download-old-archive", async (req, res) => {
  const fileName = req.body.fileName || req.query.fileName;

  const filePath = path.resolve(`exports/${fileName}`);

  return res.download(filePath);

  //return res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
