Router.configure({
  layout: 'layout'
});
var authController = function(){
  if (Meteor.user() != null)
    this.render();
  else
    this.render('landing', {});
};
Router.map(function(){
  this.route('newGame', {path: '/'});
  this.route('gameBoard', {
    path: '/game/:id',
    data: function(){
      return Games.findOne(this.params.id);
    }
  });
  this.route('viewPlayer', {
    path: '/game/:gameId/player/:id',
    data: function(){
      return {
        game: Games.findOne(this.params.gameId),
        player: Players.findOne(this.params.id)
      };
    }
  });
});
