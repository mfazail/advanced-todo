"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAppState } from "@/providers/AppStateProvider.tsx";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const TODO_PRIORITY = ["low", "medium", "high"];

const AddTodoForm = () => {
	const { state, dispatch } = useAppState();
	useEffect(() => {
		if (state.todoIdToEdit) {
			const todo = state.todos.find(
				(todo) => todo.id === state.todoIdToEdit
			);
			if (todo) {
				form.setValue("todo", todo.title);
				form.setValue("priority", todo.priority);
			}
		}
	}, [state.todoIdToEdit]);

	const formSchema = z.object({
		todo: z
			.string()
			.min(1, "This field is required"),
		priority: z.enum(["low", "medium", "high"]),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			todo: "",
			priority: "low",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (state.todoIdToEdit) {
			dispatch({
				type: "UPDATE_TODO",
				payload: {
					id: state.todoIdToEdit,
					title: values.todo,
					priority: values.priority,
				},
			});
		} else {
			dispatch({
				type: "ADD_TODO",
				payload: {
					todo: {
						id: crypto.randomUUID(),
						title: values.todo,
						completed: false,
						priority: values.priority,
					},
				},
			});
		}
		form.reset();
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card
					className={cn(
						"duration-300 ease-in-out transition-all ",
						state.todoIdToEdit ? "border-2 border-red-400" : ""
					)}>
					<CardContent className="flex flex-col md:flex-row items-center space-x-2 p-4">
						<div className="flex-1 w-full">
							<FormField
								control={form.control}
								name="todo"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input
												placeholder="Todo name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex w-full sm:w-auto items-end space-x-2">
							<FormField
								control={form.control}
								name="priority"
								render={({ field }) => (
									<FormItem className="w-full sm:w-auto">
										<FormLabel>Priority</FormLabel>
										<Select
											{...field}
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="w-full sm:w-[180px]">
													<SelectValue placeholder="Select priority" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{TODO_PRIORITY.map(
													(priority) => (
														<SelectItem
															key={priority}
															value={priority}>
															{priority}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{state.todoIdToEdit && (
								<Button
									onClick={() => {
										dispatch({ type: "CANCEL_EDIT" });
										form.reset();
									}}>
									CANCEL
								</Button>
							)}
							<Button>
								{state.todoIdToEdit ? "UPDATE" : "ADD"}
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</Form>
	);
};

export default AddTodoForm;
