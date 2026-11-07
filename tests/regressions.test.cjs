const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(file, mocks = {}) {
  const source = fs.readFileSync(path.resolve(file), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  const localRequire = name => Object.hasOwn(mocks, name) ? mocks[name] : name.startsWith('.') ? load(path.join(path.dirname(file), name + '.ts'), mocks) : require(name);
  new Function('require', 'module', 'exports', output)(localRequire, module, module.exports);
  return module.exports;
}
const storage = () => {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};
beforeEach(() => {
  global.localStorage = storage(); global.sessionStorage = storage();
  global.window = { dispatchEvent() {} };
});

test('all built-in quiz questions are valid and have translated questions, choices and explanations', () => {
  const { DEFAULT_QUIZ_QUESTIONS: questions } = load('src/lib/data.ts');
  const { filipino } = load('src/lib/translations.ts');
  const retainedTerms = new Set(['Pantat', 'Bangus', 'Tilapia', 'Danggit']);
  assert.equal(questions.length, 16);
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const q of questions) {
    assert.ok(['A', 'B', 'C', 'D'].includes(q.correct_answer));
    for (const field of ['question', 'choice_a', 'choice_b', 'choice_c', 'choice_d', 'explanation', 'fun_fact']) {
      if (q[field]) assert.ok(filipino[q[field]] || retainedTerms.has(q[field]), `${q.id}: missing ${field} translation: ${q[field]}`);
    }
  }
});

test('all built-in learning text and product descriptions have Filipino translations', () => {
  const { DEFAULT_LEARNING_MODULES: modules } = load('src/lib/data.ts');
  const { INITIAL_PRODUCTS: products } = load('src/data/marketProducts.ts');
  const { filipino } = load('src/lib/translations.ts');
  const check = text => assert.ok(filipino[text], `Missing translation: ${text}`);
  for (const m of modules) {
    [m.title, m.description, m.category, ...m.objectives].forEach(check);
    for (const section of m.contentSections) [section.heading, section.body, section.keyTakeaway].filter(Boolean).forEach(check);
  }
  for (const p of products) [p.name, p.description, p.category, p.type, p.harvestDate].filter(Boolean).forEach(check);
});

test('translation round-trip preserves surrounding spaces and unknown user content', () => {
  const { translateText } = load('src/lib/translate.ts', { './language-context': { useLanguage: () => ({ language: 'en' }) } });
  assert.equal(translateText('  Contact Seller ', 'fil'), '  Makipag-ugnayan sa Nagbebenta ');
  assert.equal(translateText('Makipag-ugnayan sa Nagbebenta', 'en'), 'Contact Seller');
  assert.equal(translateText('A custom farm name', 'fil'), 'A custom farm name');
  const { filipino } = load('src/lib/translations.ts');
  assert.ok(Object.keys(filipino).length > 500);
  assert.ok(Object.values(filipino).every(value => typeof value === 'string' && value.length));
});

test('invalid or offline login fails without creating a user or querying password hashes', async () => {
  let calls = 0;
  const supabase = { auth: { signInWithPassword: async () => { calls++; return { data: {}, error: { message: 'Invalid credentials' } }; } } };
  const auth = load('src/lib/auth.ts', { './supabase': { supabase } });
  const result = await auth.login({ email: 'nobody@example.com', password: 'invalid' });
  assert.equal(result.success, false); assert.equal(result.user, undefined); assert.equal(calls, 1);
  supabase.auth.signInWithPassword = async () => { throw new Error('offline'); };
  assert.equal((await auth.login({ email: 'nobody@example.com', password: 'invalid' })).success, false);
  assert.equal(localStorage.getItem('kaani_local_registered_users'), null);
});

test('signup requiring email confirmation does not authenticate a user', async () => {
  const auth = load('src/lib/auth.ts', { './supabase': { supabase: { auth: { signUp: async () => ({ data: { user: { id: 'pending' }, session: null }, error: null }) } } } });
  const result = await auth.signUp({ name: 'Test', email: 'test@example.com', password: 'password' });
  assert.equal(result.confirmationRequired, true); assert.equal(result.user, undefined);
});

test('unconfirmed accounts receive a confirmation action instead of a generic login failure', async () => {
  const auth = load('src/lib/auth.ts', { './supabase': { supabase: { auth: { signInWithPassword: async () => ({ data: {}, error: { code: 'email_not_confirmed', status: 400 } }) } } } });
  const result = await auth.login({ email: 'test@example.com', password: 'password' });
  assert.equal(result.success, false);
  assert.equal(result.confirmationRequired, true);
  assert.match(result.error, /Confirm your email/);
});

test('confirmed login succeeds even when optional display storage is blocked', async () => {
  const user = { id: 'auth-user', email: 'member@example.com', created_at: '2026-01-01', user_metadata: { name: 'Member' } };
  let credentials;
  const auth = load('src/lib/auth.ts', { './supabase': { supabase: { auth: { signInWithPassword: async value => { credentials = value; return { data: { user, session: { user } }, error: null }; } } } } });
  global.localStorage = { ...storage(), setItem() { throw new Error('Storage blocked'); } };
  const result = await auth.login({ email: ' MEMBER@example.com ', password: ' correct password ' });
  assert.equal(result.success, true);
  assert.equal(result.user.id, user.id);
  assert.deepEqual(credentials, { email: 'member@example.com', password: ' correct password ' });
});

test('a response without an authenticated session cannot log a user in', async () => {
  const auth = load('src/lib/auth.ts', { './supabase': { supabase: { auth: { signInWithPassword: async () => ({ data: { user: { id: 'pending' }, session: null }, error: null }) } } } });
  assert.equal((await auth.login({ email: 'test@example.com', password: 'password' })).success, false);
});

test('signup uses the app callback URL without role metadata', async () => {
  let request;
  const auth = load('src/lib/auth.ts', { './supabase': { authRedirectUrl: 'https://example.com/Kaani-web/auth', supabase: { auth: { signUp: async value => { request = value; return { data: { user: { id: 'pending' }, session: null }, error: null }; } } } } });
  await auth.signUp({ email: ' TEST@example.com ', password: 'password', name: ' Member ' });
  assert.equal(request.options.emailRedirectTo, 'https://example.com/Kaani-web/auth');
  assert.deepEqual(request.options.data, { name: 'Member' });
});

