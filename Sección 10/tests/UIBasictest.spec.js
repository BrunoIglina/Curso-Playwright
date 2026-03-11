const {test, expect} = require('@playwright/test');


// sirve para averiguar si el elemento está visible o no

test('Popup Validationes',                                  async({page})=> {


    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   // await page.goto("https://google.com");
 
   // await page.goBack();
   // await page.goForward();

   await expect(page.locator("#displayed-text")).toBeVisible();

   await page.locator("#hide-textbox").click();
   
   await expect(page.locator("#displayed-text")).toBeHidden();

   // await page.pause();
   await page.locator("#confirmbtn").click();

   // forma de obtener los popups de js cuando es modal y no se puede seguir sin confirmarlo.
   page.on('dialog',dialog => dialog.accept());

   await page.locator("#mousehover").hover();



    // video 50 muestra sobre como controlar los marcos de una pagina dentro de otra pagina, en donde, playwright no puede acceder por si misma.
    const framesPage =    page.frameLocator("#courses-iframe");

    await framesPage.locator("li a[href*='lifetime-access']:visible").click();

    const textCheck = await framesPage.locator(".text h2").textContent();

    console.log(textCheck.split(" ")[1]);



}) 


