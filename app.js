
const express = require("express");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

const app = express();

app.use(express.text({
  type: ["text/csv", "text/plain"],
  limit: "1mb"
}));

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.post("/convert/csv-to-json", (req, res) => {
  if (typeof req.body !== "string") {
    return res.status(415).json({
      error: "Send CSV with Content-Type: text/csv"
    });
  }

  try {
    const records = parse(req.body, {
      columns: true,
      skip_empty_lines: true,
      bom: true
    });

    res.json(records);
  } catch {
    res.status(400).json({ error: "Invalid CSV" });
  }
});

app.post("/convert/json-to-csv", (req, res) => {
  const records = req.body;

  if (
    !Array.isArray(records) ||
    records.length === 0 ||
    !records.every(row =>
      row !== null &&
      typeof row === "object" &&
      !Array.isArray(row)
    )
  ) {
    return res.status(400).json({
      error: "Expected a non-empty array of objects"
    });
  }

  try {
    const csv = stringify(records, {
      header: true,
      escape_formulas: true
    });

    res.type("text/csv").send(csv);
  } catch {
    res.status(400).json({ error: "Invalid JSON data" });
  }
});

app.use((err, req, res, next) => {
  const status = err.status >= 400 && err.status < 500
    ? err.status
    : 500;

  res.status(status).json({
    error: status === 413 ? "Request too large" : "Invalid request"
  });
});

module.exports = app;
