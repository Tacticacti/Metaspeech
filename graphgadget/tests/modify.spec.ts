import { test, expect } from '@playwright/test';
import * as helper from './test.help';
import path from 'path';

const testFilePath = './graphgadget/tests/test-files/test.json'

test.describe('Modify page tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    const filePath = path.resolve(testFilePath);
    const input = await page.$('input[type="file"]');
    
    if (input) {
      await input.setInputFiles(filePath);
    }
    expect(input).not.toBeNull();
  });


  test('Test if all important elements are visible', async ({ page }) => {
    await expect(helper.getNavBar(page)).toBeVisible();
    await expect(helper.getFilterButton(page)).toBeVisible();
    await expect(helper.getSelectData(page)).toBeVisible();
    await expect(helper.getNextButton(page)).toBeVisible();
    await expect(helper.getFooter(page)).toBeVisible();
  });

  test('Test if specific columns from test file are visible', async ({page}) => {
    await expect(page.getByTestId('header-id-input')).toBeVisible();
    await expect(page.getByTestId('header-start_frame-input')).toBeVisible();
    await expect(page.getByTestId('header-num_frames-input')).toBeVisible();
    await expect(page.getByTestId('header-duration-input')).toBeVisible();
    await expect(page.getByTestId('header-start_ms-input')).toBeVisible();
    await expect(page.getByTestId('header-end_ms-input')).toBeVisible();
  })

  
});
