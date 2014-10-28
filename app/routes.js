var http = require('http');
var curl = require('curlrequest');
var _ = require('underscore');
var jsdom=require('jsdom');
var $=require('jquery')(jsdom.jsdom().createWindow());

module.exports = function(app) {

  var events = [
    '800m',
    '1k',
    '1500m',
    '1 Mile',
    '3k',
    '2 Mile',
    '5k',
    '8k',
    '10k'
  ];


  //home page
  app.get('/', function(req, res) {
    res.send('Hello World');
  });

  var botRegex = /purdy\s(\d*:?\d*)\s(\d*)(mi|m|k)\s(--all)/i;

  function isBotRequest(text) {
    console.log(text);
    var parsedText = botRegex.exec(text);
    if (parsedText.length !== 4) {
      return false;
    }

    obj = {
      time: parsedText[1],
      distance: parsedText[2],
      units: parsedText[3],
      all: false
    };

    if (parsedText.lenth === 5) {
      obj.all = true;
    }
  }

  var PURDY_URL = 'http://tools.runnerspace.com/results/tools_performance_predictor_ajax.php?time=10:00&dist=3200&units=m'
  function getPurdyData(obj) {
    var url = PURDY_URL + '&time=' + obj.time;
    url += '&dist=' + obj.distance;
    url += '&units=' + obj.units;

    curl.request({
      url: url
    }, function(err, stdout, meta) {
      if (err) {
        console.log(err);
        return;
      }
      
      var output = '';      
      $(stdout).find('tr td:nth-child(2)').each(function(idx,val) {
        if (idx === 0) {
          return;
        } 
        var dist = $(val).closest('td').prev().html();
        var time = $(val).html();

        if (obj.all || _.contains(events, dist)) {
          output += dist + ': ' + time +  '\n';
        }
      });

      postGroupMeMessage(output);
    });
  }

  function postGroupMeMessage(txt) {
   
    var url = 'https://api.groupme.com/v3/bots/post';
   
    var postData = {
      bot_id: '95885cf19801c06467b1b5380b',
      text: txt,
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
      getPurdyData(parsedText);
      //postGroupMeMessage();
    }

    res.send(200);
  });

};
