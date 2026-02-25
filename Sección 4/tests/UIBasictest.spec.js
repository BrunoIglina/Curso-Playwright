const {test, expect} = require('@playwright/test');


test('Browser Context Plawright test', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/") 
        console.log(await page.title());
    //css y xpath, o puede ser con type fill
    // AHORA TYPE ES OBSOLETO Y SE USA FILL
    await page.locator('#username').fill("raulshetty");
    await page.locator("[type='password']").fill("learning");
    await page.locator("#signInBtn").click();
    //esperar hasta que el locator se muestre en la pagina
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
})




