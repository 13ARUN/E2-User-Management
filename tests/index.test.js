const fs = require('fs');
const path = require('path');
const Chance = require('chance');
const chance = new Chance();

const { fireEvent } = require("@testing-library/dom");



function generateRandomString(options) {
    return chance.string(options);
}

const setLocalStorageItem = (key, value) => {
    localStorage.setItem(key, value);
};

const getLocalStorageItem = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

const removeLocalStorageItem = (key) => {
    localStorage.removeItem(key);
}

const clearLocalStorage = () => {
    localStorage.clear();
};

function checkNotification(expectedText) {

    const notification = document.getElementById('notification');
    expect(notification.textContent).toBe(expectedText);
    
}


describe('Dynamic sidebar', () => {

    let sidebar,logo

    beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        document.body.innerHTML = html;
        require('../script.js');

        jest.resetModules();

        sidebar = document.querySelector('.sidebar');
        logo = document.querySelector('.logo_content');

    });
    
    it('should toggle class of Sidebar', () => {

        expect(sidebar.classList).toContain('sidebar');
        expect(sidebar.classList).not.toContain('active');

        logo.click();

        expect(sidebar.classList).toContain('sidebar');
        expect(sidebar.classList).toContain('active');

        logo.click();

        expect(sidebar.classList).toContain('sidebar');
        expect(sidebar.classList).not.toContain('active');

    });

});

describe('DOMContentLoaded event listener', () => {

    let sidebarLinks, contentSections;

    beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        document.body.innerHTML = html;

        require('../script.js');

        jest.resetModules();

        sidebarLinks = document.querySelectorAll('.nav_list a');
        contentSections = document.querySelectorAll('.home_content');

    });


    it('should only display the first section on page load', () => {
        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(contentSections[0].style.display).toBe('flex');
        expect(contentSections[1].style.display).toBe('none');
        expect(contentSections[2].style.display).toBe('none');

        expect(sidebarLinks[0].classList.contains('selected')).toBe(true);
        expect(sidebarLinks[1].classList.contains('selected')).toBe(false);
        expect(sidebarLinks[2].classList.contains('selected')).toBe(false);
    });

    it('should highlight the selected sidebar link and display the correct section when clicked', () => {

        document.dispatchEvent(new Event('DOMContentLoaded'));

        sidebarLinks[0].click();

        expect(contentSections[0].style.display).toBe('flex');
        expect(contentSections[1].style.display).toBe('none');
        expect(contentSections[2].style.display).toBe('none');

        expect(sidebarLinks[0].classList.contains('selected')).toBe(true);
        expect(sidebarLinks[1].classList.contains('selected')).toBe(false);
        expect(sidebarLinks[2].classList.contains('selected')).toBe(false);

        sidebarLinks[1].click();

        expect(contentSections[0].style.display).toBe('none');
        expect(contentSections[1].style.display).toBe('flex');
        expect(contentSections[2].style.display).toBe('none');

        expect(sidebarLinks[0].classList.contains('selected')).toBe(false);
        expect(sidebarLinks[1].classList.contains('selected')).toBe(true);
        expect(sidebarLinks[2].classList.contains('selected')).toBe(false);

        sidebarLinks[2].click();

        expect(contentSections[0].style.display).toBe('none');
        expect(contentSections[1].style.display).toBe('none');
        expect(contentSections[2].style.display).toBe('flex');

        expect(sidebarLinks[0].classList.contains('selected')).toBe(false);
        expect(sidebarLinks[1].classList.contains('selected')).toBe(false);
        expect(sidebarLinks[2].classList.contains('selected')).toBe(true);
    });


});

