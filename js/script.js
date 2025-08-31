class TrackListApp {
    constructor() {
this.initializeElements();
    this.bindEvents();
    this.renderTasks();
    this.updateStats();
    this.setupReminders();
    
    // Show welcome message for first-time users
    if (this.tasks.length === 0) {
        this.showNotification('Welcome to Track-List! Add your first task to get started.', 'success');
    }
}

initializeElements() {
    // Input elements
    this.taskInput = document.getElementById('taskInput');
    this.addBtn = document.getElementById('addTaskBtn');
    this.prioritySelect = document.getElementById('prioritySelect');
    this.dueDateInput = document.getElementById('dueDateInput');
    this.reminderInput = document.getElementById('reminderInput');
    
    // Filter and sort elements
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.sortSelect = document.getElementById('sortSelect');
    
    // Task list elements
    this.tasksList = document.getElementById('tasksList');
    this.emptyState = document.getElementById('emptyState');
    this.clearAllBtn = document.getElementById('clearAllBtn');
    
    // Stats elements
    this.totalTasksEl = document.getElementById('totalTasks');
    this.pendingTasksEl = document.getElementById('pendingTasks');
    this.completedTasksEl = document.getElementById('completedTasks');
    
    // Modal elements
    this.editModal = document.getElementById('editModal');
    this.editTaskInput = document.getElementById('editTaskInput');
    this.editPrioritySelect = document.getElementById('editPrioritySelect');
    this.editDueDateInput = document.getElementById('editDueDateInput');
    this.editReminderInput = document.getElementById('editReminderInput');
    this.saveEditBtn = document.getElementById('saveEditBtn');
    this.cancelEditBtn = document.getElementById('cancelEditBtn');
    this.closeModalBtn = document.querySelector('.close-modal');
    
    // Notification container
    this.notificationContainer = document.getElementById('notificationContainer');
    
    // Task template
    this.taskTemplate = document.getElementById('taskTemplate');
}

bindEvents() {
    // Add task events
    this.addBtn.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.addTask();
    });
    
    // Filter events
    this.filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            this.setFilter(e.target.dataset.filter);
        });
    });
    
    // Sort event
    this.sortSelect.addEventListener('change', (e) => {
        this.setSortOrder(e.target.value);
    });
    
    // Clear all event
    this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());
    
    // Modal events
    this.saveEditBtn.addEventListener('click', () => this.saveEditedTask());
    this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
    this.closeModalBtn.addEventListener('click', () => this.closeEditModal());
    
    // Close modal on outside click
    this.editModal.addEventListener('click', (e) => {
        if (e.target === this.editModal) this.closeEditModal();
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.editModal.classList.contains('show')) {
            this.closeEditModal();
        }
    });
}

generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

addTask() {
    const text = this.taskInput.value.trim();
    if (!text) {
        this.showNotification('Please enter a task description.', 'warning');
        return;
    }

    const task = {
        id: this.generateId(),
        text: text,
        priority: this.prioritySelect.value,
        dueDate: this.dueDateInput.value,
        reminder: this.reminderInput.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    this.tasks.unshift(task);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
    this.setupReminders();
    
    // Clear inputs
    this.taskInput.value = '';
    this.dueDateInput.value = '';
    this.reminderInput.value = '';
    this.prioritySelect.value = 'medium';
    
    this.showNotification('Task added successfully!', 'success');
    this.taskInput.focus();
}

deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex > -1) {
        const task = this.tasks[taskIndex];
        this.tasks.splice(taskIndex, 1);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.setupReminders();
        
        // Clear reminder timeout if exists
        if (this.reminderTimeouts.has(taskId)) {
            clearTimeout(this.reminderTimeouts.get(taskId));
            this.reminderTimeouts.delete(taskId);
        }
        
        this.showNotification(`Task "${task.text}" deleted.`, 'success');
    }
}

toggleTaskComplete(taskId) {
    const task = this.tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        const status = task.completed ? 'completed' : 'reopened';
        this.showNotification(`Task ${status}!`, 'success');
    }
}

editTask(taskId) {
    const task = this.tasks.find(task => task.id === taskId);
    if (task) {
        this.editingTaskId = taskId;
        this.editTaskInput.value = task.text;
        this.editPrioritySelect.value = task.priority;
        this.editDueDateInput.value = task.dueDate;
        this.editReminderInput.value = task.reminder;
        this.showEditModal();
    }
}

saveEditedTask() {
    if (!this.editingTaskId) return;
    
    const text = this.editTaskInput.value.trim();
    if (!text) {
        this.showNotification('Task description cannot be empty.', 'warning');
        return;
    }

    const task = this.tasks.find(task => task.id === this.editingTaskId);
    if (task) {
        task.text = text;
        task.priority = this.editPrioritySelect.value;
        task.dueDate = this.editDueDateInput.value;
        task.reminder = this.editReminderInput.value;
        
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.setupReminders();
        this.closeEditModal();
        
        this.showNotification('Task updated successfully!', 'success');
    }
}

showEditModal() {
    this.editModal.classList.add('show');
    this.editTaskInput.focus();
}

closeEditModal() {
    this.editModal.classList.remove('show');
    this.editingTaskId = null;
}

setFilter(filter) {
    this.currentFilter = filter;
    
    // Update active filter button
    this.filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    this.renderTasks();
}

setSortOrder(sortOrder) {
    this.currentSort = sortOrder;
    this.renderTasks();
}

