const fs = require('fs');
const path = require('path');

describe('HTML', () => {

    //* Helper Functions

    function checkElement(selector, attributes) {
        const element = document.querySelector(selector);
        expect(element).toBeTruthy();
        Object.keys(attributes).forEach(attr => {
            expect(element.getAttribute(attr)).toBe(attributes[attr]);
        });
        return element;
    }

    function checkStyles(selector, expectedStyles) {
        const element = document.querySelector(selector);
        expect(element).toBeTruthy();
        const styles = window.getComputedStyle(element);
        Object.keys(expectedStyles).forEach(style => {
            expect(styles[style]).toBe(expectedStyles[style]);
        });
    }

    function checkContains(containerSelector, childSelectors) {
        const container = document.querySelector(containerSelector);
        expect(container).toBeTruthy();
        childSelectors.forEach(childSelector => {
            const child = document.querySelector(childSelector);
            expect(container.contains(child)).toBe(true);
        });
    }

    function checkTextContent(selector, expectedText) {
        const element = document.querySelector(selector);
        expect(element).toBeTruthy();
        expect(element.textContent).toBe(expectedText);
    }

    function checkInnerHtml(selector, expectedText) {
        const element = document.querySelector(selector);
        expect(element).toBeTruthy();
        expect(element.innerHTML).toBe(expectedText);
    }

    function checkNthChildTextContent(trSelector, expectedTextContents) {
        const tr = document.querySelector(trSelector);
        expect(tr).toBeTruthy();
        
        const children = tr.children;
        //expect(children.length).toBe(expectedTextContents.length);
    
        for (let i = 0; i < expectedTextContents.length; i++) {
            expect(children[i].textContent).toBe(expectedTextContents[i]);
        }
    }

    function checkDisabledState(selector, expectedDisabled) {
        const element = document.querySelector(selector);
        expect(element).toBeTruthy();
        expect(element.disabled).toBe(expectedDisabled);
    }

    function checkElementCount(divSelector, elementTag, expectedCount) {
        const divElement = document.querySelector(divSelector);
        const elements = divElement.querySelectorAll(elementTag);
        expect(elements).toHaveLength(expectedCount);
    }

    beforeEach(() => {
        
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        const cssContent = fs.readFileSync(path.resolve(__dirname, '../css/styles.css'), 'utf8');
        
        document.body.innerHTML = html;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);

        jest.resetModules();

    });

    describe('Title and Body', () => {


        it('Head and Body', () => {
            checkElement('head',{});
            checkElement('meta', {charset:"UTF-8"});
            checkElement('meta[name="viewport"]', {content:"width=device-width, initial-scale=1.0"});
            checkTextContent('title',"User Management System");
            checkElement('link[rel="stylesheet"',{href:"css/styles.css"});
            checkContains('body', ['.sidebar','#userPage','#groupPage','#rolePage','script']);
        });

    });

    describe('Side Bar', () => {


        it('Sidebar Contents ', () => {

            checkContains('.sidebar', ['.logo_content','.nav_list']);
            checkContains('.logo_content',['.logo','.logo_content i']);
            checkContains('.logo',['.logo i','.logo_name']);
            checkContains('.logo_name',['h3']);
            checkContains('.nav_list',['li','#user','#group','#role']);
            checkContains('#user',['#user i','#user span[class="links_name"]']);
            checkContains('#group',['#group i','#group span[class="links_name"]']);
            checkContains('#role',['#role i','#role span[class="links_name"]']);


        });

        it('Sidebar', () => {

            checkTextContent('.logo_name h3',"Manage Users");
            checkElement('.logo i',{class:"fa-solid fa-users-gear"});
            checkElement('.logo_content #btn',{class:"fa-solid fa-bars"});
            checkElementCount('.nav_list','li', 3);
            checkElement('#user',{
                href: "#userPage",
                class: 'selected',
            });
            checkElement('#group',{
                href: "#groupPage",
            });
            checkElement('#role',{
                href: "#rolePage",
            });
            
            checkElement('#user i',{class:"fa-solid fa-user"});
            checkElement('#group i',{class:"fa-solid fa-user-group"});
            checkElement('#role i',{class:"fa-solid fa-user-gear"});
            checkTextContent('#user span[class="links_name"]', "User Management");
            checkTextContent('#group span[class="links_name"]', "Group Management");
            checkTextContent('#role span[class="links_name"]', "Role Management");

        });
    
    });

    describe('Users Page', () => {

        it('Elements of Content', () => {

            checkContains('#userPage', ['h1','.addUserModal','.topic','.tableusers','.updateUserModal']);
            checkTextContent('#userPage h1', "User Management");

        });

        it('Add User Modal', () => {

            checkContains('.addUserModal', ['form','#addUserForm','#closeAddUserModal','#addUserForm h3','#addUserForm label','#addUserForm input','.addUserModalBtns',]);

            checkStyles('.addUserModal',{display:'none'});
            checkElement('#addUserForm',{autocomplete: "off"});

            checkElement('#closeAddUserModal',{type: "button"});
            checkTextContent('#closeAddUserModal', "Close");
            checkTextContent('#addUserForm h3', "Add User");
            checkElementCount('#addUserForm','label', 4);
            checkElementCount('#addUserForm','input', 4);
            checkTextContent('label[for="userName"]', "Username:");
            checkElement('#userName',{
                type: 'text',
                required: ''
            });
            checkTextContent('label[for="email"]', "Email:");
            checkElement('#email',{
                type: 'email',
                required: ''
            });
            checkTextContent('label[for="firstName"]', "First Name:");
            checkElement('#firstName',{
                type: 'text',
                required: ''
            });
            checkTextContent('label[for="lastName"]', "Last Name:");
            checkElement('#lastName',{
                type: 'text',
                required: ''
            });
            checkContains('.addUserModalBtns',['#submitAddUserModal','#clear']);
            checkElement('#submitAddUserModal',{
                type: 'submit',
            });
            checkElement('#clear',{
                type: 'reset',
            });
            checkDisabledState('#addUserForm #submitAddUserModal', false);   
            checkDisabledState('#addUserForm #clear', false);          
            checkTextContent('#submitAddUserModal', "Add User");
            checkTextContent('#clear', "Clear");

        });

        it('Topic User List', () => {

            checkContains('.topic',['#userList','.createBtn2']);
            checkTextContent('#userList', "Users List");
            checkContains('.createBtn2',['#addUser','.createBtn2 i']);
            checkElement('.createBtn2 i',{class:'fa-solid fa-user-plus'})
            checkTextContent('.createBtn2 button'," Create User")

        });

        it('User Table', () => {

            checkContains('.tableusers', ['#usersTable']);
            checkContains('#usersTable', ['thead','tr','th','tbody']);
            checkElementCount('#usersTable thead tr','th',6);
            checkNthChildTextContent('#usersTable thead tr', [
                'User ID',
                'User Name',
                'Email',
                'First Name', 
                'Last Name',  
                'Actions'
            ]);
            checkInnerHtml('#usersTable tbody','');

        });

        it('Update User Modal', () => {

            checkContains('.updateUserModal', ['#updateUserForm']);
            checkElement('.updateUserModal',{style: "display:none;",});
            checkElement('#updateUserForm',{autocomplete: "off"});
            checkTextContent('#updateUserForm h3', "Update User");
            checkContains('#updateUserForm', ['#updateUserForm h3','#updateUserForm label','#updateUserForm input','#updateUserForm button']);
            
            checkElementCount('#updateUserForm','label',4);
            checkElementCount('#updateUserForm','input',4);
            
            checkTextContent('label[for="updateUsername"]', "Username:");
            checkElement('#updateUsername',{
                type: 'text',
                required: ''
            });
            checkTextContent('label[for="updateEmail"]', "Email:");
            checkElement('#updateEmail',{
                type: 'email',
                required: ''
            });
            checkTextContent('label[for="updateFirstName"]', "First Name:");
            checkElement('#updateFirstName',{
                type: 'text',
                required: ''
            });
            checkTextContent('label[for="updateLastName"]', "Last Name:");
            checkElement('#updateLastName',{
                type: 'text',
                required: ''
            });
            checkElement('#updateUserForm button',{
                type: 'submit',
            });
            checkDisabledState('#updateUserForm #submitUpdateUserModal', false);            
            checkTextContent('#updateUserForm #submitUpdateUserModal', "Update User");
            
            checkDisabledState('#updateUserForm #cancelEdit', false);            
            checkTextContent('#updateUserForm #cancelEdit', "Cancel");
        });  
            
    });

    describe('Group Page', () => {

        it('Elements of Content', () => {

            checkContains('#groupPage', ['#groupPage h1', '.createGroupModal','#groupPage .topic', '#groupPage .tablegroups','#groupPage .addUserToGroupModal','#groupPage .removeUserFromGroup']);
            checkTextContent('#groupPage h1', "Group Management");
        });
    
        it('Create Group Modal', () => {
            checkContains('.createGroupModal', ['#createGroupForm', '#closeCreateGroupModal', '#createGroupForm h3', '#createGroupForm label', '#createGroupForm input', '#submitCreateGroupModal']);
    
            checkStyles('.createGroupModal', { display: 'none' });
            checkElement('#createGroupForm', { autocomplete: "off" });
    
            checkElement('#closeCreateGroupModal', { type: "button" });
            checkTextContent('#closeCreateGroupModal', "Close");
            checkTextContent('#createGroupForm h3', "Create Group");
            checkElementCount('#createGroupForm', 'label', 1);
            checkElementCount('#createGroupForm', 'input', 1);
            checkTextContent('label[for="groupName"]', "Group Name:");
            checkElement('#groupName', {
                type: 'text',
                required: ''
            });

            checkElement('#submitCreateGroupModal', {
                type: 'submit',
            });

            checkDisabledState('#createGroupForm #submitCreateGroupModal', false);
            checkTextContent('#submitCreateGroupModal', "Create Group");

    
        });
    
        it('Topic Group List', () => {
            checkContains('#groupPage .topic', ['#groupList', '#groupPage .topic .createBtn2']);
            checkTextContent('#groupList', "Groups List");
            checkContains('#groupPage .topic .createBtn2', ['#createGroup', '.createBtn2 #createGroup i']);
            checkElement('.createBtn2 #createGroup i', { class: 'fa-solid fa-people-group' });
            checkTextContent('.createBtn2 #createGroup', " Create Group");
        });
    
        it('Group Table', () => {
            checkContains('#groupPage .tablegroups', ['#groupsTable']);
            checkContains('.tablegroups #groupsTable', ['#groupsTable thead', '#groupsTable tr', '#groupsTable th', '#groupsTable tbody']);
            checkElementCount('#groupsTable thead tr', 'th', 4);
            checkNthChildTextContent('#groupsTable thead tr', [
                'Group ID',
                'Group Name',
                'Users',
                'Actions'
            ]);
            checkInnerHtml('#groupsTable tbody', '');
        });
    
        it('Add Users to Group Modal', () => {

            checkContains('.addUserToGroupModal', ['#addUsersToGroupForm', '#closeAddUser', '#addUsersToGroupForm h3', '#addUsersToGroupForm label', '#addUsersToGroupForm select', '#addUsersToGroupForm button']);
            checkStyles('.addUserToGroupModal', { display: 'none' });
            checkElement('#addUsersToGroupForm', { autocomplete: "off" });    
            checkElement('#closeAddUser', { type: "button" });
            checkTextContent('#closeAddUser', "Close");  
            checkTextContent('#addUsersToGroupForm h3', "Add Users to Group");   
            checkTextContent('label[for="usersSelect"]', "Select Users:");   
            checkElement('#usersSelect', {
                multiple: '',
                required: ''
            });
    
            checkElement('#addUsersToGroupForm button[type="submit"]', {});
        });

        it('Remove Users from Group Modal', () => {

            checkContains('.removeUserFromGroup', ['#removeUserFromGroup', '#closeRemoveUser', '#removeUserFromGroup h3', '#removeUserFromGroup label', '#removeUserFromGroup select', '#removeUserFromGroup button']);
            checkStyles('.removeUserFromGroup', { display: 'none' });
            checkElement('#removeUserFromGroup', { autocomplete: "off" });
    
            checkElement('#closeRemoveUser', { type: "button" });
            checkTextContent('#closeRemoveUser', "Close");
            checkTextContent('#removeUserFromGroup h3', "Remove Users from Group");
    
            checkTextContent('label[for="usersSelectRemove"]', "Select Users:");
            checkElement('#usersSelectRemove', {
                multiple: '',
                required: ''
            });
    
            checkElement('#removeUserFromGroup button[type="submit"]', {});
            checkTextContent('#removeUserFromGroup button[type="submit"]', "Remove Users from Group");
        });
    

    });

    describe('Roles Page', () => {

        it('Elements of Role', () => {
            checkContains('#rolePage', ['#rolePage h1', '.createRoleModal', '#rolePage .topic', '.tableroles', '.assignRoleToUserModal', '.assignRoleToGroupModal', '.tableroleassignments']);
            checkTextContent('#rolePage h1', "Role Management");
        });

        it('Create Role Modal', () => {
            checkContains('.createRoleModal', ['#createRoleForm', '#closeCreateRoleModal', '#createRoleForm h3', '#createRoleForm label', '#createRoleForm input', '#createRoleForm textarea', '#createRoleForm button']);
            checkStyles('.createRoleModal', { display: 'none' });

            checkElement('#createRoleForm', { autocomplete: "off" });

            checkElement('#closeCreateRoleModal', { type: "button" });
            checkTextContent('#closeCreateRoleModal', "Close");

            checkTextContent('#createRoleForm h3', "Create Role");

            checkTextContent('label[for="roleName"]', "Role Name:");
            checkElement('#roleName', {
                type: 'text',
                required: ''
            });

            checkTextContent('label[for="roleDescription"]', "Role Description:");
            checkElement('#roleDescription', { rows: "4", cols: "50" });

            checkElement('#submitCreateRoleModal', { type: 'submit' });
            checkTextContent('#submitCreateRoleModal', "Create Role");
        });

        it('Topic Role List', () => {
            checkContains('#roleListdiv', ['#roleList', '.createbtn']);
            checkTextContent('#roleList', "Roles List");

            checkContains('.createbtn', ['.search', '.createRoleBtn']);
            checkElement('#searchRole', { type: "search", placeholder: "Search for roles.." });

            checkContains('.createRoleBtn', ['#createRole', '.createRoleBtn i']);
            checkElement('.createRoleBtn i', { class: "fa-solid fa-user-plus" });
            checkTextContent('#createRole', " Create Role");
        });

        it('Roles Table', () => {
            checkContains('#rolesTablediv', ['#rolesTable']);
            checkContains('#rolesTable', ['#rolesTable thead', '#rolesTable tr', '#rolesTable th', '#rolesTable tbody']);
            checkElementCount('#rolesTable thead tr', 'th', 4);

            checkNthChildTextContent('#rolesTable thead tr', [
                'Role ID',
                'Role Name',
                'Description',
                'Actions'
            ]);

            checkInnerHtml('#rolesTable tbody', '');
        });

        it('Assign Users to Role Modal', () => {
            checkContains('.assignRoleToUserModal', ['#assignRolesToUserForm', '#closeAssignUsersModal', '#assignRolesToUserForm h3', '#assignRolesToUserForm label', '#assignRolesToUserForm select', '#assignRolesToUserForm button']);
            checkStyles('.assignRoleToUserModal', { display: 'none' });

            checkElement('#assignRolesToUserForm', { autocomplete: "off" });

            checkElement('#closeAssignUsersModal', { type: "button" });
            checkTextContent('#closeAssignUsersModal', "Close");

            checkTextContent('#assignRolesToUserForm h3', "Assign Users");

            checkTextContent('label[for="usersSelectRole"]', "Select Users:");
            checkElement('#usersSelectRole', {
                multiple: '',
                required: ''
            });

            checkElement('#assignRolesToUserForm button[type="submit"]', {});
            checkTextContent('#assignRolesToUserForm button[type="submit"]', "Assign Role to Users");
        });

        it('Assign Groups to Role Modal', () => {
            checkContains('.assignRoleToGroupModal', ['#assignRolesToGroupForm', '#closeAssignGroupsModal', '#assignRolesToGroupForm h3', '#assignRolesToGroupForm label', '#assignRolesToGroupForm select', '#assignRolesToGroupForm button']);
            checkStyles('.assignRoleToGroupModal', { display: 'none' });

            checkElement('#assignRolesToGroupForm', { autocomplete: "off" });

            checkElement('#closeAssignGroupsModal', { type: "button" });
            checkTextContent('#closeAssignGroupsModal', "Close");

            checkTextContent('#assignRolesToGroupForm h3', "Assign Groups");

            checkTextContent('label[for="groupsSelect"]', "Select Groups:");
            checkElement('#groupsSelect', {
                multiple: '',
                required: ''
            });

            checkElement('#assignRolesToGroupForm button[type="submit"]', {});
            checkTextContent('#assignRolesToGroupForm button[type="submit"]', "Assign Role to Groups");
        });

        it('Topic Role Assignments', () => {
            checkContains('#roleAssignmentsdiv', ['#roleAssignments', '.view']);
            checkTextContent('#roleAssignments', "Role Assignments");

            checkContains('.view', ['.view .search', '.view .viewRoles']);
            checkElement('#searchRole', { type: "search", placeholder: "Search for roles.." });

            checkContains('.viewRoles', ['#viewRoles', '.viewRoles i']);
            checkElement('.viewRoles i', { class: "fa-solid fa-eye" });
            checkTextContent('#viewRoles', " View Roles");
        });

        it('Role Assignments Table', () => {
            checkContains('.tableroleassignments', ['#roleAssignmentsTable']);
            checkContains('#roleAssignmentsTable', ['#roleAssignmentsTable thead', '#roleAssignmentsTable tr', '#roleAssignmentsTable th', '#roleAssignmentsTable tbody']);
            checkElementCount('#roleAssignmentsTable thead tr', 'th', 3);

            checkNthChildTextContent('#roleAssignmentsTable thead tr', [
                'Role Name',
                'Assigned Users',
                'Assigned Groups'
            ]);

            checkInnerHtml('#roleAssignmentsTable tbody', '');
        });  

    });

    describe('Script file', () => {

        it('Script', () => {
            checkElement('script',{src:"script.js"});
        });

    });

});

