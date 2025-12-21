import { test, expect } from '@playwright/experimental-ct-vue';
import DatePicker from '../DatePicker.vue';

test.use({
	locale: 'fr-FR',
	timezoneId: 'Europe/Paris',
});

test.describe('input field only', () => {
	test('By default the input has no value', async ({ mount }) => {
		const component = await mount(DatePicker);
		expect(await component.locator('input').isVisible()).toBeTruthy();
		expect(component.locator('input')).toHaveValue('');
	});

	test('The input displays the initial date value', async ({ mount }) => {
		const component = await mount(DatePicker, {
			props: {
				modelValue: new Date('1997-12-18T00:00:00.000Z'),
			},
		});
		expect(await component.locator('input').isVisible()).toBeTruthy();
		await expect(component.locator('input')).toHaveValue('18/12/1997');
	});

	test('The input updates when the modelValue prop changes', async ({ mount }) => {
		const component = await mount(DatePicker, {
			props: {
				modelValue: new Date('1997-12-18T00:00:00.000Z'),
			},
		});
		expect(await component.locator('input').isVisible()).toBeTruthy();
		await expect(component.locator('input')).toHaveValue('18/12/1997');

		await component.update({
			props: {
				modelValue: new Date('2001-07-25T00:00:00.000Z'),
			},
		});
		await expect(component.locator('input')).toHaveValue('25/07/2001');
	});

	test('The component emits the updated date when a date is selected', async ({ mount }) => {

		const calls: Date[] = [];
		const component = await mount(DatePicker, {
			props: {
				modelValue: new Date('2022-01-01T00:00:00.000Z'),
			},
			on: {
				'update:modelValue': (date: Date) => {
					calls.push(date);
				},
			}
		});

		expect(await component.locator('input').isVisible()).toBeTruthy();

		await component.locator('input').fill('14/02/2022');

		expect(calls.length).toBe(1);
		expect(calls?.[0]?.toLocaleDateString('en-UK')).toBe('14/02/2022');
	});
});

