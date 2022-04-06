import { faker } from '@faker-js/faker';

let userData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(20)
};
 
describe('Authentication Tests suite preprod.backmarket', () => {
    beforeEach(() => {
        cy.visit('/register');
        cy.get('[data-qa="accept-cta"]').click();
    })
    it('should authenticate user with valid credentials', () => {
       
        //le prénom peut être un string de 1 char ou bien encore 1 nombre mais ne doit pas être vide
        cy.get('#firstName').should('not.have.class', 'border-danger').type(userData.firstName).should('have.value', userData.firstName);

        //le nom peut être un string de 1 char ou bien encore 1 nombre mais ne doit pas être vide
        cy.get('#lastName').should('not.have.class', 'border-danger').type(userData.lastName).should('have.value', userData.lastName);

        //l'email peut être bizarre genre 1@5.51
        //erreur annoncée: Saisissez une adresse e-mail valide.
        cy.get('#signup-email').should('not.have.class', 'border-danger').type(userData.email).should('have.value', userData.email);

        //le mot de passe doit faire une certaine longueur
        //erreur annoncée: Au moins 8 caractères, dont 1 majuscule, 1 minuscule et 1 chiffre.
        cy.get('#signup-password').should('not.have.class', 'border-danger').type(userData.password);

        cy.get('[data-qa="signup-submit-button"]').click()
        cy.wait(100);

        //Assertions
        cy.url().should('eq', 'https://preprod.backmarket.fr/dashboard/orders');
        cy.contains('Mon profil').should('be.visible');
        cy.get('h2').contains('Mes commandes');
        cy.get('[data-qa="dashboard-navigation-profil"]').should('exist');
    });

    it('should display error message for invalid password', () => {
        
        cy.get('#firstName').type(userData.firstName).should('have.value', userData.firstName);
        cy.get('#lastName').type(userData.lastName).should('have.value', userData.lastName);
        cy.get('#signup-email').type(userData.email).should('have.value', userData.email);
        cy.get('#signup-password').type("1234");
        cy.get('[data-qa="signup-submit-button"]').click();  
        cy.get('#signup-password').should('have.class', 'border-danger');
        cy.url().should('eq', 'https://preprod.backmarket.fr/register');   
    });
    it('should display error message for invalid email', () => {
        
        cy.get('#firstName').type(userData.firstName).should('have.value', userData.firstName);
        cy.get('#lastName').type(userData.lastName).should('have.value', userData.lastName);
        cy.get('#signup-email').type("gdfgdfg@555");
        //tester la phrase d'erreur
        cy.get('#signup-password').type(userData.password).should('have.value', userData.password);

        cy.get('[data-qa="signup-submit-button"]').click();  
        cy.contains("Saisissez une adresse e-mail valide.").should('exist'); 
        cy.url().should('eq', 'https://preprod.backmarket.fr/register');
    });
    it('should display error message for invalid fields', () => {   
    
        cy.get('[data-qa="signup-submit-button"]').click();

        cy.get('#firstName').should('have.class', 'border-danger');
        cy.get('#lastName').should('have.class', 'border-danger');
        cy.get('#signup-email').should('have.class', 'border-danger');
        cy.get('#signup-password').should('have.class', 'border-danger');
        
        cy.get('[data-test="signup-component"]').contains("Le champ \"Prénom\" est obligatoire").should('exist'); 
        cy.get('[data-test="signup-component"]').contains("Le champ \"Nom\" est obligatoire").should('exist'); 
        cy.get('[data-test="signup-component"]').contains("Le champ \"Email\" est obligatoire").should('exist'); 
        cy.get('[data-test="signup-component"]').contains("Le champ mot de passe est obligatoire").should('exist');   
        cy.url().should('eq', 'https://preprod.backmarket.fr/register');

    });
    it('should login user with valid credentials', () => {

        cy.get('#signin-email').should('not.have.class', 'border-danger').type(userData.email).should('have.value', userData.email);
        cy.get('#signin-password').should('not.have.class', 'border-danger').type(userData.password);

        cy.get('[data-qa="signin-submit-button"]').click();
        cy.url().should('eq', 'https://preprod.backmarket.fr/dashboard/orders');
    });
})