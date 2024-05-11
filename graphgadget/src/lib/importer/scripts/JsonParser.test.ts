import { ParseJson } from "./JsonParser";
import { DataFrame } from "dataframe-js";
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("dataframe-js");

describe("JsonParser", () => {
    const oldFileReader = window.FileReader;

    afterEach(() => {
        window.FileReader = oldFileReader;
        vi.restoreAllMocks();
    });

    it("should parse array-like JSON files", async () => {
        // @ts-expect-error ignore
        window.FileReader = jest.fn().mockImplementation(() => ({
            readAsText: function () {
                this.onload({ target: { result: '[{ "id": "dummy data" }]' } });
            }
        }));
        const file = new File(['[{ "id": "dummy data" }]'], "test.json", { type: "application/json" });
        await ParseJson(file);
        expect(DataFrame).toBeCalledWith(JSON.parse('[{ "id": "dummy data" }]'));
    });
    it("should parse object-like JSON files", async () => {
        // @ts-expect-error ignore
        window.FileReader = jest.fn().mockImplementation(() => ({
            readAsText: function () {
                this.onload({ target: { result: '{ "dummy": { "example": "data" }}' } });
            }
        }));
        const file = new File(['{ "dummy": { "example": "data" }}'], "test.json", { type: "application/json" });
        await ParseJson(file);
        expect(DataFrame).toBeCalledWith([{ id: "dummy", example: "data" }]);
    });
    it("should reject invalid JSON files", async () => {
        // @ts-expect-error ignore
        window.FileReader = jest.fn().mockImplementation(() => ({
            readAsText: function () {
                this.onload({ target: { result: '"invalid json"' } });
            }
        }));
        const file = new File(['"invalid json"'], "test.json", { type: "application/json" });
        try {
            await ParseJson(file);
            throw new Error("Test failed: Expected ParseJson to throw an error but did not.");
        } catch (error) {
            expect(error).toBeInstanceOf(SyntaxError);
            expect((error as SyntaxError).message).toContain("JSON data is not an array");
        }
    });
    it("should reject files with no data", async () => {
        // @ts-expect-error ignore
        window.FileReader = jest.fn().mockImplementation(() => ({
            readAsText: function () {
                this.onload({ target: { result: "" } });
            }
        }));
        const file = new File([], "test.json", { type: "application/json" });
        try {
            await ParseJson(file);
            throw new Error("Test failed: Expected ParseJson to throw an error but did not.");
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toContain("Failed to load file");
        }
    });

    // uncommenting the following test will cause the tests in xls to fail
    // i have no clue why...

    it("should handle read error", async () => {
        // @ts-expect-error ignore
        window.FileReader = jest.fn().mockImplementation(() => ({
            readAsText: function () {
                this.onerror(new Error());
            }
        }));
        const file = new File([], "test.json", { type: "application/json" });
        try {
            await ParseJson(file);
            throw new Error("Test failed: Expected ParseJson to throw an error but did not.");
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toContain('Error reading file');
        }
    });
});