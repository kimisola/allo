import React from "react";
import BoardLink from "../../components/BoardLink";
import renderer from 'react-test-renderer';

const store = {
  firebaseUid: "123456789",
  userEmail: "jestTest@test.com",
  userDisplayName: "Jest Test",
  userPhotoURL: "www.com",
  boardBackground: "www.com",
  targetLink: "www.google.com",
  boardName: "jestTest",
}

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <BoardLink store={ store }/>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // // manually trigger the callback
  tree.props.onClick();
  // // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // // // manually trigger the callback
  // tree.props.onMouseLeave();
  // // // re-rendering
  // tree = component.toJSON();
  // expect(tree).toMatchSnapshot();
  
});