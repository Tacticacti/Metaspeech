import { type Locator, type Page } from '@playwright/test';

/* Initial page elements */

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

/* Previous page elements */

export function getNoPreviousData(page: Page): Locator {
	return page.getByText('No previous data available.');
}

export function getClearData(page: Page): Locator {
	return page.getByRole('button', { name: 'Clear Data' });
}

export function getPrevDataIcon(page: Page): Locator {
	return page.getByRole('button', { name: 'info icon' });
}

export function getPrevDataHeading(page: Page): Locator {
	return page.getByRole('heading', { name: 'Previous Data' });
}

export function getPrevDataBackArrow(page: Page): Locator {
	return page.getByRole('button', { name: 'go back arrow' });
}
