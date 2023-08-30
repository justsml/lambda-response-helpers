class LambdaResponseClass {
  _headers: Record<string, string> = {};
  _statusCode: number = 200;
  _body: unknown = undefined;

  /**
   * Set response headers.
   * ## Example
   * ```ts
   * res()
   *  .headers({
   *   'content-type': 'application/json',
   *  })
   * .json({ message: 'Hello World!' });
   * ```
    */
  headers = (headers: Record<string, string>): this => {
    this._headers = headers;
    return this;
  }
  
  /** Set the status code */
  status = (statusCode: number): this => {
    this._statusCode = statusCode;
    return this;
  }

  /** Set the body/payload */
  body = (body: unknown): this => {
    this._body = body;
    return this;
  }

  /** Generate the response */
  json = (body: unknown | undefined = undefined) => {
    // Ensure that the Content-Type header is set to application/json
    const headerKeys = Object.keys(this._headers);
    // Prevent sending multiple headers (cased differently)
    const contentTypeKey = headerKeys.find((key) => key.toLowerCase() === 'content-type');
    this._headers[contentTypeKey ?? 'content-type'] = 'application/json';

    return {
      headers: this._headers,
      statusCode: this._statusCode,
      body: JSON.stringify(body ?? this._body),
    };
  }
    
}
/**
 * A helper function to create a lambda HTTP response.
 *
 * > API inspired by [expressjs/response](https://expressjs.com/en/4x/api.html#res)
 *
 * ## Usage
 *
 * ```ts
 * import { lambdaResponse } from '../../shared/lambda';
 * const res = lambdaResponse;
 *
 * const handler = async (event) => {
 *   try {
 *     return res()
 *       .status(201)
 *       .json({ message: 'Hello World!' });
 *   } catch (error) {
 *    return res()
 *      .status(500)
 *      .json({ error: error.message });
 *   }
 * };
 * ```
 */
export const LambdaResponse = () => {
  return new LambdaResponseClass();
};

/** An easy alias for `LambdaResponse` */
export const res = LambdaResponse;

/**
 * A helper function to create a lambda SQS response.
 */
export const LambdaSqsResponse = () => {
  const _failed: string[] = [];

  return {
    /**
     * Add a failed message ID to the response.
     *
     * @param messageId batch item/message id
     */
    addFailure: (messageId: string) => {
      if (!_failed.includes(messageId)) _failed.push(messageId);
      return this;
    },
    /** No body payload is supported for SQS responses */
    json: () => {
      return {
        batchItemFailures: _failed.map((messageId) => ({
          itemIdentifier: messageId,
        })),
      };
    },
  };
};