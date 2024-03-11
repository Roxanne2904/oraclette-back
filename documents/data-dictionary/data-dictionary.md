# Dictionnaire de donnée

## Table User

| Champ     | Type      | Spécificité                                     | Description                         |
| --------- | --------- | ----------------------------------------------- | ----------------------------------- |
| id        | INT       | ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY | ID de la personne                   |
| firstname | TEXT      | NOT NULL                                        | Le prénom de la personne            |
| lastname  | TEXT      | NOT NULL                                        | Le nom de la personne               |
| email     | TEXT      | NOT NULL UNIQUE                                 | L'email de la personne              |
| birthdate | DATE      |                                                 | Date de naissance de la personne    |
| gender    | ENUM      |                                                 | Le genre de la personne             |
| password  | TEXT      | NOT NULL                                        | Le mdp de la personne               |
| provider  | TEXT      |                                                 | Le provider (Google,...)            |
| is_admin  | BOOL      |                                                 | Si l'utilisateur est administrateur |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP             | Date création                       |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP             | Date modification                   |

## Table Event

| Champ          | Type      | Spécificité                                     | Description                        |
| -------------- | --------- | ----------------------------------------------- | ---------------------------------- |
| id             | INT       | ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY | ID de l’event                      |
| description    | TEXT      | DEFAULT "aucune description"                    | Description de l’event             |
| address        | TEXT      | NOT NULL                                        | Adresse de l'événement             |
| zip_code       | INT       | NOT NULL                                        | Code postal                        |
| city           | TEXT      | NOT NULL                                        | Nom de la ville                    |
| position_lat   | FLOAT     |                                                 | Latitude                           |
| position_lon   | FLOAT     |                                                 | Longitude                          |
| available_slot | INT       | NULL                                            | Nombre de places disponibles       |
| date           | DATE      |                                                 | Date de l'évènement                |
| status         | ENUM      |                                                 | Statut de l'évènement              |
| gender         | ENUM      |                                                 | Genre autorisé pour l'évènement    |
| image_name     | TEXT      |                                                 | Image de couverture de l'évènement |
| createdAt      | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP             | Date création                      |
| updatedAt      | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP             | Date modification                  |

## Table EventLike

| Champ     | Type      | Spécificité                         | Description                                         |
| --------- | --------- | ----------------------------------- | --------------------------------------------------- |
| event_id  | INT       |                                     | Identifiant de l'évènement                          |
| liked_by  | INT       |                                     | Identifiant de l'utilisateur qui a aimé l'évènement |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date création                                       |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date modification                                   |

## Table EventRegister

| Champ       | Type      | Spécificité                         | Description                                            |
| ----------- | --------- | ----------------------------------- | ------------------------------------------------------ |
| Status      | ENUM      |                                     | Status de l’inscrit (accepté, refusé, en attente, ...) |
| event_id    | INT       |                                     | Identifiant de l'évènement                             |
| register_by | INT       |                                     | Identifiant de l'utilisateur qui participe             |
| createdAt   | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date création                                          |
| updatedAt   | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date modification                                      |

## Table Message

| Champ     | Type    | Spécificité                                     | Description                                         |
| --------- | ------- | ----------------------------------------------- | --------------------------------------------------- |
| id        | INT     | ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY | Identifiant du message                              |
| message   | TEXT    |                                                 | Message de l’utilisateur                            |
| disabled  | BOOLEAN |                                                 | Modération des message (visible ou non)             |
| event_id  | INT     |                                                 | Identifiant de l'évènement                          |
| writed_by | INT     |                                                 | Identifiant de l'utilisateur qui a écrit le message |
