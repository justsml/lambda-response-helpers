import assert from "node:assert";
import { describe, it } from "node:test";
import { LambdaResponse as res, LambdaSqsResponse as sqsRes } from "./index";

describe("LambdaResponse", () => {
  it("can generate a 200 success payload", () => {
    const result = res().status(200).body({ message: "success" }).json();

    const expects = {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: `{"message":"success"}`,
    };

    assert.deepStrictEqual(result, expects);
  });

  it("can generate a payload w/ shorthand .json(body)", () => {
    const result = res().status(429).json({ message: "slow down" });

    const expects = {
      statusCode: 429,
      headers: { "content-type": "application/json" },
      body: `{"message":"slow down"}`,
    };

    assert.deepStrictEqual(result, expects);
  });

  it("can generate a payload w/ Headers", () => {
    const result = res()
      .status(429)
      .headers({
        "content-type": "application/json",
        "x-token": "p@ssword123",
      })
      .json({ message: "slow down" });

    const expects = {
      headers: { "content-type": "application/json", "x-token": "p@ssword123" },
      statusCode: 429,
      body: `{"message":"slow down"}`,
    };

    assert.deepStrictEqual(result, expects);
  });
});

describe("LambdaSqsResponse", () => {
  it("can generate a success payload", () => {
    const res = sqsRes();

    const expects = { batchItemFailures: [] };

    assert.deepStrictEqual(res.json(), expects);
  });
  it("can return failed message IDs", () => {
    const res = sqsRes();

    res.addFailure("123");

    assert.deepStrictEqual(res.json(), {
      batchItemFailures: [{ itemIdentifier: "123" }],
    });
  });
});
