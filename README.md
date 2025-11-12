![alt text](https://github.com/Mat0108/PoSkin/blob/master/public/images/logobig.png?raw=true)

[![codecov](https://codecov.io/gh/Mat0108/Po-Skin-Back/graph/badge.svg?token=EOQU2XYOQ3)](https://codecov.io/gh/Mat0108/Po-Skin-Back)

## Setup the env file with the template
Demander à un menbre de la team Po. l'url de connection MongoDB
    
## Launch the app
We can easily run the whole with only a single command:

```bash
docker-compose up
```

Docker will pull Node.js images (if our machine does not have it before).

The services can be run on the background with command:
```bash
docker-compose up -d
```

To access the application :

```bash
api : http://localhost:8080
```


## Stop the System
Stopping all the running containers is also simple with a single command:
```bash
docker-compose down
```

If you need to stop and remove all containers, networks, and all images used by any service in <em>docker-compose.yml</em> file, use the command:
```bash
docker-compose down --rmi all
```


## Reload Docker
```bash
.\reload.bat
```

## Deploy
Avec l'acces au compte hub.docker ainsi qu'au compte de l'hebergeur
```bash
.\deploy.bat
```