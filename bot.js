// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const request = require('request');
const response = "";

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            request('https://westus.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/760a2875-c5ea-42eb-8968-5581b4d1e83a/slots/production/predict?subscription-key=827490b5508b432c9958cd5030b2a29b&verbose=true&show-all-intents=true&log=true&query='+context.activity.text, { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                console.log(body.url);
                console.log(body.explanation);
                response = body.explanation; 
              });
            const replyText = `Echo: ${ context.activity.text }`;
            //await context.sendActivity(MessageFactory.text(replyText, replyText));
            await context.sendActivity(MessageFactory.text(response, response));
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onTyping(async (context, next) => {
            const text = 'Vamos digita logo, quero saber como te ajudar!'
            await context.sendActivity(MessageFactory.text(text, text));
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
