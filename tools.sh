#!/bin/bash

ENV_EXEMPLE=".env.example"
ENV_FILE=".env"

# Fonction pour générer une chaîne aleatoire
generate_random_string() {
    cat /dev/urandom | tr -dc 'a-z0-9' | fold -w ${1:-20} | head -n 1
}

create_env_file() {
    # Générer des valeurs aléatoires
    DEV_DB_PASSWORD=$(generate_random_string 20)
    DEV_DB_ROOT_PASSWORD=$(generate_random_string 20)
    ACCESS_TOKEN_SECRET=$(generate_random_string 20)
    REFRESH_TOKEN_SECRET=$(generate_random_string 20)
    SESSION_SECRET=$(generate_random_string 20)

    DEFAULT_URL_IMAGE_SERVER=$(grep -oP 'URL_IMAGE_SERVER="\K[^"]+' "$ENV_EXEMPLE")
    DEFAULT_GOOGLE_CALLBACK_URL=$(grep -oP 'GOOGLE_CALLBACK_URL="\K[^"]+' "$ENV_EXEMPLE")
    DEFAULT_FRONT_URL=$(grep -oP 'FRONT_URL="\K[^"]+' "$ENV_EXEMPLE")

    # Demander à l'utilisateur de saisir des valeurs
    read -p "Entrez GOOGLE_CLIENT_ID: " GOOGLE_CLIENT_ID
    read -p "Entrez GOOGLE_SECRET: " GOOGLE_SECRET

    read -p "Entrez URL de callback Google back ($DEFAULT_GOOGLE_CALLBACK_URL): " GOOGLE_CALLBACK_URL
    GOOGLE_CALLBACK_URL=${GOOGLE_CALLBACK_URL:-$DEFAULT_GOOGLE_CALLBACK_URL}
    read -p "Entrez URL de callback Google front ($DEFAULT_FRONT_URL): " FRONT_URL
    FRONT_URL=${FRONT_URL:-$DEFAULT_FRONT_URL}
    read -p "Entrez URL du repertoire des images ($DEFAULT_URL_IMAGE_SERVER): " URL_IMAGE_SERVER
    URL_IMAGE_SERVER=${URL_IMAGE_SERVER:-$DEFAULT_URL_IMAGE_SERVER}

    cp "${ENV_EXEMPLE}"  "${ENV_FILE}"

    # Sed chercher/remplace
    sed -i "s/DEV_DB_PASSWORD=\"\"/DEV_DB_PASSWORD=\"$DEV_DB_PASSWORD\"/" $ENV_FILE
    sed -i "s/DEV_DB_ROOT_PASSWORD=\"\"/DEV_DB_ROOT_PASSWORD=\"$DEV_DB_ROOT_PASSWORD\"/" $ENV_FILE
    sed -i "s/ACCESS_TOKEN_SECRET=\"\"/ACCESS_TOKEN_SECRET=\"$ACCESS_TOKEN_SECRET\"/" $ENV_FILE
    sed -i "s/REFRESH_TOKEN_SECRET=\"\"/REFRESH_TOKEN_SECRET=\"$REFRESH_TOKEN_SECRET\"/" $ENV_FILE
    sed -i "s/SESSION_SECRET=\"\"/SESSION_SECRET=\"$SESSION_SECRET\"/" $ENV_FILE
    sed -i "s/GOOGLE_CLIENT_ID=\"\"/GOOGLE_CLIENT_ID=\"$GOOGLE_CLIENT_ID\"/" $ENV_FILE
    sed -i "s/GOOGLE_SECRET=\"\"/GOOGLE_SECRET=\"$GOOGLE_SECRET\"/" $ENV_FILE
    sed -i "s|URL_IMAGE_SERVER=\"\"|URL_IMAGE_SERVER=\"$URL_IMAGE_SERVER\"|" $ENV_FILE
    sed -i "s|GOOGLE_CALLBACK_URL=\"\"|GOOGLE_CALLBACK_URL=\"$GOOGLE_CALLBACK_URL\"|" $ENV_FILE
    sed -i "s|FRONT_URL=\"\"|FRONT_URL=\"$FRONT_URL\"|" $ENV_FILE

    echo "Le fichier .env.exemple a été crée."
    sleep 2
}

