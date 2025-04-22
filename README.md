# Superfund

This is an interactive map of Superfund contaminated toxic waste sites across the U.S.

[**superfund.lachlanjc.com**](https://superfund.lachlanjc.com)

## Development

```bash
bun i
bun dev
```

### Supabase database setup

1. Install the Supabase CLI (if you haven’t already):
   ```bash
   bun i -g supabase
   ```
2. Initialize Supabase in this project:
   ```bash
   supabase init
   ```
3. Configure your database credentials in `.env`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>  # for server-side operations
   ```
4. Run the migration to create the `sites` table:
   ```bash
   supabase db push
   # or, manually:
   # psql $SUPABASE_DB_URL -f supabase/migrations/0001_create_sites_table.sql
   ```
5. Import the site data JSON into your database:
   ```bash
   bun lib/tasks/import-sites.ts
   ```
6. Run the migration to create the `scores` table:
   ```bash
   supabase db push
   # or, manually:
   # psql $SUPABASE_DB_URL -f supabase/migrations/0002_create_scores_table.sql
   ```

Now, import and use the client from `lib/supabaseClient.ts`:

```ts
import { supabase } from "@/lib/supabaseClient";

// Fetch all sites
const { data: sites, error } = await supabase.from("sites").select("*");
```

### Updating sites list

- Download [core CSV from EPA](https://hub.arcgis.com/datasets/EPA::superfund-national-priorities-list-npl-sites-with-status-information/about) to `lib/data/sites-raw.csv`
- Download [GeoJSON from EPA](https://hub.arcgis.com/datasets/EPA::npl-superfund-site-boundaries-epa-public-2022/explore?location=40.741488%2C-74.341546%2C10.30) to `lib/data/sites.geojson` (gitignored because huge)
- `bun run lib/tasks/csv-to-json.ts` to convert to JSON
- `bun x @mrodrig/json-2-csv-cli lib/data/sites.json -o lib/data/sites-processed.csv` if you want to convert back to CSV

### Environment variables

| Variable                         | Description                       |
| -------------------------------- | --------------------------------- |
| OpenAI for chat completions      | `OPENAI_API_KEY`                  |
| Supabase database: key           | `NEXT_PUBLIC_SUPABASE_ANON_KEY`   |
| Supabase database: URL           | `NEXT_PUBLIC_SUPABASE_URL`        |
| Supabase: server-side operations | `SUPABASE_SERVICE_ROLE_KEY`       |
| Mapbox for maps                  | `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` |
| Serper for search results        | `SERPER_API_KEY`                  |
| OpenCage for geocoding           | `OPENCAGE_API_KEY`                |

MIT License
