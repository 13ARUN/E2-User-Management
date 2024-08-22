


function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.opacity = '1';
        }, 500); 
    }, 3000); 
}



const sidebar = document.querySelector('.sidebar');
const logo = document.querySelector('.logo_content');

logo.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});


document.addEventListener('DOMContentLoaded', renderUsers);
document.addEventListener('DOMContentLoaded', renderGroups);
document.addEventListener('DOMContentLoaded', () => {
    renderRoles();
    renderRoleAssignments();

    // const searchInput = document.getElementById('searchRole');
    // searchInput.addEventListener('input', handleSearch);
});

document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll('.nav_list a');
    const contentSections = document.querySelectorAll('.home_content');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            sidebarLinks.forEach(link => link.classList.remove('selected'));
            contentSections.forEach(section => section.style.display = 'none');

            document.querySelector(this.getAttribute('href')).style.display = 'flex';
            this.classList.add('selected');
        });

        
    });

    contentSections.forEach((section, index) => {
        section.style.display = index === 0 ? 'flex' : 'none';
    });
});



function getUsersFromStorage() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsersToStorage(users) {
    localStorage.setItem('users', JSON.stringify(users));
}


//* user js

const createUserModal = document.querySelector('.addUserModal');
const createUserBtn = document.querySelector('#addUser');
const closeBtn = document.querySelector('#closeAddUserModal');
const submitBtn = document.querySelector('#submitAddUserModal');

const userNameInput = document.querySelector('#userName');
const emailInput = document.querySelector('#email');
const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');

const updateUserModal = document.querySelector('.updateUserModal');
const updateUserForm = document.querySelector('#updateUserForm');
const updateUsernameInput = document.querySelector('#updateUsername');
const updateEmailInput = document.querySelector('#updateEmail');
const updateFirstNameInput = document.querySelector('#updateFirstName');
const updateLastNameInput = document.querySelector('#updateLastName');
const cancelEditBtn = document.querySelector('#cancelEdit');

createUserBtn.addEventListener('click', () => toggleModal(createUserModal, 'flex'));
closeBtn.addEventListener('click', () => toggleModal(createUserModal, 'none'));
submitBtn.addEventListener('click', AddUser);
cancelEditBtn.addEventListener('click', () => toggleModal(updateUserModal, 'none'));


function toggleModal(modal, displayStyle) {
    modal.style.display = displayStyle;
}

function formatInput(input) {
    return input.trim().replace(/\s+/g, ' ');
}

function generateUserId() {
    const users = getUsersFromStorage();
    return users.length ? users[users.length - 1].id + 1 : 1;
}


function AddUser() {
    const user = {
        id: generateUserId(),
        userName: formatInput(userNameInput.value),
        email: formatInput(emailInput.value),
        firstName: formatInput(firstNameInput.value),
        lastName: formatInput(lastNameInput.value),
    };

    const users = getUsersFromStorage();
    users.push(user);
    saveUsersToStorage(users);

    clearInputFields([userNameInput, emailInput, firstNameInput, lastNameInput]);

    renderUsers();
    toggleModal(createUserModal, 'none');
    showNotification('User created successfully!');
}

function clearInputFields(inputs) {
    inputs.forEach(input => input.value = '');
}

function renderUsers() {
    const usersTableBody = document.querySelector('#usersTable tbody');
    const users = getUsersFromStorage();

    usersTableBody.innerHTML = '';

    if (users.length === 0) {
        usersTableBody.innerHTML = `<tr><td colspan="6" class="no-users">No users</td></tr>`;
    } else {
        users.forEach(user => {
            const row = createUserRow(user);
            usersTableBody.appendChild(row);
        });
    }
}

