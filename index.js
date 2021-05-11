const WebsocketClient = require('sockjs-client');

//Event message ID's to manage our callbacks from slobs.
const ConnectEvent = 1,
StreamingStatusEvent = 2,
StreamingStatusChangedEvent = 3,
ScenesEvent = 4;

module.exports = class StreamlabsOBSClient {
  
  token;
  scenes;
  sceneIds;
  startTimer;
  
  constructor(opts) {
    if (opts.connectionString === undefined) {
      this.port = opts.port === undefined ? 59650 : opts.port
      this.uri = opts.uri === undefined ? "127.0.0.1" : opts.uri
      this.path = opts.path === undefined ? "api" : opts.path
      this.token = opts.token;
      this.scenes = {};
      this.sceneIds = {};
      this.connectionString = `http://${this.uri}:${this.port}/${this.path}`
    }
  }
  
  connect() {
    
    this.socket = new WebsocketClient(this.connectionString);
    
    return new Promise(resolve, reject => {
      
      //AUTHORIZE WITH SLOBS
      this.socket.onopen = () => {
        this.authenticate()
      };
      
      this.socket.onerror = reject
      
      // HANDLE MESSAGES RECEIVED
      this.socket.onmessage = message => {
        
        const data = JSON.parse(message.data);
        
        switch (data.id) {
          
          case ConnectEvent:
          if (data.error !== undefined) {
            this.handleError(data.error.message)
            return
          }
          if (!data.result) {
            this.authenticate()
            return
          }
          this.subscribe("streaming");
          this.subscribe("status");
          this.subscribe("scenes");
          break
          
          case StreamingStatusEvent:
          this.streamStatus = data.result.streamingStatus
          this.startTimer = (this.streamStatus === 'live' ? data.result.streamingStatusTime : null);
          break
          
          case ScenesEvent:
          for (let i = 0; i < data.result.length; i++) {
            const sources = new Map();
            for (let j = 0; j < data.result[i].nodes.length; j++) {
              sources.set(data.result[i].nodes[j].name, data.result[i].nodes[j]);
            }
            const sceneName = data.result[i].name;
            this.scenes[sceneName] = sources
            this.sceneIds[sceneName] = data.result[i].id;
          }
          break;
        }
        
      }
      
      //Output error message if socket closes
      this.socket.onclose = reject
      
      resolve(this.socket)
      
    })
    
  }
  
  subscribe(event) {
    let message;
    switch (event) {
      case "streaming":
      message = {
        id: StreamingStatusChangedEvent,
        jsonrpc: '2.0',
        method: 'streamingStatusChange',
        params: { resource: 'StreamingService' },
      }
      break
      case "status":
      message = {
        id: StreamingStatusEvent,
        jsonrpc: '2.0',
        method: 'getModel',
        params: { resource: 'StreamingService' },
      }
      break
      case "scenes":
      message = {
        id: ScenesEvent,
        jsonrpc: '2.0',
        method: 'getScenes',
        params: { resource: 'ScenesService' },
      }
      break
    }
    this.send(message);
  }
  
  getSourceItemFromScene(sceneName, sourceName) {
    return this.scenes[sceneName].get(sourceName)
  }
  
  changeSourceVisibility(sceneName, sourceName, visibility) {
    const source = this.getSourceItemFromScene(sceneName, sourceName)
    if (visibility == null) {
      visibility = !source.visible
    }
    this.send({
      id: 10,
      jsonrpc: '2.0',
      method: 'setVisibility',
      params: {
        resource: `SceneItem["${source.sceneId}","${source.sceneItemId}","${source.sourceId}"]`,
        args: [visibility]
      },
    });
    source.visible = visibility
  }
  
  toggleSourceVisibility(sceneName, sourceName) {
    this.changeSourceVisibility(sceneName, sourceName, null)
  }
  
  changeScene(sceneName) {
    this.send({
      id: 10,
      jsonrpc: '2.0',
      method: 'makeSceneActive',
      params: {
        resource: 'ScenesService',
        args: [this.sceneIds[sceneName]],
      },
    });
  }
  
  send(message) {
    this.socket.send(JSON.stringify(message));
  }
  
  handleError(errMessage) {
    switch (errMessage) {
      case 'INTERNAL_JSON_RPC_ERROR Invalid token':
      console.log("Unauthorized!");
      return
    }
  }
  
  authenticate() {
    console.log("Authenticating to Streamlabs-OBS websocket...");
    this.socket.send(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'auth',
      params: {
        resource: 'TcpServerService',
        args: [this.token],
      },
    }));
  }
  
  getScenes() {
    return this.scenes;
  }
  
}



