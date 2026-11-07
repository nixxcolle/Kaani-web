# Product review and 30-day billing update

## Real-time order, inventory and seller notifications

Run the latest complete `marketplace-update.sql` to enable the new payment and unread-order fields/RPCs. The standalone `order-sync.sql` applies only this latest increment after all previous updates. Both are safe to rerun. Existing orders retain payment status Not Recorded; new orders begin Unpaid. Old orders are marked seen during the one-time migration, while new orders remain unread until the seller opens Seller Orders.

Placing an order calls a single authenticated database transaction. The server derives the seller, price and product details from the approved listing, locks its inventory row, validates stock and expected price, inserts the order, then reserves stock. Failure rolls everything back; retries with the same order ID cannot decrement inventory twice. Seller cancellation before delivery restores stock once. No stock is deducted a second time when payment or receipt is confirmed.

Supabase Realtime publishes committed order and product changes. Customer and seller dashboards refresh on these events even in background tabs, on local successful actions, and on focus/visibility return. Reconnection refresh and polling cover missed events. Sellers receive an in-app new-order toast and a persistent unread badge on the account avatar/mobile menu. The badge opens Seller Orders and clears only records actually fetched and viewed by their owner. Notifications work while the website is open and connected; email, SMS and operating-system push notifications are not included. Browser/server network outages cannot deliver instant notifications; unread orders remain available on return.

Orders show the actual product, quantity/unit, unit price, total, buyer name/contact, creation time, fulfillment status and payment status. The seller can explicitly Record Payment Received or Mark Unpaid with confirmation. This records an outside cash/direct payment; it does not charge a payment method or automatically verify GCash. Customers cannot change payment status. Paid and fulfillment states are separate, and cancelled orders are not automatically refunded by the website.

If the purchase response is uncertain, check My Orders before changing details or placing another order. The app retains the original attempt ID when retrying the same request. Real purchases are not manufactured for tests; the isolated PostgreSQL test verifies stock, ownership, unread markers, payment updates and rollback using disposable records.

## Customer receipt and seller fulfillment update

Run the latest full `marketplace-update.sql` to add the fulfillment and quiz-progress changes as well. It is safe to rerun and preserves existing completed sales/payments. The standalone `order-fulfillment.sql` and `quiz-progress.sql` apply just these changes when all earlier prerequisites already exist.

My Orders always shows the signed-in customer's purchases, even when that account also sells. Seller Orders separately lists received orders. The workflow is Pending → Confirmed → Handed Over / Delivered → Completed. Sellers confirm orders and then handover/delivery; only the buyer's Order Received confirmation completes a new transaction and records the 5% commission in the product's 30-day billing period.

Order Not Received leaves the order open, records the report timestamp and alerts both parties. It does not automatically cancel, refund, restore stock or create commission. The buyer can confirm receipt after resolution. Sellers cannot override that report or confirm receipt on the buyer's behalf. Repeated confirmation calls do not duplicate sales or commissions. Cancellation remains available to sellers before handover and restores reserved stock once. There is no automatic completion timer or automated dispute/refund system.

My Sales shows completed gross sales, completed/all order counts, commission-adjusted net earnings, per-product revenue, calendar monthly earnings in Asia/Manila, and completed transaction history. Pending, handed-over and cancelled orders are excluded from earned revenue. Monthly earnings summaries are distinct from the per-product 30-day billing statements. Net earnings subtract commission, not product costs or other seller expenses.

Quiz attempts now validate module ownership of each question, unique answer choices and correct-answer mapping after shuffling. Answers and timeouts lock immediately; finishing an attempt saves only once. Results store the module ID, title and question IDs locally and in private `quiz_scores` records. Cloud failures are shown clearly. Database checks enforce score/count consistency and own-user access; these are personal learning records, not a tamper-proof exam/certification service. Existing practice/timed modes and scoring percentages are retained.

Open `marketplace-update.sql`, copy its complete contents into Supabase SQL Editor and Run. It installs missing marketplace/dashboard prerequisites, then applies product approval and 30-day billing. The entire operation is transactional and can be run again. The separate `product-review-billing.sql` is the review/billing migration only and is intended to run once after the prerequisites.

New uploads are Pending and visible only to their owner until approved. Existing listings are kept Approved during migration. Editing product or seller details/photo resubmits a listing for review; stock and availability changes retain its approval. Sellers cannot set approval fields or forge the posting date.

Administrators review the real listing in Supabase Table Editor. To approve it, run this SQL as the project administrator after replacing the placeholder with the actual product ID:

```sql
select public.review_marketplace_product('PRODUCT-UUID-HERE'::uuid, true);
```

Use `false` to reject it. No administrator credentials are included in the website. Buyers cannot order pending or rejected products. Owner listings remain accessible through My Products.

Billing periods are consecutive **720-hour (30-day)** intervals from the server-recorded posting timestamp. Restocking, edits, approval and month boundaries do not reset this timestamp. Each completed sale is assigned to the product period containing its completion time; the 5% commission and period dates are stored with the sale. Payment can be submitted only after that period closes. Empty periods do not create fees. The website does not charge a listing subscription or transfer money automatically.

Previously completed monthly sales and their payments are preserved as legacy monthly statements. Outstanding orders with an existing product adopt the 30-day anchor; old orders whose product was already deleted retain the legacy monthly behavior because their original posting date cannot be recovered reliably. Do not reinterpret a month-end statement date as a new grace period or overdue penalty; none has been specified.

GCash submission and manual verification remain unchanged. The dashboard shows per-product period dates, days remaining, balances, downloadable reports and payment history. The private receipt bucket remains owner-only.

## Module-specific quizzes

The module ID is carried from the module reader into the quiz. The quiz reads that module's current PDF using the lazy-loaded Mozilla PDF.js worker, removes repeated page-edge headers/footers and creates extractive fill-in-the-blank multiple-choice recall questions. Correct answers and explanations quote only that document; distractors are words from the same material. Text-only modules use their content sections. The shared question bank is never used as a fallback.

Practice/timed mode, answer shuffling, navigation, scoring, sound and saved progress use the existing quiz flow. Each quiz still selects up to 10 questions from its own source pool. The question wording differs from the former shared bank because it is now generated from the selected document. Source text remains in the document's language; interface prompts support English, Tagalog and Waray-Waray.

Image-only/scanned PDFs need a readable text layer; OCR is not included. Unreadable or insufficient materials show an explanation instead of unrelated questions. Browser extraction is limited to 400 pages and 2 million characters per module; larger materials need server-side extraction. No module content is sent to an external AI service.
