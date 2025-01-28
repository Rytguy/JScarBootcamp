class TM {
    constructor() {
        this.t = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    addT(tl, desc, pr, dDate) {
        const newT = {
            id: Date.now().toString(),
            title: tl,
            description: desc,
            priority: pr,
            dueDate: dDate,
            completed: false,
        };
        this.t.push(newT);
        this.saveT();
        return newT;
    }

    delT(tId) {
        this.t = this.t.filter(task => task.id !== tId);
        this.saveT();
    }

    updT(tId, upd) {
        const task = this.t.find(task => task.id === tId);
        if (task) {
            Object.assign(task, upd);
            this.saveT();
        }
    }

    toggleT(tId) {
        const task = this.t.find(task => task.id === tId);
        if (task) {
            task.completed = !task.completed;
            this.saveT();
        }
    }

    filterT(f) {
        switch (f) {
            case 'completed':
                return this.t.filter(task => task.completed);
            case 'incomplete':
                return this.t.filter(task => !task.completed);
            default:
                return this.t;
        }
    }

    sortT(by) {
        if (by === 'priority') {
            const prOrder = { high: 1, medium: 2, low: 3 };
            return [...this.t].sort((a, b) => prOrder[a.priority] - prOrder[b.priority]);
        } else if (by === 'dueDate') {
            return [...this.t].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }
        return this.t;
    }

    searchT(q) {
        return this.t.filter(task =>
            task.title.toLowerCase().includes(q.toLowerCase()) ||
            task.description.toLowerCase().includes(q.toLowerCase())
        );
    }

    saveT() {
        localStorage.setItem('tasks', JSON.stringify(this.t));
    }
}

// DOM Manipulation
const tm = new TM();
const tf = document.getElementById('taskForm');
const tl = document.getElementById('taskList');
const fs = document.getElementById('filterTasks');
const ss = document.getElementById('sortTasks');
const si = document.getElementById('searchTasks');

function renderT(ts) {
    tl.innerHTML = '';
    ts.forEach(task => {
        const tItem = document.createElement('div');
        tItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;

        tItem.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Priority: ${task.priority}</p>
                <p>Due Date: ${task.dueDate || 'No due date'}</p>
            </div>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        tItem.querySelector('.complete-btn').addEventListener('click', () => {
            tm.toggleT(task.id);
            applyFandR();
        });

        tItem.querySelector('.delete-btn').addEventListener('click', () => {
            tm.delT(task.id);
            applyFandR();
        });

        tl.appendChild(tItem);
    });
}

function applyFandR() {
    const f = fs.value;
    const s = ss.value;
    const q = si.value;

    let ts = tm.filterT(f);
    ts = tm.sortT(s);
    if (q) {
        ts = tm.searchT(q);
    }

    renderT(ts);
}

// Event Listeners
tf.addEventListener('submit', event => {
    event.preventDefault();

    const tl = document.getElementById('taskTitle').value;
    const desc = document.getElementById('taskDescription').value;
    const pr = document.getElementById('taskPriority').value;
    const dDate = document.getElementById('taskDueDate').value;

    if (tl.trim() === '') {
        alert('Task title is required');
        return;
    }

    tm.addT(tl, desc, pr, dDate);
    tf.reset();
    applyFandR();
});

fs.addEventListener('change', applyFandR);
ss.addEventListener('change', applyFandR);
si.addEventListener('input', applyFandR);

// Initial