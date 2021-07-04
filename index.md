![Ursamu](media://ursamu_github_banner.png)

> This repo is in it's very early stages of testing. While everything is here that you need to start an **UrsamMU** installation of your own, the documentation is still a wrok in progress. And, as we reach a 1.0 stable release of the API, breaking changes are sure to happen! Be warned

This repo represents the core functionality of the UrsamMU game engine. With this repository you can quickly build your own bare-bones UrsaMU installation! It handles the connections, characters and basic functionality of an **UrsaMU** Server.

```ts
import { app } from "@ursamu/core";

app.listen(4201);
```

With two lines you'll be broadcasting on socket.io port 4201, waiting for a client to connect!

For more information on the API of @ursamu/core - check out the list!

Thanks for visiting!


## Broadcast
Broadcast is used to send messages to different entities within the game.  It's a 
