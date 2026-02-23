function templateAddTaskForm() {
    return `
        <div>
            <div class="add-task-content">
                <div class="left-side">
                    <div class="section">
                        <div class="headline">Title<span class="red-star">*</span></div>
                        <input type="text" class="task-title" id="task-title" placeholder="Enter a title" />
                        <span id="title-error-message" class="error-text" style="display: none"></span>
                    </div>
                    <div class="section">
                        <div class="headline">Description</div>
                        <textarea class="task-description" id="task-description" placeholder="Enter a description"></textarea>
                    </div>
                    <div class="section">
                        <div class="headline">Due Date<span class="red-star">*</span></div>
                        <div class="date-wrapper">
                            <input type="date" class="task-due-date" id="task-due-date" />
                            <img src="../assets/img/addtask/calender.svg" class="calendar-icon" id="calendar-icon" alt="Kalender" />
                            <span id="date-error-message" class="error-text" style="display: none"></span>
                        </div>
                    </div>
                </div>
                <div class="add-task-separator"></div>
                <div class="right-side">
                    <div class="priority-content">
                        <div class="priority">Priority</div>
                        <div class="priority-selection" id="priority-selection">
                            <button type="button" value="urgent" class="priority__button">Urgent <img src="../assets/img/addtask/urgent.svg" /></button>
                            <button type="button" value="medium" class="priority__button medium active">Medium <img src="../assets/img/addtask/mediumselected.svg" /></button>
                            <button type="button" value="low" class="priority__button">Low <img src="../assets/img/addtask/low.svg" /></button>
                        </div>
                    </div>
                    <div class="section">
                        <div class="headline">Assigned to</div>
                        <div class="dropdown" id="dropdown-container">
                            <div class="dropdown-wrapper">
                                <input type="text" class="contact-search-input" id="contact-search-input" placeholder="Select contacts to assign" />
                                <div class="dropdown-arrow" id="dropdown-arrow"></div>
                            </div>
                            <ul class="dropdown-list" id="dropdown-list" style="display: none"></ul>
                        </div>
                        <div class="selected-contacts" id="selected-contacts"></div>
                    </div>
                    <div class="section">
                        <div class="headline">Category<span class="red-star">*</span></div>
                        <div class="category-wrapper">
                            <select class="task-category" id="task-category">
                                <option value="" disabled selected>Select category</option>
                                <option value="technical-task">Technical Task</option>
                                <option value="user-story">User Story</option>
                            </select>
                            <div class="category-arrow"></div>
                        </div>
                        <span id="category-error-message" class="error-text" style="display: none"></span>
                    </div>
                    <div class="section">
                        <div class="headline">Subtasks</div>
                        <div class="subtask-wrapper">
                            <input type="text" class="subtask" id="task-subtasks" placeholder="Add new subtask" />
                            <div class="subtask-actions">
                                <span class="cancel" id="subtask-cancel"><img src="../assets/img/addtask/cross.svg" /></span>
                                <span class="confirm" id="subtask-confirm"><img src="../assets/img/addtask/checkdark.svg" /></span>
                            </div>
                        </div>
                        <div class="added-subtask" id="added-subtask"></div>
                    </div>
                </div>
            </div>
            <div class="button-wrapper">
                <div><span class="red-star">*</span>This field is required</div>
                <div class="add-task-button">
                    <button type="button" id="clear__button" class="clear__button">Clear <span class="icon"></span></button>
                    <button type="button" id="create-task__button" class="create-task__button">Create Task <img src="../assets/img/addtask/check.svg" /></button>
                </div>
            </div>
        </div>
    `;
}

function templateAddSubtask(subtaskText) {
    return `
        <div class="subtask-item">
            <span class="subtask-text">${subtaskText}</span>
            <div class="subtask-item-actions">
                <button type="button" class="edit-btn">
                    <img src="../assets/img/addtask/edit.svg" alt="Edit">
                </button>
                <button type="button" class="delete-btn">
                    <img src="../assets/img/addtask/delete.svg" alt="Delete">
                </button>
            </div>
        </div>
    `;
}

function templateContact(initial, name, color) {
    return `
    <div class="contact-item-container">
      <div class="assign-to-initial" style="background-color: ${color} !important">
        ${initial}
      </div>
      <div class="contact-info">
        <span>${name}</span>
      </div>
      <div class="selection-checkmark"></div>
    </div>
  `;
}