test('resending confirmation uses the registered email and correct callback', async () => {
  let request;
  const auth = load('src/lib/auth.ts', { './supabase': { authRedirectUrl: 'https://example.com/Kaani-web/auth', supabase: { auth: { resend: async value => { request = value; return { error: null }; } } } } });
  assert.equal((await auth.resendConfirmation(' MEMBER@example.com ')).success, true);
  assert.deepEqual(request, { type: 'signup', email: 'member@example.com', options: { emailRedirectTo: 'https://example.com/Kaani-web/auth' } });
  assert.equal((await auth.resendConfirmation('')).success, false);
});

test('network, mail, database and rate-limit errors are distinguished without leaking SQL details', () => {
  const { authErrorMessage } = load('src/lib/auth-errors.ts');
  assert.match(authErrorMessage({ name: 'AuthRetryableFetchError', status: 0 }, 'fallback'), /connect/);
  assert.match(authErrorMessage({ code: 'email_address_not_authorized' }, 'fallback'), /configure the email service/);
  assert.match(authErrorMessage({ code: 'unexpected_failure', status: 500, message: 'INSERT failed in private_table' }, 'fallback'), /server/);
  assert.doesNotMatch(authErrorMessage({ status: 500, message: 'private_table' }, 'fallback'), /private_table/);
  assert.match(authErrorMessage({ code: 'over_email_send_rate_limit' }, 'fallback'), /wait/);
});

test('rate-limited sign-in returns a local retry pause without retrying the server', async () => {
  let calls = 0;
  const auth = load('src/lib/auth.ts', { './supabase': { supabase: { auth: { signInWithPassword: async () => { calls++; return { data: {}, error: { status: 429, code: 'over_request_rate_limit' } }; } } } } });
  const result = await auth.login({ email: 'test@example.com', password: 'password' });
  assert.equal(result.success, false);
  assert.equal(result.retryAfterSeconds, 60);
  assert.equal(result.retryScope, 'all');
  assert.equal(calls, 1);
  assert.match(result.error, /Too many attempts/);
});

test('email quota is distinct from the password sign-in limit', async () => {
  const auth = load('src/lib/auth.ts', { './supabase': { supabase: { auth: { resend: async () => ({ error: { status: 429, code: 'over_email_send_rate_limit' } }) } } } });
  const result = await auth.resendConfirmation('test@example.com');
  assert.equal(result.retryScope, 'email');
  assert.equal(result.retryAfterSeconds, 60);
  assert.match(result.error, /email service/);
});

test('forged legacy authentication flags do not produce an authenticated member', async () => {
  localStorage.setItem('isAuthenticated', 'true'); localStorage.setItem('user', JSON.stringify({ id: 'forged', name: 'Forged' }));
  const auth = load('src/lib/auth.ts', { './supabase': { supabase: { auth: { getUser: async () => ({ data: { user: null }, error: {} }) } } } });
  assert.equal(await auth.getCurrentUser(), null);
  const guest = auth.createGuestSession('Test Guest');
  assert.equal((await auth.getCurrentUser()).id, guest.id);
  assert.equal(guest.is_guest, true);
});

test('report delivery errors are surfaced and do not mark a report as submitted', async () => {
  const reports = load('src/lib/reports.ts', { './supabase': { supabase: { from: () => ({ insert: async () => ({ error: { message: 'Policy denied' } }) }) } } });
  const result = await reports.submitMarketReport({ productId: 'p1', productName: 'Fish', sellerName: 'Test', category: 'Other concerns' });
  assert.equal(result.success, false); assert.deepEqual(reports.getStoredReports(), []);
});

test('anonymous reporters are not conflated with other anonymous reports', async () => {
  const reports = load('src/lib/reports.ts', { './supabase': { supabase: { from: () => ({ insert: async () => ({ error: null }) }) } } });
  const common = { productId: 'p1', productName: 'Fish', sellerName: 'Test' };
  assert.equal((await reports.submitMarketReport({ ...common, category: 'Other concerns' })).success, true);
  assert.equal((await reports.submitMarketReport({ ...common, category: 'Incorrect product information' })).success, true);
  assert.equal((await reports.submitMarketReport({ ...common, category: 'Other concerns' })).success, false);
});

test('commission calculations use finite, nonnegative cents; inquiries remain pending and deduplicate', () => {
  const commission = load('src/lib/commission.ts');
  for (const price of [-1, NaN, Infinity]) assert.equal(commission.calculateCommission(price).grossPrice, 0);
  assert.equal(commission.calculateCommission(12.345).grossPrice, 12.35);
  const order = { productId: 'p1', productName: 'Fish', sellerName: 'Test', price: 100, idempotencyKey: 'inquiry-1' };
  const first = commission.recordMarketTransaction(order);
  assert.equal(first.transaction.platformFee, 5); assert.equal(first.transaction.sellerNet, 95);
  assert.equal(first.transaction.status, 'pending');
  assert.equal(commission.recordMarketTransaction(order).isDuplicate, true);
  assert.equal(commission.getMarketTransactions().length, 1);
});

test('Supabase configuration accepts the project root or REST URL without doubling API paths', () => {
  const { projectUrl } = load('src/lib/supabase-config.ts');
  for (const value of ['https://example.supabase.co', ' https://example.supabase.co/rest/v1/ ', 'https://example.supabase.co/rest/v1']) assert.equal(projectUrl(value), 'https://example.supabase.co');
  for (const value of ['not a URL', 'javascript:alert(1)', 'https://user:pass@example.com', 'https://example.com/auth/v1', 'https://example.com/?key=secret']) assert.throws(() => projectUrl(value));
});

