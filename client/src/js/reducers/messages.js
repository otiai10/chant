
export default function messages(state = [], action) {
  switch (action.type) {
  case "SOCKET_ON_MESSAGE":
    return state.concat([action.payload]);
  default:
    return state;
  }
}
