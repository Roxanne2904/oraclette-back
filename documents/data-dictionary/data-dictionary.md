# Dictionnaire de donnée

## Table User

| Champ                | Type         | Spécificité                                     | Description                               |
| -------------------- | ------------ | ----------------------------------------------- | ----------------------------------------- |
| id                   | INT          | ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY | ID de la personne                         |
| firstname            | VARCHAR(64)  | NOT NULL                                        | Le prénom de la personne                  |
| lastname             | VARCHAR(64)  | NOT NULL                                        | Le nom de la personne                     |
| email                | VARCHAR(256) | NOT NULL UNIQUE                                 | L'email de la personne                    |
| birthdate            | DATE         |                                                 | Date de naissance de la personne          |
| gender               | ENUM         | DEFAULT VALUE "nonbinary"                       | Le genre de la personne                   |
| password_reset_token | VARCHAR(255) |                                                 | Token pour la récupération d mot de passe |
| password             | VARCHAR(255) | NOT NULL                                        | Le mdp de la personne                     |
| provider             | TEXT         |                                                 | Le provider (Google,...)                  |
| provider_id          | TEXT         |                                                 | Identifiant du provider                   |
| is_admin             | BOOLEAN      |                                                 | Si l'utilisateur est administrateur       |
| createdAt            | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP             | Date création                             |
| updatedAt            | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP             | Date modification                         |

## Table Event

| Champ          | Type        | Spécificité                                     | Description                                         |
| -------------- | ----------- | ----------------------------------------------- | --------------------------------------------------- |
| id             | INT(10)     | ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY | ID de l’event                                       |
| description    | TEXT        | DEFAULT "aucune description"                    | Description de l’event                              |
| address        | TEXT        | NOT NULL                                        | Adresse de l'événement                              |
| zip_code       | VARCHAR(5)  | NOT NULL                                        | Code postal                                         |
| city           | TEXT        | NOT NULL                                        | Nom de la ville                                     |
| latitude       | FLOAT       |                                                 | Latitude                                            |
| longitude      | FLOAT       |                                                 | Longitude                                           |
| available_slot | SMALLINT(5) | NOT NULL                                        | Nombre de places disponibles                        |
| date           | DATE        | NOT NULL                                        | Date de l'évènement                                 |
| status         | ENUM        | DEFAULT VALUE "open"                            | Statut de l'évènement                               |
| gender         | ENUM        | DEFAULT VALUE "nonbinary"                       | Genre autorisé pour l'évènement                     |
| user_id        | INT(10)     | NOT NULL                                        | Identifiant de l'utilisateur qui a créé l'évènement |
| createdAt      | TIMESTAMP   | NOT NULL, DEFAULT CURRENT_TIMESTAMP             | Date création                                       |
| updatedAt      | TIMESTAMP   | NOT NULL, DEFAULT CURRENT_TIMESTAMP             | Date modification                                   |

## Table EventLike // TODO

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
