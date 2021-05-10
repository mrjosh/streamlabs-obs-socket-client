const StreamlabsOBSClient = require("../index.js")

const client = new StreamlabsOBSClient({
  token: "{YOUR-SLOBS-ACCESS-TOKEN}",
  port:  59650,
  uri:   "localhost",
});

// create slobs websocket connection
client.connect().then(() => {

  // change the scene
  client.changeScene("Desktop")

})
