# Lambda Helpers

[![NPM version](https://img.shields.io/npm/v/lambda-response-helpers.svg)](https://www.npmjs.com/package/lambda-response-helpers)
[![GitHub stars](https://img.shields.io/github/stars/justsml/lambda-response-helpers.svg?style=social)](https://github.com/justsml/lambda-response-helpers)

## Get Started

```bash
npm install lambda-response-helpers
# OR
yarn add lambda-response-helpers
```

## Usage

### LambdaResponse

The `LambdaResponse` function provides a simple way to build a response object for your HTTP lambda function.

#### Simplified example

```typescript
import { Handler } from 'aws-lambda';
import { LambdaResponse } from 'lambda-response-helpers'

export const handler: Handler = async (event, context) => {
  const data = await getSomeData();

  return LambdaResponse()
    .status(200)
    .json({ data });
};
```

#### More complete example

```typescript
import { Handler } from 'aws-lambda';
import { LambdaResponse as res } from 'lambda-response-helpers'

export const handler: Handler = async (event, context) => {
  let data = undefined;

  try {
    data = await getSomeData();
    
    return res()
      .status(200)
      .json({ results: data });

  } catch (error) {
    console.error(error);

    return res()
      .status(500)
      .json({ error: error.message });
  }
};
```

### LambdaSqsResponse

The `LambdaSqsResponse` function provides a simple way to build a response object for your SQS lambda function.

#### Example

```typescript
import { SqsHandler } from 'aws-lambda';
import { LambdaSqsResponse } from 'lambda-response-helpers'

export const handler: SqsHandler = async (event) => {
  const res = LambdaSqsResponse();
  // Parse sqs Record body's
  const records = event.Records.map((record) => {
    try {
      return JSON.parse(record.body);
    } catch (error) {
      // Log failures
      res.addError(record.messageId);
      console.error(error);
      return undefined;
    }
  });

  // Reply with any failed record ids
  return res.json();
};
```
