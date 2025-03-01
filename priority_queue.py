import heapq

class PriorityQueue:
    def __init__(self):
        self.queue = []  # List to hold the heap
        self.counter = 0  # Counter to ensure stable ordering in case of same priority

    def enqueue(self, task):
        # We invert the priority to simulate a Max-Heap
        heapq.heappush(self.queue, (-task.priority, self.counter, task))

    def dequeue(self):
        # Pop the highest priority task
        if self.is_empty():
            return None
        return heapq.heappop(self.queue)[-1]

    def is_empty(self):
        return len(self.queue) == 0

    def size(self):
        return len(self.queue)

    def clear(self):
        self.queue = []
