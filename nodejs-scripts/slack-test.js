/*
curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, Coffee!"}' https://hooks.slack.com/services/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

 */




var IncomingWebhook = require('@slack/client').IncomingWebhook;

var url = "https://hooks.slack.com/services/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";

var webhook = new IncomingWebhook(url);

webhook.send('Hello there, this is coffee talking!!', function(err, header, statusCode, body) {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Received', statusCode, 'from Slack');
  }
});
