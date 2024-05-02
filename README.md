# Raclette Party backend 🧀

## Sommaire

- [Commandes principales](#commandes-principales)
  - [Démarrer le projet en dev](#démarrer-le-projet-en-dev)
  - [Redeployer en prod du back](#redeployer-en-prod-du-back)
  - [Redeployer en prod en front](#redeployer-en-prod-en-front)
- [Configuration VSCode](#configuration-vscode)
- [Commandes annexe](#commandes-annexe)
  - [⚡🥴 Supprimer tous les docker et volumes de le machine](#⚡🥴-supprimer-tous-les-docker-et-volumes-de-le-machine)
  - [Lancer le projet](#lancer-le-projet)
  - [Annuler et réapliquer les migrations et le seedings](#annuler-et-réapliquer-les-migrations-et-le-seeding)
  - [Seeder la DB](#seeder-la-db)
  - [Rentrer en ligne de commande dans un container docker](#rentrer-en-ligne-de-commande-dans-un-container-docker)
  - [Activer les Query Log Global MySQL](#activer-les-query-log-global-mysql)
- [Historique des commandes](#historique-des-commandes)
  - [Création des migrations et models](#création-des-migrations-et-models)
  - [Crée la migration des triggers](#crée-la-migration-des-triggers)
  - [Création des seeders](#création-des-seeders)
  - [Installer Docker sous Debian dans un container LXC sous Proxmox](#installer-docker-sous-debian-dans-un-container-lxc-sous-proxmox)
  - [Commande Osmosis](#commande-osmosis)

## Commandes principales

### Démarrer le projet en dev

1. Clonner le projet : `git clone git@github.com:O-clock-Pegase/projet-13-Tartiflette-Party-back.git`
2. Lancer l'outil de déploiment : `sudo ./tools.sh`

### Redeployer en prod du back

1. Se connecter en SSH avec git_deploy : ssh git_deploy@oraclette.com -p 2224
2. Passe en root avec `su -`
3. Stoppert le service : `systemctl stop oraclette.service`
4. Passer en git_deploy : su git_deploy
5. Aller dans le repertoire `/home/git_deploy/projet-13-Tartiflette-Party-back`
6. Update le projet `git pull`
7. Revenire en root `exit`
8. Lancer le service : `systemctl stop oraclette.service`
9. Appliquer les migrations : `docker exec oraclette_node npx sequelize-cli db:migrate`

### Redeployer en prod en front

1. Se connecter en SSH avec git_deploy : ssh git_deploy@oraclette.com -p 2223

## Configuration VSCode

```bash
git config --global core.autocrlf false
git config core.ignorecase false
```

Créer le fichier de configuration de l'IDE

```sh
mkdir -p .vscode && touch .vscode/settings.json
```

Ajouter les paramètres nécessaires

```json
{
	"prettier.useTabs": true
}
```

## Commandes annexe

### ⚡🥴 Supprimer tous les docker et volumes de le machine

```bash
sudo docker stop $(sudo docker ps -q)
sudo docker system prune -a
sudo docker volume rm $(sudo docker volume ls -q)
```

### Lancer le projet

```bash
sudo docker compose up --build
```

### Annuler et réapliquer les migrations et le seeding

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

```sh
sudo docker exec -it oraclette_db /bin/bash
```

### Activer les Query Log Global MySQL

```sh
sudo docker exec -it oraclette_db /bin/bash

mariadb -u root -p

SET global general_log = on;
SET global general_log_file='/var/log/mysql/mysql.log';
SET global log_output = 'file';

sudo docker exec -it oraclette_db /usr/bin/tail -f /var/log/mysql/mysql.log
```

## Historique des commandes

### Création des migrations et models

```bash
# User
sudo docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name User --attributes firstname:string,lastname:string,birthdate:date,email:string,password:string,password_reset_token:string,provider:text,provider_id:text,gender:boolean

# Event
sudo docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name Event --attributes description:text,adress:text,zip_code:text,city:text,available_slot:integer,image_name:text,created_by:integer

# EventRegister
sudo docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name EventRegister --attributes status:integer,event_id:integer,register_by:integer

# Message
sudo docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name Message --attributes message:text,disabled:boolean,event_id:integer,writed_by:integer

# ZipCode :
sudo docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name ZipCode --attributes zip_code:string,name:string,lat:float,lon:float

# Photo :
sudo docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name Photo --attributes image_name:string

# PhotoLike
sudo docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name PhotoLike --attributes event_id:integer,user_id:integer

# Log
sudo docker exec oraclette_node npx sequelize model:generate --models-path "./app/models" --name Log --attributes text:string
```

### Crée la migration des triggers

```sh
sudo docker exec oraclette_node npx sequelize migration:create --name=create-log-trigger
```

### Création des seeders

```bash
docker exec oraclette_node npx sequelize-cli seed:generate --name demo-user
docker exec oraclette_node npx sequelize-cli seed:generate --name demo-events
docker exec oraclette_node npx sequelize-cli seed:generate --name demo-eventRegister
docker exec oraclette_node npx sequelize-cli seed:generate --name demo-zipCode
```

### Installer Docker sous Debian dans un container LXC sous Proxmox

```bash
# Dans Proxmox : Verifier si le kernel module nécésiare est activer
lsmod | grep -E 'overlay|aufs'
# Si la commande ne retourne rien
echo -e "overlay\naufs" >> /etc/modules-load.d/modules.conf
# Et reboot le serveur

# Dans Proxmox : Crée un conteneur LXC et éditer sa config :
nano /etc/pve/lxc/116.conf
Remplacer : features: nesting=1
Par : features: keyctl=1,nesting=1

# Dans le conteneur : Installer les prérequis
apt install sudo
dpkg-reconfigure tzdata # Pour mettre à l'heure le serveur
apt-get update && apt-get upgrade && apt-get dist-upgrade && apt-get autoremove

# Dans le conteneur :
# https://docs.docker.com/engine/install/debian/
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Ajouter l'user git_deploy au groupe Docker
sudo usermod -aG docker git_deploy
sudo systemctl restart docker

# Crée un service pour lancer l'API au boot
nano /etc/systemd/system/oraclette.service
+ [Unit]
+ Description=Docker Container service
+ After=docker.service
+ Requires=docker.service
+
+ [Service]
+ User=git_deploy
+ Group=docker
+ Type=simple
+ Restart=always
+ ExecStart=/usr/bin/docker compose -f /home/git_deploy/projet-13-Tartiflette-Party-back/docker-compose.yml up
+ ExecStop=/usr/bin/docker compose -f /home/git_deploy/projet-13-Tartiflette-Party-back/docker-compose.yml up down
+
+ [Install]
+ WantedBy=multi-user.target

# Tester le service :
systemctl start oraclette.service

# Voir les log en directe :
journalctl -u oraclette.service -f

# Activer le service au reboot
systemctl enable oraclette.service

# Relance le serveur
systemctl restart oraclette.service

apt-get install policykit-1
```

### Commande Osmosis

```sh
osmosis \
--read-pbf file="france-latest.osm.pbf" \
--tf accept-nodes "waterway=river" "waterway=stream" "natural=water" \
--tf reject-ways \
--tf reject-relations \
--sort \
\
--read-pbf file="france-latest.osm.pbf" \
--tf accept-ways "waterway=river" "waterway=stream" "natural=water" \
--tf reject-relations \
--used-node \
--sort \
\
--read-pbf file="france-latest.osm.pbf" \
--tf accept-relations "waterway=river" "waterway=stream" "natural=water" \
--used-way \
--used-node \
--sort \
\
--merge --merge \
--write-pbf granularity=10000 "france-latest-waterways.osm.pbf"


osmosis \
--read-pbf file="france-latest.osm.pbf" \
--tf accept-nodes "place=country,state,region,province,district,county,municipality,city,town,village,hamlet,isolated_dwelling,farm,allotments" \
--tf reject-ways \
--tf reject-relations \
--sort \
\
--read-pbf file="france-latest.osm.pbf" \
--tf accept-ways "place=country,state,region,province,district,county,municipality,city,town,village,hamlet,isolated_dwelling,farm,allotments" \
--tf reject-relations \
--used-node \
--sort \
\
--read-pbf file="france-latest.osm.pbf" \
--tf accept-relations "place=country,state,region,province,district,county,municipality,city,town,village,hamlet,isolated_dwelling,farm,allotments" \
--used-way \
--used-node \
--sort \
\
--merge --merge \
--write-pbf granularity=10000 "france-latest-place.osm.pbf"


osmosis \
--read-pbf file="france-latest.osm.pbf" \
--tf accept-nodes "highway=*" \
--tf reject-ways \
--tf reject-relations \
--sort \
\
--read-pbf file="france-latest.osm.pbf" \
--tf accept-ways "highway=*" \
--tf reject-relations \
--used-node \
--sort \
\
--read-pbf file="france-latest.osm.pbf" \
--tf accept-relations "highway=*" \
--used-way \
--used-node \
--sort \
\
--merge --merge \
--write-pbf granularity=10000 "france-latest-highway.osm.pbf"

osmosis \
  --read-pbf file="france-latest-highway.osm.pbf" \
  --sort \
  --read-pbf file="france-latest-place.osm.pbf" \
  --sort \
  --read-pbf file="france-latest-waterways.osm.pbf" \
  --sort \
  --merge \
  --merge \
  --write-pbf granularity=10000 "france-latest-light.osm.pbf"


docker stop $(docker ps -q)
docker system prune -a
docker volume rm $(docker volume ls -q)

docker volume create osm-data
docker run -v /root/france-latest-light.osm.pbf:/data/region.osm.pbf -v osm-data:/data/database/ overv/openstreetmap-tile-server import
docker run -e "OSM2PGSQL_EXTRA_ARGS=-C 8172" --shm-size=2g --cpus=9 -e THREADS=50 -p 80:80 -v osm-data:/data/database --sig-proxy=false overv/openstreetmap-tile-server run
docker run -e "OSM2PGSQL_EXTRA_ARGS=-C 8172" --shm-size=2g --cpus=9 -e THREADS=50 -p 80:80 -v osm-data:/data/database -d overv/openstreetmap-tile-server run

shared_buffers = 128MB
min_wal_size = 1GB
# max_wal_size = 2GB # Overridden below
maintenance_work_mem = 256MB

# Suggested settings from
# https://github.com/openstreetmap/chef/blob/master/roles/tile.rb#L38-L45

max_connections = 250
temp_buffers = 32MB
work_mem = 128MB
wal_buffers = 1024kB
wal_writer_delay = 500ms
commit_delay = 10000
# checkpoint_segments = 60 # unrecognized in psql 10.7.1
max_wal_size = 2880MB
random_page_cost = 1.1
track_activity_query_size = 16384
autovacuum_vacuum_scale_factor = 0.05
autovacuum_analyze_scale_factor = 0.02
```
