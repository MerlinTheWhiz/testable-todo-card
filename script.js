const viewMode = document.querySelector('[data-testid="test-todo-view-mode"]');
const titleEl = document.querySelector('[data-testid="test-todo-title"]');
const descEl = document.querySelector('[data-testid="test-todo-description"]');

const priorityEl = document.querySelector('[data-testid="test-todo-priority"]');

const statusEl = document.querySelector('[data-testid="test-todo-status"]');
const statusSelect = document.querySelector(
  '[data-testid="test-todo-status-control"]'
);

const checkboxEl = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]'
);

const dueDateTextEl = document.querySelector(
  '[data-testid="test-todo-due-date"] span'
);

const timeEl = document.querySelector(
  '[data-testid="test-todo-time-remaining"]'
);
const timeTextEl = timeEl.querySelector("span");

const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector(
  '[data-testid="test-todo-delete-button"]'
);

const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');

const editTitleInput = document.querySelector(
  '[data-testid="test-todo-edit-title-input"]'
);
const editDescInput = document.querySelector(
  '[data-testid="test-todo-edit-description-input"]'
);
const editPrioritySelect = document.querySelector(
  '[data-testid="test-todo-edit-priority-select"]'
);
const editDueDateInput = document.querySelector(
  '[data-testid="test-todo-edit-due-date-input"]'
);

const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelBtn = document.querySelector(
  '[data-testid="test-todo-cancel-button"]'
);

// ---------------- STATE ----------------
const state = {
  title: titleEl.textContent,
  description: descEl.textContent,
  status: statusEl.textContent || "In Progress",
  priority: "Medium",
  dueDate: "2026-04-16T18:00:00Z",

  isEditing: false,
  draft: null,
};

// ---------------- HELPERS ----------------
function getPriorityClass(priority) {
  if (priority === "Low") return "priority-low";
  if (priority === "Medium") return "priority-medium";
  return "priority-high";
}

function updatePriorityUI() {
  const priorityClass = getPriorityClass(state.priority);

  priorityEl.classList.remove(
    "priority-low",
    "priority-medium",
    "priority-high"
  );
  priorityEl.classList.add(priorityClass);

  Array.from(priorityEl.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.remove();
    }
  });

  const indicator = priorityEl.querySelector(
    '[data-testid="test-todo-priority-indicator"]'
  );

  if (indicator) {
    priorityEl.innerHTML = "";
    priorityEl.appendChild(indicator);
    priorityEl.appendChild(document.createTextNode(` ${state.priority}`));
  }
}

// ---------------- RENDER ----------------
function render() {
  checkboxEl.checked = state.status === "Done";
  titleEl.textContent = state.title;
  descEl.textContent = state.description;

  // Due date UI
  dueDateTextEl.textContent = new Date(state.dueDate).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  statusEl.textContent = state.status;
  
  statusSelect.value = state.status;


  // STATUS UI
  if (state.status === "Done") {
    titleEl.style.textDecoration = "line-through";
    statusEl.style.color = "var(--complete)";
    statusEl.style.fontWeight = "600";
  } else {
    titleEl.style.textDecoration = "none";
    statusEl.style.color = "var(--accent)";
    statusEl.style.fontWeight = "600";
  }

  // PRIORITY
  updatePriorityUI();

  // TIME
  updateTimeRemaining();

  // EDIT MODE TOGGLE
  if (state.isEditing) {
    viewMode.hidden = true;
    editForm.hidden = false;

    editTitleInput.value = state.draft.title;
    editDescInput.value = state.draft.description;
    editPrioritySelect.value = state.draft.priority;

    editDueDateInput.value = state.draft.dueDate || "";
  } else {
    viewMode.hidden = false;
    editForm.hidden = true;
  }
}

render();

// ---------------- TIME ----------------
function updateTimeRemaining() {
  if (state.status === "Done") {
    timeTextEl.textContent = "Completed";
    return;
  }

  const due = new Date(state.dueDate);
  const now = new Date();
  const diff = due - now;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  let text = "";

  if (diff < 0) {
    text = `Overdue by ${Math.abs(hours)} hour(s)`;
  } else if (minutes < 1) {
    text = "Due now!";
  } else if (hours < 24) {
    text = `Due in ${hours} hour(s)`;
  } else if (days === 1) {
    text = "Due tomorrow";
  } else {
    text = `Due in ${days} days`;
  }

  timeTextEl.textContent = text;
}

// ---------------- EVENTS ----------------
checkboxEl.addEventListener("change", () => {
  state.status = checkboxEl.checked ? "Done" : "Pending";
  render();
});

statusSelect.addEventListener("change", () => {
  state.status = statusSelect.value;
  render();
});

editBtn.addEventListener("click", () => {
  state.isEditing = true;

  state.draft = {
    title: state.title,
    description: state.description,
    priority: state.priority,
    dueDate: state.dueDate,
  };

  render();
});

editTitleInput.addEventListener("input", () => {
  state.draft.title = editTitleInput.value;
});

editDescInput.addEventListener("input", () => {
  state.draft.description = editDescInput.value;
});

editPrioritySelect.addEventListener("change", () => {
  state.draft.priority = editPrioritySelect.value;
});

editDueDateInput.addEventListener("change", () => {
  state.draft.dueDate = editDueDateInput.value;
});

saveBtn.addEventListener("click", () => {
  state.title = state.draft.title;
  state.description = state.draft.description;
  state.priority = state.draft.priority;
  state.dueDate = new Date(state.draft.dueDate).toISOString();

  state.isEditing = false;
  state.draft = null;

  render();
});

cancelBtn.addEventListener("click", () => {
  state.isEditing = false;
  state.draft = null;

  render();
});

deleteBtn.addEventListener("click", () => {
  alert("Delete clicked");
});