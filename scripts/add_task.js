let task = []

function selectPriority(priority) {
    task.priority = priority.value 
    document.querySelectorAll('.priority').forEach(el => el.classList.remove('selected'))
    priority.classList.add('selected')
}