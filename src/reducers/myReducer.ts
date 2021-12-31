interface State {
    value: number;
}

interface Action {
    type: string;
}

export function myReducer(state: State = { value: 0 }, action: Action) {
    switch (action.type) {
        case 'INCREMENT':
            return { value: state.value + 1 };
        case 'DECREMENT':
            return { value: state.value - 1 };
        default:
            return state;
    }
}