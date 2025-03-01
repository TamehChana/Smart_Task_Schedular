from priority_queue import PriorityQueue
from task_schedular import Task  # Import Task class if it's in task_schedular.py, otherwise create it here

class TaskManager:
    def __init__(self, priority_queue):
        self.priority_queue = priority_queue
        self.tasks = []
        self.task_counter = 0

    def add_task(self, description, priority):
        self.task_counter += 1
        task = Task(self.task_counter, description, priority)
        self.priority_queue.enqueue(task)
        self.tasks.append(task)

    def delete_task(self, task_id):
        task_to_delete = next((task for task in self.tasks if task.id == task_id), None)
        if task_to_delete:
            self.tasks.remove(task_to_delete)
            # Rebuild the priority queue with remaining tasks
            self.priority_queue.clear()
            for task in self.tasks:
                self.priority_queue.enqueue(task)

    def edit_task(self, task_id, new_description=None, new_priority=None):
        task_to_edit = next((task for task in self.tasks if task.id == task_id), None)
        if task_to_edit:
            if new_description:
                task_to_edit.description = new_description
            if new_priority is not None:
                task_to_edit.priority = new_priority
            # Rebuild the priority queue with updated tasks
            self.priority_queue.clear()
            for task in self.tasks:
                self.priority_queue.enqueue(task)

    def complete_task(self, task_id):
        task_to_complete = next((task for task in self.tasks if task.id == task_id), None)
        if task_to_complete:
            task_to_complete.status = "Completed"
