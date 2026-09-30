import React from "react";
import { screen, render } from "@testing-library/react";
import Text from "./Text";

describe("<Text />", () => {
  test("Text should return paragraphs", () => {
    const text = "First line\n\nSecond line\n\nThird line";
    render(<Text>{text}</Text>);

    const firstLine = screen.getByText("First line");
    expect(firstLine.tagName).toBe("SPAN");

    const paragraphs = screen.getAllByRole("paragraph");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent("Second line");
    expect(paragraphs[1]).toHaveTextContent("Third line");
  });

  test("Text should return links and line breaks", () => {
    const text =
      "Test [link](https://mock.com) \n[link2](https://mock2.com) \n[link3](https://mock3.com)";
    render(
      <div role="region">
        <Text>{text}</Text>
      </div>
    );

    const testContainer = screen.getByRole("region");
    expect(testContainer).toHaveTextContent("Test link link2 link3");

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "https://mock.com");
    expect(links[1]).toHaveAttribute("href", "https://mock2.com");
    expect(links[2]).toHaveAttribute("href", "https://mock3.com");

    const br = testContainer.querySelectorAll("br");
    expect(br.length).toBe(2);
  });
});
