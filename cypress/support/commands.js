// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('loginToApplication',() => {

    const userCredentials = {
        "user": {
          "email": "lyalpha@hotmail.com",
          "password": "12345"
        }
    }

    cy.request('POST','http://localhost:3000/api/users/login',userCredentials )                     // tried the save it to the local storage, but it didn't work!!!
        .its('body').then(body => {
            const token = body.user.token;

            cy.visit('/',{
                onBeforeLoad(win){
                    win.localStorage.setItem('jwtToken',token)
                }
            })

        })

    // cy.visit('user/login')
    // cy.get('[placeholder="Email"]').type('lyalpha@hotmail.com')
    // cy.get('[placeholder="Password"]').type('12345')
    // cy.get('form').submit()
})






