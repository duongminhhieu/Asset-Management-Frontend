import BannerLogoComponent from "./BannerLogoComponent";

import { render, screen } from "@testing-library/react";

describe("BannerLogoComponent", () => {
  const renderComponent = () => {
    return render(<BannerLogoComponent />);
  };

  test("should render the BannerLogoComponent", () => {
    renderComponent();
    expect(screen.getByText("Online Asset Management")).toBeInTheDocument();
  });
});