function createUserRow(user) {
    const formattedUserId = `US${String(user.id).padStart(3, '0')}`;
    const row = document.createElement('tr');
    row.id = `UserRow-${user.id}`;
    row.innerHTML = `
        <td class="userId-${user.id}">${formattedUserId}</td>
        <td class="userName-${user.id}">${user.userName}</td>
        <td class="userEmail-${user.id}">${user.email}</td>
        <td class="userFname-${user.id}">${user.firstName}</td>
        <td class="userLname-${user.id}">${user.lastName}</td>
        <td class="actions" id="userActions-${user.id}">
            <button title="edit" class="editUser"><i class="fa-solid fa-pen-to-square"></i> Edit User</button>
            <button title="delete" class="deleteUser"><i class="fa-solid fa-trash"></i> Delete User</button>
        </td>
    `;

    row.querySelector('.editUser').addEventListener('click', () => editUser(user.id));
    row.querySelector('.deleteUser').addEventListener('click', () => deleteUser(user.id));

    return row;
}

function deleteUser(userId) {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete this user?");

    if (confirmed) {
        // If confirmed, proceed with deletion
        const users = getUsersFromStorage();
        const updatedUsers = users.filter(user => user.id !== userId);
        saveUsersToStorage(updatedUsers);
        renderUsers();
        showNotification('User deleted successfully!');
    } else {
        // If canceled, do nothing
        console.log("User deletion canceled");
    }
}

function editUser(userId) {
    const users = getUsersFromStorage();
    const user = users.find(u => u.id === userId);

    updateUsernameInput.value = user.userName;
    updateEmailInput.value = user.email;
    updateFirstNameInput.value = user.firstName;
    updateLastNameInput.value = user.lastName;

    toggleModal(updateUserModal, 'flex');

    updateUserForm.onsubmit = function (event) {
        event.preventDefault();
        updateUser(userId);
    };
}

function updateUser(userId) {
    const users = getUsersFromStorage();
    const user = users.find(u => u.id === userId);

    user.userName = formatInput(updateUsernameInput.value);
    user.email = formatInput(updateEmailInput.value);
    user.firstName = formatInput(updateFirstNameInput.value);
    user.lastName = formatInput(updateLastNameInput.value);

    saveUsersToStorage(users);

    toggleModal(updateUserModal, 'none');
    updateUserForm.reset();
    renderUsers();
    showNotification('User updated successfully!');
}

//* group js


const createGroupModal = document.querySelector('.createGroupModal');
const createGroupBtn = document.querySelector('#createGroup');
const closeCreateGroupModalBtn = document.querySelector('#closeCreateGroupModal');
const submitCreateGroupModalBtn = document.querySelector('#submitCreateGroupModal');
const groupNameInput = document.querySelector('#groupName');

const addUserToGroupModal = document.querySelector('.addUserToGroupModal');
const usersSelect = document.querySelector('#usersSelect');
const addUsersToGroupForm = document.querySelector('#addUsersToGroupForm');
const addUserSubmitBtn = document.querySelector('#addUsersToGroupForm button[type="submit"]');
const closeAddUserBtn = document.querySelector('#closeAddUser');

const removeUserFromGroupModal = document.querySelector('.removeUserFromGroup');
const userSelect = document.querySelector('#usersSelectRemove');
const removeUsersFromGroupForm = document.querySelector('#removeUserFromGroup');
const closeRemoveUserBtn = document.querySelector('#closeRemoveUser');
const removeUserSubmitBtn = document.querySelector('#removeUserFromGroup button[type="submit"]');

createGroupBtn.addEventListener('click', () => showModal(createGroupModal));
closeCreateGroupModalBtn.addEventListener('click', () => hideModal(createGroupModal));
submitCreateGroupModalBtn.addEventListener('click', CreateGroup);
closeAddUserBtn.addEventListener('click', () => hideModal(addUserToGroupModal));
closeRemoveUserBtn.addEventListener('click', () => hideModal(removeUserFromGroupModal));


function showModal(modal) {
    modal.style.display = 'flex';
}

function hideModal(modal) {
    modal.style.display = 'none';
}

