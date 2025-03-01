import tkinter as tk
from tkinter import messagebox
from tkinter import ttk
import ttkbootstrap as tb  # Improved styling with ttkbootstrap

# Task class to hold task details
class Task:
    def __init__(self, id, description, priority):
        self.id = id
        self.description = description
        self.priority = priority
        self.status = "Pending"

    def __str__(self):
        return f"{self.id}: {self.description} (Priority: {self.priority}) - {self.status}"

# Main window with a modern theme
root = tb.Window(themename="flatly")  # Use "flatly" for a modern, soft look
root.title("Smart Task Scheduler")
root.geometry("700x600")
root.configure(bg="#E3F2FD")  # Light blue background

# Task list and counter
tasks = []
task_counter = 0

# Header Frame
header_frame = ttk.Frame(root, style="Header.TFrame")
header_frame.pack(pady=15)

header_label = ttk.Label(header_frame, text="📋 Smart Task Scheduler", font=("Helvetica", 20, "bold"), foreground="#333")
header_label.pack()

# Input Frame
input_frame = ttk.Frame(root, padding=10)
input_frame.pack(pady=10)

description_label = ttk.Label(input_frame, text="Task Description:", font=("Helvetica", 12))
description_label.grid(row=0, column=0, padx=5, pady=5, sticky="e")

description_entry = ttk.Entry(input_frame, width=45, font=("Helvetica", 12))
description_entry.grid(row=0, column=1, padx=5, pady=5)

priority_label = ttk.Label(input_frame, text="Task Priority:", font=("Helvetica", 12))
priority_label.grid(row=1, column=0, padx=5, pady=5, sticky="e")

priority_entry = ttk.Entry(input_frame, width=45, font=("Helvetica", 12))
priority_entry.grid(row=1, column=1, padx=5, pady=5)

# Task List Frame
list_frame = ttk.Frame(root)
list_frame.pack(pady=10, padx=20)

task_listbox = tk.Listbox(list_frame, width=65, height=10, font=('Helvetica', 12), bg="#fefefe", fg="#333",
                          selectbackground="#90CAF9", selectforeground="black", relief="flat", bd=0)
task_listbox.pack(side=tk.LEFT, fill=tk.BOTH)

scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=task_listbox.yview)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
task_listbox.config(yscrollcommand=scrollbar.set)

# Task Summary Frame
task_summary_frame = ttk.Frame(root)
task_summary_frame.pack(pady=10)

total_tasks_label = ttk.Label(task_summary_frame, text="📊 Total Tasks: 0", font=("Helvetica", 12, "bold"))
total_tasks_label.grid(row=0, column=0, padx=10)

pending_tasks_label = ttk.Label(task_summary_frame, text="⏳ Pending Tasks: 0", font=("Helvetica", 12, "bold"))
pending_tasks_label.grid(row=0, column=1, padx=10)

completed_tasks_label = ttk.Label(task_summary_frame, text="✅ Completed Tasks: 0", font=("Helvetica", 12, "bold"))
completed_tasks_label.grid(row=0, column=2, padx=10)

# Button Frame
button_frame = ttk.Frame(root)
button_frame.pack(pady=10)

def update_task_summary():
    total_tasks = len(tasks)
    pending_tasks = len([task for task in tasks if task.status == "Pending"])
    completed_tasks = len([task for task in tasks if task.status == "Completed"])

    total_tasks_label.config(text=f"📊 Total Tasks: {total_tasks}")
    pending_tasks_label.config(text=f"⏳ Pending Tasks: {pending_tasks}")
    completed_tasks_label.config(text=f"✅ Completed Tasks: {completed_tasks}")

# Add Task Function
def add_task():
    global task_counter
    description = description_entry.get()
    priority = priority_entry.get()

    if description and priority.isdigit():
        task_counter += 1
        task = Task(task_counter, description, int(priority))
        tasks.append(task)

        description_entry.delete(0, tk.END)
        priority_entry.delete(0, tk.END)

        update_task_listbox()
        print(f"Task added: {task}")
    else:
        messagebox.showwarning("Input Error", "Please enter a valid description and numeric priority.")

# Update Task Listbox Function
def update_task_listbox():
    task_listbox.delete(0, tk.END)
    pending_tasks = sorted([task for task in tasks if task.status == "Pending"], key=lambda task: task.priority)
    completed_tasks = [task for task in tasks if task.status == "Completed"]

    for task in pending_tasks + completed_tasks:
        task_listbox.insert(tk.END, str(task))

    update_task_summary()

# Delete Task Function
def delete_task():
    try:
        selected_task_index = task_listbox.curselection()[0]
        selected_task_text = task_listbox.get(selected_task_index)

        for task in tasks:
            if str(task) == selected_task_text:
                tasks.remove(task)
                break

        update_task_listbox()
    except IndexError:
        messagebox.showwarning("Selection Error", "Please select a task to delete.")

# Complete Task Function
def complete_task():
    try:
        selected_task_index = task_listbox.curselection()[0]
        selected_task_text = task_listbox.get(selected_task_index)

        for task in tasks:
            if str(task) == selected_task_text:
                task.status = "Completed"
                break

        update_task_listbox()
    except IndexError:
        messagebox.showwarning("Selection Error", "Please select a task to mark as complete.")

# Stylish Buttons with Rounded Corners
add_button = tb.Button(button_frame, text="➕ Add Task", command=add_task, bootstyle="success, outline", width=18)
add_button.grid(row=0, column=0, padx=10, pady=5)

delete_button = tb.Button(button_frame, text="❌ Delete Task", command=delete_task, bootstyle="danger, outline", width=18)
delete_button.grid(row=0, column=1, padx=10, pady=5)

complete_button = tb.Button(button_frame, text="✅ Complete Task", command=complete_task, bootstyle="primary, outline", width=18)
complete_button.grid(row=0, column=2, padx=10, pady=5)

# Hover effect for buttons
def on_enter(e):
    e.widget.config(style="info.TButton")

def on_leave(e):
    e.widget.config(style="primary.TButton")

for btn in [add_button, delete_button, complete_button]:
    btn.bind("<Enter>", on_enter)
    btn.bind("<Leave>", on_leave)

# Run Tkinter main loop
print("Window is opening...")
root.mainloop()
