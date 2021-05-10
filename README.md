[![Discord](https://discordapp.com/api/guilds/415566764697583628/embed.png)](https://discord.gg/d4syxTUXFc)
![License](https://poser.pugx.org/josh/laravel-phantomjs/license)

# Streamlabs-OBS Websocket Javascript Client
Connect and control Streamlabs-OBS websocket.

## How to use
### Get Token
In Streamlabs OBS, go to ``Settings``->``Remote Control`` and click on the ``QR-Code`` and then on ``show details``

### Usage
```js
const StreamlabsOBSClient = require("streamlabs-obs-socket-client")

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
```

### Available Methods
| Method | Description |
| ------- | ------- |
| `client.getScenes()` | get available scenes |
| `client.changeScene(sceneName = String)` | change the current scene |
| `client.changeSourceVisibility(sceneName = String, sourceName = String, visibility = Bool)` | change source visibility of an item in a scene |
| `client.toggleSourceVisibility(sceneName = String, sourceName = String)` | toggle visibility of an item in a scene |
| `client.getSourceItemFromScene(sceneName = String, sourceName = String)` | get a source item from a scene |

## Contributing
Thank you for considering contributing to this project!

## License
The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
