const {test, expect} = require('@playwright/test');

/* hasta video 14
test('Browser Context Plawright test', async ({browser})=>
{
    

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/") 
        console.log(await page.title());
    const userName = page.locator('#username');
    const signIn = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-body a")
    //css y xpath, o puede ser con type fill
    // AHORA TYPE ES OBSOLETO Y SE USA FILL
    await userName.fill("raulshetty");
    await page.locator("[type='password']").fill("Learning@830$3mK2");
    await signIn.click();
    //esperar hasta que el locator se muestre en la pagina
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    // forma de diferenciar type o fill
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    // forma de obtener el primer elemento del array de elementos que devuelve el locator
  //  console.log(await cardTitles.first().textContent());
  //  console.log(await cardTitles.nth(1).textContent());

    // obtener todos los textos de los titulos de las tarjetas, es un defecto porque no espera a que se carguen en el dom, realmente no se realiza el await y no falla, devuelve array vacio
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
})
*/

// video 15 en donde hay que registrarse y validar en esta url https://rahulshettyacademy.com/client/auth/login

test('Page test register and login', async({page})=> {
    await page.goto("https://rahulshettyacademy.com/client/auth/login");
    await page.locator('.text-reset').click();

    await page.locator('#firstName').fill("Bruno");
    await page.locator('#lastName').fill("Iglina");
    await page.locator('#userEmail').fill("brunooiglina@gmail.com");
    await page.locator('#userMobile').fill("3462415690");


    await page.locator(".custom-select").selectOption("2: Student");

    await page.locator("input[value='Male']").click();


    await page.locator('#userPassword').fill("Bruno30b.");
    await page.locator('#confirmPassword').fill("Bruno30b.");

    await page.locator("input[type='checkbox']").click();

    await page.locator('#login').click();

    await page.locator('.btn.btn-primary').click();

    await page.locator('#userEmail').fill("brunooiglina@gmail.com");
    await page.locator('#userPassword').fill("Bruno30b.");
    await page.locator('#login').click();

    console.log(await page.locator('.card-body').nth(0).textContent());

})