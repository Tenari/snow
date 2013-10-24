Template.newGame.madeGame= function(){
  return Session.get('boardlink') != undefined;
};
Template.newGame.boardlink= function(){
  return Session.get('boardlink');
};
Template.newGame.players= function(){
  return Session.get('players');
};



var makeBoard = function(){
  // make the snowy base land
  var board = [];
  for(var i = 0; i < 90; i++){
    board.push([]);
    for(var j =0; j< 30; j++){
      board[i][j] = 0;
    }
  }

  // add some trees
  var numTrees = _.random(50,90);
  var row, col;
  // all board trees
  for(i = 0; i < numTrees; i++){
    row = _.random(0,85);
    col = _.random(0,29);

    board[row][col] = 1;
  }
  // denser near the top
  for(i = 0; i < numTrees; i++){
    row = _.random(0,25);
    col = _.random(0,29);

    board[row][col] = 1;
  }

  // add the cave somewhere up top
  board[_.random(0,5)][_.random(0,28)] = 2;
  return board;
};
var makePlayers = function(numPlayers){
  var players = [];
  var playerId;
  for (var i = 0; i < numPlayers; i++){
    playerId = Players.insert({
      number: i,
      row: 89,
      col: (6+i),
      inventory: [],
      energy: 0,
      character: 0
    });
    players.push(playerId);
  }

  return players;
};
Template.newGame.events({
  'click #makeGame': function(){
    var numPlayers = parseInt($('#players').val());
    if ( numPlayers == 0) {return;}

    var players = makePlayers(numPlayers);
    var gameId = Games.insert({
      board: makeBoard(),
      players: players,
      enemies: [],
      objects: [],
      temp: 0,
      time: 7.00
    });

    Session.set('boardlink', "/game/"+gameId);
    for(var i= 0; i< players.length; i++){
      players[i] = "/game/"+gameId+"/player/"+players[i];
    }
    Session.set('players', players);
  }
});
