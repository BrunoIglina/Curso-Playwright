const {expect, test} = require('@playwright/test');


    const  BASE_URL = 'https://eventhub.rahulshettyacademy.com';

    const USER_EMAIL = process.env.EVENTHUB_EMAIL || 'brunoniglina@gmail.com';
    const USER_PASSWORD = process.env.EVENTHUB_PASSWORD || 'Bruno2026.';

    async function login(page) {
        await page.goto(`${BASE_URL}/login`);
        await page.getByPlaceholder('you@email.com').fill(USER_EMAIL);
        await page.getByLabel('Password').fill(USER_PASSWORD);
        await page.locator('#login-btn').click();
    
        await expect(page.getByText('Browse Events →')).toBeVisible();
    }



test('FLujo de Reserva Tarea 2', async({page})=> 
    {
        await login(page);
        await page.goto(`${BASE_URL}/admin/events`);

        await page.locator('#event-card').first().waitFor();

        await page.locator('#event-card').first().locator('#book-now-btn').click();

        await page.getByText('Book Tickets', { exact: true }).waitFor();

        await page.getByRole('textbox', { name: 'Full Name*' }).fill('Bruno Iglina');

        await page.getByRole('textbox', { name: 'Email*' }).fill('brunoniglina@gmail.com');

        await page.getByRole('textbox', { name: 'Phone Number*' }).fill('1234567890');

        await page.locator('#confirm-booking').click();

        await expect(page.getByRole('button', { name: 'View My Bookings' })).toBeVisible();

        await page.getByRole('button', { name: 'View My Bookings' }).click();

        await expect(page.url().toContain('/bookings'));

        await page.locator('#booking-card').first().waitFor();

        await page.locator('#booking-card').first().getByRole('button', { name: 'View Details' }).click();

        await expect(page.getByText('Event Details', { exact: true })).toBeVisible();


        const ReserveRef = await page.locator('span.text-sm.text-right.font-medium.text-gray-900').nth(0).textContent();
        console.log('ID de la reserva:', ReserveRef);

        const ReserveTitle = await page.locator('h1').filter({ hasText: 'Dilli Diwali Mela' }).last().textContent();
        console.log('Título del evento:', ReserveTitle);

        const firstBookingChar = ReserveRef.trim().split('')[0].toUpperCase();
        const firstEventChar = ReserveTitle.trim().split('')[0].toUpperCase();

        expect(firstBookingChar).toBe(firstEventChar);

        await page.locator('#check-refund-btn').click();

        await expect(page.locator('#refund-spinner')).toBeVisible();

        await expect(page.locator('#refund-spinner').isVisible({delay: 6000})).toBeFalsy();

        await expect(page.locator('#refund-result')).toBeVisible();

        await expect(page.getByText('Eligible for refund.', { exact: true })).toBeVisible();

        await expect(page.getByText('Single-ticket bookings qualify for a full refund.', { exact: true })).toBeVisible();

        

    
    });