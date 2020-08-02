[![Discord](https://discordapp.com/api/guilds/415566764697583628/embed.png)](https://discord.gg/udz5DC6)
![License](https://poser.pugx.org/josh/laravel-phantomjs/license)

# Streamlabs-OBS Websocket Javascript Client
Connect and control Streamlabs-OBS websocket.

## How to use
### Get Token
In Streamlabs OBS, go to ``Settings``->``Remote Control`` and click on the ``QR-Code`` and then on ``show details``

### Usage
```
const StreamlabsOBSClient = require("streamlabs-obs-socket-client")

const client = new StreamlabsOBSClient({
    token: "{TOKEN}",
});

client.connect();

setTimeout(() => {
    client.changeScene("Scene Name")
}, 3000)
```

## Contributing
Thank you for considering contributing to this project!

## License
The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
