const viewMode = document.querySelector('[data-testid="test-todo-view-mode"]');
const titleEl = document.querySelector('[data-testid="test-todo-title"]');
const expandBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
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

const overdueIndicator = document.querySelector(
  '[data-testid="test-todo-overdue-indicator"]'
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

// App state definition
const state = {
  title: titleEl.textContent.trim().replace(/\s+/g, ' '),
  description: descEl.textContent.trim().replace(/\s+/g, ' '),
  status: statusEl.textContent || "In Progress",
  priority: "Medium",
  dueDate: "2026-04-16T18:00:00Z",
  isExpanded: false,
  isEditing: false,
  draft: null,
};

// Helper functions
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

function updateExpandUI() {
  const shouldCollapse = state.description.length > 120;

  // Hide expand button if the text is short
  if (!shouldCollapse) {
    expandBtn.hidden = true;
    collapsibleSection.classList.remove("is-collapsed");
    return;
  }

  expandBtn.hidden = false;

  if (state.isExpanded) {
    collapsibleSection.classList.remove("is-collapsed");
    expandBtn.textContent = "Collapse";
    expandBtn.setAttribute("aria-expanded", "true");
  } else {
    collapsibleSection.classList.add("is-collapsed");
    expandBtn.textContent = "Expand";
    expandBtn.setAttribute("aria-expanded", "false");
  }
}

// Main render loop to sync the DOM with state
function render() {
  checkboxEl.checked = state.status === "Done";
  titleEl.textContent = state.title;
  descEl.textContent = state.description;

  // Format and set due date
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


  // Apply corresponding styles for the current status
  if (state.status === "Done") {
    titleEl.style.textDecoration = "line-through";
    statusEl.style.color = "var(--complete)";
    statusEl.style.fontWeight = "600";
  } else if (state.status === "In Progress") {
    titleEl.style.textDecoration = "none";
    statusEl.style.color = "var(--warning)";
    statusEl.style.fontWeight = "600";
  } else {
    titleEl.style.textDecoration = "none";
    statusEl.style.color = "var(--text)";
    statusEl.style.fontWeight = "600";
  }
   updateExpandUI();

  // Refresh priority display
  updatePriorityUI();

  // Refresh time remaining logic
  updateTimeRemaining();

  // Switch between view and edit modes
  if (state.isEditing) {
    const wasHidden = viewMode.hidden === false;
    viewMode.hidden = true;
    editForm.hidden = false;

    editTitleInput.value = state.draft.title;
    editDescInput.value = state.draft.description;
    editPrioritySelect.value = state.draft.priority;
    editDueDateInput.value = state.draft.dueDate || "";
    
    if (wasHidden) {
      editTitleInput.focus();
    }
  } else {
    const wasEditing = editForm.hidden === false;
    viewMode.hidden = false;
    editForm.hidden = true;
    
    if (wasEditing) {
      editBtn.focus();
    }
  }
}

render();


function updateTimeRemaining() {
  if (state.status === "Done") {
    timeTextEl.textContent = "Completed";
    timeEl.classList.remove("overdue-text");
    if (overdueIndicator) overdueIndicator.hidden = true;
    return;
  }

  const due = new Date(state.dueDate);
  const now = new Date();
  const diff = due - now;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  let text = "";
  const isOverdue = diff < 0;

  if (isOverdue) {
    timeEl.classList.add("overdue-text");
    if (overdueIndicator) overdueIndicator.hidden = false;
    
    const absMinutes = Math.abs(minutes);
    const absHours = Math.abs(hours);
    const absDays = Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24)));
    
    if (absDays >= 1) {
      text = `Overdue by ${absDays} day(s)`;
    } else if (absHours >= 1) {
      text = `Overdue by ${absHours} hour(s)`;
    } else {
      text = `Overdue by ${absMinutes} minute(s)`;
    }
  } else {
    timeEl.classList.remove("overdue-text");
    if (overdueIndicator) overdueIndicator.hidden = true;
    
    if (minutes < 1) {
      text = "Due now!";
    } else if (hours < 1) {
      text = `Due in ${minutes} minute(s)`;
    } else if (hours < 24) {
      text = `Due in ${hours} hour(s)`;
    } else if (days === 1) {
      text = "Due tomorrow";
    } else {
      text = `Due in ${days} days`;
    }
  }

  timeTextEl.textContent = text;
}

// Update time every 30 seconds
setInterval(updateTimeRemaining, 30000);

// Event listeners
checkboxEl.addEventListener("change", () => {
  state.status = checkboxEl.checked ? "Done" : "Pending";
  render();
});

statusSelect.addEventListener("change", () => {
  state.status = statusSelect.value;
  render();
});

expandBtn.addEventListener("click", () => {
  state.isExpanded = !state.isExpanded;
  updateExpandUI();
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