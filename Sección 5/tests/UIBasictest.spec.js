const {test, expect} = require('@playwright/test');


//video 20
test('UI CONTROLS', async({page})=> {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise");

  const userName = page.locator('#username');
  const signIn = page.locator('#signInBtn');
  const documentLink = page.locator('[href*="documents-request"]');

  const dropdown = page.locator('select.form-control');

  await dropdown.selectOption("consult"); // forma de elegir una opcion especifica de un dropdown

  await page.locator('.radiotextsty').last().click(); 

  await page.locator('#okayBtn').click();

  await expect(page.locator('.radiotextsty').last()).toBeChecked(); // forma de validar que un radio button esta seleccionado, es booleando, debe devolver true

  // una forma similar es : 
  console.log(await page.locator('.radiotextsty').last().isChecked()); // devuelve true o false dependiendo de si el radio button esta seleccionado o no


  await page.locator('#terms').check(); // forma de marcar un checkbox, si ya esta marcado no hace nada, si no esta marcado lo marca
  expect(page.locator('#terms').isChecked()); // forma de validar que un checkbox esta marcado
 // forma de pausar el test en un punto y poder reanudarlo 
  //await page.pause();


  // fomra de saber si el link verde está parpadeando o no con metodo toHaveAttribute, si el atributo tiene un valor que contiene la palabra blinking entonces el test pasa, sino falla

  await expect(documentLink).toHaveAttribute("class", "blinkingText");


}) 

test.only('Child Windows handling', async({browser})=> {

    const context = await browser.newContext(); // creo un nuevo navegador y una nueva pagina de ese contexto
    const page = await context.newPage();
    const userName = page.locator('#username');

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")

    const documentLink = await page.locator("[href*='documents-request']");

    // es la forma de indicar que hay dos pasos que se deben ejecutar paralelamente, formando un array de dichos dos pasos o promesas
    const [newPage] =  await Promise.all([
    context.waitForEvent('page'), // forma de esperar a que se abra una nueva pagina, es un evento que se dispara cuando se abre una nueva pagina
   
    documentLink.click(),]) // solo sale del bloque cuando ambas promesas se cumplen, extremadamente util es.

    const text = await newPage.locator('.im-para.red').textContent(); // forma de obtener el texto de un elemento de la nueva pagina, es importante notar que se esta usando el locator de la nueva pagina y no el locator de la pagina original, porque el elemento que se quiere localizar esta en la nueva pagina y no en la pagina original
    console.log(text); 

    const arrayText = text.split("@"); // forma de dividir el texto obtenido en un array, usando el simbolo @ como separador, el resultado es un array con dos elementos, el primer elemento es la parte del texto antes del simbolo @ y el segundo elemento es la parte del texto despues del simbolo @
    const domain = arrayText[1].split(" ")[0]; // forma de obtener el primer elemento del segundo elemento del array, es decir, la parte del texto despues del simbolo @, y luego dividir esa parte del texto usando el espacio como separador, y obtener el primer elemento de ese nuevo array, que es la parte del texto despues del simbolo @ y antes del primer espacio, que en este caso es el dominio del correo electronico
    //console.log(domain);

    await page.locator('#username').fill(domain); 

        // se usa inputValue porque playwright guarda el contenido al inicio de cargar la pagina, es decir, el TextContent es vacio y luego ingresa texto, por eso se usa inputValue para que lo valide en el momento
    console.log(await page.locator('#username').inputValue()); // forma de validar que el campo de texto se ha llenado correctamente, obteniendo el texto del campo de texto y comparandolo con el valor esperado, en este caso el dominio del correo electronico

    


}) 