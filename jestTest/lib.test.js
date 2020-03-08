import homePageReducer from '../reducers/homePageReducer';

//輸入 initial state 與 action 後，返回預期的 state

describe('homePageReducer', () => {

	let HomePageReducer;
	beforeEach(() => {
		jest.resetModules();
		HomePageReducer = homePageReducer;
	});

	describe("type: ADD_BEINVITED_DATA", () => {
		it("should show the initial load status", () => {
			const state = {
				beInvitedData: [],
				invitationData: [],
				gotBeInvitedData: false,
			};
			const result = HomePageReducer(state, {
				type: "ADD_BEINVITED_DATA",
				data: [],
			});
			expect(result).toEqual({
				...state,
				gotBeInvitedData: true
			});
		});
	});

	describe("type: UPDATE_BEINVITED_DATA", () => {
		it("should show the initial load status", () => {
			const state = {
				beInvitedData: [
				{ confirm: true },
				{ confirm: null }
				],
				invitationData: [],
				gotBeInvitedData: false,
			};
			const result = HomePageReducer(state, {
				type: "UPDATE_BEINVITED_DATA",
				beInvitedData: [
				{ confirm: true },
				{ confirm: null }
				],
				index: 1,
				confirm: true
			});
			expect(result).toEqual({
				...state,
				beInvitedData: [
				{ confirm: true },
				{ confirm: true }
				],
			});
		});
	});

	describe("type: ADD_INVITATION_DATA", () => {
		it("should show the initial load status", () => {
			const state = {
				beInvitedData: [],
				invitationData: [],
				gotBeInvitedData: false,
			};
			const result = HomePageReducer(state, {
				type: "ADD_INVITATION_DATA",
				data: [],
			});
			expect(result).toEqual({
				...state,
			});
		});
	});


	describe("type: UNFRIEND", () => {
		it("should show the initial load status", () => {
			const state = {
				beInvitedData: [],
				invitationData: [
					{ username: "May",
					confirm: true },
					{ username: "June",
					confirm: true },
					{ username: "July",
					confirm: true }
				],
				gotBeInvitedData: false,
			};
			const result = HomePageReducer(state, {
				type: "UNFRIEND",
				invitationData: [
				{ username: "May",
					confirm: true },
				{ username: "June",
					confirm: true },
				{ username: "July",
					confirm: true }
				],
				index: 0,
			});
			expect(result).toEqual({
				...state,
				invitationData: [
				{ username: "June",
					confirm: true },
				{ username: "July",
					confirm: true }
				],
			});
		});
	});

})