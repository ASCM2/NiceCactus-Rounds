# Microservice Rounds

Microservice gérant les différentes parties du jeu Paper Rock Scissor.

## Démarrage

Après avoir cloné le projet depuis Github, dans le répertoire taper:

### `npm install`

Pour lancer le microservice, vous aurez besoin d'une base de données MongoDB présente en local. Vous pouvez modifier les paramètres de connexion à la base de données MongoDB dans le fichier .env.development. Une fois que la base de données est prête, lancer:

### `npm start`

/!\ Attention, si vous êtes sur Linux plutôt que sur Windows, enlever le mot-clé SET au début des commmandes start et test indiquées dans le fichier package.json.

Par défaut, le serveur se lance et écoute sur le port 3001. Vous pouvez changer ce comportement dans le fichier .env.development, auquel cas, n'oubliez pas de faire les modifications explicitées dans la documentation de la UI afin que les deux services puissent toujours communiquer.

## Modèle de la base de données

Le modèle de la base de données ressemble au total à ceci:

    {
      position: Number
      rounds: [
        ...,
        {
          winner: WinnerEnum,
          moves: [MoveEnum, MoveEnum]
        },
        ...
      ]
    }

Par défaut, position est à (-1). Elle augmente de 1 à chaque fois qu'une nouvelle partie est créée.  
Le tableau rounds est un tableau représentant l'ensemble des diverses parties successivement jouées.  

WinnerEnum ne prend que les valeurs 'none', 'left' ou 'right'. Si la valeur est à 'none', on considère qu'aucun joueur n'a gagné. Si elle est à 'left', on considère que le joueur du côté gauche de l'écran gagne la partie. Si elle est à 'right', on considère que le joueur du côté droit gagne la partie. Ces joueurs peuvent être de nature humaine ou être des ordinateurs, peu importe.  

MoveEnum ne prend que les valeurs de coups possibles définies dans le fichier racine possible-moves.js.

Bien évidemment, un tel modèle tient car nous supposons par souci de simplicité que l'architecture ainsi créée ne s'adresse qu'à un seul joueur (vous), sinon les parties de différents joueurs se chevaucheraient.

## Tests

Pour lancer les tests, lancer la commande:

`npm test`

Vous pouvez modifier les paramètres de connexion à la base de données en mode test en modifiant le fichier .env.test.

## Routes implémentées par le microservice Rounds

Quatre routes sont implémentées sur le microservice Rounds:

- `POST /play`

  Permet de stocker le résultat d'une partie dans la base de données et retourne le résultat au front-end.

- `GET /last`

  Permet de revenir à la partie précédant la dernière partie retournée par le microservice. Si aucune partie ne peut être retournée, elle retourne des valeurs par défaut.

- `GET /next`

  Permet d'aller à la partie suivant la dernière partie retournée par le moircroservice. Si aucune partie ne peut être retournée, elle retourne des valeurs par défaut.

- `DELETE /clear`

  Supprime l'historique des parties stockées en mettant position à `(-1)` et rounds à `[]`.

## Extension du jeu au jeu Rock Paper Scissor Lizard Spock

Il faudra adapter le tableau possibleMoves et la fonction winner présents dans le fichier racine possibe-moves.js qui décident en fonction des coups joués, lequel est le meilleur.  

Actuellement le tableau possibleMoves est écrit de telle sorte que les éléments d'indexes les plus élevés sont considérés supérieurs aux éléments d'indexes plus faibles. Excepté que le dernier élément est considéré plus faible que le tout premier. Ce qui nous permet de simuler une relation de domination cyclique.  

Pour passer au jeu Rock Paper Scissor Lisard Spock, il faudra donc réécrire le tableau possibleMoves et redéfinir une nouvelle fonction winner adaptée à cette situation.  

Il faudra également revoir le test de la méthode /play en ce qui concerne le calcul du gagnant d'un tournoi car la relation de domination entre les différents coups n'est plus cyclique.
