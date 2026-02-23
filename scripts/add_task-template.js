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