test('modules fetch only database rows across pages and reflect additions, edits and deletions', async () => {
  let rows = [
    { id: 'remote-text', title: 'Marine guide', description: 'Text only', file_name: null, file_data: null },
    { id: 'remote-pdf', title: 'Crop guide', description: null, file_name: 'remote.pdf', file_data: 'pdf' },
  ];
  const offsets = [];
  const builder = { select() { return this; }, order() { return this; }, async range(start) { offsets.push(start); return { data: rows.slice(start, start + 1), error: null, count: rows.length }; } };
  const { fetchLearningModules } = load('src/lib/modules.ts', { './supabase': { supabase: { from: () => { throw new Error('Member client must not read public modules'); } }, moduleCatalog: { from: table => { assert.equal(table, 'modules'); return builder; } } } });
  let result = await fetchLearningModules();
  assert.deepEqual(offsets, [0, 1]);
  assert.deepEqual(result.map(m => m.id), rows.map(m => m.id));
  assert.equal(result[0].description, 'Text only');
  assert.equal(result[0].category, undefined);
  assert.equal(result[0].difficulty, undefined);
  assert.equal(result[0].readTimeMinutes, undefined);
  rows = [{ ...rows[1], title: 'Updated title' }, { ...rows[0], id: 'new-module' }];
  result = await fetchLearningModules();
  assert.deepEqual(result.map(m => m.id), ['remote-pdf', 'new-module']);
  assert.equal(result[0].title, 'Updated title');
  rows = [];
  assert.deepEqual(await fetchLearningModules(), []);
});

test('module permission and network errors propagate instead of pretending to load successfully', async () => {
  const builder = { select() { return this; }, order() { return this; }, async range() { return { data: null, count: null, error: { code: '42501' } }; } };
  const { fetchLearningModules } = load('src/lib/modules.ts', { './supabase': { moduleCatalog: { from: () => builder } } });
  await assert.rejects(fetchLearningModules(), error => error.code === '42501');
  builder.range = async () => { throw new Error('offline'); };
  await assert.rejects(fetchLearningModules(), /offline/);
  builder.range = async () => ({ data: [], error: null, count: 1 });
  await assert.rejects(fetchLearningModules(), /pagination/);
  builder.range = async () => ({ data: [], error: null, count: 0 });
  assert.deepEqual(await fetchLearningModules(), []);
});

test('registration with confirmation disabled authenticates immediately from the returned server session', async () => {
  const user = { id: 'new-member', email: 'test@example.com', created_at: '2026-10-29', user_metadata: { name: 'Member' } };
  const auth = load('src/lib/auth.ts', { './supabase': { supabase: { auth: { signUp: async () => ({ data: { user, session: { user } }, error: null }) } } } });
  const result = await auth.signUp({ email: user.email, password: 'test-password', name: 'Member' });
  assert.equal(result.success, true);
  assert.equal(result.confirmationRequired, undefined);
  assert.equal(result.user.id, user.id);
  assert.equal(JSON.parse(localStorage.getItem('user')).id, user.id);
});


test('public module catalog never loads a cached member session', async () => {
  const source = fs.readFileSync('src/lib/supabase.ts', 'utf8').replaceAll('import.meta.env', '({BASE_URL: "/Kaani-web/"})');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const calls = [];
  const mockRequire = name => name === '@supabase/supabase-js' ? { createClient: (url, key, options) => { const client = { url, key, options }; calls.push(client); return client; } } : load('src/lib/supabase-config.ts');
  const module = { exports: {} };
  window.location = { origin: 'http://localhost:4173' };
  new Function('require', 'module', 'exports', output)(mockRequire, module, module.exports);
  assert.notEqual(module.exports.moduleCatalog, module.exports.supabase);
  assert.equal(await module.exports.moduleCatalog.options.accessToken(), null);
  assert.equal(module.exports.supabase.options.auth.persistSession, true);
  assert.equal(calls.length, 2);
});

const validProduct = { name: 'Tomatoes', category: 'Vegetables & Fruits', type: 'Farm Product', price: 25.50, unit: 'kg', availableStock: 10, status: 'Available', seller: 'Test Seller', sellerPhone: '+63 917 000 0000', location: 'Samar', description: 'Fresh' };
const productRow = { id: 'product-id', owner_id: 'owner-id', name: 'Tomatoes', category: 'Vegetables & Fruits', type: 'Farm Product', price: '25.50', unit: 'kg', stock: '10', status: 'Available', seller_name: 'Test Seller', seller_phone: '+63 917 000 0000', location: 'Samar', description: 'Fresh', photo_path: 'owner-id/product-id/old.jpg', photo_url: 'https://example.com/old.jpg', created_at: '2026-11-01', updated_at: 'version-1' };
function productHarness() {
  const state = { user: { id: 'owner-id' }, row: { ...productRow }, dbError: null, uploadError: null, cleanupError: null, values: null, filters: [], uploaded: [], removed: [], action: '' };
  const storage = { upload: async (name, file) => { state.uploaded.push({ name, file }); return { error: state.uploadError }; }, getPublicUrl: name => ({ data: { publicUrl: 'https://example.com/' + name } }), remove: async names => { state.removed.push(...names); return { error: state.cleanupError }; } };
  const builder = { insert(values) { state.action = 'insert'; state.values = values; return this; }, update(values) { state.action = 'update'; state.values = values; return this; }, delete() { state.action = 'delete'; return this; }, eq(key, value) { state.filters.push([key, value]); return this; }, select() { return this; }, async single() { return { data: state.dbError ? null : { ...state.row, ...state.values }, error: state.dbError }; } };
  const supabase = { auth: { getUser: async () => ({ data: { user: state.user }, error: null }) }, storage: { from: bucket => { assert.equal(bucket, 'product-photos'); return storage; } }, from: table => { assert.equal(table, 'marketplace_products'); return builder; } };
  const service = load('src/lib/products.ts', { './supabase': { supabase } });
  const original = { ...validProduct, id: 'product-id', ownerId: 'owner-id', updatedAt: 'version-1', image: productRow.photo_url, photoPath: productRow.photo_path };
  return { state, service, original };
}
const productPhoto = () => new File([new Uint8Array([255,216,255,224,0,0,0,0,0,0,0,0])], 'photo.jpg', { type: 'image/jpeg' });

