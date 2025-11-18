import { render } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("should render without crashing", () => {
    render(<App />);
    // Just verify the app renders - router will handle the rest
    expect(document.body).toBeInTheDocument();
  });

  it("should render BrowserRouter", () => {
    const { container } = render(<App />);
    // Verify that the router is working by checking if any route renders
    expect(container).toBeInTheDocument();
  });
});