describe('User Page', () => {

    beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        document.body.innerHTML = html;

        require('../script.js');

    
        const mockLocalStorage = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => (store[key] = value.toString()),
                clear: () => (store = {}),
                removeItem: (key) => delete store[key],
            };
        })();
        Object.defineProperty(window, 'localStorage', {value: mockLocalStorage,});

        clearLocalStorage();
        jest.resetModules();
    });
        
    afterEach(() => {
        clearLocalStorage();
    });

    describe('Adding users', () => {

        it('should display add User form when create user is clicked', () => {

            const createUserModal = document.querySelector('.addUserModal');
            expect(createUserModal).toBeTruthy();
            expect(createUserModal.style.display).toBe('none');

            const createUserBtn = document.querySelector('#addUser');
            expect(createUserBtn).toBeTruthy();

            createUserBtn.click();

            expect(createUserModal.style.display).toBe('flex');

        });

        it('should close form when close is clicked', () => {

            const createUserModal = document.querySelector('.addUserModal');
            expect(createUserModal).toBeTruthy();
            expect(createUserModal.style.display).toBe('none');

            const createUserBtn = document.querySelector('#addUser');
            expect(createUserBtn).toBeTruthy();

            createUserBtn.click();

            const closeBtn = document.querySelector('#closeAddUserModal');
            expect(closeBtn).toBeTruthy();

            closeBtn.click();

            expect(createUserModal.style.display).toBe('none');

        });

        it('should clear form entries when clear is clicked', () => {

            const userName = document.querySelector('#userName');
            const email = document.querySelector('#email');
            const firstName = document.querySelector('#firstName');
            const lastName = document.querySelector('#lastName');

            expect(userName.value).toBe('');
            expect(email.value).toBe('');
            expect(firstName.value).toBe('');
            expect(lastName.value).toBe('');

            userName.value = "Arun";
            email.value = "Arun";
            firstName.value = "Arun";
            lastName.value = "Arun";

            expect(userName.value).toBe('Arun');
            expect(email.value).toBe('Arun');
            expect(firstName.value).toBe('Arun');
            expect(lastName.value).toBe('Arun');

            const clearBtn = document.querySelector('#clear');
            clearBtn.click();

            expect(userName.value).toBe('');
            expect(email.value).toBe('');
            expect(firstName.value).toBe('');
            expect(lastName.value).toBe('');

    
        });

        it('should add a user to local storage when submitted', () => {

            const userName = document.querySelector('#userName');
            const email = document.querySelector('#email');
            const firstName = document.querySelector('#firstName');
            const lastName = document.querySelector('#lastName');

            expect(userName.value).toBe('');
            expect(email.value).toBe('');
            expect(firstName.value).toBe('');
            expect(lastName.value).toBe('');

            userName.value = "Arun";
            email.value = "Arun";
            firstName.value = "Arun";
            lastName.value = "Arun";

            const submitBtn = document.querySelector('#submitAddUserModal');
            submitBtn.click();

            expect(userName.value).toBe('');
            expect(email.value).toBe('');
            expect(firstName.value).toBe('');
            expect(lastName.value).toBe('');


            let users = getLocalStorageItem('users');
            expect(users[0].userName).toBe('Arun');
            expect(users[0].email).toBe('Arun');
            expect(users[0].firstName).toBe('Arun');
            expect(users[0].lastName).toBe('Arun');


        });

        it('should add subsequent users to local storage when submitted', () => {

            const userName = document.querySelector('#userName');
            const email = document.querySelector('#email');
            const firstName = document.querySelector('#firstName');
            const lastName = document.querySelector('#lastName');

            expect(userName.value).toBe('');
            expect(email.value).toBe('');
            expect(firstName.value).toBe('');
            expect(lastName.value).toBe('');

            userName.value = "Arun";
            email.value = "Arun";
            firstName.value = "Arun";
            lastName.value = "Arun";

            const submitBtn = document.querySelector('#submitAddUserModal');
            fireEvent.click(submitBtn);

            expect(userName.value).toBe('');
            expect(email.value).toBe('');
            expect(firstName.value).toBe('');
            expect(lastName.value).toBe('');



            let users = getLocalStorageItem('users');
            expect(users[0].userName).toBe('Arun');
            expect(users[0].email).toBe('Arun');
            expect(users[0].firstName).toBe('Arun');
            expect(users[0].lastName).toBe('Arun');

            userName.value = "user2";
            email.value = "user2";
            firstName.value = "user2";
            lastName.value = "user2";

            
            fireEvent.click(submitBtn);



            let usersUpdated = getLocalStorageItem('users');

            expect(usersUpdated[0].userName).toBe('Arun');
            expect(usersUpdated[0].email).toBe('Arun');
            expect(usersUpdated[0].firstName).toBe('Arun');
            expect(usersUpdated[0].lastName).toBe('Arun');

            expect(usersUpdated[1].userName).toBe('user2');
            expect(usersUpdated[1].email).toBe('user2');
            expect(usersUpdated[1].firstName).toBe('user2');
            expect(usersUpdated[1].lastName).toBe('user2');

        });

        it('should format the input values by removing empty spaces', () => {

            const userName = document.querySelector('#userName');
            const email = document.querySelector('#email');
            const firstName = document.querySelector('#firstName');
            const lastName = document.querySelector('#lastName');

            userName.value = "   Arun   ";
            email.value = "Ar  un";
            firstName.value = "    Arun";
            lastName.value = "Arun    ";

            const submitBtn = document.querySelector('#submitAddUserModal');
            fireEvent.click(submitBtn);



            let users = getLocalStorageItem('users');
            expect(users[0].userName).toBe('Arun');
            expect(users[0].email).toBe('Ar un');
            expect(users[0].firstName).toBe('Arun');
            expect(users[0].lastName).toBe('Arun');
            
    
        });

        it('should generate id for each user based on the users length', () => {
            const userName = document.querySelector('#userName');
            const email = document.querySelector('#email');
            const firstName = document.querySelector('#firstName');
            const lastName = document.querySelector('#lastName');


            userName.value = "Arun";
            email.value = "Arun";
            firstName.value = "Arun";
            lastName.value = "Arun";

            const submitBtn = document.querySelector('#submitAddUserModal');
            fireEvent.click(submitBtn);


            let users = getLocalStorageItem('users');
            expect(users[0].id).toBe(1);


            userName.value = "Arun";
            email.value = "Arun";
            firstName.value = "Arun";
            lastName.value = "Arun";

            fireEvent.click(submitBtn);


            let usersUpdated = getLocalStorageItem('users');
            expect(usersUpdated[0].id).toBe(1);
            expect(usersUpdated[1].id).toBe(2);
   
        });


        it('should display success message when user is created', () => {

            const submitBtn = document.querySelector('#submitAddUserModal');
            submitBtn.click();
        
            checkNotification('User created successfully!');
        });
        


        

        

    });

    describe('Viewing users', () => {

        beforeEach(() => {
            ({renderUsers} = require('../script.js'));
        });


        it('should render "No users" when no key exists', () => {

            removeLocalStorageItem('users');
        
            renderUsers();
        
            const usersTableBody = document.querySelector('#usersTable tbody');
            expect(usersTableBody.rows.length).toBe(1);
            expect(usersTableBody.rows[0].textContent.trim()).toBe('No users');
        });

        it('should render "No users" when there are no users', () => {

            setLocalStorageItem('users', JSON.stringify([]));
        
            renderUsers();
        
            const usersTableBody = document.querySelector('#usersTable tbody');
            expect(usersTableBody.rows.length).toBe(1);
            expect(usersTableBody.rows[0].textContent.trim()).toBe('No users');
        });
        

        it('should display the users in the table by rendering users from local storage', () => {

            const Users = [
                { id: 1, userName: 'User1', email: 'user1@example.com', firstName: 'John', lastName: 'Doe' },
                { id: 2, userName: 'User2', email: 'user2@example.com', firstName: 'Jane', lastName: 'Doe' }
            ];
            setLocalStorageItem('users', JSON.stringify(Users));

            renderUsers();

            const usersTableBody = document.querySelector('#usersTable tbody');
            expect(usersTableBody.rows.length).toBe(2);

            const user = document.querySelector('#UserRow-1');
            expect(user).toBeTruthy();

            expect((document.querySelector('.userId-1')).textContent).toBe('US001');
            expect((document.querySelector('.userName-1')).textContent).toBe('User1');
            expect((document.querySelector('.userEmail-1')).textContent).toBe('user1@example.com');
            expect((document.querySelector('.userFname-1')).textContent).toBe('John');
            expect((document.querySelector('.userLname-1')).textContent).toBe('Doe');

            expect((document.querySelector('.userId-2')).textContent).toBe('US002');
            expect((document.querySelector('.userName-2')).textContent).toBe('User2');
            expect((document.querySelector('.userEmail-2')).textContent).toBe('user2@example.com');
            expect((document.querySelector('.userFname-2')).textContent).toBe('Jane');
            expect((document.querySelector('.userLname-2')).textContent).toBe('Doe');
            

        });

        test('should format user ID as U001, U002, etc.', () => {
            const mockUsers = [
                { id: 1, userName: 'User1', email: 'user1@example.com', firstName: 'First1', lastName: 'Last1' },
                { id: 10, userName: 'User2', email: 'user2@example.com', firstName: 'First2', lastName: 'Last2' }
            ];
            setLocalStorageItem('users', JSON.stringify(mockUsers));
        
            renderUsers();
        
            const usersTableBody = document.querySelector('#usersTable tbody');
            expect(usersTableBody.querySelector('.userId-1').textContent).toBe('US001');
            expect(usersTableBody.querySelector('.userId-10').textContent).toBe('US010');
        });
        


        

    });

    describe('Deleting users', () => {
        let users;
        let deleteUser;
        let renderUsers;
    
        beforeEach(() => {

            jest.spyOn(window, 'confirm').mockImplementation(() => true);
    
            ({ deleteUser, renderUsers } = require('../script.js'));
            users = [
                { id: 1, userName: 'JohnDoe', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
                { id: 2, userName: 'JaneDoe', email: 'jane@example.com', firstName: 'Jane', lastName: 'Doe' }
            ];
            setLocalStorageItem('users', JSON.stringify(users));
    
            renderUsers();
        });
    
        afterEach(() => {
            window.confirm.mockRestore();
        });
    
        it('should delete a user from the list', () => {
            deleteUser(1);
    
            const updatedUsers = getLocalStorageItem('users');
            expect(updatedUsers).toHaveLength(1);
            expect(updatedUsers[0].id).toBe(2);
    
            const userRow = document.querySelector('#UserRow-1');
            expect(userRow).toBeNull();
        });
    
        it('should update the user list UI after deletion', () => {
            deleteUser(2);
    
            const updatedUsers = getLocalStorageItem('users');
            expect(updatedUsers).toHaveLength(1);
    
            const deletedUserRow = document.querySelector('#UserRow-2');
            expect(deletedUserRow).toBeNull();
        });
    
        it('should display "No users" message when the last user is deleted', () => {
            deleteUser(1);
            deleteUser(2);
    
            const updatedUsers = getLocalStorageItem('users');
            expect(updatedUsers).toHaveLength(0);
    
            const noUsersMessage = document.querySelector('.no-users');
            expect(noUsersMessage).not.toBeNull();
            expect(noUsersMessage.textContent).toBe('No users');
        });

        it('should not delete a user if cancel is clicked on the confirmation dialog', () => {

            jest.spyOn(window, 'confirm').mockImplementation(() => false);
    
            deleteUser(1);
    
            const updatedUsers = getLocalStorageItem('users');
            expect(updatedUsers).toHaveLength(2);
    
            const userRow = document.querySelector('#UserRow-1');
            expect(userRow).not.toBeNull();
        });

        it('should display success message when user is deleted', () => {

            deleteUser(1);
        
            checkNotification('User deleted successfully!');
        });
    
        it('should work with delete button event listener', () => {
            let deleteBtn1 = document.querySelector('#userActions-1 button[title="delete"]');
    
            deleteBtn1.click();
    
            const updatedUsers = getLocalStorageItem('users');
            expect(updatedUsers).toHaveLength(1);
            expect(updatedUsers[0].id).toBe(2);
    
            const userRow = document.querySelector('#UserRow-1');
            expect(userRow).toBeNull();
        });


    });
    

    describe('Editing users', () => {
        let users;
    
        beforeEach(() => {
            ({editUser,updateUser,renderUsers} = require('../script.js'));
    
            users = [
                { id: 1, userName: 'JohnDoe', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
                { id: 2, userName: 'JaneDoe', email: 'jane@example.com', firstName: 'Jane', lastName: 'Doe' }
            ];
            setLocalStorageItem('users', JSON.stringify(users));
            renderUsers();
        });

        it('should display update User form when edit user is clicked', () => {

            const updateUserModal = document.querySelector('.updateUserModal');
            expect(updateUserModal).toBeTruthy();
            expect(updateUserModal.style.display).toBe('none');

            editUser(1);

            expect(updateUserModal.style.display).toBe('flex');

        });
    
        it('should pre-fill the edit form with the correct user data', () => {
            editUser(1);
    
            expect(document.querySelector('#updateUsername').value).toBe('JohnDoe');
            expect(document.querySelector('#updateEmail').value).toBe('john@example.com');
            expect(document.querySelector('#updateFirstName').value).toBe('John');
            expect(document.querySelector('#updateLastName').value).toBe('Doe');
        });
    
        it('should update the user data in localStorage and UI after editing', () => {
            editUser(1);
    
            document.querySelector('#updateUsername').value = 'JohnUpdated';
            document.querySelector('#updateEmail').value = 'johnupdated@example.com';
            document.querySelector('#updateFirstName').value = 'Johnny';
            document.querySelector('#updateLastName').value = 'DoeUpdated';
    
            document.querySelector('#updateUserForm').dispatchEvent(new Event('submit'));
    
            const updatedUsers = getLocalStorageItem('users');
            expect(updatedUsers[0].userName).toBe('JohnUpdated');
            expect(updatedUsers[0].email).toBe('johnupdated@example.com');
            expect(updatedUsers[0].firstName).toBe('Johnny');
            expect(updatedUsers[0].lastName).toBe('DoeUpdated');
    
            const updatedUserRow = document.querySelector('.userName-1');
            expect(updatedUserRow.textContent).toBe('JohnUpdated');
        });
    
        it('should close the edit modal without saving changes when cancel is clicked', () => {
            editUser(1);
    
            document.querySelector('#updateUsername').value = 'JohnUpdated';
            document.querySelector('#updateEmail').value = 'johnupdated@example.com';
            document.querySelector('#updateFirstName').value = 'Johnny';
            document.querySelector('#updateLastName').value = 'DoeUpdated';
    
            const cancelBtn = document.querySelector('#cancelEdit');
            cancelBtn.click();
    
            const editModal = document.querySelector('.updateUserModal');
            expect(editModal.style.display).toBe('none');
    
            const users = getLocalStorageItem('users');
            expect(users[0].userName).toBe('JohnDoe');
        });

        it('should display success message when user is updated', () => {

            updateUser(1);
        
            checkNotification('User updated successfully!');
        });

        
       

        it('should work with edit button event listener', () => {

            const updateUserModal = document.querySelector('.updateUserModal');
            expect(updateUserModal).toBeTruthy();
            expect(updateUserModal.style.display).toBe('none');

            let editBtn1 = document.querySelector('#userActions-1 button[title="edit"]');

            editBtn1.click();

            expect(updateUserModal.style.display).toBe('flex');

        });
       
    });

});