function generateGroupId() {
    const groups = localStorage.getItem('groups') ? JSON.parse(localStorage.getItem('groups')) : [];
    return groups.length ? groups[groups.length - 1].id + 1 : 1;
}

function CreateGroup() {
    const group = {
        id: generateGroupId(),
        groupName: groupNameInput.value,
        users: [] // Initialize with an empty users array
    };

    const groups = localStorage.getItem('groups') ? JSON.parse(localStorage.getItem('groups')) : [];
    groups.push(group);
    localStorage.setItem('groups', JSON.stringify(groups));

    groupNameInput.value = "";
    renderGroups();
    showNotification('Group created successfully!');
    hideModal(createGroupModal);
}

function renderGroups() {
    const groupsTableBody = document.querySelector('#groupsTable tbody');
    const groups = localStorage.getItem('groups') ? JSON.parse(localStorage.getItem('groups')) : [];

    groupsTableBody.innerHTML = '';

    if (groups.length === 0) {
        const noGroupsRow = document.createElement('tr');
        noGroupsRow.innerHTML = '<td colspan="4" class="no-users">No groups</td>';
        groupsTableBody.appendChild(noGroupsRow);
    } else {
        groups.forEach(group => {
            const formattedGroupId = `GP${String(group.id).padStart(3, '0')}`;

            const row = document.createElement('tr');
            row.id = `GroupRow-${group.id}`;
            const usersContent = group.users.length ? group.users.join(', ') : 'No users assigned';
            row.innerHTML = `
                <td class="groupId-${group.id}">${formattedGroupId}</td>
                <td class="groupName-${group.id}">${group.groupName}</td>
                <td class="users-${group.id}">${usersContent}</td>
                <td class="actions" id="groupActions-${group.id}">
                    <button title="add" class="addUser"><i class="fa-solid fa-user-plus"></i> Add User</button>
                    <button title="remove" class="removeUser"><i class="fa-solid fa-user-minus"></i> Remove User</button>
                </td>
            `;
            groupsTableBody.appendChild(row);

            row.querySelector('.addUser').addEventListener('click', () => addUser(group.id));
            row.querySelector('.removeUser').addEventListener('click', () => removeUser(group.id));
        });
    }
}

function addUser(groupId) {
    showModal(addUserToGroupModal);

    const groups = JSON.parse(localStorage.getItem('groups'));
    const group = groups.find(g => g.id === groupId);
    addUserSubmitBtn.innerHTML = `Add users to ${group.groupName}`;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) {
        usersSelect.innerHTML = '<option>No users to add</option>';
        addUserSubmitBtn.disabled = true; 
    } else {
        usersSelect.innerHTML = users.map(user => `<option value="${user.id}">${user.userName}</option>`).join('');
        addUserSubmitBtn.disabled = false;
    }

    addUsersToGroupForm.onsubmit = (event) => {
        event.preventDefault();

        const selectedUserNames = Array.from(usersSelect.selectedOptions).map(option => option.textContent);
        const userSet = new Set(group.users);

        selectedUserNames.forEach(userName => {
            userSet.add(userName);
        });

        group.users = Array.from(userSet); 

        const updatedGroups = groups.map(g => g.id === groupId ? group : g);

        localStorage.setItem('groups', JSON.stringify(updatedGroups));
        renderGroups();
        showNotification('User(s) added to Group successfully!');
        hideModal(addUserToGroupModal);
    };
}

