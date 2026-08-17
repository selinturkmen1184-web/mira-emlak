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

test("Mira Emlak ana sayfasını sunucu tarafında oluşturur", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="tr"/i);
  assert.match(html, /<title>Mira Emlak \| Hayalinizdeki Eve Birlikte<\/title>/i);
  assert.match(html, /Hayalinizdeki evi/);
  assert.match(html, /Size özel seçtiklerimiz/);
  assert.match(html, /Boğaz manzaralı, teraslı daire/);
  assert.match(html, /Ücretsiz değerleme/);
  assert.match(html, /https:\/\/mira-emlak\.pages\.dev\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/i);
});

test("temel erişilebilirlik ve iletişim öğelerini içerir", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /aria-label="Ana menü"/);
  assert.match(html, /aria-label="İlan türü"/);
  assert.match(html, /type="tel"/);
  assert.match(html, /mailto:danisman@miraemlak\.com/);
});
