import { test, expect } from '@playwright/test';

import * as helper from './test.help';

test.describe('Initial page tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('file input not null', async ({ page }) => {
		//get file input
		const input = await page.$('input[type=file]');
		expect(input).not.toBeNull;
	});
	test('all important elements are visible', async ({ page }) => {
		await expect(helper.getSelectData(page)).toBeVisible();
		await expect(helper.getPreviousData(page)).toBeVisible();
		await expect(helper.getStoreClientData(page)).toBeVisible();
		await expect(helper.getLogo(page)).toBeVisible();
		await expect(helper.getNavBar(page)).toBeVisible();
		await expect(helper.getFooter(page)).toBeVisible();
	});
});

test.describe('Previous data page tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await helper.getPreviousData(page).click();
	});

	test('all important elements are visible', async ({ page }) => {
		// page.once('dialog', dialog => {
		// 	dialog.dismiss().catch(() => {});
		// });
		await expect(helper.getNoPreviousData(page)).toBeVisible();
		await expect(helper.getClearData(page)).toBeVisible();
		await expect(helper.getPrevDataIcon(page)).toBeVisible();
		await expect(helper.getPrevDataHeading(page)).toBeVisible();
		await expect(helper.getPrevDataBackArrow(page)).toBeVisible();
	});
});
