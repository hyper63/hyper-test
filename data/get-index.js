import { assertEquals } from "asserts";

const test = Deno.test;

export default function (url, headers) {
  test("GET /data", async () => {
    const res = await fetch(`${url}/data`, {
      headers,
    }).then((r) => r.json());
    assertEquals(res.name, "hyper63 Data");
  });
}
