import AddTodoForm from "@/components/AddTodoForm";
import Navbar from "@/components/Navbar";
import TodoList from "@/components/TodoList";
import { ScrollArea } from "@/components/ui/scroll-area";

const App = () => {
	return (
		<ScrollArea className="w-full h-screen">
			<div className="max-w-7xl mx-auto pt-20 px-4">
				<Navbar />
				<AddTodoForm />
				<TodoList />
			</div>
		</ScrollArea>
	);
};

export default App;
