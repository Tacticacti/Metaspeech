import { it, expect } from "vitest"
import { render } from '@testing-library/svelte';
import sut from "./+page.svelte"

// @ts-nocheck

it("displays the currency with a $ in front of it", () => {
    const {getByTestId} = render(sut, {currency: 20})

    expect(
        getByTestId("formatted-currency").innerHTML
    ).toEqual("$20")
})