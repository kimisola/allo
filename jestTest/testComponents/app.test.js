// import React from 'react';
// import homePageReducer from '../../reducers/homePageReducer';
// import renderer from 'react-test-renderer';

// //輸入 initial state 與 action 後，返回預期的 state

// describe('homePageReducer', () => {
//   let HomePageReducer;
//   beforeEach(() => {
//     jest.resetModules();
//     HomePageReducer = homePageReducer; // eslint-disable-line global-require
//   });

//   describe("type: ADD_BEINVITED_DATA", () => {
//     it("should show the initial load status", () => {
//       const state = {
//         beInvitedData: [],
//         invitationData: [],
//         gotBeInvitedData: false,
//       };
//       const result = HomePageReducer(state, {
//         type: "ADD_BEINVITED_DATA",
//         data: [],
//       });
//       expect(result).toEqual({
//         ...state,
//         gotBeInvitedData: true
//       });
//     });
//   });

//   describe("type: UPDATE_BEINVITED_DATA", () => {
//     it("should show the initial load status", () => {
//       const state = {
//         beInvitedData: [
//           { confirm: true },
//           { confirm: null }
//         ],
//         invitationData: [],
//         gotBeInvitedData: false,
//       };
//       const result = HomePageReducer(state, {
//         type: "UPDATE_BEINVITED_DATA",
//         beInvitedData: [
//           { confirm: true },
//           { confirm: null }
//         ],
//         index: 1,
//         confirm: true
//       });
//       expect(result).toEqual({
//         ...state,
//         beInvitedData: [
//           { confirm: true },
//           { confirm: true }
//         ],
//       });
//     });
//   });



// })


// // test('Link changes the class when hovered', () => {
// //   const component = renderer.create(
// //     <CommentTags />,
// //   );
// //   let tree = component.toJSON();
// //   expect(tree).toMatchSnapshot();

// //   // // manually trigger the callback
// //   // tree.props.onMouseEnter();
// //   // // re-rendering
// //   // tree = component.toJSON();
// //   // expect(tree).toMatchSnapshot();

// //   // // manually trigger the callback
// //   // tree.props.onMouseLeave();
// //   // // re-rendering
// //   // tree = component.toJSON();
// //   // expect(tree).toMatchSnapshot();
// // });