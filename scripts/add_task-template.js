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

function templateContact(initial, name, index) {
  return `
    <option value="${index}" data-name="${name}">
      <div class="contact-initial">${initial}</div> <div class="contact-name">${name}</div>
    </option>
  `;
}