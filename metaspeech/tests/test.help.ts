import { type Locator, type Page } from '@playwright/test';

/* Common elements (layout) */

export function getNavBar(page: Page): Locator {
	return page.getByRole('navigation');
}

export function getNavHome(page: Page): Locator {
	return page.getByRole('link', { name: 'HOME' });
}

export function getNavVisualizations(page: Page): Locator {
	return page.getByRole('link', { name: 'VISUALIZATIONS' });
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
	return page.getByText('Upload data');
}

export function getAppendFile(page: Page): Locator {
	return page.getByText('Merge with another file');
}

export function getPreviousData(page: Page): Locator {
	return page.getByRole('button', { name: 'Previous Data' });
}

export function getStoreClientData(page: Page): Locator {
	return page.getByLabel('Keep session saved (only on broswer');
}

export function getLogo(page: Page): Locator {
	return page.getByRole('img', { name: 'Logo', exact: true });
}

export function getImporterInput(page: Page): Locator {
	return page.getByTestId('import');
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
	return page.getByTestId('btn-delete-file');
}

/* Modify page elements */
export function getFilterButton(page: Page): Locator {
	return page.getByRole('button', { name: 'Filter icon Filter' });
}

export function getNextButton(page: Page): Locator {
	return page.getByTestId('next-link');
}

export function getColumnSelect(page: Page): Locator {
	return page.getByTestId('column-select');
}

export function getTextFilterInput(page: Page): Locator {
	return page.getByTestId('textfilter-input');
}

export function getRemoveMatchingButton(page: Page): Locator {
	return page.getByTestId('remove-matching-button');
}

export function getRemoveNonMatchingButton(page: Page): Locator {
	return page.getByTestId('remove-nonmatching-button');
}

export function getRangeCheckbox(page: Page): Locator {
	return page.getByTestId('userange-check');
}

export function getSelectRange(page: Page): Locator {
	return page.getByText('Select Range');
}

export function getMinRangeInput(page: Page): Locator {
	return page.getByTestId('minrange-input');
}

export function getMaxRangeInput(page: Page): Locator {
	return page.getByTestId('maxrange-input');
}

export function getWarningText(page: Page): Locator {
	return page.getByText('Warning: Missing values');
}

export function getRemoveMissingButton(page: Page): Locator {
	return page.getByTestId('remove-missing-button');
}

export function getInfoButton(page: Page): Locator {
	return page.getByRole('button', { name: 'info icon' });
}

export function getMergeTypeSelect(page: Page): Locator {
	return page.getByTestId('merge-type-select');
}

export function getColumnOneSelect(page: Page): Locator {
	return page.getByTestId('col1-select');
}

export function getColumnTwoSelect(page: Page): Locator {
	return page.getByTestId('col2-select');
}

export function getMergeButton(page: Page): Locator {
	return page.getByTestId('merge-button');
}

export function getColumnHeaderInput(page: Page, headerName: string): Locator {
	return page.getByTestId('header-' + headerName + '-input');
}

export function getColumnHeaderDeleteButton(page: Page, headerName: string): Locator {
	return page.getByTestId('header-' + headerName + '-delete');
}

export function getTableCell(page: Page, cellName: string): Locator {
	return page.getByTestId(cellName + '-cell');
}

export function getInfoBubble(page: Page): Locator {
	return page.getByTestId('info-bubble');
}

/* Select page elements */
export function getGroupColumnCheckbox(page: Page, colName: string): Locator {
	return page.getByRole('checkbox', { name: colName });
}

export function getSelectColumnRadio(page: Page, colName: string): Locator {
	return page.getByRole('radio', { name: colName });
}

/* View page elements */

export function getCanvasElement(page: Page): Locator {
	return page.getByTestId('canvas-element');
}

export function getPngButton(page: Page): Locator {
	return page.getByRole('button', { name: 'PNG' });
}

/* Scatter plot */
export function getScatterPlotGraph(page: Page): Locator {
	return page.getByTestId('Scatter');
}

export function getScatterSwapColumns(page: Page): Locator {
	return page.getByTestId('scatter-swap-columns');
}
