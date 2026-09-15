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

test("Güvenle Al Sat yakında ekranını sunucu tarafında oluşturur", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="tr"/i);
  assert.match(html, /<title>Güvenle Al Sat \| Yakında Sizlerle<\/title>/i);
  assert.match(html, /güvenle/i);
  assert.match(html, /alsat/i);
  assert.match(html, /Yakında Sizlerle/);
  assert.match(html, /HIZLI SATIŞ/);
  assert.match(html, /GÜVENLİ ALIM - SATIM/);
  assert.match(html, /DOĞRU FİYAT/);
  assert.match(html, /İLK 1 YIL ÜCRETSİZ/);
  assert.match(html, /aria-labelledby="soon-title"/);
  assert.match(html, /https:\/\/mira-emlak\.pages\.dev\/guvenlealsat-yakinda\.jpg/);
  assert.doesNotMatch(html, /RealYerin|REALYERİN|YERİNİ BUL/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/i);
});

test("yakında ekranının temel erişilebilirlik öğelerini içerir", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /<h1[^>]*id="soon-title"/);
  assert.match(html, /aria-label="Güvenle Al Sat e-posta adresine yaz"/);
  assert.match(html, /<img[^>]*alt=""/);
  assert.match(html, /guvenlealsat@gmail\.com/i);
  assert.doesNotMatch(html, /type="password"/i);
});
