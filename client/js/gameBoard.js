Template.gameBoard.visibleRows = function(gameObj){
  // if called from the html template, dont pass anything,
  //   the data context 'this' will hold the game object
  if(gameObj == undefined){gameObj = this;}
  if(gameObj.board){
    var highestRow =0, lowestRow=100;
    var high,low;
    var player;
    for(var i=0; i<gameObj.players.length;i++){
      player = Players.findOne(gameObj.players[i]);
      if(player != undefined){
        high = player.vision + player.row;
        low = player.row - player.vision;
        if(high > highestRow){
          highestRow = high;
        }
        if(low < lowestRow){
          lowestRow = low;
        }
      }
    }
    
    var visibleBoard = [];
    // Math.max/min is necessary, because players might be able to
    //   'see' past the edge of the map. those functions limit that.
    for(i = Math.max(0,lowestRow); i<Math.min(90,highestRow); i++){
      visibleBoard.push(gameObj.board[i]);
    }

    Session.set('top row', Math.max(0,lowestRow));

    return visibleBoard;
  } else {
    return []; // cant see any rows. 
               //   likely only when miniMongoDB isn't filled yet
  }
};
var visibleCols = function(visibleRows, playerIds){
  if(playerIds == undefined){playerIds =[];}

  var highestCol =0, lowestCol=30;
  var high,low;
  var player;
  for(var i=0; i<playerIds.length; i++){
    player = Players.findOne(playerIds[i]);
    if(player != undefined){
      high = player.vision + player.col;
      low = player.col - player.vision;
      if(high > highestCol){
        highestCol = high;
      }
      if(low < lowestCol){
        lowestCol = low;
      }
    }
  }
  
  var visibleBoard = [];
  // Math.max/min is necessary, because players might be able to
  //   'see' past the edge of the map. those functions limit that.
  for(i =0; i<visibleRows.length; i++){
    visibleBoard.push([]);
    for(var j = Math.max(0,lowestCol); j<Math.min(30,highestCol); j++){
      visibleBoard[i].push(visibleRows[i][j]);
    }
  }

  Session.set('first col', Math.max(0,lowestCol));

  return visibleBoard;
};
Template.gameBoard.boardHTML = function(){
  var board = Template.gameBoard.visibleRows(this);
  board = visibleCols(board, this.players);
  var baseRow = Session.get('top row');
  var baseCol = Session.get('first col');
  var outputHTML = "";
  for(var i=0; i<board.length; i++){
    outputHTML += "<div style='height:12px;background:#ccc'>";
    for(var j=0; j<board[i].length;j++){
      outputHTML += "<div class='b-"+board[i][j]+
                    "' data-row='"+ (i + baseRow) +
                    "' data-col='"+ (j + baseCol) +"'/>";
    }
    outputHTML += "</div>";
  }
  return outputHTML;
};

Template.gameBoard.entity = function(){
  var entities = [];

  if( this.board != undefined){
    var playerIds= this.players;
    var player, entity;
    for(var i =0; i < playerIds.length; i++){
      player = Players.findOne(playerIds[i]);
      if(player != undefined){
        var topRow = Session.get('top row');
        var firstCol = Session.get('first col');
        entity = {
          type: "player",
          top: ((player.row - topRow) * 12) + "px",
          left: ((player.col - firstCol) * 12) + "px",
          character: player.character,
          number: player.number,
          _id: player._id
        };
        entities.push(entity);
      }
    }
  }
  return entities;
};


Template.gameBoard.events({
  'click .c-0': function(e){
    Session.set('show moves', $(e.currentTarget).data("_id"));
  },
  'click .b-0': function(e){
    var playerId = Session.get('show moves');
    if( playerId != undefined){
      var $tar = $(e.currentTarget);
      var row = $tar.data("row");
      var col = $tar.data("col");

      // need to check that the move is valid

      Players.update(playerId, {
        $set: {
          row: row,
          col: col
        }
      });
    }
  }
});
