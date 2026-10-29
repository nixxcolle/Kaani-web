# KaAni Web

A responsive React / TypeScript website for agriculture and fisheries education, quizzes, legal information, sustainability resources, and a local marketplace prototype.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite, including `/Kaani-web/`. The base path matches the existing GitHub Pages deployment. Production builds are written to `dist/`, with a `404.html` copy for client-side routing.

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

The regression tests cover bilingual learning and quiz content, authentication failures, email confirmation, forged legacy login flags, report delivery failures, anonymous duplicate detection, and commission rounding/idempotency.

## Languages and presentation

Use the EN / FIL control in the header, or the explicit English / Filipino buttons in the mobile menu. The language persists across pages and reloads and synchronizes across browser tabs. Site copy, forms, accessibility labels, product descriptions, module text, questions, choices, and explanations use the same translation catalog in `src/lib/translations.ts`. New editorial content should have a catalog entry before publication. Proper names, scientific terms, user submissions, and original downloadable PDF files retain their source text. The online module reader provides the translated educational content.

Translations apply at rendering boundaries; filter IDs, answer keys, form values, and persisted records do not change when switching languages. Search matches both English and Filipino product and learning content.

The shared design uses forest green, coastal blue, rounded outline icons, responsive spacing, keyboard focus indicators, and scrollable dialogs. Ambient CSS animation uses transforms and opacity; reduced-motion preferences disable motion. Routes load on demand.

## Authentication and backend requirements

The app now uses **Supabase Auth**. It no longer reads or writes password hashes in a public `users` table, creates accounts during login, or falls back to browser-based member authentication. Guest sessions remain available without a network connection. Legacy cached password hashes are removed.

Existing accounts created by the old custom `users` implementation are **not Supabase Auth accounts**. Users must register through Supabase Auth or be migrated through a trusted administrative process. Email confirmation is handled explicitly. Enable the email/password provider and configure email delivery, redirect URLs, and any user-profile triggers in your Supabase project. Verify that `quiz_scores.user_id` accepts authenticated user IDs and that row-level security limits score writes to the authenticated owner.

### Troubleshoot sign-in

The sign-in screen now distinguishes incorrect credentials, unconfirmed email, rate limits, connection failures, email delivery restrictions, and server/database failures. Successful authentication is no longer rejected when optional browser display caches cannot be written. Confirmation instructions appear as a status notice, with a resend action; confirmation callbacks restore the Supabase session and open the quiz.

Submitting sign-in, registration, or confirmation email requests has an immediate in-flight guard. A rate-limit response pauses affected submissions for a visible 60-second local cooldown. An email quota pauses registration and resending, while password sign-in remains available for confirmed accounts. A general request limit pauses all authentication submissions. The app does not automatically retry authentication. The local pause does not reset or shorten Supabase's server-side limit; a longer wait may be necessary depending on the project's configuration. See [Supabase rate limits](https://supabase.com/docs/guides/auth/rate-limits) and the project's [Authentication → Rate Limits](https://supabase.com/dashboard/project/isdbsiocqiaxttlfysqq/auth/rate-limits).

In **Authentication → URL Configuration**, allow the exact callback used by the running app, for example `https://nixxcolle.github.io/Kaani-web/auth` for GitHub Pages and `http://localhost:8080/Kaani-web/auth` for local Vite. Use the printed preview origin when testing other ports. The app computes the callback from its actual origin and Vite base path.

Supabase's default email service only sends to organization team members. For public registration and confirmation emails, configure a custom SMTP service under the project's email settings. Keep email confirmation enabled; changing application text cannot repair an unavailable mail service. See the [official SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp).

For a confirmed account that still fails, inspect its latest `/token` error in [this project's Auth logs](https://supabase.com/dashboard/project/isdbsiocqiaxttlfysqq/logs/auth-logs). A `Database error` requires investigating the matching Auth/Postgres log entry rather than changing passwords or relaxing permissions blindly. The read-only `supabase/diagnostics/auth.sql` file checks account confirmation counts, signup triggers, profile columns, and constraints without returning user records. No database changes are applied by that script.

Optional `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables can point the app to another project; configure both for the same project and rebuild. Never expose a service-role key in frontend configuration. See `.env.example`.

The existing public Supabase project configuration remains in `src/lib/supabase.ts`. Public module and quiz reads were checked, including translations for the current remote text. This change does not configure the remote database, migrate existing users, verify remote row-level-security policies, or send live test reports. Guest learning and built-in content work offline after assets have loaded.

Reports are only acknowledged after the remote insert succeeds. The `market_reports` table must support the fields in `src/lib/reports.ts`, including reporter name/contact, and enforce suitable insertion and read policies. Public browser-based moderation controls were removed. Moderation must run behind authenticated server-enforced permissions.

## Marketplace behavior

New listings and favorites are saved in the current browser. Listing forms and confirmation messages explicitly identify this limitation. They are not published to other devices; shared listings require a backend product schema, storage, and authorization.

Contact forms open a prefilled SMS draft. The buyer must send it in their messaging app; the site does not confirm delivery or reserve stock. Desktop users can use the displayed phone number. Inquiries are recorded locally as pending, and repeated identical submissions are deduplicated. Fee breakdowns are illustrative: this app does not collect payments, deduct commissions, or settle seller payouts.

## Deployment

```sh
npm run build
npm run deploy
```

Deployment requires access to the existing GitHub Pages repository. No deployment was performed as part of these local changes.
