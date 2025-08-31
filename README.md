# Track-List - Personal Task Manager

A modern, responsive to-do list application built with vanilla HTML, CSS, and JavaScript. Track-List helps you stay organized with priority management, due dates, reminders, and a clean, minimalist interface.

## Features

### ✅ Core Functionality
- **Add, Edit, Delete Tasks**: Full CRUD operations for task management
- **Task Completion**: Mark tasks as complete/incomplete with visual feedback
- **Persistent Storage**: Tasks are saved locally and persist between sessions

### 🎯 Priority Management
- **Three Priority Levels**: High, Medium, Low with color-coded indicators
- **Priority Sorting**: Sort tasks by priority level
- **Visual Priority Indicators**: Color-coded left borders on task items

### 📅 Date & Time Features
- **Due Dates**: Set and track task due dates
- **Overdue Detection**: Visual indicators for overdue tasks
- **Smart Date Display**: Shows "Today", "Tomorrow", or formatted dates
- **Reminder System**: Set datetime reminders with notifications

### 🔍 Organization Tools
- **Filter Options**: View All, Pending, or Completed tasks
- **Multiple Sort Options**: Sort by creation date, priority, due date, or alphabetically
- **Task Statistics**: Live counters for total, pending, and completed tasks
- **Search & Filter**: Easy task organization and finding

### 📱 User Experience
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern UI**: Clean interface using grey, white, and black color scheme
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Keyboard Shortcuts**: Efficiency features for power users
- **Dark Mode Support**: Automatic dark mode based on system preferences

### 🔔 Notifications
- **Reminder Alerts**: Browser notifications for scheduled reminders
- **Audio Notifications**: Optional sound alerts for reminders
- **Success/Error Messages**: User feedback for all actions
- **Overdue Warnings**: Automatic detection and notification of overdue tasks

## Technology Stack

- **HTML5**: Semantic markup and accessibility features
- **CSS3**: Modern styling with Flexbox and Grid layouts
- **Vanilla JavaScript**: No frameworks - pure JavaScript for optimal performance
- **Local Storage**: Client-side data persistence
- **Font Awesome**: Icons for enhanced visual appeal

## Installation & Setup

### Prerequisites
- Git installed on your computer
- A GitHub account
- A text editor (VS Code recommended)
- Modern web browser

### Getting Started

1. **Clone or Download**: Get the project files on your local machine
2. **Open in Browser**: Simply open `index.html` in any modern web browser
3. **Start Adding Tasks**: Begin organizing your tasks immediately

### Local Development
```bash
# If using a local server (optional)
python -m http.server 8000
# Or with Node.js
npx serve .
```

## Usage Guide

### Adding Tasks
1. Type your task in the input field
2. Select priority level (Low, Medium, High)
3. Optionally set a due date
4. Optionally set a reminder time
5. Click the + button or press Enter

### Managing Tasks
- **Complete**: Click the checkbox next to any task
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the trash icon to remove a task
- **Filter**: Use filter buttons to view specific task types
- **Sort**: Use the dropdown to change task ordering

### Keyboard Shortcuts
- `Enter`: Add new task (when input is focused)
- `Ctrl/Cmd + Enter`: Quick add task
- `Ctrl/Cmd + E`: Export tasks to JSON file
- `Escape`: Close edit modal

## File Structure

```
track-list/
├── index.html          # Main application file
├── css/
│   └── style.css      # All styling and responsive design
├── js/
│   └── script.js      # Application logic and functionality
├── assets/
│   └── icons/         # Future icon storage
├── README.md          # This documentation
└── .gitignore         # Git ignore rules
```

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Optimized for iOS Safari and Chrome Mobile

## Features in Detail

### Priority System
- **High Priority**: Red indicator, urgent tasks
- **Medium Priority**: Yellow indicator, standard tasks
- **Low Priority**: Green indicator, when-possible tasks

### Date Management
- **Due Date Tracking**: Visual indicators for upcoming deadlines
- **Overdue Detection**: Automatic highlighting of past-due tasks
- **Smart Date Display**: User-friendly date formatting

### Responsive Design
- **Mobile First**: Optimized for touch interfaces
- **Tablet Support**: Adapted layouts for medium screens
- **Desktop Enhancement**: Full feature access on large screens

### Data Persistence
- **Local Storage**: Tasks saved automatically in browser
- **Export/Import**: Backup and restore functionality
- **Cross-Session**: Tasks persist between browser sessions

## Browser Storage Notice

This application uses the browser's Local Storage to save your tasks. Your data is stored locally on your device and is not sent to any external servers.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Categories/Tags for tasks
- [ ] Drag and drop task reordering
- [ ] Advanced recurring task options
- [ ] Task sharing capabilities
- [ ] Subtask functionality
- [ ] Advanced search and filtering
- [ ] Data synchronization across devices
- [ ] Progressive Web App (PWA) features

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues:
1. Check the documentation above
2. Review the code comments in the source files
3. Create an issue in the GitHub repository

---

**Track-List** - Stay organized, stay productive.