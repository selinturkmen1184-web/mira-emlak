import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("RealYerin yakında ekranını sunucu tarafında oluşturur", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="tr"/i);
  assert.match(html, /<title>RealYerin \| Çok Yakında<\/title>/i);
  assert.match(html, /REALYERİN/);
  assert.match(html, /ÇOK/);
  assert.match(html, /YAKINDA/);
  assert.match(html, /BURADAYIZ\./);
  assert.match(html, /AÇILIŞA HAZIRLIK/);
  assert.match(html, /GÜVENLE KEŞFET/);
  assert.match(html, /aria-labelledby="soon-title"/);
  assert.match(html, /https:\/\/mira-emlak\.pages\.dev\/og-v7\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/i);
});

test("yakında ekranının temel erişilebilirlik öğelerini içerir", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /<h1[^>]*id="soon-title"/);
  assert.match(html, /aria-label="RealYerin ana sayfa"/);
  assert.match(html, /<img[^>]*alt=""/);
  assert.doesNotMatch(html, /type="password"|guvenlealsat@gmail\.com/i);
});
