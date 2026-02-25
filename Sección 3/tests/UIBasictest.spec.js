const {test, expect} = require('@playwright/test');


/*//esta es una estructura general para ejecutar un testeo
test('First Plawright test',async () =>
{
    //escritura del codigo de playwright
    // debe ser asincronico obviamente para que no busque hacer todos los pasos al mismo tiempo, debe esperar con el async await a que finalize uno para realizar el otro.


})*/

//video 10 section 3

test('Browser Context Plawright test', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/") 
        console.log(await page.title());
})

test('Page Plawright test',async ({page})=>
{
    await page.goto("https://google.com") 
    //get title - assertion
    console.log(await page.title());
    await expect(page).toHaveTitle("Google")
})



