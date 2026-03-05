const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const USER_EMAIL = process.env.EVENTHUB_EMAIL || 'brunoniglina@gmail.com';
const USER_PASSWORD = process.env.EVENTHUB_PASSWORD || 'Bruno2026.';

function futureDateValue(daysAhead = 7) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function parseSeats(text) {
    const match = text.match(/\d+/);
    return match ? Number(match[0]) : 0;
}

async function login(page) {
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('you@email.com').fill(USER_EMAIL);
    await page.getByLabel('Password').fill(USER_PASSWORD);
    await page.locator('#login-btn').click();

    await expect(page.getByText('Browse Events →')).toBeVisible();
}

test('Flujo de Reserva', async ({ page }) => {
    const eventTitle = `Test event ${Date.now()}`;


    await login(page);

    await page.goto(`${BASE_URL}/admin/events`);
    await page.locator('#event-title-input').fill(eventTitle);
    await page.locator('#admin-event-form textarea').fill('Automated booking flow event.');
    await page.getByLabel('City').fill('Rosario');
    await page.getByLabel('Venue').fill('Metropolitano zona centro');
    await page.getByLabel('Event Date & Time').fill(futureDateValue());
    await page.getByLabel('Price ($)').fill('100');
    await page.getByLabel('Total Seats').fill('50');
    await page.locator('#add-event-btn').click();
    await expect(page.getByText('Event created!')).toBeVisible();


    await page.goto(`${BASE_URL}/events`);
    const cards = page.getByTestId('event-card');
    await expect(cards.first()).toBeVisible();

    const eventCard = cards.filter({ hasText: eventTitle });
    await expect(eventCard).toBeVisible({ timeout: 5000 });

    const seatsBeforeBookingText = await eventCard.locator('text=/seat/i').first().innerText();
    const seatsBeforeBooking = parseSeats(seatsBeforeBookingText);

    await eventCard.getByTestId('book-now-btn').click();


    await expect(page.locator('#ticket-count')).toHaveText('1');
    await page.getByLabel('Full Name').fill('Bruno Iglina');
    await page.locator('#customer-email').fill(USER_EMAIL);
    await page.getByPlaceholder('+91 98765 43210').fill('+54 9 341 555 1234');
    await page.locator('.confirm-booking-btn').click();

    const bookingRefElement = page.locator('.booking-ref').first();
    await expect(bookingRefElement).toBeVisible();
    const bookingRef = (await bookingRefElement.innerText()).trim();


    page.getByRole('button', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);

    const bookingCards = page.locator('#booking-card');
    await expect(bookingCards.first()).toBeVisible();

    const matchingBookingCard = bookingCards.filter({
        has: page.locator('.booking-ref', { hasText: bookingRef }),
    });
    await expect(matchingBookingCard).toBeVisible();
    await expect(matchingBookingCard).toContainText(eventTitle);


    await page.goto(`${BASE_URL}/events`);
    await expect(cards.first()).toBeVisible();

    const updatedEventCard = cards.filter({ hasText: eventTitle });
    await expect(updatedEventCard).toBeVisible();

    const seatsAfterBookingText = await updatedEventCard.locator('text=/seat/i').first().innerText();
    const seatsAfterBooking = parseSeats(seatsAfterBookingText);

    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});



