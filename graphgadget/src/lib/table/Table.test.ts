import { describe, it, expect } from "vitest";
import { data } from "$lib/Store";
import sut from "./Table.svelte";
import { fireEvent, render } from "@testing-library/svelte";
import DataFrame from "dataframe-js";
import "$lib/table/Table.help.ts";
import * as h from "$lib/table/Table.help";

describe("Table", () => {
    it("should render", () => {
        const { container } = render(sut);
        expect(container).to.exist;
    });
    it("should render a table with headers and rows based on provided data", async () => {
        // Create a mock DataFrame
        const mockData = new DataFrame(
        [
            { col1: "Row1Col1", col2: "Row1Col2" },
            { col1: "Row2Col1", col2: "Row2Col2" },
        ],
        ["col1", "col2"]
        );
    
        // Render the component with mock data
        data.set(mockData);
        const r = render(sut);
    
        // Check if headers are present
        expect(h.getHeaderInput(r, "col1")).toBeDefined();
        expect(h.getHeaderInput(r, "col2")).toBeDefined();
    
        // Check if data is present
        expect(h.getCell(r, "Row1Col1")).toBeDefined();
        expect(h.getCell(r, "Row1Col2")).toBeDefined();
        expect(h.getCell(r, "Row2Col1")).toBeDefined();
        expect(h.getCell(r, "Row2Col2")).toBeDefined();
    });
    it("should be able to render an empty table", async () => {
        const df = new DataFrame([]);
        data.set(df);
        const { container } = render(sut);
    
        expect(container).toBeTruthy();
    });
    it("should not fail with undefined", async () => {
        // @ts-expect-error - intentionally testing with invalid data
        data.set(undefined);

        render(sut);
    });
    it("should update the table when data updates", async () => {
        let mockData = new DataFrame(
        [
            { col1: "Row1Col1" }
        ],
        ["col1"]
        );
    
        data.set(mockData);
        const r = render(sut);

        mockData = new DataFrame(
        [
            { col1: "Row3Col1" }
        ],
        ["col1"]
        );

        data.set(mockData);
        await h.rerender(r);

        expect(h.getCell(r, "Row1Col1")).toBeNull();
        expect(h.getCell(r, "Row3Col1")).toBeDefined();
    });
});

describe("Deleting" , () => {
    it("should be able to be deleted", async () => {
        const mockData = new DataFrame(
        [
            { col1: "Row1Col1", col2: "Row1Col2" },
            { col1: "Row2Col1", col2: "Row2Col2" },
        ],
        ["col1", "col2"]
        );
    
        data.set(mockData);
        const r = render(sut);

        const deleteButton = h.getHeaderDeleteButton(r, "col1");
        expect(deleteButton).toBeDefined();

        await fireEvent.click(deleteButton!);
        await h.rerender(r);
        expect(h.getHeaderInput(r, "col1")).toBeNull();
    });
});

describe("Renaming", async () => {
    it("should be able to be renamed", async () => {
        const mockData = new DataFrame(
        [
            { col1: "Row1Col1", col2: "Row1Col2" },
            { col1: "Row2Col1", col2: "Row2Col2" },
        ],
        ["col1", "col2"]
        );
    
        data.set(mockData);
        const r = render(sut);

        h.renameColumn(r, "col1", "newName");

        expect(h.getHeaderInput(r, "newName")).toBeDefined();
    });
    it("should reset the column name when left empty", async () => {
        const mockData = new DataFrame(
        [
            { col1: "Row1Col1", col2: "Row1Col2" },
            { col1: "Row2Col1", col2: "Row2Col2" },
        ],
        ["col1", "col2"]
        );
    
        data.set(mockData);
        const r = render(sut);

        h.renameColumn(r, "col1", "");

        expect(h.getHeaderInput(r, "col1")).toBeDefined();
    });
    it("should not allow renaming to an existing column name", async () => {
        const mockData = new DataFrame(
        [
            { col1: "Row1Col1", col2: "Row1Col2" },
            { col1: "Row2Col1", col2: "Row2Col2" },
        ],
        ["col1", "col2"]
        );
    
        data.set(mockData);
        const r = render(sut);

        h.renameColumn(r, "col1", "col2");

        expect(h.getHeaderInput(r, "col1")).toBeDefined();
    });
    it("should trim whitespace from the new column name", async () => {
        const mockData = new DataFrame(
        [
            { col1: "Row1Col1", col2: "Row1Col2" },
            { col1: "Row2Col1", col2: "Row2Col2" },
        ],
        ["col1", "col2"]
        );
    
        data.set(mockData);
        const r = render(sut);

        h.renameColumn(r, "col1", " newName ");

        expect(h.getHeaderInput(r, "newName")).toBeDefined();
    });
});