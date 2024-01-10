import axios from "axios";

const config = {
  HOST: "https://chat.manzanares.com.ve",
  USER: "Hk2P99p3DxhXzMxcb",
  PASS: "RDFNMtbV3ks9RMmbwpO1rylwXboNozxmv7tk8LL61aw",
  USE_SSL: true,
};

axios.defaults.baseURL = `${config.HOST}/api/v1`;
axios.defaults.headers.common["X-User-Id"] = config.USER;
axios.defaults.headers.common["X-Auth-Token"] = config.PASS;

async function getChannels() {
  try {
    const response = await axios.get("channels.list");

    const channels = response.data.channels
      .map((channel) => {
        return {
          id: channel._id,
          name: channel.name,
          fname: channel.fname,
          messages_count: channel.msgs,
          users_count: channel.usersCount,
          last_message_at: channel.lm,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return { channels: channels };
  } catch (err) {
    if (err.response.status !== 200) {
      return err.response.data;
    }
  }
}

async function getChannelMembers(channelId) {
  try {
    const response = await axios.get(`channels.members?roomId=${channelId}`);

    const members = response.data.members
      .map((member) => {
        return {
          id: member._id,
          name: member.name,
          username: member.username,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return { members: members };
  } catch (err) {
    if (err.response.status !== 200) {
      return err.response.data;
    }
  }
}

async function getGroups() {
  try {
    const response = await axios.get("groups.list");

    const groups = response.data.groups
      .map((group) => {
        return {
          id: group._id,
          name: group.name,
          messages_count: group.msgs,
          users_count: group.usersCount,
          last_message_at: group.lm,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return { groups: groups };
  } catch (err) {
    if (err.response.status !== 200) {
      return err.response.data;
    }
  }
}

async function getGroupsSingle(groupId) {
  try {
    const response = await axios.get(`groups.info?roomId=${groupId}`);

    const group = response.data.group;

    return {
      id: group._id,
      name: group.name,
      messages_count: group.msgs,
      users_count: group.usersCount,
      last_message_at: group.lm,
    };
  } catch (err) {
    if (err.response.status !== 200) {
      return err.response.data;
    }
  }
}

async function getGroupMembers(groupId) {
  try {
    const response = await axios.get(`groups.members?roomId=${groupId}`);

    const members = response.data.members
      .map((member) => {
        return {
          id: member._id,
          name: member.name,
          username: member.username,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return { members: members };
  } catch (err) {
    if (err.response.status !== 200) {
      return err.response.data;
    }
  }
}

async function getGroupMessages(groupId, { userId, fromDate, toDate }) {
  let filter = {};

  if (userId) {
    filter["u._id"] = userId;
  }

  if (fromDate && toDate) {
    filter["ts"] = {
      $gt: { $date: fromDate },
      $lt: { $date: toDate },
    };
  }

  let queryString = "";

  if (Object.keys(filter).length > 0) {
    queryString += `&query=${JSON.stringify(filter)}`;
  }

  try {
    const response = await axios.get(
      `groups.messages?roomId=${groupId}${queryString}`
    );

    const messages = response.data.messages
      .map((message) => {
        return {
          id: message._id,
          message: message.msg,
          date: message.ts,
          user_name: message.u.name,
          user_username: message.u.username,
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return { messages: messages };
  } catch (err) {
    if (err.response?.status !== 200) {
      return err.response.data;
    }
  }
}

export {
  getChannels,
  getChannelMembers,
  getGroups,
  getGroupMembers,
  getGroupMessages,
  getGroupsSingle,
};
