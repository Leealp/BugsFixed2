/// <reference types = "cypress" />

describe('Test with backend', () =>{
    beforeEach('login to the app', ()=>{
        
        cy.intercept({method:'GET',path:'tags'},{fixture:'tags.json'}) 
        cy.loginToApplication()
    })

    it('verify correct request and response', () => {

        //cy.route('POST','**/articles').as('postArticles')
        cy.intercept('POST','http://localhost:3000/api/articles').as('postArticles') 
        // cy.intercept('POST','https://api.realworld.io/api/articles/').as('GetUser')

        cy.contains('New Article').click()
        cy.get('[placeholder="Article Title"]').type('This is an Article')
        cy.get('[placeholder="What\'s this article about?"]').type('This is the description')
        cy.get('[placeholder="Write your article (in markdown)"]').type('This is the body of the Article')
        //cy.get('[placeholder="Enter tags"]').type('tag1')
        cy.contains('Publish').click()
        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr =>{
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is the body of the Article')
            expect(xhr.response.body.article.description).to.equal('This is the description')
        })  
    })

    it('verify correct request and response', () => {

        //cy.route('POST','**/articles').as('postArticles')
        cy.intercept('POST','http://localhost:3000/api/articles', req =>{
            req.reply(res =>{
                expect(res.body.article.description).to.equal('This is the description')
                res.body.article.description = 'This is the description 2'
            })
        }).as('postArticles')
        // cy.intercept('POST','https://api.realworld.io/api/articles/').as('GetUser')

        cy.contains('New Article').click()
        cy.get('[placeholder="Article Title"]').type('This is an Article')
        cy.get('[placeholder="What\'s this article about?"]').type('This is the description')
        cy.get('[placeholder="Write your article (in markdown)"]').type('This is the body of the Article')
        //cy.get('[placeholder="Enter tags"]').type('tag1')
        cy.contains('Publish').click()
        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr =>{
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.response.body.article.description).to.equal('This is the description 2')
            expect(xhr.request.body.article.body).to.equal('This is the body of the Article')
        })  
    })

    it('should give tags with routing object', () =>{
        cy.get('.tag-list')
        .should('contain','cypress')
        .and('contain','automation')
        .and('contain','testing')
    })

    it('verify global feed likes count', () =>{
        cy.intercept('GET','http://localhost:3000/api/articles/feed?limit=10&offset=0',{"articles":[],"articlesCount":0})
        cy.intercept('GET','http://localhost:3000/api/articles?limit=10&offset=0',{fixture:'articles.json'})              

        cy.contains('Global Fee').click()
  
        // cy.get('.col-md-9').get('button').then(listOfButtons =>{
        //     expect(listOfButtons[0]).to.contain('1')
        //     expect(listOfButtons[1]).to.contain('5')
        // })

        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug
            cy.intercept('POSt','http://localhost:3000/api/articles/articleLink/favorite',file) 
        })

        cy.get('.col-md-9 button')
        .eq(1)
        .click()
        .should('contain','4')
    })


    it.only('delete a new article in the Global Fee', ()=>{

        const userCredentials = {
            "user": {
              "email": "lyalpha@hotmail.com",
              "password": "12345"
            }
        }

        const bodyRequest = {
            "article": {
                "title": "Full stack Reactjs developer",
                "description": "React position",
                "body": "$60 per hour",
                "tagList": []
            }
        }

        cy.request('POST','http://localhost:3000/api/users/login',userCredentials)
        
        .its('body').then(body =>{
            console.log(body)

            const token = body.user.token;

            cy.request({
                url: 'http://localhost:3000/api/articles',
                headers: {'Authorization':'Token '+ token},
                method: 'POST',
                // failOnStatusCode: false,
                body: bodyRequest
            })
            .then(res =>{
                expect(res.status).to.equal(200)
            })

            cy.contains('Global Feed').click()
            cy.wait(50)
            cy.get('.article-preview').first().click()
            cy.wait(50)
            cy.get('.article-actions').contains('Delete Article').click()

            cy.request({
                url: 'http://localhost:3000/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token '+token},
                method: 'GET'
            }).its('body').then( body =>{
                console.log(body)
                expect(body.articles[0].title).not.to.equal('Full stack Reactjs developer')
            })

        })
    })
})