test('product validation rejects invalid seller details, amounts, quantities and photos', () => {
  const { service } = productHarness();
  service.validateProduct(validProduct);
  for (const patch of [{ name: ' ' }, { sellerPhone: 'invalid' }, { price: NaN }, { price: -1 }, { price: 1.005 }, { availableStock: -1 }, { availableStock: Infinity }, { category: 'invalid' }, { status: 'invalid' }]) assert.throws(() => service.validateProduct({ ...validProduct, ...patch }));
  assert.throws(() => service.validatePhoto(new File(['svg'], 'evil.svg', { type: 'image/svg+xml' })));
  assert.throws(() => service.validatePhoto({ type: 'image/png', size: 5242881 }));
});

test('only authenticated owners can update or delete products', async () => {
  const { state, service, original } = productHarness();
  state.user = null;
  await assert.rejects(service.saveProduct(validProduct, productPhoto()), /Sign in/);
  state.user = { id: 'different-owner' };
  await assert.rejects(service.saveProduct(validProduct, null, original), /own products/);
  await assert.rejects(service.deleteProduct(original), /own products/);
  assert.equal(state.action, ''); assert.equal(state.uploaded.length, 0);
});

test('product creation uploads a file, saves generated URL and owner, and normalizes zero stock', async () => {
  const { state, service } = productHarness();
  const { product } = await service.saveProduct({ ...validProduct, availableStock: 0 }, productPhoto());
  assert.equal(state.action, 'insert'); assert.equal(state.values.owner_id, 'owner-id');
  assert.equal(state.values.status, 'Out of Stock');
  assert.ok(state.values.photo_path.startsWith('owner-id/' + state.values.id + '/'));
  assert.equal(state.values.photo_url, 'https://example.com/' + state.values.photo_path);
  assert.equal(product.image, state.values.photo_url);
  assert.equal(state.removed.length, 0);
});

test('failed upload or invalid photo content never creates a product', async () => {
  const { state, service } = productHarness();
  await assert.rejects(service.saveProduct(validProduct, new File(['not an image'], 'bad.jpg', { type: 'image/jpeg' })), /not a valid/);
  state.uploadError = { message: 'denied' };
  await assert.rejects(service.saveProduct(validProduct, productPhoto()), /upload failed/);
  assert.equal(state.action, '');
});

test('restocking guards the owner and version, preserves photo, and rejects stale edits', async () => {
  const { state, service, original } = productHarness();
  await service.saveProduct({ ...validProduct, availableStock: 42.5, status: 'Unavailable' }, null, original);
  assert.equal(state.values.stock, 42.5); assert.equal(state.values.status, 'Unavailable');
  assert.equal(state.values.photo_path, original.photoPath);
  assert.deepEqual(state.filters, [['id','product-id'], ['owner_id','owner-id'], ['updated_at','version-1']]);
  state.dbError = { code: 'PGRST116' };
  await assert.rejects(service.saveProduct(validProduct, null, original), /changed or was deleted/);
});

test('photo replacement cleans the old photo only after confirmed database success', async () => {
  const { state, service, original } = productHarness();
  await service.saveProduct(validProduct, productPhoto(), original);
  assert.deepEqual(state.removed, [original.photoPath]);
  state.removed = []; state.dbError = { code: '42501' };
  await assert.rejects(service.saveProduct(validProduct, productPhoto(), original), /could not be saved/);
  assert.equal(state.removed.length, 1); assert.notEqual(state.removed[0], original.photoPath);
  state.removed = []; state.dbError = { message: 'Failed to fetch' };
  await assert.rejects(service.saveProduct(validProduct, productPhoto(), original), /could not be saved/);
  assert.deepEqual(state.removed, []);
});

test('deletion checks the saved version before deleting the photo and reports cleanup failures', async () => {
  const { state, service, original } = productHarness();
  state.dbError = { code: '42501' };
  await assert.rejects(service.deleteProduct(original), /could not be deleted/);
  assert.deepEqual(state.removed, []);
  state.dbError = null; state.cleanupError = { message: 'offline' };
  const result = await service.deleteProduct(original);
  assert.match(result.warning, /photo could not be removed/);
  assert.deepEqual(state.filters.slice(-3), [['id','product-id'], ['owner_id','owner-id'], ['updated_at','version-1']]);
});

test('product catalog reads every database page without demo listings', async () => {
  let rows = [productRow, { ...productRow, id: 'second' }];
  const builder = { select() { return this; }, order() { return this; }, async range(start) { return { data: rows.slice(start, start + 1), error: null, count: rows.length }; } };
  const service = load('src/lib/products.ts', { './supabase': { moduleCatalog: { from: () => builder } } });
  assert.deepEqual((await service.fetchProducts()).map(product => product.id), ['product-id', 'second']);
  rows = []; assert.deepEqual(await service.fetchProducts(), []);
  builder.range = async () => ({ data: null, error: { code: '42501' }, count: null });
  await assert.rejects(service.fetchProducts(), /could not be loaded/);
});


test('registration requires a real name and ignores legacy role properties', async () => {
  let request;
  const auth = load('src/lib/auth.ts', { './supabase': { supabase: { auth: { signUp: async value => { request = value; return { data: { user: { id: 'pending' }, session: null }, error: null }; } } } } });
  assert.equal((await auth.signUp({ name: ' ', email: 'test@example.com', password: 'password' })).success, false);
  assert.equal(request, undefined);
  await auth.signUp({ name: 'Member', email: 'test@example.com', password: 'password', role: 'admin' });
  assert.deepEqual(request.options.data, { name: 'Member' });
  assert.equal(auth.createGuestSession().role, undefined);
});

