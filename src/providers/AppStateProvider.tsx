"use client";
import {
	Dispatch,
	FC,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from "react";

export interface Todo {
	id: string;
	title: string;
	completed: boolean;
	priority: "low" | "medium" | "high";
}

interface AppState {
	todoIdToEdit: string | null;
	todos: Todo[];
}

type Action =
	| {
			type: "ADD_TODO";
			payload: {
				todo: Todo;
			};
	  }
	| {
			type: "DELETE_TODO";
			payload: {
				id: string;
			};
	  }
	| {
			type: "TOGGLE_TODO";
			payload: {
				id: string;
			};
	  }
	| {
			type: "UPDATE_PRIORITY";
			payload: {
				id: string;
				priority: "low" | "medium" | "high";
			};
	  }
	| {
			type: "EDIT_TODO";
			payload: {
				id: string;
			};
	  }
	| {
			type: "UPDATE_TODO";
			payload: {
				id: string;
				title: string;
				priority: "low" | "medium" | "high";
			};
	  }
	| {
			type: "CANCEL_EDIT";
	  };
	  
export const reducer = (state: AppState, action: Action) => {
	switch (action.type) {
		case "ADD_TODO":
			return {
				...state,
				todos: [...state.todos, action.payload.todo],
			};
		case "DELETE_TODO":
			return {
				...state,
				todos: state.todos.filter(
					(todo) => todo.id !== action.payload.id
				),
			};
		case "TOGGLE_TODO":
			return {
				...state,
				todos: state.todos
					.map((todo) =>
						todo.id === action.payload.id
							? { ...todo, completed: !todo.completed }
							: todo
					)
					.sort((a, b) => {
						if (a.completed && !b.completed) {
							return 1; // a is completed, b is not completed, so a should be after b
						} else if (!a.completed && b.completed) {
							return -1; // a is not completed, b is completed, so a should be before b
						} else {
							// both a and b are either completed or not completed, so compare their priorities
							const priorityOrder = {
								high: 0,
								medium: 1,
								low: 2,
							};
							return (
								priorityOrder[a.priority] -
								priorityOrder[b.priority]
							);
						}
					}),
			};
		case "UPDATE_PRIORITY":
			return {
				...state,
				todos: state.todos.map((todo) =>
					todo.id === action.payload.id
						? { ...todo, priority: action.payload.priority }
						: todo
				),
			};
		case "EDIT_TODO":
			return {
				...state,
				todoIdToEdit: action.payload.id,
			};
		case "UPDATE_TODO":
			return {
				...state,
				todos: state.todos.map((todo) =>
					todo.id === action.payload.id
						? {
								...todo,
								title: action.payload.title,
								priority: action.payload.priority,
						  }
						: todo
				),
				todoIdToEdit: null,
			};
		case "CANCEL_EDIT":
			return {
				...state,
				todoIdToEdit: null,
			};
		default:
			return state;
	}
};
const initalAppState = {
	todoIdToEdit: null,
	todos: [],
};
const AppStateContext = createContext<{
	state: AppState;
	dispatch: Dispatch<Action>;
}>({
	state: initalAppState,
	dispatch: () => null,
});

const AppStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const todos = JSON.parse(localStorage.getItem("todos")??"[]");
	const [state, dispatch] = useReducer(reducer, {
		...initalAppState,
		todos,
	});

	useEffect(()=>{
		localStorage.setItem("todos", JSON.stringify(state.todos));
	},[state.todos])

	return (
		<AppStateContext.Provider value={{ state, dispatch }}>
			{children}
		</AppStateContext.Provider>
	);
};

export const useAppState = () => {
	const context = useContext(AppStateContext);
	if (context === undefined) {
		throw new Error("useAppState must be used within a AppStateProvider");
	}
	return context;
};

export default AppStateProvider;
