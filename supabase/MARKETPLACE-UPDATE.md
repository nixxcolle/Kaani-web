# Product review and 30-day billing update

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
