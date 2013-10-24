var characters = [
  {
    number: 1,
    name: "Jorgen Von Stragen",
    bonus: "Tough guy. Carrying Capacity +15"
  },
  {
    number: 2,
    name: "Pilo Longarrow",
    bonus: "Fatass. Warmth +8"
  },
  {
    number: 3,
    name: "Ellen Smith",
    bonus: "Pragmatic Bargainer. Initial money +100"
  },
  {
    number: 4,
    name: "Octavian",
    bonus: "Leader. +1 to hit for all group members"
  },
  {
    number: 5,
    name: "Gorf the Wizard",
    bonus: "Knows Magic, kind of. Can create fires without wood"
  }
];
Template.viewPlayer.needToPickGuy = function(){
  return this.player && this.player.character == 0;
};
Template.viewPlayer.availableCharacter = function(){
  var gamePlayers = this.game.players;
  return _.filter(characters, function(guy){
    var good = true;
    for(var i=0; i< gamePlayers.length; i++){
      if(Players.findOne(gamePlayers[i]).character == guy.number){
        good = false;
      }
    }
    return good;
  });
}
Template.viewPlayer.selectedCharacter = function(){
  return _.find(characters, function(guy){
    return guy.number == Session.get('selected character');
  });
};


Template.viewPlayer.events({
  'click #pickGuy': function(e){
    Players.update(this.player._id, {
      $set: {
        character: Session.get('selected character')
      }
    });
  },
  'change #character': function(){
    Session.set('selected character', $('#character').val());
  }
});
