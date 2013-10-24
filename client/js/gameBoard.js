Template.gameBoard.visibleRows = function(gameObj){
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
    for(i = Math.max(0,lowestRow); i<Math.min(90,highestRow); i++){
      visibleBoard.push(gameObj.board[i]);
    }

    Session.set('top row', Math.max(0,lowestRow));

    return visibleBoard;
  } else {
    return [];
  }
};
Template.gameBoard.boardHTML = function(){
  var board = Template.gameBoard.visibleRows(this);
  var baseRow = Session.get('top row');
  var outputHTML = "";
  for(var i=0; i<board.length; i++){
    outputHTML += "<div style='height:12px;background:#ccc'>";
    for(var j=0; j<board[i].length;j++){
      outputHTML += "<div class='b-"+board[i][j]+
                    "' data-row='"+ (i + baseRow) +
                    "' data-col='"+j+"'/>";
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
        entity = {
          type: "player",
          top: ((player.row - topRow) * 12) + "px",
          left: (player.col * 12) + "px",
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

      Players.update(playerId, {
        $set: {
          row: row,
          col: col
        }
      });
    }
  }
});
