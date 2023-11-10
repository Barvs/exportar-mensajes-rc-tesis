import express from 'express';
import bodyParser from 'body-parser';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';

import { getChannelMembers, getChannels, getGroups, getGroupMembers, getGroupMessages } from './rocketchat/service.js'

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/rc/get-channels', async (req, res) => {
    return res.json(await getChannels());
});

app.get('/rc/get-channel-members', async (req, res) => {
    const channelId = req.body.channel_id || req.query.channel_id;

    return res.json(await getChannelMembers(channelId));
});


app.get('/rc/get-groups', async (req, res) => {
    return res.json(await getGroups());
});

app.get('/rc/get-group-members', async (req, res) => {
    const groupId = req.body.group_id || req.query.group_id;

    return res.json(await getGroupMembers(groupId));
});


app.get('/rc/get-group-messages', async (req, res) => {
    const groupId = req.body.group_id || req.query.group_id;
    const userId = req.body.user_id || req.query.user_id;
    const fromDate = req.body.from_date || req.query.from_date;
    const toDate = req.body.to_date || req.query.to_date;

    return res.json(await getGroupMessages(groupId, { userId, fromDate, toDate }));
});

app.post('/rc/export-group-messages', async (req, res) => {
    const groupId = req.body.group_id || req.query.group_id;
    const userId = req.body.user_id || req.query.user_id;
    const fromDate = req.body.from_date || req.query.from_date;
    const toDate = req.body.to_date || req.query.to_date;

    const result = await getGroupMessages(groupId, { userId, fromDate, toDate });

    if (result.messages) {

        const timestamp = new Date().getTime();

        const fileName = `group_${groupId}_messages_${timestamp}.csv`;
        const filePath = path.resolve(`exports/${fileName}`);

        const fd = fs.openSync(filePath, 'w');

        const headers = [
            { id: 'id', title: 'ID'},
            { id: 'message', title: 'Message'},
            { id: 'date', title: 'Date'},
            { id: 'user_name', title: 'User Name'},
            { id: 'user_username', title: 'User Alias'},
        ];

        const writer = createObjectCsvWriter({
            path: filePath,
            header: headers
        });

        try {
            await writer.writeRecords(result.messages);
        } catch(err) {
            console.log(err);
        }

        return res.json({
            message: "Messages exported!"
        });
    }

    return res.json(result);
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});