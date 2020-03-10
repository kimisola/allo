import React from "react";
import Enzyme, {shallow} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({adapter: new Adapter()});
import {BoardLink} from "../../components/BoardLink";

const mockProps = {
  firebaseUid: "123456789",
  userEmail: "jestTest@test.com",
  userDisplayName: "Jest Test-1",
  userPhotoURL: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2FalloImage.png?alt=media&token=59ffb5bb-4322-4a60-b331-d88e9aa4cbae",
  boardBackground: "https://images.unsplash.com/photo-1571649454759-c0de91fe6044?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  targetLink: "https://allo-dc54c.firebaseapp.com",
  boardName: "jest-Test",
}

describe('to match snapshot', () => {
  const component = shallow(<BoardLink {...mockProps} />);
  it("match snapshot", () => {
    expect(component).toMatchSnapshot();
  });

  it("must have boardName info", () => {
    expect(component.find(".board").children()).toHaveLength(1);
    expect(
      component
        .find(".board")
        .childAt(0)
        .text()
    ).toEqual("jest-Test");
  });
});