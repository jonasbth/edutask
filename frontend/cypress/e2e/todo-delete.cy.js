describe('Delete todo-item', () => {
  // Define variables that we need on multiple occasions
  let uid;   // user id
  let email; // email of the user
  let taskTitle; // Task title

  before(function () {
    // Create a fabricated user from a fixture
    cy.fixture('user.json')
      .then((user) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: user
        }).then((response) => {
          uid = response.body._id.$oid;
          email = user.email;
        });
      });

    // Create a fabricated task from a fixture
    // ('task.json' is in .gitignore so use 'task1.json')
    cy.fixture('task1.json')
      .then((task1) => {
        task1.userid = uid;
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/tasks/create',
          form: true,
          body: task1
        }).then((response) => {
          taskTitle = task1.title;
        });
      });
  });

  beforeEach(function () {
    cy.viewport(1024, 800);

    // Enter the main page
    cy.visit('http://localhost:3000');

    // Login using the created user

    // Find the input and type email (in a declarative way)
    cy.contains('Email Address')  // Gets label element
      .next()
      .type(email);

    // Submit the form on this page
    cy.get('form')
      .submit();

    // Find and click on the created task
    cy.get('.container-element')
      .contains(taskTitle)
      .click();

  })

  it('3.1 Delete todo-item', () => {
    // Assert that the length of the todo-list is two
    // (one todo-item plus the form to add todos)
    cy.get('.popup .todo-list')  // ul
      .children()  // li
      .should('have.length', 2);

    // cy.pause();

    // Click the delete-icon behind the description
    cy.get('.popup .todo-list')  // ul
      .children()  // li
      .first()
      .children()  // 3 span
      .last().as('deleteIcon');

    cy.get('@deleteIcon')
      .click();

    // cy.wait(500);

    // cy.get('@deleteIcon')
    //   .click();

    // Assert that the length of the todo-list is one
    // (only the form to add todos is left)
    cy.get('.popup .todo-list')  // ul
      .children()  // li
      .should('have.length', 1);
  })

  after(function () {
    // Clean up by deleting the user from the database.
    // Any associated tasks are also deleted.
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    });
  });
});