describe('Group Page', () => {

    beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        document.body.innerHTML = html;


        require('../script.js');

    
        const mockLocalStorage = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => (store[key] = value.toString()),
                clear: () => (store = {}),
                removeItem: (key) => delete store[key],
            };
        })();
        Object.defineProperty(window, 'localStorage', {value: mockLocalStorage,});

        clearLocalStorage();
        jest.resetModules();
    });
        
    afterEach(() => {
        clearLocalStorage();
    });

    describe('Adding Groups', () => {

        it('should display add Group form when create group is clicked', () => {

            const createGroupModal = document.querySelector('.createGroupModal');
            expect(createGroupModal).toBeTruthy();
            expect(createGroupModal.style.display).toBe('none');

            const createGroupBtn = document.querySelector('#createGroup');
            expect(createGroupBtn).toBeTruthy();

            expect(createGroupModal.style.display).toBe('none');

            createGroupBtn.click();

            //expect(createGroupModal.style.display).toBe('');

        });

        it('should close form when close is clicked', () => {

            const createGroupModal = document.querySelector('.createGroupModal');
            expect(createGroupModal).toBeTruthy();
            expect(createGroupModal.style.display).toBe('none');

            const createGroupBtn = document.querySelector('#createGroup');
            expect(createGroupBtn).toBeTruthy();

            createGroupBtn.click();

            expect(createGroupModal.style.display).toBe('flex');

            const closeBtn = document.querySelector('#closeCreateGroupModal');
            expect(closeBtn).toBeTruthy();

            closeBtn.click();

            expect(createGroupModal.style.display).toBe('none');

        });

        it('should add a user to local storage when submitted', () => {

            const groupName = document.querySelector('#groupName');

            expect(groupName.value).toBe('');

            groupName.value = "Group 1";

            const submitBtn = document.querySelector('#submitCreateGroupModal');
            submitBtn.click();

            expect(groupName.value).toBe('');


            let groups = getLocalStorageItem('groups');
            expect(groups[0].groupName).toBe('Group 1');



        });

        it('should add subsequent Groups to local storage when submitted', () => {

            const groupName = document.querySelector('#groupName');

            expect(groupName.value).toBe('');

            groupName.value = "Group 1";

            const submitBtn = document.querySelector('#submitCreateGroupModal');
            submitBtn.click()

            expect(groupName.value).toBe('');


            let groups = getLocalStorageItem('groups');
            expect(groups[0].groupName).toBe('Group 1');

            groupName.value = "Group 2";
            submitBtn.click();

            expect(groupName.value).toBe('');

            let groupsUpdated = getLocalStorageItem('groups');

            expect(groupsUpdated[0].groupName).toBe('Group 1');
            expect(groupsUpdated[1].groupName).toBe('Group 2');
        });

        it('should display success message when group is created', () => {

            const submitBtn = document.querySelector('#submitCreateGroupModal');
            submitBtn.click()
        
            checkNotification("Group created successfully!");
        });



    });

    describe('Viewing Groups', () => {

        beforeEach(() => {
            ({renderGroups} = require('../script.js'));
        });

        it('should initialize with "No groups" when there are no groups in localStorage', () => {
            localStorage.removeItem('groups');
            
            renderGroups();
            
            const tableRows = document.querySelectorAll('#groupsTable tbody tr');
            
            expect(tableRows.length).toBe(1);
            expect(tableRows[0].textContent).toContain('No groups');
        });

        it('should render "No Groups" when there are no users', () => {

            setLocalStorageItem('groups', JSON.stringify([]));
        
            renderGroups();

            const tableRows = document.querySelectorAll('#groupsTable tbody tr');
        
            expect(tableRows.length).toBe(1);
            expect(tableRows[0].textContent).toContain('No groups');
        });

        it('should add a new group to localStorage and update the UI', () => {

            const groupName = document.querySelector('#groupName');

            expect(groupName.value).toBe('');

            groupName.value = "Group 1";

            const submitBtn = document.querySelector('#submitCreateGroupModal');
            submitBtn.click()
    
            const groups = getLocalStorageItem('groups');
            expect(groups.length).toBe(1);
            expect(groups[0].groupName).toBe("Group 1");
    
            const tableRows = document.querySelectorAll('#groupsTable tbody tr');
            expect(tableRows.length).toBe(1); 
            expect(tableRows[0].textContent).toContain("Group 1");
        });

        it('should display "No users assigned" when a group is created but no users are assigned', () => {

            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1", users: [] }]));
            
            renderGroups();
            
            const tableRows = document.querySelectorAll('#groupsTable tbody tr');
            
            expect(tableRows.length).toBe(1);
            
            expect(tableRows[0].textContent).toContain('Group 1');
            expect(tableRows[0].textContent).toContain('No users assigned');
        });

        
    });

    describe('Add users to Groups', () => {

        beforeEach(() => {
            ({renderGroups} = require('../script.js'));
        });



        it('should display the "Add User to Group" modal and populate users dropdown', () => {
            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1", users: [] }]));
            setLocalStorageItem('users', JSON.stringify([{ id: 1, userName: "User 1" }, { id: 2, userName: "User 2" }]));
    
            renderGroups();
            const addUserBtn = document.querySelector('.addUser');
            addUserBtn.click();
    
            expect(document.querySelector('.addUserToGroupModal').style.display).toBe('flex');
            
            const userOptions = document.querySelectorAll('#usersSelect option');
            expect(userOptions.length).toBe(2);
            expect(userOptions[0].textContent).toBe('User 1');
            expect(userOptions[1].textContent).toBe('User 2');
        });

        it('should show "No users to add" when there are no users in local storage', () => {
            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1", users: [] }]));
            localStorage.removeItem('users'); 
        
            renderGroups();
            const addUserBtn = document.querySelector('.addUser');
            addUserBtn.click();
        
            expect(document.querySelector('.addUserToGroupModal').style.display).toBe('flex');
        
            const userOptions = document.querySelectorAll('#usersSelect option');
            expect(userOptions.length).toBe(1);
            expect(userOptions[0].textContent).toBe('No users to add');
        });
        

        it('should add selected users to the group', () => {
            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1", users: [] }]));
            setLocalStorageItem('users', JSON.stringify([{ id: 1, userName: "User 1" }, { id: 2, userName: "User 2" }]));
    
            renderGroups();
            const addUserBtn = document.querySelector('.addUser');
            addUserBtn.click();
    
            const userSelect = document.querySelector('#usersSelect');
            userSelect.options[0].selected = true;
            userSelect.options[1].selected = true;
    
            const addUsersToGroupBtn = document.querySelector('#addUsersToGroupForm button[type="submit"]');
            addUsersToGroupBtn.click();
    
            const groups = getLocalStorageItem('groups');
            expect(groups[0].users).toEqual(['User 1', 'User 2']);
    
            const tableRows = document.querySelectorAll('#groupsTable tbody tr');
            expect(tableRows[0].querySelector('.users-1').textContent).toContain('User 1, User 2');
        });

        it('prevents adding duplicate users to the same group', () => {

            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1", users: ['User 1'] }]));
            setLocalStorageItem('users', JSON.stringify([{ id: 1, userName: "User 1" }, { id: 2, userName: "User 2" }]));
    
            renderGroups();
            const addUserBtn = document.querySelector('.addUser');
            addUserBtn.click();
    
            const userSelect = document.querySelector('#usersSelect');
            userSelect.options[0].selected = true;
            userSelect.options[1].selected = true;
    
            const addUsersToGroupBtn = document.querySelector('#addUsersToGroupForm button[type="submit"]');
            addUsersToGroupBtn.click();
    
            const groups = getLocalStorageItem('groups');
            expect(groups[0].users).toEqual(['User 1', 'User 2']);
    
            const tableRows = document.querySelectorAll('#groupsTable tbody tr');
            expect(tableRows[0].querySelector('.users-1').textContent).toContain('User 1, User 2');

        });

        it('should display success message when users are added to group', () => {

            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1", users: ['User 1'] }]));
            setLocalStorageItem('users', JSON.stringify([{ id: 1, userName: "User 1" }, { id: 2, userName: "User 2" }]));
    
            renderGroups();
            const addUserBtn = document.querySelector('.addUser');
            addUserBtn.click();
    
            const userSelect = document.querySelector('#usersSelect');
            userSelect.options[0].selected = true;
            userSelect.options[1].selected = true;
    
            const addUsersToGroupBtn = document.querySelector('#addUsersToGroupForm button[type="submit"]');
            addUsersToGroupBtn.click();

            checkNotification("User(s) added to Group successfully!");
        });
        

        it('should close the modals when close buttons are clicked', () => {
            const closeAddUserBtn = document.querySelector('#closeAddUser');
    
            closeAddUserBtn.click();
            expect(document.querySelector('.addUserToGroupModal').style.display).toBe('none');
    
        });

    });

    describe('Remove users from Groups', () => {

        beforeEach(() => {
            ({renderGroups} = require('../script.js'));
        });


        it('should display the "Remove User from Group" modal and populate users dropdown', () => {
            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1", users: ["User 1", "User 2"] }]));
            renderGroups();
            
            const removeUserBtn = document.querySelector('.removeUser');
            removeUserBtn.click();
    
            expect(document.querySelector('.removeUserFromGroup').style.display).toBe('flex');
            
            const userOptions = document.querySelectorAll('#usersSelectRemove option');
            expect(userOptions.length).toBe(2);
            expect(userOptions[0].textContent).toBe('User 1');
            expect(userOptions[1].textContent).toBe('User 2');
        });

        it('should show "No users to remove" when there are no users in the group', () => {
            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1", users: [] }]));
        
            renderGroups();
            const removeUserBtn = document.querySelector('.removeUser');
            removeUserBtn.click();
        
            expect(document.querySelector('.removeUserFromGroup').style.display).toBe('flex');
        
            const userOptions = document.querySelectorAll('#usersSelectRemove option');
            expect(userOptions.length).toBe(1);
            expect(userOptions[0].textContent).toBe('No users to remove');
        });
        

        it('should remove selected users from the group', () => {

            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1", users: ["User 1", "User 2"] }]));
            renderGroups();
            
            const removeUserBtn = document.querySelector('.removeUser');
            removeUserBtn.click();
    
            const userSelect = document.querySelector('#usersSelectRemove');
            userSelect.options[0].selected = true;
    
            const removeUsersFromGroupBtn = document.querySelector('#removeUserFromGroup button[type="submit"]');
            removeUsersFromGroupBtn.click();
    
            const groups = getLocalStorageItem('groups');
            expect(groups[0].users).toEqual(['User 2']);
    
            const tableRows = document.querySelectorAll('#groupsTable tbody tr');
            expect(tableRows[0].querySelector('.users-1').textContent).toContain('User 2');
        });

        it('should display success message when users are removed to group', () => {

            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1", users: ["User 1", "User 2"] }]));
            renderGroups();
            
            const removeUserBtn = document.querySelector('.removeUser');
            removeUserBtn.click();
    
            const userSelect = document.querySelector('#usersSelectRemove');
            userSelect.options[0].selected = true;
    
            const removeUsersFromGroupBtn = document.querySelector('#removeUserFromGroup button[type="submit"]');
            removeUsersFromGroupBtn.click();


            checkNotification("User(s) removed from Group successfully!" );
        });

        it('should close the modals when close buttons are clicked', () => {
            const closeRemoveUserBtn = document.querySelector('#closeRemoveUser');
    
            closeRemoveUserBtn.click();
            expect(document.querySelector('.removeUserFromGroup').style.display).toBe('none');
        });

    });

});

