import { setColor } from "./CanvasUtils";
import { describe, it, expect } from "vitest";

describe("CanvasUtils", () => {
  it("should set color", () => {
    const chart = {
      ctx: {
        save: jest.fn(),
        globalCompositeOperation: "",
        fillStyle: "",
        fillRect: jest.fn(),
        restore: jest.fn(),
      },
      width: 100,
      height: 100,
    };
    setColor(chart, "", { color: "#ff0000" });
    expect(chart.ctx.fillStyle).toBe("#ff0000");
  });
});