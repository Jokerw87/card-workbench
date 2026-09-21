const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert'),{pathToFileURL}=require('url');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({acceptDownloads:true,viewport:{width:1360,height:960}});
 await context.setOffline(true);
 const page=await context.newPage(),out=path.join(__dirname,'test-output');fs.mkdirSync(out,{recursive:true});
 const external=[],errors=[],checks=[];
 page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 page.on('dialog',d=>d.accept());
 await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
 async function check(name,fn){await fn();checks.push({name,status:'PASS'});}
 await check('six templates edit and real PNG download',async()=>{
  for(const kind of ['recruitment','notice','steps','knowledge','compare','case']){
   await page.selectOption('#template',kind);
   for(const el of await page.locator('#fields input,#fields textarea').all())await el.fill('虚构中文，数字123；标点！');
   await page.locator('#f_title').fill('长标题验证：中文数字123与标点，确认标题会自动换行且保留完整含义');
   assert.equal(await page.locator('#export').isDisabled(),false);
   const preview=await page.locator('#preview').evaluate(c=>c.toDataURL('image/png').split(',')[1]);
   const dp=page.waitForEvent('download');await page.click('#export');const dl=await dp;const target=path.join(out,kind+'.png');await dl.saveAs(target);
   const bytes=fs.readFileSync(target);assert.equal(bytes.readUInt32BE(16),1080);assert.equal(bytes.readUInt32BE(20),1440);
   assert.equal(bytes.toString('base64'),preview,'export must be byte-identical to preview canvas PNG');
  }
 });
 await check('literal user code is not executed',async()=>{await page.locator('#f_title').fill('<script>window.hacked=1</script>');assert.equal(await page.evaluate(()=>window.hacked),undefined);});
 await check('long content overflow blocks export and auto height recovers',async()=>{
  await page.selectOption('#template','knowledge');await page.fill('#f_body','这是一段中文长正文，用来检查自动换行。'.repeat(70));
  assert.equal(await page.locator('#export').isDisabled(),true);assert.match(await page.locator('#status').textContent(),/溢出/);
  await page.selectOption('#ratio','auto');assert.equal(await page.locator('#export').isDisabled(),false);assert.ok(await page.locator('#preview').evaluate(c=>c.height)>1440);
  const dp=page.waitForEvent('download');await page.click('#export');await (await dp).saveAs(path.join(out,'long.png'));
  await page.fill('#f_body','长文本，'.repeat(1900));assert.equal(await page.locator('#export').isDisabled(),true);
 });
 await check('font size and line spacing change actual image; 9:16 size',async()=>{
  await page.click('#reset');const old=await page.locator('#preview').evaluate(c=>c.toDataURL());
  await page.fill('#titleSize','90');await page.fill('#bodySize','42');await page.fill('#lineHeight','1.8');
  assert.notEqual(await page.locator('#preview').evaluate(c=>c.toDataURL()),old);
  await page.selectOption('#ratio','1920');
  const dp=page.waitForEvent('download');await page.click('#export');const target=path.join(out,'portrait.png');await (await dp).saveAs(target);assert.equal(fs.readFileSync(target).readUInt32BE(20),1920);
 });
 await check('empty fields supported',async()=>{await page.click('#clear');assert.equal(await page.locator('#f_title').inputValue(),'');assert.equal(await page.locator('#export').isDisabled(),false);});
 await check('cancel replacement retains edits',async()=>{
  await page.fill('#f_title','保留的内容');page.removeAllListeners('dialog');page.once('dialog',d=>d.dismiss());
  await page.selectOption('#template','recruitment');assert.equal(await page.locator('#f_title').inputValue(),'保留的内容');assert.equal(await page.locator('#template').inputValue(),'knowledge');page.on('dialog',d=>d.accept());
 });
 await check('draft roundtrip and invalid draft rejected',async()=>{
  const dp=page.waitForEvent('download');await page.click('#save');const target=path.join(out,'draft.json');await (await dp).saveAs(target);
  await page.click('#reset');await page.locator('#draftFile').setInputFiles(target);assert.equal(await page.locator('#f_title').inputValue(),'保留的内容');
  await page.locator('#draftFile').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":1,"template":"__proto__"}')});assert.match(await page.locator('#status').textContent(),/无法打开/);
 });
 await page.click('#reset');await page.selectOption('#template','recruitment');await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});
 await check('offline; no external requests; no runtime errors',async()=>{assert.deepEqual(external,[]);assert.deepEqual(errors,[]);});
 const report={browser:await browser.version(),platform:'Windows desktop headless Chromium; offline context; file://',checks,externalRequests:external,errors,android:'NOT_RUN',time:new Date().toISOString()};
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
