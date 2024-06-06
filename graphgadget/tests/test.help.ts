import { type Locator, type Page } from '@playwright/test';

export function getSelectData(page: Page): Locator {
	return page.getByText('Select Data');
}

export function getPreviousData(page: Page): Locator {
	return page.getByRole('button', { name: 'Previous Data' });
}

export function getStoreClientData(page: Page): Locator {
	return page.getByLabel('Keep session saved (client');
}

export function getLogo(page: Page): Locator {
	return page.getByRole('img', { name: 'Logo', exact: true });
}

export function getNavBar(page: Page): Locator {
	return page.getByRole('navigation');
}

export function getFooter(page: Page): Locator {
	return page.locator('footer');
}
