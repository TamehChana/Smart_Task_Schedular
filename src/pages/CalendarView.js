import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar as CalendarIcon,
  Search
} from 'lucide-react';
import { useNotifications } from '../components/NotificationProvider';

const CalendarView = ({ user, onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { success } = useNotifications();

  // Mock tasks data
  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        title: 'Complete React project documentation',
        description: 'Write comprehensive documentation for the React task scheduler project',
        priority: 'high',
        status: 'pending',
        category: 'Work',
        assignee: 'John Doe',
        dueDate: '2024-01-15',
        createdAt: '2024-01-10'
      },
      {
        id: 2,
        title: 'Review pull requests',
        description: 'Review and approve pending pull requests in the team repository',
        priority: 'medium',
        status: 'in-progress',
        category: 'Work',
        assignee: 'Jane Smith',
        dueDate: '2024-01-12',
        createdAt: '2024-01-08'
      },
      {
        id: 3,
        title: 'Plan team meeting agenda',
        description: 'Prepare agenda and materials for the weekly team meeting',
        priority: 'low',
        status: 'completed',
        category: 'Work',
        assignee: 'Mike Johnson',
        dueDate: '2024-01-10',
        createdAt: '2024-01-05'
      },
      {
        id: 4,
        title: 'Gym workout',
        description: 'Complete strength training routine',
        priority: 'medium',
        status: 'pending',
        category: 'Health',
        assignee: 'John Doe',
        dueDate: '2024-01-16',
        createdAt: '2024-01-10'
      }
    ];
    setTasks(mockTasks);
  }, []);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'Work',
    assignee: '',
    dueDate: ''
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const tasksForDate = (date) => {
    return filteredTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.dueDate) {
      return;
    }

    const task = {
      id: Date.now(),
      ...newTask,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'Work',
      assignee: '',
      dueDate: ''
    });
    setShowAddModal(false);
    success('Task Added', 'New task has been scheduled successfully');
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTasks = tasksForDate(date);
      if (dayTasks.length > 0) {
        return (
          <div className="mt-1">
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">{dayTasks.length}</div>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayTasks = tasksForDate(date);
      if (dayTasks.length > 0) {
        return 'bg-blue-50 hover:bg-blue-100';
      }
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar View</h1>
          <p className="text-gray-600">
            Schedule and visualize your tasks across time
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Health">Health</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Task</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="w-full border-0"
                navigationLabel={({ date }) => {
                  const month = date.toLocaleString('default', { month: 'long' });
                  const year = date.getFullYear();
                  return `${month} ${year}`;
                }}
                prevLabel={<ChevronLeft className="w-5 h-5" />}
                nextLabel={<ChevronRight className="w-5 h-5" />}
              />
            </div>
          </motion.div>

          {/* Sidebar - Tasks for Selected Date */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Selected Date Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                {tasksForDate(selectedDate).length} task{tasksForDate(selectedDate).length !== 1 ? 's' : ''} scheduled
              </div>

              {tasksForDate(selectedDate).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No tasks scheduled for this date</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Schedule a task
                  </motion.button>
                </div>
              )}
            </div>

            {/* Tasks List for Selected Date */}
            {tasksForDate(selectedDate).length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h3>
                <div className="space-y-3">
                  {tasksForDate(selectedDate).map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {getStatusIcon(task.status)}
                              <span className="ml-1">{task.status}</span>
                            </span>
                            <span className="text-xs text-gray-500">{task.category}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Tasks</span>
                  <span className="font-semibold text-gray-900">{filteredTasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {filteredTasks.filter(t => t.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {filteredTasks.filter(t => t.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">
                    {filteredTasks.filter(t => t.status === 'in-progress').length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule New Task</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Study">Study</option>
                    <option value="Health">Health</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Assignee (optional)"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTask}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule Task
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;
