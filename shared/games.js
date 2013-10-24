Games = new Meteor.Collection("games");
/*
  {
    board: [90][30] //randomly generated
                    //uses 0 for snow, 1 for tree, 2 for cave, 3 for ice, 4 for rock
    players: [playerId, playerId, ...]
    enemies: [enemyId, enemyId, ...]
    objects: [objectId, objectId, ...]
  }
*/