/*importar { prueba, esperar } de '@playwright/test';

constante BASE_URL = 'https://eventhub.rahulshettyacademy.com'
// ── Credenciales ─────────────────────────────────────────────────────────────────────
const USER_EMAIL = 'replacewithyourcredentials@gmail.com';// actualiza el correo electrónico y la contraseña con tu cuenta
const USER_PASSWORD = 'tu contraseña';

// ── Ayudantes ──────────────────────────────────────────────────────────────────────────────
función asíncrona login(página) {
  esperar página.goto(`${BASE_URL}/login`);

  // Ubicado por marcador de posición
  esperar página.getByPlaceholder('tu@email.com').fill(USER_EMAIL);

  // Ubicado por etiqueta
  esperar página.getByLabel('Contraseña').fill(USER_PASSWORD);

  // Ubicado por id
  esperar página.locator('#login-btn').click();

  await expect(page.getByRole('link', { name: 'Explorar eventos →' })).toBeVisible();
}


// ── Prueba ───────────────────────────────────────────────────────────────────────────────────
test('crear evento a través de la interfaz de usuario, reservarlo y verificar la reducción de asientos', async ({ page }) => {

  // ── Paso 1: Iniciar sesión ─────────────────────────────────────────────────────────
  esperar inicio de sesión(página);

  // ── Paso 2: Crea un nuevo evento a través del formulario de administración ────────────────────────
  esperar página.goto(`${BASE_URL}/admin/events`);

  // Título único para que podamos encontrar esta tarjeta exacta más tarde.
  const eventTitle = `Evento de prueba ${Date.now()}`;

  // Ubicado por id (explícito en el componente)
  esperar página.locator('#event-title-input').fill(eventTitle);

  // Descripción — solo área de texto en el formulario
  esperar page.locator('#admin-event-form textarea').fill('Evento de prueba de dramaturgo');

  // Ubicado por etiqueta (Seleccionar genera automáticamente la identificación a partir del texto de la etiqueta)
  esperar página.getByLabel('Ciudad').fill('Ciudad de prueba');
  esperar página.getByLabel('Lugar').fill('Lugar de prueba');

  // entrada local de fecha y hora — ubicada por etiqueta
  await page.getByLabel('Fecha y hora del evento').fill('2027-12-31T10:00');

  esperar página.getByLabel('Precio ($)').fill('100');
  esperar página.getByLabel('Total de asientos').fill('50');

  // Ubicado por id
  esperar página.locator('#add-event-btn').click();

  // Espera el brindis por el éxito
  esperar expect(page.getByText('¡Evento creado!')).toBeVisible();

  console.log(`Evento creado: "${eventTitle}"`);

  // ── Paso 3: Ve a la página de Eventos y busca la tarjeta recién creada ─────────────
  esperar página.goto(`${BASE_URL}/eventos`);

  // Ubicado por data-testid
  const eventCards = page.getByTestId('tarjeta-de-evento');
  esperar esperar(eventCards.first()).toBeVisible();

  // Escanee todas las tarjetas de eventos visibles para encontrar la que coincida con nuestro título creado
  constante targetCard = eventCards.filter({ hasText: eventTitle }).first();
  esperar esperar(targetCard).toBeVisible({ tiempo de espera: 5000 });

  // Capturar el número de asientos antes de reservar
  const asientosAntesDeReservar = parseInt(await targetCard.getByText('asiento').first().innerText());
  console.log(`Asientos antes de la reserva: ${seatsBeforeBooking}`);

  // Ubicado por data-testid dentro de la tarjeta coincidente
  esperar targetCard.getByTestId('reservar-ahora-btn').click();

  // ── Paso 4: Rellena el formulario de reserva ─────────────────────────────────────────

  // La cantidad predeterminada es 1: verificar mediante identificación
  const ticketCount = page.locator('#ticket-count');
  esperar esperar(ticketCount).toHaveText('1');

  // Ubicado por etiqueta
  await page.getByLabel('Nombre completo').fill('Estudiante de prueba');

  // Ubicado por id
  esperar página.locator('#customer-email').fill('test.student@example.com');

  // Ubicado por marcador de posición
  esperar página.getByPlaceholder('+91 98765 43210').fill('9876543210');

  // Ubicado por clase CSS
  esperar página.locator('.confirm-booking-btn').click();

  // ── Paso 5: Verificar la confirmación de la reserva ──────────────────────────────────

  // Ubicado por clase CSS
  const bookingRefEl = page.locator('.booking-ref').first();
  esperar esperar(bookingRefEl).toBeVisible();

  const bookingRef = (await bookingRefEl.innerText()).trim();
  expect(bookingRef.charAt(0)).toBe(eventTitle.trim().charAt(0).toUpperCase());

  console.log(`Reserva confirmada. Ref: ${bookingRef}`);

  // ── Paso 6: Verificar que la reserva aparezca en Mis reservas ────────────────────────
  await page.getByRole('link', { name: 'Ver mis reservas' }).click();
  esperar esperar(página).toHaveURL(`${BASE_URL}/reservas`);

  // Ubicado por id
  const bookingCards = page.locator('#booking-card');
  esperar esperar(bookingCards.first()).toBeVisible();

  // Encuentra la tarjeta que contiene nuestra referencia de reserva (a través de la clase CSS dentro de la tarjeta)
  const matchingCard = bookingCards.filter({ tiene: page.locator('.booking-ref', { tieneTexto: bookingRef }) });
  esperar esperar(matchingCard).toBeVisible();

  // Verificar que el título del evento también aparezca en la misma tarjeta
  esperar esperar(matchingCard).toContainText(eventTitle);

  console.log(`Tarjeta de reserva encontrada en Mis reservas para la referencia: ${bookingRef}`);

  // ── Paso 7: Verificar que el recuento de asientos se haya reducido en la página de Eventos ─────────────────────
  esperar página.goto(`${BASE_URL}/eventos`);
  esperar esperar(eventCards.first()).toBeVisible();

  // Encuentra el mismo evento por título
  const updatedCard = eventCards.filter({ hasText: eventTitle }).first();
  esperar esperar(updatedCard).toBeVisible();

  const asientosDespuésDeLaReserva = parseInt(await updatedCard.getByText('asiento').first().innerText());
  console.log(`Asientos después de la reserva: ${seatsAfterBooking}`);

  // Reservé 1 boleto: el conteo debe disminuir exactamente en 1
  esperar(asientosDespuésDeLaReserva).toBe(asientosAntesDeLaReserva - 1);
});

Su envío
BI
Bruno Iglina
Publicado hace unos segundos
Complete el código del dramaturgo para las instrucciones del manual dado.

const { prueba, esperar } = require('@playwright/test');

constante BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const USER_EMAIL = proceso.env.EVENTHUB_EMAIL || 'brunoniglina@gmail.com';
const CONTRASEÑA_USUARIO = proceso.env.CONTRASEÑA_EVENTHUB || 'Bruno2026.';

función futureDateValue(daysAhead = 7) {
    const fecha = nueva Fecha();
    fecha.setDate(fecha.getDate() + díasAdelante);

    constante yyyy = fecha.getFullYear();
    constante mm = String(fecha.getMonth() + 1).padStart(2, '0');
    constante dd = String(fecha.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    devuelve `${aaaa}-${mm}-${dd}T${hh}:${min}`;
}

función parseSeats(texto) {
    constante match = texto.match(/\d+/);
    ¿devolver coincidencia? Número(coincidencia[0]): 0;
}

función asíncrona login(página) {
    esperar página.goto(`${BASE_URL}/login`);
    esperar página.getByPlaceholder('tu@email.com').fill(USER_EMAIL);
    esperar página.getByLabel('Contraseña').fill(USER_PASSWORD);
    esperar página.locator('#login-btn').click();

    esperar expect(page.getByText('Explorar eventos →')).toBeVisible();
}

test('Flujo de Reserva', async ({ página }) => {
    const eventTitle = `Evento de prueba ${Date.now()}`;


    esperar inicio de sesión(página);

    esperar página.goto(`${BASE_URL}/admin/events`);
    esperar página.locator('#event-title-input').fill(eventTitle);
    await page.locator('#admin-event-form textarea').fill('Evento de flujo de reserva automatizado.');
    esperar pagina.getByLabel('Ciudad').fill('Rosario');
    await page.getByLabel('Lugar').fill('Metropolitano zona centro');
    esperar page.getByLabel('Fecha y hora del evento').fill(futureDateValue());
    esperar página.getByLabel('Precio ($)').fill('100');
    esperar página.getByLabel('Total de asientos').fill('50');
    esperar página.locator('#add-event-btn').click();
    esperar expect(page.getByText('¡Evento creado!')).toBeVisible();


    esperar página.goto(`${BASE_URL}/eventos`);
    const cards = page.getByTestId('tarjeta-de-evento');
    esperar esperar(tarjetas.primero()).serVisible();

    const eventCard = tarjetas.filter({ hasText: eventTitle });
    esperar esperar(eventCard).toBeVisible({ tiempo de espera: 5000 });

    const asientosAntesDeReservaTexto = await eventCard.locator('texto=/asiento/i').first().innerText();
    const asientosAntesDeReserva = parseAsientos(asientosAntesDeReservaTexto);

    esperar eventCard.getByTestId('reservar-ahora-btn').click();


    esperar esperar(página.locator('#ticket-count')).toHaveText('1');
    await page.getByLabel('Nombre completo').fill('Bruno Iglina');
    esperar página.locator('#customer-email').fill(USER_EMAIL);
    esperar página.getByPlaceholder('+91 98765 43210').fill('+54 9 341 555 1234');
    esperar página.locator('.confirm-booking-btn').click();

    const bookingRefElement = page.locator('.booking-ref').first();
    esperar esperar(bookingRefElement).toBeVisible();
    const bookingRef = (await bookingRefElement.innerText()).trim();


    page.getByRole('button', { name: 'Ver mis reservas' }).click();
    esperar esperar(página).toHaveURL(`${BASE_URL}/reservas`);

    const bookingCards = page.locator('#booking-card');
    esperar esperar(bookingCards.first()).toBeVisible();

    constante coincidenteBookingCard = bookingCards.filter({
        tiene: page.locator('.booking-ref', { hasText: bookingRef }),
    });
    esperar esperar(matchingBookingCard).toBeVisible();
    esperar esperar(matchingBookingCard).toContainText(eventTitle);


    esperar página.goto(`${BASE_URL}/eventos`);
    esperar esperar(tarjetas.primero()).serVisible();

    const updatedEventCard = tarjetas.filter({ hasText: eventTitle });
    esperar esperar(updatedEventCard).toBeVisible();

    const asientosDespuésDeLaReservaTexto = await updatedEventCard.locator('texto=/asiento/i').first().innerText();
    const asientosDespuésDeReserva = parseAsientos(asientosDespuésDeReservaTexto);

    esperar(asientosDespuésDeLaReserva).toBe(asientosAntesDeLaReserva - 1);
}); */