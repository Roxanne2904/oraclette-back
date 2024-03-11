# Raclette Party backend 🧀

## Commandes princiaple

### Démarrer le projet en dev

1. Clonner le projet : ``

## Commandes annexe

### ⚡🥴 Supprimer tous les docker et volumes de le machine

```bash
docker stop $(docker ps -q)
docker system prune -a
docker volume rm $(docker volume ls -q)
```

### Lancer le projet

```bash
docker compose up --build
```

### Annuler et réapliquer les migrations et le seedings

```bash
docker exec oraclette_node npx sequelize-cli db:migrate:undo:all
docker exec oraclette_node npx sequelize-cli db:migrate
docker exec oraclette_node npx sequelize-cli db:seed:all
```

### Seeder la DB

```bash
docker exec oraclette_node npx sequelize-cli db:migrate:undo:all
docker exec oraclette_node npx sequelize-cli db:migrate
docker exec oraclette_node npx sequelize-cli db:seed:all
```

### Rentrer en ligne de commande dans un container docker

`sudo docker exec -it <container_name> /bin/bash`

### Activer les Query Log Global MySQL

```
sudo docker exec -it oraclette_db /bin/bash

mariadb -u root -p

SET global general_log = on;
SET global general_log_file='/var/log/mysql/mysql.log';
SET global log_output = 'file';

<sudo> docker exec -it oraclette_db /usr/bin/tail -f /var/log/mysql/mysql.log
```

## Historique des commandes

### Création des migrations et models

```bash
# User
docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name --name User --attributes firstname:string,lastname:string,birthdate:date,email:string,password:string,password_reset_token:string,provider:text,provider_id:text,gender:boolean

# Event
docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name --name Event --attributes description:text,adress:text,zip_code:text,city:text,available_slot:integer,image_name:text,created_by:integer

# EventLike
docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name --name EventLike --attributes event_id:integer,liked_by:integer

# EventRegister
docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name --name EventRegister --attributes status:integer,event_id:integer,register_by:integer

# Message
docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name --name Message --attributes message:text,disabled:boolean,event_id:integer,writed_by:integer

# ZipCode :
docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name ZipCode --attributes zip_code:string,name:string,lat:float,lon:float
```

### Création des seeders

```bash
docker exec oraclette_node npx sequelize-cli seed:generate --name demo-user
docker exec oraclette_node npx sequelize-cli seed:generate --name demo-events
docker exec oraclette_node npx sequelize-cli seed:generate --name demo-eventRegister
docker exec oraclette_node npx sequelize-cli seed:generate --name demo-zipCode
```