function removeUser(groupId) {
    showModal(removeUserFromGroupModal);

    const groups = JSON.parse(localStorage.getItem('groups'));
    const group = groups.find(g => g.id === groupId);

    removeUserSubmitBtn.innerHTML = `Remove users from ${group.groupName}`;
    
    if (group.users.length === 0) {
        userSelect.innerHTML = '<option>No users to remove</option>';
        removeUserSubmitBtn.disabled = true;
    } else {
        userSelect.innerHTML = group.users.map(user => `<option>${user}</option>`).join('');
        removeUserSubmitBtn.disabled = false;
    }

    removeUsersFromGroupForm.onsubmit = (event) => {
        event.preventDefault();

        const selectedUsers = Array.from(userSelect.selectedOptions).map(option => option.textContent);

    
        const userSet = new Set(group.users);

        selectedUsers.forEach(user => {
            userSet.delete(user);
        });

        group.users = Array.from(userSet); 

        const updatedGroups = groups.map(g => g.id === groupId ? group : g);

        localStorage.setItem('groups', JSON.stringify(updatedGroups));
        renderGroups();
        showNotification('User(s) removed from Group successfully!');
        hideModal(removeUserFromGroupModal);
    };
}

//* role js

const createRoleModal = document.querySelector('.createRoleModal');
const createRoleBtn = document.querySelector('#createRole');
const closeCreateRoleModalBtn = document.querySelector('#closeCreateRoleModal');
const submitCreateRoleModalBtn = document.querySelector('#submitCreateRoleModal');
const roleNameInput = document.querySelector('#roleName');
const roleDescriptionInput = document.querySelector('#roleDescription');
const closeAssignRoleBtn = document.querySelector('#closeAssignUsersModal');
const closeAssignRoleGroupBtn = document.querySelector('#closeAssignGroupsModal');
const assignRoleToUserModal = document.querySelector('.assignRoleToUserModal');
const assignRoleToGroupModal = document.querySelector('.assignRoleToGroupModal');
const addUsersToRoleForm = document.querySelector('#assignRolesToUserForm');
const assignUserSubmitBtn = document.querySelector('#assignRolesToUserForm button[type="submit"]');
const addGroupsToRoleForm = document.querySelector('#assignRolesToGroupForm');
const assignGroupSubmitBtn = document.querySelector('#assignRolesToGroupForm button[type="submit"]');
const usersSelectRole = document.querySelector('#usersSelectRole');
const groupsSelect = document.querySelector('#groupsSelect');



createRoleBtn.addEventListener('click', () => showModal(createRoleModal));
closeCreateRoleModalBtn.addEventListener('click', () => hideModal(createRoleModal));
submitCreateRoleModalBtn.addEventListener('click', createRole);
closeAssignRoleBtn.addEventListener('click', () => hideModal(assignRoleToUserModal));
closeAssignRoleGroupBtn.addEventListener('click', () => hideModal(assignRoleToGroupModal));



function generateRoleId() {
    const roles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')) : [];
    return roles.length ? roles[roles.length - 1].id + 1 : 1;
}

function createRole() {
    const role = {
        id: generateRoleId(),
        name: roleNameInput.value,
        description: roleDescriptionInput.value,
        assignedUsers: [],
        assignedGroups: [],
    };

    const roles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')) : [];
    roles.push(role);
    localStorage.setItem('roles', JSON.stringify(roles));

    roleNameInput.value = "";
    roleDescriptionInput.value = "";
    renderRoles();
    showNotification('Role created successfully!');
    hideModal(createRoleModal);
}

function renderRoles() {
    const rolesTableBody = document.querySelector('#rolesTable tbody');
    const roles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')) : [];

    rolesTableBody.innerHTML = '';

    if (roles.length === 0) {
        rolesTableBody.innerHTML = '<tr><td colspan="3" class="no-roles">No roles</td></tr>';
    } else {
        roles.forEach(role => {
            const formattedRoleId = `RL${String(role.id).padStart(3, '0')}`;

            const row = document.createElement('tr');
            row.id = `RoleRow-${role.id}`;
            row.innerHTML = `
                <td class="roleId-${role.id}">${formattedRoleId}</td>
                <td class="roleName-${role.id}">${role.name}</td>
                <td class="roleDescription-${role.id}">${role.description}</td>
                <td class="actions" id="roleActions-${role.id}">
                    <button title="assignUser" class="assignUser"><i class="fa-solid fa-user"></i> Assign Users</button>
                    <button title="assignGroup" class="assignGroup"><i class="fa-solid fa-user-group"></i> Assign Groups</button>
                </td>
            `;

            rolesTableBody.appendChild(row);

            const assignUserBtn = row.querySelector('.assignUser');
            const assignGroupBtn = row.querySelector('.assignGroup');

            assignUserBtn.addEventListener('click', () => assignRoleToUser(role.id));
            assignGroupBtn.addEventListener('click', () => assignRoleToGroup(role.id));
        });


    }

}

