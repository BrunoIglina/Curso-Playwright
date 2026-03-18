const {test, expect, request } = require("@playwright/test");
const {APIUtils} = require("./utils/APIUtils");
let webContext;


test.beforeAll(async({browser})=>
    {
     const context = await browser.newContext();
     const page = await context.newPage();
     await page.goto("https://rahulshettyacademy.com/client");
     await page.locator("#userEmail").fill("anshika@gmail.com");
     await page.locator("#userPassword").fill("Iamking@000");
     await page.locator("[value='Login']").click();
     await page.waitForLoadState('networkidle');
     await context.storageState({path: 'state.json'});
     webContext =await browser.newContext({storageState:'state.json'});
    })


// la ventaja es que inicio sesion una sola vez antes de todos los test y luego inyecto el token en el storageState, luego dichos test reutilizan ese token.
    test('Client App Sessions', async({}) =>
    {
        const productName = "ZARA COAT 3";
        const page = await webContext.newPage();
        await page.goto("https://rahulshettyacademy.com/client");
        const products = page.locator(".card-body");

        const titles = await page.locator(".card-body b").allTextContents();
        console.log(titles);

        const count = await products.count();
        for (let i=0; i<count; i++)
        {
        if(await products.nth(i).locator("b").textContent()=== productName){

            await products.nth(i).locator("text = Add To Cart").click();
            break;
        }
        }
        await page.locator("[routerlink *='cart']").click();

    await page.locator("div li").first().waitFor();

    const bool = await page.locator(`h3:has-text("${productName}")`).isVisible(); // utiliza el selector :has-text para verificar que el producto esté en el carrito, y ademas, es una pseudo clase
    expect(bool).toBeTruthy();

    await page.locator("text=Checkout").click();

    await page.locator("[placeholder*='Country']").pressSequentially("Arg",{delay:100}); // lo que hace es ingresar letra por letra, para que aparezcan las opciones que si llenas todo de una vez, no aparecen las opciones

    const dropdown = page.locator(".ta-results"); 

    await dropdown.waitFor(); 
    const optionsCountry = await dropdown.locator("button").count();
    for(let i=0; i<optionsCountry; i++)
    {
        if(await dropdown.locator("button").nth(i).textContent() === " Argentina")
        {
           await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    
    await expect(page.locator(".user__name [type='text']").first()).toHaveText("anshika@gmail.com");

    await page.locator(".action__submit").click();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

        const orderID = (await page.locator(".em-spacer-1 .ng-star-inserted").textContent())
            ?.replace(/\|/g, "")
            .trim();

    console.log(orderID);

    await page.locator("[routerlink *=myorders]").first().click();

    await page.waitForLoadState('networkidle');
    await page.locator("tbody tr").first().waitFor();

    const ordersIds = await page.locator("tbody tr th").allTextContents();
    console.log(ordersIds);

    const rows = await page.locator("tbody tr");


    for(let i=0; i< await rows.count(); i++)
    {
        const rowOrderId = (await rows.nth(i).locator("th").textContent())?.trim();
        if(rowOrderId === orderID)
        {
           await rows.nth(i).locator(".btn.btn-primary").click();
           console.log("Order found");
            break;
        }
    }
    await page.waitForLoadState('networkidle');
    await page.locator(".col-text").waitFor();

    const orderIdDetails = (await page.locator(".col-text.-main").textContent())?.trim();
    expect(orderID?.includes(orderIdDetails)).toBeTruthy();
        
    })