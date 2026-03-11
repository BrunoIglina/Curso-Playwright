const {expect, test} = require('@playwright/test');


    const  BASE_URL = 'https://eventhub.rahulshettyacademy.com';

    const USER_EMAIL = process.env.EVENTHUB_EMAIL || 'brunoniglina@gmail.com';
    const USER_PASSWORD = process.env.EVENTHUB_PASSWORD || 'Bruno2026.';

    async function loginAndGoToBooking(page) {
        await page.goto(`${BASE_URL}/login`);
        await page.getByPlaceholder('you@email.com').fill(USER_EMAIL);
        await page.getByLabel('Password').fill(USER_PASSWORD);
        await page.locator('#login-btn').click();
    
        await expect(page.getByText('Browse Events →')).toBeVisible();
    }



test('Flujo de Reserva Tarea 2 - 1 ticket eligible for refund', async({page})=> 
    {
        await loginAndGoToBooking(page);
        await page.goto(`${BASE_URL}/events`);

        await page.getByTestId('event-card').first().waitFor();

        await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();

        await page.getByText('Book Tickets', { exact: true }).waitFor();

        await page.getByRole('textbox', { name: 'Full Name*' }).fill('Bruno Iglina');

        await page.getByRole('textbox', { name: 'Email*' }).fill('brunoniglina@gmail.com');

        await page.getByRole('textbox', { name: 'Phone Number*' }).fill('1234567890');

        await page.locator('.confirm-booking-btn').click();

        await expect(page.getByRole('button', { name: 'View My Bookings' })).toBeVisible();

        await page.getByRole('button', { name: 'View My Bookings' }).click();

        await expect(page).toHaveURL(/\/bookings/);

        await page.locator('#booking-card').first().waitFor();

        await page.getByRole('link', { name: 'View Details' }).first().click();

        await expect(page.getByText('Booking Information', { exact: true })).toBeVisible();


        const ReserveRef = await page.locator('span.text-sm.text-right.font-medium.text-gray-900').nth(0).textContent();
        console.log('ID de la reserva:', ReserveRef);

        const ReserveTitle = await page.locator('h1').last().textContent();
        console.log('Título del evento:', ReserveTitle);

        const firstBookingChar = ReserveRef.trim().split('')[0].toUpperCase();
        const firstEventChar = ReserveTitle.trim().split('')[0].toUpperCase();

        expect(firstBookingChar).toBe(firstEventChar);

        await page.locator('#check-refund-btn').click();

        await expect(page.locator('#refund-spinner')).toBeVisible();

        await expect(page.locator('#refund-spinner')).toBeHidden({ timeout: 6000 });

        await expect(page.locator('#refund-result')).toBeVisible();

        await expect(page.locator('#refund-result')).toContainText('Eligible for refund');

        await expect(page.locator('#refund-result')).toContainText('Single-ticket bookings qualify for a full refund');

        

    
    });


    test('Flujo de Reserva Tarea 2 - 3 tickets not eligible for refund', async({page})=> 
    {
        await loginAndGoToBooking(page);

        await page.goto(`${BASE_URL}/events`);

        
        await page.getByTestId('event-card').first().waitFor();

        await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();

        await page.getByText('Book Tickets', { exact: true }).waitFor();

        await page.locator('button:has-text("+")').click();
        await page.locator('button:has-text("+")').click();


        await page.getByRole('textbox', { name: 'Full Name*' }).fill('Bruno Iglina');

        await page.getByRole('textbox', { name: 'Email*' }).fill('brunoniglina@gmail.com');

        await page.getByRole('textbox', { name: 'Phone Number*' }).fill('1234567890');

        await page.locator('.confirm-booking-btn').click();

        await expect(page.getByRole('button', { name: 'View My Bookings' })).toBeVisible();

        await page.getByRole('button', { name: 'View My Bookings' }).click();

        await expect(page).toHaveURL(/\/bookings/);

        await page.locator('#booking-card').first().waitFor();

        await page.getByRole('link', { name: 'View Details' }).first().click();

        await expect(page.getByText('Booking Information', { exact: true })).toBeVisible();


        const ReserveRef = await page.locator('span.text-sm.text-right.font-medium.text-gray-900').nth(0).textContent();
        console.log('ID de la reserva:', ReserveRef);

        const ReserveTitle = await page.locator('h1').last().textContent();
        console.log('Título del evento:', ReserveTitle);

        const firstBookingChar = ReserveRef.trim().split('')[0].toUpperCase();
        const firstEventChar = ReserveTitle.trim().split('')[0].toUpperCase();

        expect(firstBookingChar).toBe(firstEventChar);

        await page.locator('#check-refund-btn').click();

        await expect(page.locator('#refund-spinner')).toBeVisible();

        await expect(page.locator('#refund-spinner')).toBeHidden({ timeout: 6000 });

        await expect(page.locator('#refund-result')).toBeVisible();


        await expect(page.locator('#refund-result')).toContainText('Not eligible for refund');

        await expect(page.locator('#refund-result')).toContainText('Group bookings (3 tickets) are non-refundable');


    });



    // codigo del instructor
    /* 
    import { test, expect } from '@playwright/test';

const BASE_URL   = 'https://eventhub.rahulshettyacademy.com';

// Change these to match a registered account in your local sandbox
const GMAIL_USER = { email: 'rahulshetty1@gmail.com', password: 'Magiclife1!' };

async function loginAndGoToBooking(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel('Email').fill(GMAIL_USER.email);
  await page.getByPlaceholder('••••••').fill(GMAIL_USER.password);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

// ── Test 1: 1 ticket → eligible ───────────────────────────────────────────────
test('refund eligible for single ticket booking', async ({ page }) => {
  await loginAndGoToBooking(page);

  // Book event with 1 ticket via UI
  await page.goto(`${BASE_URL}/events`);
  await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();


  await page.getByLabel('Full Name').fill('Test User');
  await page.locator('#customer-email').fill(GMAIL_USER.email);
  await page.getByPlaceholder('+91 98765 43210').fill('9999999999');
  await page.locator('.confirm-booking-btn').click();

  // Navigate to booking detail
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);
  await page.getByRole('link', { name: 'View Details' }).first().click();
  await expect(page.getByText('Booking Information')).toBeVisible();

  // Validate booking ref first letter matches event name first letter
  const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
  const eventTitle = await page.locator('h1').innerText();
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

  await page.locator('#check-refund-btn').click();

  // Spinner must appear immediately
  await expect(page.locator('#refund-spinner')).toBeVisible();

  // Wait for spinner to disappear after 4s
  await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });

  // Validate eligible message
  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Eligible for refund');
  await expect(result).toContainText('Single-ticket bookings qualify for a full refund');
});

// ── Test 2: 3 tickets → not eligible ─────────────────────────────────────────
test('refund not eligible for group ticket booking', async ({ page }) => {
  await loginAndGoToBooking(page);

  // Book event with 3 tickets via UI
  await page.goto(`${BASE_URL}/events`);
  await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();


  // Increase quantity to 3
  await page.locator('button:has-text("+")').click();
  await page.locator('button:has-text("+")').click();

  await page.getByLabel('Full Name').fill('Test User');
  await page.locator('#customer-email').fill(GMAIL_USER.email);
  await page.getByPlaceholder('+91 98765 43210').fill('9999999999');
  await page.locator('.confirm-booking-btn').click();

  // Navigate to booking detail
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);
  await page.getByRole('link', { name: 'View Details' }).first().click();
  await expect(page.getByText('Booking Information')).toBeVisible();

  // Validate booking ref first letter matches event name first letter
  const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
  const eventTitle = await page.locator('h1').innerText();
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

  await page.locator('#check-refund-btn').click();

  // Spinner must appear immediately
  await expect(page.locator('#refund-spinner')).toBeVisible();

  // Wait for spinner to disappear after 4s
  await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });

  // Validate ineligible message
  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Not eligible for refund');
  await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
});*/