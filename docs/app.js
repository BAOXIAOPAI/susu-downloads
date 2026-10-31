const $ = id => document.getElementById(id);
async function loadRelease() {
  const abort = new AbortController(); const timer = setTimeout(() => abort.abort(), 8000);
  try {
    const res = await fetch('./latest.json', {cache: 'no-cache', signal: abort.signal});
    if (!res.ok) throw new Error('unavailable');
    const r = await res.json();
    if (r.schemaVersion !== 1 || r.packageName !== 'com.dorm.cleaner.preview' || r.revoked !== false || !/^https:\/\/github\.com\/BAOXIAOPAI\/susu-downloads\/releases\/download\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+\.apk$/.test(r.apkUrl) || !Array.isArray(r.notes) || !r.notes.every(x => typeof x === 'string') || !Number.isFinite(r.sizeBytes) || !/^[a-f0-9]{64}$/.test(r.sha256)) throw new Error('invalid');
    $('version').textContent = `体验版 ${r.versionName}`;
    $('download').href = r.apkUrl; $('download').removeAttribute('aria-disabled');
    $('download').textContent = `下载安卓版 · ${(r.sizeBytes / 1048576).toFixed(1)} MB ↓`;
    $('status').textContent = '保留原应用，直接覆盖安装';
    $('notes').replaceChildren(...r.notes.map(line => {const li = document.createElement('li');li.textContent = line;return li;}));
    $('hash').textContent = `安装包 SHA-256：${r.sha256}`;
  } catch {
    $('version').textContent = '暂时无法获取版本'; $('status').textContent = '请刷新重试，或打开历史版本下载。';
    $('download').textContent = '下载暂不可用'; $('notes').textContent = '版本说明暂不可用。';
  } finally {clearTimeout(timer);}
}
$('share').addEventListener('click', async () => {
  const url = 'https://baoxiaopai.github.io/susu-downloads/';
  try {
    if (navigator.share) await navigator.share({title:'苏宿 · 安卓下载',url});
    else {await navigator.clipboard.writeText(url);$('status').textContent='下载页链接已复制';}
  } catch (e) {if (e.name !== 'AbortError') $('status').textContent = `分享这个地址：${url}`;}
});
loadRelease();
