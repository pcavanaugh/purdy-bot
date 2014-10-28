var http = require('http');
var curl = require('curlrequest');

module.exports = function(app) {

  //home page
  app.get('/', function(req, res) {
    res.send('Hello World');
  });

  var botRegex = /purdy\s(\d*[ :]\d*)\s(\d*)([mM])/i;

  function isBotRequest(text) {
    console.log(text);
    var parsedText = botRegex.exec(text);
    if (parsedText.length !== 4) {
      return false;
    }

    return {
      time: parsedText[1],
      distance: parsedText[2],
      units: parsedText[3]
    };
  }

  function postGroupMeMessage() {
   
    var url = 'https://api.groupme.com/v3/bots/post';
   
    var postData = {
      bot_id: '95885cf19801c06467b1b5380b',
      text: 'shut the fuck up',
    };

    curl.request({
      url: url,
      method: 'POST',
      data: postData
    }, console.log);
 

  }


  app.post('/', function(req, res) {
    var text = req.body.text;
    if (!text) { res.send(400); }
    
    var parsedText = isBotRequest(text);

    if (parsedText) {
      postGroupMeMessage();
    }

    res.send(200);
  });

};
