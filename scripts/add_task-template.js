function templateAddSubtask(subtaskText) {
    return `
        <div class="subtask-item">
            <span class="subtask-text" ondblclick="editSubtask(this)">- ${subtaskText}</span>
            <div class="subtask-item-actions">
                <span class="edit" onclick="editSubtask(this)"><img src="../assets/img/addtask/edit.svg" alt="Edit"></span>
                <span class="delete" onclick="deleteSubtask(this)"><img src="../assets/img/addtask/delete.svg" alt="Delete"></span>
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