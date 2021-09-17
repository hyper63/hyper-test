import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";

import { buildRequest } from "./utils.js";
const test = Deno.test;

test("get request with no auth", async () => {
  const doBuildRequest = buildRequest(new URL("http://localhost:6363/test"));
  const res = await doBuildRequest("data").toPromise();
  assertEquals(res.url, "http://localhost:6363/data/test");
  assertEquals(res.headers.get("Content-Type"), "application/json");
});

test("get request with auth", async () => {
  const doBuildRequest = buildRequest(
    new URL("http://u:p@localhost:6363/test"),
  );
  const res = await doBuildRequest("data").toPromise();
  assertEquals(res.url, "http://localhost:6363/data/test");
  assertEquals(res.headers.get("Content-Type"), "application/json");
  assertEquals(
    res.headers.get("authorization"),
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJzdWIiOiJ1In0.5YCvIgIKQi-MCkq5mqvUpFxwKEV52IFJi4wJljXNISQ",
  );
});
