Template.gameBoard.entity = function(){
  var game =Games.findOne(window.location.pathname.slice(6));
  var entities = [];

  if( game != undefined){
    var playerIds= game.players;
    var player, entity;
    for(var i =0; i < playerIds.length; i++){
      player = Players.findOne(playerIds[i]);
      entity = {
        type: "player",
        top: (player.row * 12) + "px",
        left: (player.col * 12) + "px",
        character: player.character,
        number: player.number
      };
      entities.push(entity);
    }
  }
  return entities;
};
