const {test, expect} = require('@playwright/test');




test('Playwright Special Locators', async({page})=> {


    await page.goto("https://rahulshettyacademy.com/angularpractice/");

    await page.getByLabel("Check me out if you Love IceCreams!").click();

    await page.getByLabel("Employed").check();

    await page.getByLabel("Gender").selectOption("Female");

    await page.getByPlaceholder("Password").fill("abc123");
    
    await page.getByRole("button", {name:'Submit'}).click();

    await page.getByText("Success! The Form has been submitted successfully!.").isVisiWx|ble();

    await page.getByRole("Link", {name: "Shop"}).click();

    await page.locator("app-card").filter({hasText: "Nokia Edge"}).getByRole("button").click();





}) 


// video 40

test('Playwright Client App Other', async({page})=> 
{
    const productName = "ZARA COAT 3";
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");

    const email = "anshika@gmail.com";

    await page.getByPlaceholder('email@example.com').fill(email);
    await page.getByPlaceholder('enter your passsword').fill("Iamking@000");

    await page.getByRole('button', {name: "Login"}).click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor(); // espera a que el primer producto se cargue para asegurarse de que la página esté completamente cargada

    await page.locator(".card-body").filter({hasText:"ZARA COAT 3"})
   .getByRole("button",{name:"Add to Cart"}).click();

    await page.getByRole("listitem").getByRole('button', {name: "Cart"}).click();

    await page.locator("div li").first().waitFor();

    await expect(page.getByText("ZARA COAT 3")).toBeVisible();

    await page.getByRole('button', {name: "Checkout"}).click();

    await page.getByPlaceholder("Select Country").pressSequentially("Arg",{delay:100}); // lo que hace es ingresar letra por letra, para que aparezcan las opciones que si llenas todo de una vez, no aparecen las opciones



    await page.getByRole("button", {name: "Argentina"}).click();



    await page.getByText("PLACE ORDER").click();

    await expect(page.getByText("Thankyou for the order.")).toBeVisible();




})