describe('Role Page', () => {

    beforeEach(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        document.body.innerHTML = html;

        require('../script.js');

        const mockLocalStorage = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => (store[key] = value.toString()),
                clear: () => (store = {}),
                removeItem: (key) => delete store[key],
            };
        })();
        Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

        clearLocalStorage();
        jest.resetModules();
    });

    afterEach(() => {
        clearLocalStorage();
    });

    describe('Creating Roles', () => {

        it('should display add role form when create role is clicked', () => {

            const createRoleModal = document.querySelector('.createRoleModal');
            expect(createRoleModal).toBeTruthy();
            expect(createRoleModal.style.display).toBe('none');

            const createRoleBtn = document.querySelector('#createRole');
            expect(createRoleBtn).toBeTruthy();

            createRoleBtn.click();

            //expect(createRoleModal.style.display).toBe('flex');
        });

        it('should close form when close is clicked', () => {
            const createRoleModal = document.querySelector('.createRoleModal');
            expect(createRoleModal).toBeTruthy();
            expect(createRoleModal.style.display).toBe('none');

            const createRoleBtn = document.querySelector('#createRole');
            expect(createRoleBtn).toBeTruthy();

            createRoleBtn.click();
            expect(createRoleModal.style.display).toBe('flex');

            const closeBtn = document.querySelector('#closeCreateRoleModal');
            expect(closeBtn).toBeTruthy();

            closeBtn.click();

            expect(createRoleModal.style.display).toBe('none');
        });

        it('should add a role to local storage when submitted', () => {
            const roleNameInput = document.querySelector('#roleName');
            const roleDescriptionInput = document.querySelector('#roleDescription');

            expect(roleNameInput.value).toBe('');
            expect(roleDescriptionInput.value).toBe('');

            roleNameInput.value = "Role 1";
            roleDescriptionInput.value = "Description for Role 1";

            const submitBtn = document.querySelector('#submitCreateRoleModal');
            submitBtn.click();

            expect(roleNameInput.value).toBe('');
            expect(roleDescriptionInput.value).toBe('');

            const roles = getLocalStorageItem('roles');
            expect(roles.length).toBe(1);
            expect(roles[0].name).toBe('Role 1');
            expect(roles[0].description).toBe('Description for Role 1');
        });

        it('should add subsequent roles to local storage when submitted', () => {
            const roleNameInput = document.querySelector('#roleName');
            const roleDescriptionInput = document.querySelector('#roleDescription');

            roleNameInput.value = "Role 1";
            roleDescriptionInput.value = "Description for Role 1";

            const submitBtn = document.querySelector('#submitCreateRoleModal');
            submitBtn.click();

            roleNameInput.value = "Role 2";
            roleDescriptionInput.value = "Description for Role 2";

            submitBtn.click();

            const roles = getLocalStorageItem('roles');
            expect(roles.length).toBe(2);
            expect(roles[0].name).toBe('Role 1');
            expect(roles[1].name).toBe('Role 2');
        });

        it('should handle the creation of multiple roles correctly', () => {
            const roleNameInput = document.querySelector('#roleName');
            const roleDescriptionInput = document.querySelector('#roleDescription');
            const submitBtn = document.querySelector('#submitCreateRoleModal');
        
            roleNameInput.value = "Role 1";
            roleDescriptionInput.value = "Description for Role 1";
            submitBtn.click();
        
            roleNameInput.value = "Role 2";
            roleDescriptionInput.value = "Description for Role 2";
            submitBtn.click();
        
            const roles = getLocalStorageItem('roles');
            expect(roles.length).toBe(2);
            expect(roles[0].name).toBe("Role 1");
            expect(roles[1].name).toBe("Role 2");
        });

        it('should display success message when role is created', () => {

            const submitBtn = document.querySelector('#submitCreateRoleModal');
            submitBtn.click();
        
            checkNotification("Role created successfully!");
        });
        
    });

    describe('Viewing Roles', () => {

        beforeEach(() => {
            ({ renderRoles } = require('../script.js'));
        });

        it('should initialize with "No roles" when there are no roles in localStorage', () => {
            localStorage.removeItem('roles');

            renderRoles();

            const tableRows = document.querySelectorAll('#rolesTable tbody tr');
            expect(tableRows.length).toBe(1);
            expect(tableRows[0].textContent).toContain('No roles');
        });

        it('should render "No Roles" when there are no roles in localStorage', () => {
            setLocalStorageItem('roles', JSON.stringify([]));

            renderRoles();

            const tableRows = document.querySelectorAll('#rolesTable tbody tr');
            expect(tableRows.length).toBe(1);
            expect(tableRows[0].textContent).toContain('No roles');
        });

        it('should add a new role to localStorage and update the UI', () => {
            const roleNameInput = document.querySelector('#roleName');
            const roleDescriptionInput = document.querySelector('#roleDescription');

            roleNameInput.value = "Role 1";
            roleDescriptionInput.value = "Description for Role 1";

            const submitBtn = document.querySelector('#submitCreateRoleModal');
            submitBtn.click();

            const roles = getLocalStorageItem('roles');
            expect(roles.length).toBe(1);
            expect(roles[0].name).toBe("Role 1");

            renderRoles();

            const tableRows = document.querySelectorAll('#rolesTable tbody tr');
            expect(tableRows.length).toBe(1);
            expect(tableRows[0].textContent).toContain("Role 1");
        });
    });

    describe('Assign users to Role', () => {

        beforeEach(() => {
            ({renderRoleAssignments,renderRoles} = require('../script.js'));
        });

        it('should render roles correctly in the table', () => {
            // Set up the roles in local storage
            const roles = [
                { id: 1, name: "Role 1", description: "Description for Role 1" },
                { id: 2, name: "Role 2", description: "Description for Role 2" }
            ];
            localStorage.setItem('roles', JSON.stringify(roles));
    
            // Call the function to render roles
            renderRoles();
    
            // Get the table body and rows
            const rolesTableBody = document.querySelector('#rolesTable tbody');
            const rows = rolesTableBody.querySelectorAll('tr');
    
            // Check that the correct number of rows are rendered
            expect(rows.length).toBe(2);
    
            // Check the contents of the first row
            const firstRow = rows[0];
            expect(firstRow.querySelector('.roleId-1').textContent).toBe('RL001');
            expect(firstRow.querySelector('.roleName-1').textContent).toBe('Role 1');
            expect(firstRow.querySelector('.roleDescription-1').textContent).toBe('Description for Role 1');
            expect(firstRow.querySelector('.actions').querySelector('.assignUser')).toBeTruthy();
            expect(firstRow.querySelector('.actions').querySelector('.assignGroup')).toBeTruthy();
    
            // Check the contents of the second row
            const secondRow = rows[1];
            expect(secondRow.querySelector('.roleId-2').textContent).toBe('RL002');
            expect(secondRow.querySelector('.roleName-2').textContent).toBe('Role 2');
            expect(secondRow.querySelector('.roleDescription-2').textContent).toBe('Description for Role 2');
            expect(secondRow.querySelector('.actions').querySelector('.assignUser')).toBeTruthy();
            expect(secondRow.querySelector('.actions').querySelector('.assignGroup')).toBeTruthy();
        });

        it('should display "Assign User to Role" modal and populate users dropdown', () => {
            setLocalStorageItem('roles', JSON.stringify([{ id: 1, name: "Role 1", description: "Description for Role 1", assignedUsers: [] ,assignedGroups: []}]));
            setLocalStorageItem('users', JSON.stringify([{ id: 1, userName: "User 1" }, { id: 2, userName: "User 2" }]));

            renderRoles();
            
            const assignUserBtn = document.querySelector('#roleActions-1 .assignUser');
            assignUserBtn.click();

            expect(document.querySelector('.assignRoleToUserModal').style.display).toBe('flex');


            const userOptions = document.querySelectorAll('#usersSelectRole option');
            expect(userOptions.length).toBe(2);
            expect(userOptions[0].textContent).toBe('User 1');
            expect(userOptions[1].textContent).toBe('User 2');
        });

        it('should add selected users to the role', () => {
            setLocalStorageItem('roles', JSON.stringify([{ id: 1, name: "Role 1", description: "Description for Role 1", assignedUsers: [],assignedGroups: [] }]));
            setLocalStorageItem('users', JSON.stringify([{ id: 1, userName: "User 1" }, { id: 2, userName: "User 2" }]));

            renderRoles();
            const assignUserBtn = document.querySelector('#roleActions-1 .assignUser');            assignUserBtn.click();

            const userSelect = document.querySelector('#usersSelectRole');
            userSelect.options[0].selected = true;
            userSelect.options[1].selected = true;

            const assignUsersToRoleBtn = document.querySelector('#assignRolesToUserForm button[type="submit"]');
            assignUsersToRoleBtn.click();

            const roles = getLocalStorageItem('roles');
            expect(roles[0].assignedUsers).toEqual(['User 1', 'User 2']);

            const rolesTableBody = document.querySelector('#roleAssignmentsTable tbody');
            const rows = rolesTableBody.querySelectorAll('tr');

            const assigneduser= document.querySelector('.assignedUsers-1');
            expect(assigneduser.textContent).toContain(`User 1`);
    
    
        });

        it('prevents assigning duplicate users to the same role', () => {
            setLocalStorageItem('roles', JSON.stringify([{ id: 1, name: "Role 1", description: "Description for Role 1", assignedUsers: ['User 1'] }]));
            setLocalStorageItem('users', JSON.stringify([{ id: 1, userName: "User 1" }, { id: 2, userName: "User 2" }]));

            renderRoles();
            const assignUserBtn = document.querySelector('#roleActions-1 .assignUser');          
            assignUserBtn.click();

            const userSelect = document.querySelector('#usersSelectRole');
            userSelect.options[0].selected = true;
            userSelect.options[1].selected = true;

            const assignUsersToRoleBtn = document.querySelector('#assignRolesToUserForm button[type="submit"]');
            assignUsersToRoleBtn.click();

            const roles = getLocalStorageItem('roles');
            expect(roles[0].assignedUsers).toEqual(['User 1', 'User 2']);
        });

        it('should correctly assign users to multiple roles', () => {
            setLocalStorageItem('roles', JSON.stringify([
                { id: 1, name: "Role 1", assignedUsers: [],assignedGroups: [] },
                { id: 2, name: "Role 2", assignedUsers: [],assignedGroups: [] }
            ]));
            setLocalStorageItem('users', JSON.stringify([{ id: 1, userName: "User 1" }, { id: 2, userName: "User 2" }]));
        
            renderRoles();
            const assignUserBtnRole1 = document.querySelector('#roleActions-1 .assignUser');
            assignUserBtnRole1.click();
        
            const userSelect = document.querySelector('#usersSelectRole');
            userSelect.options[0].selected = true;
        
            const assignUsersToRoleBtn = document.querySelector('#assignRolesToUserForm button[type="submit"]');
            assignUsersToRoleBtn.click();
        
            const assignUserBtnRole2 = document.querySelector('#roleActions-2 .assignUser');
            assignUserBtnRole2.click();
        
            userSelect.options[1].selected = true;
            assignUsersToRoleBtn.click();
        
            const roles = getLocalStorageItem('roles');
            expect(roles[0].assignedUsers).toEqual(['User 1']);
            expect(roles[1].assignedUsers).toEqual(['User 2']);
        });

        it('should display success message when users are assigned role ', () => {

            setLocalStorageItem('roles', JSON.stringify([{ id: 1, name: "Role 1", description: "Description for Role 1", assignedUsers: [],assignedGroups: [] }]));
            setLocalStorageItem('users', JSON.stringify([{ id: 1, userName: "User 1" }, { id: 2, userName: "User 2" }]));

            renderRoles();
            const assignUserBtn = document.querySelector('#roleActions-1 .assignUser');            assignUserBtn.click();

            const userSelect = document.querySelector('#usersSelectRole');
            userSelect.options[0].selected = true;
            userSelect.options[1].selected = true;

            const assignUsersToRoleBtn = document.querySelector('#assignRolesToUserForm button[type="submit"]');
            assignUsersToRoleBtn.click();
        
            checkNotification("Role assigned for User(s) successfully!" );
        });
        

        it('should close the modal when the close button is clicked', () => {
            const closeAssignUserBtn = document.querySelector('#closeAssignUsersModal');

            closeAssignUserBtn.click();
            expect(document.querySelector('.assignRoleToUserModal').style.display).toBe('none');
        });

       

        
    });

    describe('Assign groups to Role', () => {

        beforeEach(() => {
            ({renderRoleAssignments,renderRoles} = require('../script.js'));
        });

        it('should display "Assign Group to Role" modal and populate groups dropdown', () => {
            setLocalStorageItem('roles', JSON.stringify([{ id: 1, name: "Role 1", description: "Description for Role 1", assignedGroups: [] }]));
            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1" }, { id: 2, groupName: "Group 2" }]));

            renderRoles();
            const assignGroupBtn = document.querySelector('#roleActions-1 .assignGroup');
            assignGroupBtn.click();

            expect(document.querySelector('.assignRoleToGroupModal').style.display).toBe('flex');

            const groupOptions = document.querySelectorAll('#groupsSelect option');
            expect(groupOptions.length).toBe(2);
            expect(groupOptions[0].textContent).toBe('Group 1');
            expect(groupOptions[1].textContent).toBe('Group 2');
        });

        it('should add selected groups to the role', () => {
            setLocalStorageItem('roles', JSON.stringify([{ id: 1, name: "Role 1", description: "Description for Role 1",assignedUsers: [] ,assignedGroups: [] }]));
            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1" }, { id: 2, groupName: "Group 2" }]));

            renderRoles();
            const assignGroupBtn = document.querySelector('#roleActions-1 .assignGroup');
            assignGroupBtn.click();

            const groupSelect = document.querySelector('#groupsSelect');
            groupSelect.options[0].selected = true;
            groupSelect.options[1].selected = true;

            const assignGroupsToRoleBtn = document.querySelector('#assignRolesToGroupForm button[type="submit"]');
            assignGroupsToRoleBtn.click();

            const roles = getLocalStorageItem('roles');
            expect(roles[0].assignedGroups).toEqual(['Group 1', 'Group 2']);
        });

        it('prevents assigning duplicate groups to the same role', () => {
            setLocalStorageItem('roles', JSON.stringify([{ id: 1, name: "Role 1", description: "Description for Role 1", assignedUsers: [] ,assignedGroups: ['Group 1'] }]));
            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1" }, { id: 2, groupName: "Group 2" }]));

            renderRoles();
            const assignGroupBtn = document.querySelector('#roleActions-1 .assignGroup');
            assignGroupBtn.click();

            const groupSelect = document.querySelector('#groupsSelect');
            groupSelect.options[0].selected = true;
            groupSelect.options[1].selected = true;

            const assignGroupsToRoleBtn = document.querySelector('#assignRolesToGroupForm button[type="submit"]');
            assignGroupsToRoleBtn.click();

            const roles = getLocalStorageItem('roles');
            expect(roles[0].assignedGroups).toEqual(['Group 1', 'Group 2']);
        });

        it('should display success message when groups are assigned role ', () => {

            setLocalStorageItem('roles', JSON.stringify([{ id: 1, name: "Role 1", description: "Description for Role 1",assignedUsers: [] ,assignedGroups: [] }]));
            setLocalStorageItem('groups', JSON.stringify([{ id: 1, groupName: "Group 1" }, { id: 2, groupName: "Group 2" }]));

            renderRoles();
            const assignGroupBtn = document.querySelector('#roleActions-1 .assignGroup');
            assignGroupBtn.click();

            const groupSelect = document.querySelector('#groupsSelect');
            groupSelect.options[0].selected = true;
            groupSelect.options[1].selected = true;

            const assignGroupsToRoleBtn = document.querySelector('#assignRolesToGroupForm button[type="submit"]');
            assignGroupsToRoleBtn.click();
        
            checkNotification("Role assigned for Group(s) successfully!" );
        });

        it('should close the modal when the close button is clicked', () => {
            const closeAssignGroupBtn = document.querySelector('#closeAssignGroupsModal');

            closeAssignGroupBtn.click();
            expect(document.querySelector('.assignRoleToGroupModal').style.display).toBe('none');
        });

        
    });



});

describe('showNotification', () => {
    let notification;

    beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        document.body.innerHTML = html;
        ({showNotification} = require('../script.js'));

        jest.resetModules();
        notification = document.getElementById('notification');
        notification.style.display = 'none';
        notification.style.opacity = '1';
        jest.useFakeTimers();
    });

    test('should display the notification with the correct message', () => {
        showNotification('Test message');
        expect(notification.textContent).toBe('Test message');
        expect(notification.style.display).toBe('block');
    });

    test('should hide the notification after 3.5 seconds', () => {
        showNotification('Test message');
        jest.advanceTimersByTime(3500); 
        expect(notification.style.display).toBe('none');
    });

    test('should fade out the notification before hiding', () => {
        showNotification('Test message');
        jest.advanceTimersByTime(3000); 
        expect(notification.style.opacity).toBe('0');
        
        jest.advanceTimersByTime(500);
        expect(notification.style.opacity).toBe('1');
    });

    test('should reset styles after hiding', () => {
        showNotification('Test message');
        jest.advanceTimersByTime(3000);
        jest.advanceTimersByTime(500); 

        expect(notification.style.display).toBe('none');
        expect(notification.style.opacity).toBe('1');
    });
});