test.describe('visual date picker', () => {
	test('the visual picker should opens', async ({ mount, page }) => {
		const component = await mount(DatePicker);
		const visualPickerButton = component.locator('.date-picker-open-button');
		await visualPickerButton.click();
		const visualPicker = page.locator('.date-picker-visual');
		await expect(visualPicker).toBeVisible();
	});

	test('the visual picker should display the correct date when the input has a value', async ({ mount, page }) => {
		const component = await mount(DatePicker);
		const input = component.locator('input');
		await input.fill('18/12/1997');
		const visualPickerButton = component.locator('.date-picker-open-button');
		await visualPickerButton.click();
		const visualPicker = page.locator('.date-picker-visual');
		await expect(visualPicker).toBeVisible();
		await expect(visualPicker).toHaveText(/^18 décembre 1997/);
	});

	test('selecting a date from the visual picker should update the input value', async ({ mount, page }) => {
		const component = await mount(DatePicker);
		const visualPickerButton = component.locator('.date-picker-open-button');
		await visualPickerButton.click();
		const visualPicker = page.locator('.date-picker-visual');
		const dayButton = visualPicker.locator('button[aria-label="11 décembre 2025"]');
		await dayButton.click();
		await expect(visualPicker).toBeHidden();
		const input = component.locator('input');
		await expect(input).toHaveValue('11/12/2025');
	});

	test('the visual picker should open with the correct month when a date is already selected in the input', async ({ mount, page }) => {
		const component = await mount(DatePicker);
		const input = component.locator('input');
		await input.fill('25/07/2001');
		const visualPickerButton = component.locator('.date-picker-open-button');
		await visualPickerButton.click();
		const visualPicker = page.locator('.date-picker-visual');
		await expect(visualPicker).toBeVisible();
		const monthYearHeader = visualPicker.locator('.date-navigation__select-month');
		await expect(monthYearHeader).toHaveText('juillet');
	});

	test('it should be possible to navigate months in the visual picker', async ({ mount, page }) => {
		const component = await mount(DatePicker);
		const visualPickerButton = component.locator('.date-picker-open-button');
		await visualPickerButton.click();
		const visualPicker = page.locator('.date-picker-visual');
		const monthButton = visualPicker.locator('.date-navigation__select-month');
		await monthButton.click();
		const augustOption = page.locator('text=août');
		await augustOption.click();
		await expect(visualPicker.locator('.date-navigation__select-month')).toHaveText('août');
	});

	test('it should be possible to navigate years in the visual picker', async ({ mount, page }) => {
		const component = await mount(DatePicker);
		const visualPickerButton = component.locator('.date-picker-open-button');
		await visualPickerButton.click();
		const visualPicker = page.locator('.date-picker-visual');
		const yearButton = visualPicker.locator('.date-navigation__select-year');
		await yearButton.click();
		const year2000Option = page.locator('text=2000');
		await year2000Option.click();
		await expect(visualPicker.locator('.date-navigation__select-year')).toHaveText('2000');
	});

	test.describe('month navigation', () => {
		test('clicking the next month button should update the month displayed', async ({ mount, page }) => {
			const component = await mount(DatePicker);
			const input = component.locator('input');
			await input.fill('15/01/2023');
			const visualPickerButton = component.locator('.date-picker-open-button');
			await visualPickerButton.click();
			const visualPicker = page.locator('.date-picker-visual');
			const nextMonthButton = visualPicker.locator('button[data-test-id="next-month-button"]');
			await nextMonthButton.click();
			const monthButton = visualPicker.locator('.date-navigation__select-month');
			await expect(monthButton).toHaveText('février');
			await nextMonthButton.click();
			await expect(monthButton).toHaveText('mars');
		});

		test('the year should change when navigating from December to January', async ({ mount, page }) => {
			const component = await mount(DatePicker);
			const input = component.locator('input');
			await input.fill('15/12/2023');
			const visualPickerButton = component.locator('.date-picker-open-button');
			await visualPickerButton.click();
			const visualPicker = page.locator('.date-picker-visual');
			const nextMonthButton = visualPicker.locator('button[data-test-id="next-month-button"]');
			await nextMonthButton.click();
			const monthButton = visualPicker.locator('.date-navigation__select-month');
			const yearButton = visualPicker.locator('.date-navigation__select-year');
			await expect(monthButton).toHaveText('janvier');
			await expect(yearButton).toHaveText('2024');
		});

		test('clicking the previous month button should update the month displayed', async ({ mount, page }) => {
			const component = await mount(DatePicker);
			const input = component.locator('input');
			await input.fill('15/03/2023');
			const visualPickerButton = component.locator('.date-picker-open-button');
			await visualPickerButton.click();
			const visualPicker = page.locator('.date-picker-visual');
			const prevMonthButton = visualPicker.locator('button[data-test-id="previous-month-button"]');
			await prevMonthButton.click();
			const monthButton = visualPicker.locator('.date-navigation__select-month');
			await expect(monthButton).toHaveText('février');
			await prevMonthButton.click();
			await expect(monthButton).toHaveText('janvier');
		});

		test('the year should change when navigating from January to December', async ({ mount, page }) => {
			const component = await mount(DatePicker);
			const input = component.locator('input');
			await input.fill('15/01/2024');
			const visualPickerButton = component.locator('.date-picker-open-button');
			await visualPickerButton.click();
			const visualPicker = page.locator('.date-picker-visual');
			const nextMonthButton = visualPicker.locator('button[data-test-id="previous-month-button"]');
			await nextMonthButton.click();
			const monthButton = visualPicker.locator('.date-navigation__select-month');
			const yearButton = visualPicker.locator('.date-navigation__select-year');
			await expect(monthButton).toHaveText('décembre');
			await expect(yearButton).toHaveText('2023');
		});
	});
});

test.describe('visual regression', () => {
	test('it should match the visual snapshot', async ({ mount, page }) => {
		// 21/12/2025
		await page.clock.install({ time: new Date('2025-12-21T12:00:00.000Z') });

		const component = await mount(DatePicker);
		const visualPickerButton = component.locator('.date-picker-open-button');
		await visualPickerButton.click();
		const visualPicker = page.locator('.date-picker-visual');
		await expect(visualPicker).toHaveScreenshot();
	});
});
