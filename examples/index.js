const StreamlabsOBSClient = require("../index.js")

const client = new StreamlabsOBSClient({
    token: "{TOKEN}",
});

client.connect();

setTimeout(() => {
    client.changeScene("Desktop")
}, 3000)