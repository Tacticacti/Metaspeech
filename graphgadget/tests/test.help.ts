import { type Locator, type Page } from '@playwright/test';

/* Common elements (layout) */

export function getNavBar(page: Page): Locator {
	return page.getByRole('navigation');
}

export function getNavHome(page: Page): Locator {
	return page.getByRole('link', { name: 'HOME' });
}

export function getFooter(page: Page): Locator {
	return page.locator('footer');
}

export function getErrorModal(page: Page): Locator {
	return page.getByTestId('error-modal');
}

export function getCloseErrorModal(page: Page): Locator {
	return page.getByTestId('close-button');
}

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

export function getImporterInput(page: Page): Locator {
	return page.getByTestId('input');
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

export function getPrevDataInfoBuble(page: Page): Locator {
	return page.getByTestId('info-bubble');
}

export function getPrevDataList(page: Page): Locator {
	return page.getByTestId('prev-data-list');
}

export function getListItems(page: Page): Locator {
	return page.getByRole('listitem');
}

export function getPrevFileButton(page: Page, file: string) {
	return page.getByRole('button', { name: file });
}

export function getDeleteButtons(page: Page): Locator {
	//return page.getByRole('button', { name: 'X' })
	return page.getByTestId('btn-delete-file');
}