test('registration opens directly with only name, email and password fields and ignores old profile URLs', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { StaticRouter } = require('react-router-dom/server');
  const wrapper = ({ children }) => React.createElement('div', null, children);
  const native = tag => props => React.createElement(tag, props);
  const mocks = {
    '@/lib/translate': { useText: () => text => text },
    '@/components/icons': new Proxy({}, { get: () => () => null }),
    '@/components/ui/button': { Button: ({ children }) => React.createElement('button', null, children) },
    '@/components/ui/input': { Input: native('input') },
    '@/components/ui/label': { Label: native('label') },
    '@/components/ui/card': { Card: wrapper, CardContent: wrapper, CardDescription: wrapper, CardHeader: wrapper, CardTitle: wrapper },
    '@/components/ui/tabs': { Tabs: wrapper, TabsContent: wrapper, TabsList: wrapper, TabsTrigger: wrapper },
    '@/components/Header': { default: () => null }, '@/components/Footer': { default: () => null },
    '@/lib/auth': {}, '@/lib/supabase': {}, '@/lib/auth-errors': {},
  };
  const source = fs.readFileSync('src/pages/Auth.tsx', 'utf8');
  const output = ts.transpileModule(source, { fileName: 'Auth.tsx', compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', output)(name => mocks[name] || require(name), module, module.exports);
  const html = renderToStaticMarkup(React.createElement(StaticRouter, { location: '/auth?mode=signup&role=farmer&profile=Farmer' }, React.createElement(module.exports.default)));
  assert.match(html, /Create Free Account/);
  assert.deepEqual([...html.matchAll(/<input[^>]* name="([^"]+)"/g)].map(match => match[1]), ['name', 'email', 'password', 'confirmPassword']);
  assert.doesNotMatch(html, /<select|type="radio"|Learner \(Farmer\)|Back to Roles/);
  assert.match(html, /name="name"[^>]*value=""/);
});

test('Tagalog and Waray catalogs cover every editorial entry and keyed fallback', () => {
  const { filipino } = load('src/lib/translations.ts');
  const { waray } = load('src/lib/waray.ts');
  const { TRANSLATIONS } = load('src/lib/i18n-data.ts');
  assert.deepEqual(Object.keys(waray).sort(), Object.keys(filipino).sort());
  assert.ok(Object.keys(waray).length > 890);
  for (const text of Object.values(TRANSLATIONS.en)) {
    assert.ok(filipino[text], 'Missing Tagalog: ' + text);
    assert.ok(waray[text], 'Missing Waray: ' + text);
  }
  assert.ok(Object.values(waray).every(text => typeof text === 'string' && text.trim()));
});

test('language preference accepts all locales, preserves old Filipino settings, and rejects invalid values', () => {
  const { LANGUAGES, savedLanguage, isLanguage } = load('src/lib/locales.ts');
  for (const code of ['en', 'fil', 'war']) { assert.equal(isLanguage(code), true); assert.equal(savedLanguage(code), code); }
  assert.equal(savedLanguage('tl'), 'fil');
  for (const value of [null, '', '__proto__', 'fr', {}, 5]) { assert.equal(isLanguage(value), false); assert.equal(savedLanguage(value), 'en'); }
  assert.equal(LANGUAGES.fil.label, 'Tagalog'); assert.equal(LANGUAGES.war.htmlLang, 'war');
});

test('three-language translation works across navigation, modules, forms, errors and notifications', () => {
  const { translateText } = load('src/lib/translation-catalogs.ts');
  const samples = ['Home', 'Full Name', 'Product saved', 'Edit Product / Restock', 'Unit 1: INTRODUCTION TO FISH PHYSIOLOGY', 'Invalid email or password. Check your details and try again.', 'TRIAL MODULE', 'dont click this is for trial only'];
  for (const source of samples) {
    const war = translateText(source, 'war'); const fil = translateText(source, 'fil');
    assert.notEqual(war, source); assert.notEqual(fil, source);
    assert.equal(translateText(war, 'fil'), fil);
    assert.equal(translateText(fil, 'war'), war);
    assert.equal(translateText(war, 'en'), source);
  }
  assert.equal(translateText('  Product saved ', 'war'), '  Natipigan an produkto ');
  assert.equal(translateText('A custom farm name', 'war'), 'A custom farm name');
  assert.equal(translateText('ambot', 'en'), "I don't know");
  assert.equal(translateText('ambot', 'fil'), 'Hindi ko alam');
});


test('seller monthly commissions use completed own sales, Manila months and verified payments only', () => {
  const { monthlyCommissions, productCommissionSummary, commissionCsv, closedBillingMonth } = load('src/lib/seller-dashboard.ts', { './supabase': {}, './products': {} });
  const base = { id:'o', seller_id:'seller', product_id:'fish', product_name:'Fish', total:100, quantity:2, status:'Completed', completed_at:'2026-10-31T16:30:00Z', commission:5, commission_rate:0.05, due_date:'2026-11-30' };
  const orders = [base, {...base,id:'o2',total:200,quantity:3,commission:10}, {...base,status:'Cancelled',commission:999}, {...base,seller_id:'other',commission:999}];
  const result = monthlyCommissions(orders, [{month:'2026-11-01',amount:2,status:'Paid'}, {month:'2026-11-01',amount:5,status:'Pending Verification'}, {month:'2026-11-01',amount:50,status:'Rejected'}], 'seller');
  assert.equal(result.length,1); assert.equal(result[0].month,'2026-11-01'); assert.equal(result[0].sales,300); assert.equal(result[0].commission,15); assert.equal(result[0].balance,13); assert.equal(result[0].pending,5);
  assert.deepEqual(productCommissionSummary(result[0].orders),[{name:'Fish',sales:300,commission:15,quantity:5}]);
  assert.ok(commissionCsv([{...base,product_name:'=HYPERLINK("bad")'}]).includes("' =".replace(' ','')));
  assert.equal(closedBillingMonth('2026-10-01',new Date('2026-10-31T16:00:00Z')),true);
  assert.equal(closedBillingMonth('2026-11-01',new Date('2026-10-31T16:00:00Z')),false);
});

test('order submission validates input and only submits product id and buyer details, only the expected price, never authoritative totals or seller identity', async () => {
  const calls=[]; const { placeOrder }=load('src/lib/seller-dashboard.ts', {'./products':{},'./supabase':{supabase:{rpc:async(...args)=>{calls.push(args);return {error:null};}}}});
  await assert.rejects(placeOrder('id','product',0,'Buyer','09123456789',100));
  await assert.rejects(placeOrder('id','product',1.0001,'Buyer','09123456789',100));
  assert.equal(calls.length,0);
  await placeOrder('id','product',1.5,' Buyer ','09123456789',100);
  assert.deepEqual(calls,[['place_marketplace_order',{order_id:'id',product:'product',qty:1.5,buyer:'Buyer',phone:'09123456789',expected_price:100}]]);
});

test('payment submission validates before upload and never submits verification status', async () => {
  const calls=[]; const { submitPayment }=load('src/lib/seller-dashboard.ts',{'./products':{},'./supabase':{supabase:{auth:{getUser:async()=>({data:{user:{id:'seller'}}})},rpc:async(...args)=>{calls.push(args);return {error:null};}}}});
  await assert.rejects(submitPayment('id','2026-10-01',0,'1234567890123','2026-11-01',null));
  await assert.rejects(submitPayment('id','2026-10-01',5,'bad','2026-11-01',null));
  assert.equal(calls.length,0);
  await submitPayment('id','2026-10-01',5,'1234567890123','2026-11-01',null);
  assert.deepEqual(calls,[['submit_commission_payment',{payment_id:'id',billing_month:'2026-10-01',paid:5,reference_number:'1234567890123',paid_on:'2026-11-01',receipt:null}]]);
});


test('receipt retries reuse the same immutable file path and a replaced screenshot gets a different path', async () => {
  const paths=[]; const requests=[];
  const { submitPayment }=load('src/lib/seller-dashboard.ts',{'./products':{validatePhoto(){}},'./supabase':{supabase:{auth:{getUser:async()=>({data:{user:{id:'seller'}}})},storage:{from:()=>({upload:async path=>{paths.push(path);return {error:null};}})},rpc:async(name,args)=>{requests.push(args);return {error:null};}}}});
  const first=new File(['first screenshot'],'receipt.png',{type:'image/png'}), second=new File(['replacement screenshot'],'receipt.png',{type:'image/png'});
  await submitPayment('id','2026-10-01',5,'1234567890123','2026-11-01',first);
  await submitPayment('id','2026-10-01',5,'1234567890123','2026-11-01',first);
  await submitPayment('id','2026-10-01',5,'1234567890123','2026-11-01',second);
  assert.equal(paths[0],paths[1]); assert.notEqual(paths[1],paths[2]); assert.match(paths[0],/^seller\/id-[a-f0-9]{64}\.png$/); assert.equal(requests[0].receipt,paths[0]);
});


test('module recall questions and every answer option come only from the selected module source', () => {
  const { generateModuleQuestions }=load('src/lib/module-quiz.ts');
  const fish='The gill arches separating the gill slits are reinforced with cartilage. Sharks and their relatives are abundant in oceans as predators and scavengers. Their endoskeleton is cartilaginous and the anterior gill arches are modified into jaws. The mouth is at the center of the round buccal funnel and is armed with horny teeth and a rasping tongue.';
  const crops='Composting is a biological process that transforms organic materials into nutrient-rich humus. Mulching helps conserve soil moisture and suppresses unwanted weeds around growing vegetables. Irrigation provides a controlled supply of water to roots during prolonged dry weather. Rotation includes growing different crops in succession to improve soil fertility and reduce pests.';
  const a=generateModuleQuestions('fish',fish), b=generateModuleQuestions('crops',crops);
  assert.ok(a.length>=2);assert.ok(b.length>=2);
  for(const [questions,text,id] of [[a,fish,'fish'],[b,crops,'crops']]) for(const q of questions) {
    assert.ok(q.id.startsWith(id+'-'));assert.ok(text.includes(q.explanation));assert.equal(q.correct_answer,'A');assert.ok(q.question.includes('_____'));
    assert.equal(new Set([q.choice_a,q.choice_b,q.choice_c,q.choice_d].map(v=>v.toLowerCase())).size,4);
    for(const option of [q.choice_a,q.choice_b,q.choice_c,q.choice_d]) assert.ok(text.includes(option));
  }
  assert.equal(a.some(q=>q.question.includes('Composting')),false);assert.equal(b.some(q=>q.question.includes('gill')),false);
  assert.deepEqual(generateModuleQuestions('trial','dont click this is for trial only'),[]);
});

test('product billing uses exact 30-day periods, including boundaries and February', () => {
  const { productBillingPeriod, billingStatements, closedBillingStatement }=load('src/lib/seller-dashboard.ts',{'./supabase':{},'./products':{}});
  const posted='2026-01-31T08:15:00Z';const first=productBillingPeriod(posted,new Date('2026-03-02T08:14:59Z'));const second=productBillingPeriod(posted,new Date('2026-03-02T08:15:00Z'));
  assert.equal(first.index,0);assert.equal(first.end,'2026-03-02T08:15:00.000Z');assert.equal(second.index,1);assert.equal(second.start,first.end);assert.equal(new Date(second.end)-new Date(second.start),2592000000);
  const order={id:'order',seller_id:'seller',product_name:'Fish',status:'Completed',completed_at:'2026-02-10T00:00:00Z',total:100,commission:5,billing_key:'product:0',billing_start:posted,billing_end:first.end};
  const rows=billingStatements([order,{...order,status:'Cancelled',commission:999}],[{billing_key:'product:0',month:'2026-01-01',amount:2,status:'Paid'},{billing_key:'product:0',month:'2026-01-01',amount:3,status:'Pending Verification'}],'seller');
  assert.equal(rows.length,1);assert.equal(rows[0].commission,5);assert.equal(rows[0].balance,3);assert.equal(rows[0].pending,3);
  assert.equal(closedBillingStatement(rows[0],new Date(first.end)),true);assert.equal(closedBillingStatement(rows[0],new Date('2026-02-28T00:00:00Z')),false);
});


test('PDF page cleaning removes repeated headers and page numbers without losing lesson statements',()=>{
  const {cleanModulePages}=load('src/lib/module-quiz.ts');
  const one='1 Fish Study\nAuthor Name\n1\nFish gills are used for respiration and exchange dissolved oxygen.\nThe water passes over the gill filaments to release carbon dioxide.\nunique last line';
  const two='1 Fish Study\nAuthor Name\n2\nCartilage supports the gill arches and provides structural strength.\nThe lateral line is used to detect vibrations in surrounding water.\nanother last line';
  const text=cleanModulePages([one,two]);assert.ok(!text.includes('Author Name'));assert.ok(!text.includes('Fish Study'));assert.ok(text.includes('Fish gills'));assert.ok(text.includes('Cartilage'));assert.ok(text.includes('unique last line'));
});


test('dashboard distinguishes an expired session from a connection failure before reading private records',async()=>{
  let calls=0;
  const missing=load('src/lib/seller-dashboard.ts',{'./products':{},'./supabase':{supabase:{auth:{getUser:async()=>({data:{user:null},error:{name:'AuthSessionMissingError'}})},rpc:()=>{calls++;}}}});
  await assert.rejects(missing.fetchDashboard(),/Sign in to open/);
  const offline=load('src/lib/seller-dashboard.ts',{'./products':{},'./supabase':{supabase:{auth:{getUser:async()=>({data:{user:null},error:{name:'AuthRetryableFetchError'}})},rpc:()=>{calls++;}}}});
  await assert.rejects(offline.fetchDashboard(),/Check your connection/);assert.equal(calls,0);
});


test('dashboard loads owner posting dates when a cached RPC response lacks billing listings',async()=>{
 const listing={id:'p',name:'Fish',created_at:'2026-11-01T00:00:00Z',review_status:'Approved',stock:2,unit:'kg',photo_url:'photo'};let owner;
 const query={select(){return this;},eq(key,value){owner=value;return this;},order(){return this;},range:async()=>({data:[listing],count:1,error:null})};
 const {fetchDashboard}=load('src/lib/seller-dashboard.ts',{'./products':{},'./supabase':{supabase:{auth:{getUser:async()=>({data:{user:{id:'seller'}}})},rpc:async()=>({data:{products:1,orders:[],payments:[]}}),from:()=>query}}});
 const data=await fetchDashboard();assert.equal(owner,'seller');assert.deepEqual(data.listings,[listing]);assert.equal(data.products,1);
});


test('customers keep all purchases visible even when they also sell products',()=>{
 const {customerOrders}=load('src/lib/seller-dashboard.ts',{'./products':{},'./supabase':{}});
 const orders=[{id:'purchase',buyer_id:'member',seller_id:'other'},{id:'sale',buyer_id:'other',seller_id:'member'},{id:'cancelled',buyer_id:'member',seller_id:'other',status:'Cancelled'}];
 assert.deepEqual(customerOrders(orders,'member').map(o=>o.id),['purchase','cancelled']);assert.deepEqual(customerOrders(orders,'outsider'),[]);
});

test('sales summaries count only completed owned revenue and group calendar monthly earnings in Manila',()=>{
 const {salesSummary}=load('src/lib/seller-dashboard.ts',{'./products':{},'./supabase':{}});
 const base={seller_id:'seller',status:'Completed',product_id:'fish',product_name:'Fish',quantity:1,total:100,commission:5,completed_at:'2026-10-31T16:30:00Z'};
 const summary=salesSummary([base,{...base,total:200,commission:10},{...base,status:'Cancelled',total:999},{...base,status:'Delivered',total:999},{...base,seller_id:'other',total:999}],'seller');
 assert.equal(summary.orderCount,4);assert.equal(summary.completedCount,2);assert.equal(summary.gross,300);assert.equal(summary.commission,15);assert.equal(summary.net,285);assert.equal(summary.products.length,1);assert.equal(summary.products[0].sales,300);assert.equal(summary.months[0].month,'2026-11-01');
});

test('quiz choice shuffling preserves correct answers and grading rejects mixed-module or duplicate question data',()=>{
 const {prepareModuleQuiz,gradeModuleQuiz}=load('src/lib/quiz-session.ts');
 const q={id:'q',module_id:'fish',question:'Complete the fish statement.',choice_a:'Gills',choice_b:'Fins',choice_c:'Scales',choice_d:'Muscles',correct_answer:'A',explanation:'Fish use gills for respiration.'};
 for(let i=0;i<20;i++){const [mixed]=prepareModuleQuiz([q], 'fish');assert.equal(mixed['choice_'+mixed.correct_answer.toLowerCase()],'Gills');assert.deepEqual(gradeModuleQuiz([mixed],{q:mixed.correct_answer},'fish'),{correct:1,total:1,percentage:100});assert.equal(gradeModuleQuiz([mixed],{q:'NONE'},'fish').percentage,0);}
 assert.deepEqual(prepareModuleQuiz([q],'crops'),[]);assert.deepEqual(prepareModuleQuiz([{...q,choice_d:'gills'}],'fish'),[]);
 assert.throws(()=>gradeModuleQuiz([q],{q:'A'},'crops'),/selected module/);assert.throws(()=>gradeModuleQuiz([q,q],{q:'A'},'fish'),/selected module/);
 assert.deepEqual(gradeModuleQuiz([],{},'fish'),{correct:0,total:0,percentage:0});
 const questions=[q,{...q,id:'q2'},{...q,id:'q3'}];assert.deepEqual(gradeModuleQuiz(questions,{q:'A',q2:'A',q3:'NONE'},'fish'),{correct:2,total:3,percentage:67});
});

test('personal quiz history records the selected module and reports blocked local storage honestly',()=>{
 const {savePersonalQuizAttempt,getPersonalQuizHistory}=load('src/lib/data.ts');
 const result=savePersonalQuizAttempt({score:100,total_questions:1,correct_answers:1,date:'2026-11-07',module_id:'fish',module_title:'Fish',question_ids:['fish-q1']});
 assert.equal(result.savedLocally,true);assert.equal(getPersonalQuizHistory()[0].module_id,'fish');
 global.localStorage={getItem:()=>null,setItem:()=>{throw Error('blocked');}};assert.equal(savePersonalQuizAttempt({score:0,total_questions:1,correct_answers:0,date:'2026-11-07'}).savedLocally,false);
});


test('dashboard renders purchases and receipt actions separately from seller fulfillment',()=>{
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{StaticRouter}=require('react-router-dom/server');
 const helpers=load('src/lib/seller-dashboard.ts',{'./supabase':{},'./products':{}});
 const base={quantity:1,unit:'kg',total:100,created_at:'2026-11-07T00:00:00Z',commission:0,completed_at:null};
 const data={user_id:'member',profile:{name:'Test Member',email:'test@example.invalid'},products:1,listings:[],payments:[],orders:[{...base,id:'purchase',buyer_id:'member',seller_id:'other',product_name:'Rice Purchase',status:'Delivered'},{...base,id:'sale',buyer_id:'other',seller_id:'member',product_name:'Fish Sale',status:'Confirmed'}]};
 function render(section){let index=0;const mocks={react:{...React,useState:initial=>{const n=index++;return [n===0?data:n===3?section:n===5?false:initial,()=>{}];}},'@/components/Header':{default:()=>null},'@/components/Footer':{default:()=>null},'@/components/icons':new Proxy({},{get:()=>()=>null}),'@/components/ui/button':{Button:({children,asChild,...props})=>React.createElement('button',props,children)},'@/hooks/use-toast':{useToast:()=>({toast(){}})},'@/lib/translate':{useText:()=>value=>value},'@/lib/commission':load('src/lib/commission.ts'),'@/lib/supabase':{},'@/lib/order-notifications':{},'@/lib/seller-dashboard':helpers};
 const output=ts.transpileModule(fs.readFileSync('src/pages/MarketDashboard.tsx','utf8'),{fileName:'MarketDashboard.tsx',compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};new Function('require','module','exports',output)(name=>mocks[name]||require(name),module,module.exports);
 return renderToStaticMarkup(React.createElement(StaticRouter,null,React.createElement(module.exports.default)));}
 const purchases=render('My Orders');assert.match(purchases,/Rice Purchase/);assert.doesNotMatch(purchases,/Fish Sale/);assert.match(purchases,/>Order Received<\/button>/);assert.match(purchases,/>Order Not Received<\/button>/);
 const sales=render('Seller Orders');assert.match(sales,/Fish Sale/);assert.doesNotMatch(sales,/Rice Purchase/);assert.match(sales,/Confirm Handover \/ Delivery/);assert.doesNotMatch(sales,/>Order Received<\/button>/);
});


test('seller unread queries are owner-filtered and reading notifications uses the checked RPC',async()=>{
 let owner,seen,selection,read;const query={select(...args){selection=args;return this;},eq(key,value){owner=[key,value];return this;},is:async(key,value)=>{seen=[key,value];return {count:3,error:null};}};
 const {unreadSellerOrders,readSellerOrders}=load('src/lib/order-notifications.ts',{'./supabase':{supabase:{from:()=>query,rpc:async(name,args)=>{read=[name,args];return {error:null};}}}});
 assert.equal(await unreadSellerOrders('seller'),3);assert.deepEqual(owner,['seller_id','seller']);assert.deepEqual(seen,['seller_seen_at',null]);assert.equal(selection[1].head,true);
 await readSellerOrders([]);assert.equal(read,undefined);await readSellerOrders(['order']);assert.deepEqual(read,['read_marketplace_orders',{order_ids:['order']}]);
});

test('realtime seller inserts notify once, ignore other sellers and stop after cleanup',async()=>{
 const effects=[],handlers=[],messages=[],counts=[];let state=0,reads=0,removed=false;
 global.window={...global.window,addEventListener(){},removeEventListener(){},setInterval:()=>1};
 const channel={on(_event,filter,callback){handlers.push({filter,callback});return this;},subscribe(callback){callback('SUBSCRIBED');return this;}};
 const {useOrderNotifications}=load('src/hooks/use-order-notifications.ts',{react:{useState:()=>{const n=state++;return [n===0?'seller':0,value=>counts.push(value)];},useEffect:fn=>effects.push(fn)},'@/hooks/use-toast':{useToast:()=>({toast:message=>messages.push(message)})},'@/lib/order-notifications':{unreadSellerOrders:async id=>{assert.equal(id,'seller');reads++;return 2;}},'@/lib/supabase':{supabase:{auth:{getUser:async()=>({data:{user:{id:'seller'}}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},channel:()=>channel,removeChannel:async()=>{removed=true;}}}});
 useOrderNotifications();const cleanups=effects.map(effect=>effect());await new Promise(setImmediate);
 const insert=handlers.find(h=>h.filter.event==='INSERT');assert.equal(insert.filter.filter,'seller_id=eq.seller');
 insert.callback({new:{id:'order',seller_id:'seller'}});insert.callback({new:{id:'order',seller_id:'seller'}});insert.callback({new:{id:'other',seller_id:'outsider'}});await new Promise(setImmediate);
 assert.equal(messages.length,1);assert.equal(messages[0].title,'New customer order');assert.ok(counts.includes(2));
 cleanups.forEach(cleanup=>cleanup());const before=reads;insert.callback({new:{id:'late',seller_id:'seller'}});await new Promise(setImmediate);assert.equal(reads,before);assert.equal(messages.length,1);assert.equal(removed,true);
});

test('seller payment updates call the dedicated payment RPC and preserve order fulfillment state',async()=>{
 let request;const {updateOrderPayment}=load('src/lib/seller-dashboard.ts',{'./products':{},'./supabase':{supabase:{rpc:async(name,args)=>{request=[name,args];return {error:null};}}}});
 await updateOrderPayment('order','Paid');assert.deepEqual(request,['set_marketplace_order_payment',{order_id:'order',next_payment_status:'Paid'}]);
});


test('uncertain purchase responses do not announce success and tell the buyer to check saved orders first',async()=>{
 let events=0;global.window={dispatchEvent(){events++;}};
 const {placeOrder}=load('src/lib/seller-dashboard.ts',{'./products':{},'./supabase':{supabase:{rpc:async()=>({error:{code:'',message:'Failed to fetch'}})}}});
 await assert.rejects(placeOrder('same-attempt','product',1,'Buyer','09123456789',100),/may already have been saved/);assert.equal(events,0);
});


test('a stock or price rejection is explained without claiming an authentication failure or leaking database errors',async()=>{
 const {placeOrder}=load('src/lib/seller-dashboard.ts',{'./products':{},'./supabase':{supabase:{rpc:async()=>({error:{code:'P0001',message:'Product unavailable, price changed or insufficient stock.'}})}}});
 await assert.rejects(placeOrder('id','product',22,'Buyer','09123456789',50),error=>error.message==='The product price or available stock changed. Refresh the listing and check your quantity.');
});
