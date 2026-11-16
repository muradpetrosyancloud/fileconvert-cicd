
const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../app");

async function withServer(callback) {
  const server = await new Promise(resolve => {
    const instance = app.listen(0, "127.0.0.1", () => {
      resolve(instance);
    });
  });

  const base = `http://127.0.0.1:${server.address().port}`;

  try {
    await callback(base);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test("Health endpoint responds successfully", async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: "healthy"
    });
  });
});

test("Converts CSV to JSON", async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/convert/csv-to-json`, {
      method: "POST",
      headers: { "Content-Type": "text/csv" },
      body: "name,age\nAlex,20"
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), [
      { name: "Alex", age: "20" }
    ]);
  });
});

test("Converts JSON to CSV", async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/convert/json-to-csv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ name: "Alex", age: 20 }])
    });

    assert.equal(response.status, 200);
    assert.equal(await response.text(), "name,age\nAlex,20\n");
  });
});
