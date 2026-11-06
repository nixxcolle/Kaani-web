# Seller dashboard setup

1. In Supabase SQL Editor, run the **contents** of `seller-dashboard.sql` once, after the existing `marketplace.sql`. This adds new tables and checked functions; it does not import browser SMS inquiries or create sample transactions.
2. Open the website → Kaani Market → My Dashboard. Sign in with your existing account. Commission management appears only for users who own products or have received seller orders.
3. A signed-in buyer can open Contact Seller, enter name, phone and quantity, then choose **Place Order**. SMS remains a separate inquiry and does not create a sale. The server checks the current price, reserves stock atomically, and uses a unique order ID to avoid repeat submissions. Cancelling restores stock when the product still exists. Sellers confirm an order and mark it Completed after the actual transaction.
4. Every completed order stores 5% commission rounded to centavos, the transaction price and completion time. Completed orders cannot be cancelled through the app. Pending and cancelled orders generate no commission. The database totals are summarized per product and month using Asia/Manila. Current-month reports accrue; previous months are final. CSV exports include product totals and an overall total. No scheduled job is needed to make a closed month's report available.
5. GCash payments go to **09305846861** outside the website. The form records the amount, billing month, date, unique GCash reference and optional private receipt (JPG/PNG/WebP, 5 MB). It does not transfer money. Submissions for the current/open month are blocked. Payments stay Pending Verification and never reduce balances until an administrator verifies them.

## Administrator verification

Use Supabase Table Editor → `marketplace_commission_payments` to inspect a pending record. Compare its reference, amount and recipient against the actual GCash account. Use Storage → `commission-receipts` to view the optional receipt. A screenshot alone is not proof of settlement.

After checking the real payment, an administrator can run this in Supabase SQL Editor, replacing the quoted UUID with that payment's actual ID:

```sql
select public.verify_marketplace_commission_payment('PAYMENT-UUID-HERE'::uuid, true);
```

Use `false` to reject a pending submission. Verification records the time and database actor. Normal authenticated users cannot call this function or directly change orders, settings or payment records. Never put a service-role key in the browser. No automatic GCash verification or separate admin website is included.

The month-end date is the statement date. A separate payment deadline/grace period has not been specified, so the website does not invent an overdue deadline or penalty. Verified overpayments remain visible in history and do not automatically transfer credit between months.

If a payment request has an uncertain network result, refresh Payment History before retrying. Receipts are immutable/private and can remain unlinked after a failed submission; an administrator can remove unlinked receipts after checking the records. Existing historical products/orders outside these marketplace tables are not migrated.

## Checks

`npm test`, `npm run typecheck`, `npm run lint`, `npm run build` cover application checks. The development-only PostgreSQL check in `artifacts/sql-check/check.cjs` runs the actual migrations against an isolated PGlite database with minimal Auth/Storage schema stubs. It checks access rules, order retries, stock reservation/cancellation, state transitions, 5% commission, payment submission and administrator verification without modifying live Supabase records.
