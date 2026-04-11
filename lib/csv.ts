export type CsvSkipEmptyLines = boolean | "greedy";

export interface CsvParseOptions {
  header?: boolean;
  skipEmptyLines?: CsvSkipEmptyLines;
  preview?: number;
  dynamicTyping?: boolean;
}

export interface CsvParseResult<T = unknown> {
  data: T[];
  errors: Array<{ message: string }>;
  meta: {
    fields?: string[];
  };
}

function normalizeCell(value: string) {
  return value.replace(/\r/g, "");
}

function shouldSkipRow(row: string[], skipEmptyLines?: CsvSkipEmptyLines) {
  if (!skipEmptyLines) {
    return false;
  }

  return row.every(cell => normalizeCell(cell).trim() === "");
}

function coerceValue(value: string, dynamicTyping?: boolean) {
  const normalized = normalizeCell(value);
  if (!dynamicTyping) {
    return normalized;
  }

  const trimmed = normalized.trim();
  if (trimmed === "") {
    return "";
  }

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const asNumber = Number(trimmed);
    if (!Number.isNaN(asNumber)) {
      return asNumber;
    }
  }

  return normalized;
}

function parseRows(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (inQuotes) {
      if (char === '"') {
        if (next === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char === "\r") {
      if (next === "\n") {
        continue;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

export async function parseCsvFile<T = unknown>(
  file: File,
  options: CsvParseOptions = {}
): Promise<CsvParseResult<T>> {
  const text = await file.text();
  const parsedRows = parseRows(text).filter(row => !shouldSkipRow(row, options.skipEmptyLines));

  if (options.header) {
    if (parsedRows.length === 0) {
      return { data: [], errors: [], meta: { fields: [] } };
    }

    const headers = parsedRows[0].map(cell => normalizeCell(String(cell)).trim());
    const dataRows = parsedRows.slice(1, options.preview ? options.preview + 1 : undefined);
    const data = dataRows.map(row => {
      const entry: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        entry[header] = coerceValue(row[index] ?? "", options.dynamicTyping);
      });
      return entry;
    }) as T[];

    return {
      data,
      errors: [],
      meta: { fields: headers }
    };
  }

  const slicedRows = options.preview ? parsedRows.slice(0, options.preview) : parsedRows;
  const data = slicedRows.map(row => row.map(cell => coerceValue(cell, options.dynamicTyping))) as T[];

  return {
    data,
    errors: [],
    meta: {}
  };
}

function escapeCsvValue(value: unknown) {
  const stringValue = value == null ? "" : String(value);
  if (/[",\n\r]/.test(stringValue) || /^\s|\s$/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function unparseCsv(data: Array<Record<string, unknown> | unknown[]>) {
  if (!data.length) {
    return "";
  }

  if (Array.isArray(data[0])) {
    return (data as unknown[][])
      .map(row => row.map(escapeCsvValue).join(","))
      .join("\n");
  }

  const objectRows = data as Record<string, unknown>[];
  const headers = Object.keys(objectRows[0] || {});
  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...objectRows.map(row => headers.map(header => escapeCsvValue(row[header])).join(","))
  ];

  return lines.join("\n");
}
