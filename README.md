# FTLabs Quiz Experiment

This is an experiment with automating quiz questions from the news published in a given amount of time. Although this a stand alone project it is also an excuse to explore new technologies which we can use to extract data from our content.

This is an API utilising AWS technologies (api gateway and lambda).

The end goal is to have a versatile api which can give automated questions of different types from one api call.

## Setup

To run and deploy this app you will need to install serverless:

```
npm install -g serverless
```

Then to deploy:

```
serverless deploy -v
```

You will need these environment variables saved in the root in a `serverless.env.yml`:

```
dev:
  LANTERN_API_KEY: <lantern api key>
```

# Question types

## Redacted

This question type gets the top articles published over a given time and redacts a key phrase in the headline. It uses AWS Comprehend and the Lantern API.

An example of these in action can be found [here](http://ftlabs-quiz-redacted-frontend.s3-website-eu-west-1.amazonaws.com/)