getFilteredTasks() {
    let filteredTasks = [...this.tasks];
    
    // Apply filter
    switch (this.currentFilter) {
        case 'pending':
            filteredTasks = filteredTasks.filter(task => !task.completed);
            break;
        case 'completed':
            filteredTasks = filteredTasks.filter(task => task.completed);
            break;
        default:
            // 'all' - no filtering needed
            break;
    }
    
    // Apply sort
    switch (this.currentSort) {
        case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
            break;
        case 'dueDate':
            filteredTasks.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
            break;
        case 'alphabetical':
            filteredTasks.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
            break;
        default:
            // 'created' - keep original order (newest first)
            filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }
    
    return filteredTasks;
}

renderTasks() {
    const filteredTasks = this.getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        this.tasksList.innerHTML = '';
        this.emptyState.style.display = 'block';
        return;
    }
    
    this.emptyState.style.display = 'none';
    
    this.tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
    
    // Bind events to newly created task elements
    this.bindTaskEvents();
}

createTaskHTML(task) {
    const dueDate = task.dueDate ? this.formatDate(task.dueDate) : '';
    const reminder = task.reminder ? this.formatDateTime(task.reminder) : '';
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    
    return `
        <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" 
             data-priority="${task.priority}" 
             data-status="${task.completed ? 'completed' : 'pending'}"
             data-task-id="${task.id}">
            <div class="task-content">
                <div class="task-checkbox-container">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="custom-checkbox"></span>
                </div>
                
                <div class="task-details">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="task-priority ${task.priority}">
                            <i class="fas fa-flag"></i> ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        ${dueDate ? `<span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                            <i class="fas fa-calendar"></i> ${dueDate}
                        </span>` : ''}
                        ${reminder ? `<span class="task-reminder">
                            <i class="fas fa-bell"></i> ${reminder}
                        </span>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="task-actions">
                <button class="edit-btn" title="Edit Task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="Delete Task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

bindTaskEvents() {
    // Checkbox events
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = e.target.closest('.task-item').dataset.taskId;
            this.toggleTaskComplete(taskId);
        });
    });
    
    // Edit button events
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = e.target.closest('.task-item').dataset.taskId;
            this.editTask(taskId);
        });
    });
    
    // Delete button events
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = e.target.closest('.task-item').dataset.taskId;
            const task = this.tasks.find(t => t.id === taskId);
            if (confirm(`Are you sure you want to delete "${task.text}"?`)) {
                this.deleteTask(taskId);
            }
        });
    });
}

updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    this.totalTasksEl.textContent = total;
    this.pendingTasksEl.textContent = pending;
    this.completedTasksEl.textContent = completed;
}

clearAllTasks() {
    if (this.tasks.length === 0) {
        this.showNotification('No tasks to clear.', 'warning');
        return;
    }
    
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
        this.tasks = [];
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.clearAllReminders();
        this.showNotification('All tasks cleared.', 'success');
    }
}

setupReminders() {
    // Clear existing timeouts
    this.clearAllReminders();
    
    // Set up new reminders
    this.tasks.forEach(task => {
        if (task.reminder && !task.completed) {
            this.setReminder(task);
        }
    });
}

setReminder(task) {
    const reminderTime = new Date(task.reminder);
    const now = new Date();
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
        const timeoutId = setTimeout(() => {
            this.showReminderNotification(task);
        }, timeUntilReminder);
        
        this.reminderTimeouts.set(task.id, timeoutId);
    }
}

clearAllReminders() {
    this.reminderTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.reminderTimeouts.clear();
}

showReminderNotification(task) {
    const message = `Reminder: ${task.text}`;
    this.showNotification(message, 'warning', 8000);
    
    // Play notification sound (if supported)
    this.playNotificationSound();
    
    // Remove the reminder timeout
    this.reminderTimeouts.delete(task.id);
}

playNotificationSound() {
    try {
        // Create a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('Audio notification not supported');
    }
}

showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = this.getNotificationIcon(type);
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    this.notificationContainer.appendChild(notification);
    
    // Auto remove notification
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, duration);
}

getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-triangle';
        case 'warning': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }
}

formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem('trackListTasks') || '[]');
        return savedTasks;
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

saveTasks() {
    try {
        localStorage.setItem('trackListTasks', JSON.stringify(this.tasks));
    } catch (error) {
        console.error('Error saving tasks:', error);
        this.showNotification('Error saving tasks to local storage.', 'error');
    }
}

exportTasks() {
    const dataStr = JSON.stringify(this.tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `track-list-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    this.showNotification('Tasks exported successfully!', 'success');
}

importTasks(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedTasks = JSON.parse(e.target.result);
            if (Array.isArray(importedTasks)) {
                this.tasks = importedTasks;
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
                this.setupReminders();
                this.showNotification('Tasks imported successfully!', 'success');
            } else {
                throw new Error('Invalid file format');
            }
        } catch (error) {
            this.showNotification('Error importing tasks. Please check the file format.', 'error');
        }
    };
    reader.readAsText(file);
}

// Check for overdue tasks
checkOverdueTasks() {
    const now = new Date();
    const overdueTasks = this.tasks.filter(task => 
        task.dueDate && 
        new Date(task.dueDate) < now && 
        !task.completed
    );
    
    if (overdueTasks.length > 0) {
        const message = `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}!`;
        this.showNotification(message, 'warning', 6000);
    }
}

// Initialize app
init() {
    // Check for overdue tasks on load
    this.checkOverdueTasks();
    
    // Set up periodic checks for overdue tasks (every 5 minutes)
    setInterval(() => {
        this.checkOverdueTasks();
    }, 5 * 60 * 1000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to add task
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (document.activeElement === this.taskInput) {
                this.addTask();
            }
        }
        
        // Ctrl/Cmd + E to export tasks
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            this.exportTasks();
        }
    });
    
    // Set minimum date to today for date inputs
    const today = new Date().toISOString().split('T')[0];
    this.dueDateInput.min = today;
    
    // Set minimum datetime to now for reminder inputs
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.reminderInput.min = now.toISOString().slice(0, 16);
}