# Cloudflare Click Logging Setup

## Email Link Format

Use one unique `rid` value per recipient:

```html
<a href="https://YOUR-CLOUDFLARE-DOMAIN/click?rid=EMPLOYEE001">photo</a>
```

The worker logs the click, then redirects to:

```text
/login.html?rid=EMPLOYEE001
```

## Basic Logging

Without extra setup, `_worker.js` writes each click to Cloudflare Worker logs with `console.log`.

In Cloudflare:

1. Open your Worker or Pages project.
2. Go to Logs, Observability, or Real-time logs.
3. Search for `training_link_click`.

## Persistent D1 Logging

For durable click history, create a D1 database and bind it as `DB`.

Create this table:

```sql
CREATE TABLE clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient_id TEXT NOT NULL,
  clicked_at TEXT NOT NULL,
  country TEXT,
  city TEXT,
  user_agent TEXT,
  referer TEXT
);
```

The worker will automatically write to D1 when the `DB` binding exists.

## Privacy Note

Use approved recipient IDs instead of names or email addresses where possible. Get approval from security, HR, and legal/compliance before tracking individual employees.