docker_start() {
    docker compose up --build -d
    sleep 2
}

docker_stop() {
    docker stop oraclette_node
    docker stop oraclette_phpmyadmin
    docker stop oraclette_db
    sleep 2
}

check_containers_running() {
    container_names=$(docker ps --format "{{.Names}}")

    local conteneurs=("oraclette_db" "oraclette_node" "oraclette_phpmyadmin")

    for conteneur in "${conteneurs[@]}"; do
        if [[ ! "$container_names" =~ "$conteneur" ]]; then
            echo "Le conteneur '$conteneur' n'est pas présent."
            return 0
        fi
    done

    return 1
}

db_migrate() {
    if check_containers_running; then
        echo "Erreur lors des migrations"
    else
        docker exec oraclette_node npx sequelize-cli db:migrate:undo:all
        docker exec oraclette_node npx sequelize-cli db:migrate
        docker exec oraclette_node npx sequelize-cli db:seed:all
    fi
    sleep 2
}

docker_prune() {
    docker compose -f docker-compose.yml down
    sleep 2
}

docker_prune_volume() {
    docker compose -f docker-compose.yml down -v
    sleep 2
}

docker_follow() {
    docker compose logs -f
}

docker_mysql() {
    source .env
    
    docker exec -i oraclette_db mariadb -uroot -p${DEV_DB_ROOT_PASSWORD}  <<< "SET global general_log = on;"
    docker exec -i oraclette_db mariadb -uroot -p${DEV_DB_ROOT_PASSWORD}  <<< "SET global general_log_file='/var/log/mysql/mysql.log';"
    docker exec -i oraclette_db mariadb -uroot -p${DEV_DB_ROOT_PASSWORD}  <<< "SET global log_output = 'file';"
    
    docker exec -it oraclette_db /usr/bin/tail -f /var/log/mysql/mysql.log
}

all() {
    docker_prune_volume
    docker_start
    db_migrate
    docker_follow
}

unitary_test() {
    docker exec oraclette_node npm test
    read -n 1 -s -r -p "Appuyer sur une touche pour continuer."
}

entre_docker() {
    clear
    sudo docker exec -it oraclette_node /bin/bash
}


# Boucle du menu
while true; do
    clear
    echo "🦄 Menu Principal 🧀"
    echo "1. Créer le fichier .env"
    echo "2. Lancer les docker"
    echo "3. Appliquer les migrations (undo/migrate/seed)"
    echo "4. Stop les docker"
    echo "5. Stop les docker & les supprimer (du projet)"
    echo "6. Stop les docker & les supprimer & prune les volumes (du projet)"
    echo "7. Suivre les logs des dockers"
    echo "8. Suivre les logs MySQL"
    echo "9. Tout kill, crée et migrer (pour toi Leo 💗)"
    echo "t. Execute les tests unitaire"
    echo "e. Entrer dans le docker Node"
    echo "0. Quitter"

    echo ""
    PORT_OUT=$(grep -oP 'PORT_OUT="\K[^"]+' "$ENV_EXEMPLE")
    echo "URL back : http://localhost:$PORT_OUT"

    API_DOCUMENTATION_ROUTE=$(grep -oP 'API_DOCUMENTATION_ROUTE="\K[^"]+' "$ENV_EXEMPLE")
    echo "Swagger : http://localhost:$PORT_OUT$API_DOCUMENTATION_ROUTE"

    PORT_PMA=$(grep -oP 'PORT_PMA="\K[^"]+' "$ENV_EXEMPLE")
    echo "phpMyAdmin : http://localhost:$PORT_PMA"
    echo "Front (si lancer) : http://localhost:5173"
    
    echo ""
    
    read -n 1 -p "Choisissez une option: " choice

    case $choice in
        1) create_env_file ;;
        2) docker_start ;;
        3) db_migrate ;;
        4) docker_stop ;;
        5) docker_prune ;;
        6) docker_prune_volume ;;
        7) docker_follow ;;
        8) docker_mysql ;;
        9) all ;;
        t) unitary_test ;;
        e) entre_docker ;;
        0) exit 0 ;;
        *) echo "Option invalide. Réessayez." ;;
    esac
done