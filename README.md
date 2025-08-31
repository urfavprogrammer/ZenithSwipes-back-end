# NEWDASHBOARD

Database migrations

This project uses Sequelize migrations. Because the repository is configured with "type": "module", some older `.js` migration files may be treated as ESM which can cause the CLI to fail when it attempts to `require()` them.

Recommended workflow:

- Rename migration files that are CommonJS to `.cjs` (we keep a `migrations_cjs/` folder in this repo for immediate use).
- Run migrations with the Sequelize CLI:

```bash
npx sequelize-cli db:migrate --migrations-path migrations_cjs
```

- Alternatively, rename all `.js` migration files to `.cjs` and then run the CLI normally:

```bash
npx sequelize-cli db:migrate
```

Note: I created `migrations/20250821-create-deposits-table.cjs` and a `migrations_cjs/` copy so you can run the migration without changing other files.

If you want a permanent fix, convert all migration files to `.cjs`.
