import { test, expect } from '@playwright/test';
import { describe } from 'node:test';

test.use({
  locale: 'fr-FR',
  timezoneId: 'Europe/Paris',
});

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('input')).toHaveValue('');
})


test('checks if the visual picker is present', async ({ page }) => {
  await page.goto('/');
  const visualPickerButton = page.locator('.date-picker-open-button');
  await visualPickerButton.click();
  const visualPicker = page.locator('.date-picker-visual');
  await expect(visualPicker).toBeVisible();
});

test('the visual picker should show the date selected in the input', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('input');
  await input.fill('18/12/1997');
  const visualPickerButton = page.locator('.date-picker-open-button');
  await visualPickerButton.click();
  const visualPicker = page.locator('.date-picker-visual');
  await expect(visualPicker).toBeVisible();
  await expect(visualPicker).toHaveText(/^18 décembre 1997/);
});

test('selecting a date from the visual picker should update the input value', async ({ page }) => {
  await page.goto('/');
  const visualPickerButton = page.locator('.date-picker-open-button');
  await visualPickerButton.click();
  const visualPicker = page.locator('.date-picker-visual');
  await expect(visualPicker).toBeVisible();
  const dayButton = visualPicker.locator('button[aria-label="11 décembre 2025"]');
  await dayButton.click();
  await expect(visualPicker).toBeHidden();
  const input = page.locator('input');
  await expect(input).toHaveValue('11/12/2025');
});

test('the visual picker should open with the correct month when a date is already selected in the input', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('input');
  await input.fill('25/07/2001');
  const visualPickerButton = page.locator('.date-picker-open-button');
  await visualPickerButton.click();
  const visualPicker = page.locator('.date-picker-visual');
  await expect(visualPicker).toBeVisible();
  const monthYearHeader = visualPicker.locator('.date-navigation__select-month');
  await expect(monthYearHeader).toHaveText('juillet');
});

test('it should be possible to navigate months in the visual picker', async ({ page }) => {
  await page.goto('/');
  const visualPickerButton = page.locator('.date-picker-open-button');
  await visualPickerButton.click();
  const visualPicker = page.locator('.date-picker-visual');
  const monthButton = visualPicker.locator('.date-navigation__select-month');
  await monthButton.click();
  const augustOption = page.locator('text=août');
  await augustOption.click();
  await expect(visualPicker.locator('.date-navigation__select-month')).toHaveText('août');
});

test('it should be possible to navigate years in the visual picker', async ({ page }) => {
  await page.goto('/');
  const visualPickerButton = page.locator('.date-picker-open-button');
  await visualPickerButton.click();
  const visualPicker = page.locator('.date-picker-visual');
  const yearButton = visualPicker.locator('.date-navigation__select-year');
  await yearButton.click();
  const year2000Option = page.locator('text=2000');
  await year2000Option.click();
  await expect(visualPicker.locator('.date-navigation__select-year')).toHaveText('2000');
});

describe('month navigation', () => {
  test('the right month arrow button should allow navigation to the next month', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input');
    await input.fill('15/01/2023');
    const visualPickerButton = page.locator('.date-picker-open-button');
    await visualPickerButton.click();
    const visualPicker = page.locator('.date-picker-visual');
    const nextMonthButton = visualPicker.locator('button[data-test-id="next-month-button"]');
    await nextMonthButton.click();
    const monthButton = visualPicker.locator('.date-navigation__select-month');
    await expect(monthButton).toHaveText('février');
    await nextMonthButton.click();
    await expect(monthButton).toHaveText('mars');
  });

  test('the year should change when navigating from December to January', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input');
    await input.fill('15/12/2023');
    const visualPickerButton = page.locator('.date-picker-open-button');
    await visualPickerButton.click();
    const visualPicker = page.locator('.date-picker-visual');
    const nextMonthButton = visualPicker.locator('button[data-test-id="next-month-button"]');
    await nextMonthButton.click();
    const monthButton = visualPicker.locator('.date-navigation__select-month');
    const yearButton = visualPicker.locator('.date-navigation__select-year');
    await expect(monthButton).toHaveText('janvier');
    await expect(yearButton).toHaveText('2024');
  });

  test('the left month arrow button should allow navigation to the previous month', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input');
    await input.fill('15/03/2023');
    const visualPickerButton = page.locator('.date-picker-open-button');
    await visualPickerButton.click();
    const visualPicker = page.locator('.date-picker-visual');
    const previousMonthButton = visualPicker.locator('button[data-test-id="previous-month-button"]');
    await previousMonthButton.click();
    const monthButton = visualPicker.locator('.date-navigation__select-month');
    await expect(monthButton).toHaveText('février');
    await previousMonthButton.click();
    await expect(monthButton).toHaveText('janvier');
  });

  test('the year should change when navigating from January to December', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input');
    await input.fill('15/01/2023');
    const visualPickerButton = page.locator('.date-picker-open-button');
    await visualPickerButton.click();
    const visualPicker = page.locator('.date-picker-visual');
    const previousMonthButton = visualPicker.locator('button[data-test-id="previous-month-button"]');
    await previousMonthButton.click();
    const monthButton = visualPicker.locator('.date-navigation__select-month');
    const yearButton = visualPicker.locator('.date-navigation__select-year');
    await expect(monthButton).toHaveText('décembre');
    await expect(yearButton).toHaveText('2022');
  });
});

test('the visual picker should always look the same in visual regression tests', async ({ page }) => {
  await page.goto('/');
  const visualPickerButton = page.locator('.date-picker-open-button');
  await visualPickerButton.click();
  const visualPicker = page.locator('.date-picker-visual');
  await expect(visualPicker).toHaveScreenshot();
});
