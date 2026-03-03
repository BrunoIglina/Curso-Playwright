const {test, expect} = require('@playwright/test');



test.only('Page Context Playwright test', async({page})=> {
    await page.goto("https://rahulshettyacademy.com/client");

    await page.locator('#userEmail').fill("anshika@gmail.com");
    await page.locator('#userPassword').fill("Iamking@000");

    await page.locator("input[value='Login']").click();

    // utilizar las llamadas a la api que realizan en la web para obtener antes todos los productos
  // es un poco defectuoso, no siempre funciona
  //   await page.waitForLoadState('networkidle'); //significa que playwright esperará hasta que no haya más solicitudes de red, lo que indica que la página ha terminado de cargar completamente y no hay más recursos pendientes por cargar.
 

  // metodo alternativo
  await page.locator('.card-body b').first().waitFor(); // lo que realmente hace es esperar a que el locator se muestre en la pagina, es decir, que se cargue el elemento en el DOM, no espera a que se cargue toda la pagina
  const titles = await page.locator('.card-body b').allTextContents();

    console.log(titles);
}) 