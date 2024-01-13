"use client"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenIcon, TrashIcon } from "lucide-react";
import { useAppState } from "@/providers/AppStateProvider";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const TodoList = () => {
	const [parent] = useAutoAnimate(/* optional config */)
	const { state, dispatch } = useAppState();
	return (
		<Table className="mt-5">
			<TableCaption>A list of your todos.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-20"></TableHead>
					<TableHead>Title</TableHead>
					<TableHead className="w-40">Status</TableHead>
					<TableHead className="w-20">Priority</TableHead>
					<TableHead className="text-right w-32">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody ref={parent}>
				{state.todos.map((todo) => (
					<TableRow key={todo.id}>
						<TableCell>
							<Checkbox
								checked={todo.completed}
								onCheckedChange={() => {
									dispatch({
										type: "TOGGLE_TODO",
										payload: {
											id: todo.id,
										},
									});
								}}
							/>
						</TableCell>
						<TableCell
							className={cn(
								"font-medium",
								todo.completed
									? "line-through text-gray-400"
									: "text-foreground"
							)}>
							{todo.title}
						</TableCell>
						<TableCell>
							{todo.completed ? "Completed" : "Not Completed"}
						</TableCell>
						<TableCell>
							<Badge variant={todo.priority}>
								{todo.priority}
							</Badge>
						</TableCell>
						<TableCell className="text-right">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => {
												dispatch({
													type: "EDIT_TODO",
													payload: {
														id: todo.id,
													},
												});
											}}>
											<PenIcon size={16} />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Edit</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => {
												dispatch({
													type: "DELETE_TODO",
													payload: {
														id: todo.id,
													},
												});
											}}>
											<TrashIcon
												size={16}
												className="text-red-400"
											/>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Delete</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default TodoList;