function assignRoleToUser(roleId) {
    showModal(assignRoleToUserModal);
    
    const roles = JSON.parse(localStorage.getItem('roles')) ;
    const role = roles.find(r => r.id === roleId);
    
    const users = JSON.parse(localStorage.getItem('users')) ;
    usersSelectRole.innerHTML = users.map(user => `<option value="${user.id}">${user.userName}</option>`).join('');
    assignUserSubmitBtn.disabled = users.length === 0;

    addUsersToRoleForm.onsubmit = function (event) {
        event.preventDefault();
    
        const existingAssignedUsers = role.assignedUsers;

        const selectedUserIds = Array.from(usersSelectRole.selectedOptions).map(option => option.textContent);

        role.assignedUsers = Array.from(new Set([...existingAssignedUsers, ...selectedUserIds]));
        
        localStorage.setItem('roles', JSON.stringify(roles));
        renderRoleAssignments();
        showNotification('Role assigned for User(s) successfully!');
        hideModal(assignRoleToUserModal);
    };
}

function assignRoleToGroup(roleId) {
    showModal(assignRoleToGroupModal);
    
    const roles = JSON.parse(localStorage.getItem('roles'));
    const role = roles.find(r => r.id === roleId);
    
    const groups = JSON.parse(localStorage.getItem('groups'));
    groupsSelect.innerHTML = groups.map(group => `<option value="${group.id}">${group.groupName}</option>`).join('');
    assignGroupSubmitBtn.disabled = groups.length === 0;

    addGroupsToRoleForm.onsubmit = function (event) {
        event.preventDefault();
        
        const existingAssignedGroups = role.assignedGroups;
        
        const selectedGroupIds = Array.from(groupsSelect.selectedOptions).map(option => option.textContent);
        
        role.assignedGroups = Array.from(new Set([...existingAssignedGroups, ...selectedGroupIds]));
        
        localStorage.setItem('roles', JSON.stringify(roles));
        renderRoleAssignments();
        showNotification('Role assigned for Group(s) successfully!');
        hideModal(assignRoleToGroupModal);
    };
}

function renderRoleAssignments() {
    const roleAssignmentsTableBody = document.querySelector('#roleAssignmentsTable tbody');
    const roles = JSON.parse(localStorage.getItem('roles')) || [];

    const filteredRoles = roles.filter(role => 
        role.assignedUsers.length > 0 || role.assignedGroups.length > 0
    );

    roleAssignmentsTableBody.innerHTML = '';

    if (filteredRoles.length === 0) {
        roleAssignmentsTableBody.innerHTML = '<tr><td colspan="3" class="no-roles">No roles assigned</td></tr>';
    } else {
        filteredRoles.forEach(role => {
            const assignedUsers = role.assignedUsers ;
            const assignedGroups = role.assignedGroups || [];
            const usersContent = assignedUsers.length ? assignedUsers.join(', ') : 'No users assigned';
            const groupsContent = assignedGroups.length ? assignedGroups.join(', ') : 'No groups assigned';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="roleName-${role.id}">${role.name}</td>
                <td class="assignedUsers-${role.id}">${usersContent}</td>
                <td class="assignedGroups-${role.id}">${groupsContent}</td>
            `;

            roleAssignmentsTableBody.appendChild(row);
        });
    }
}

//* exports

module.exports = {
    renderUsers,
    deleteUser,
    editUser,
    updateUser,
    renderGroups,
    renderRoles,
    renderRoleAssignments,
    showNotification,
};














