describe('Message Capsule Flow', () => {
    beforeEach(() => {

        cy.visit('/');
    });

    it('logs in and creates a new capsule when it is time to open', () => {

        cy.visit('/login');


        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="password"]').type('password');
        cy.get('button[type="submit"]').click();


        cy.url().should('eq', 'http://127.0.0.1:5173/');


        cy.contains('Create Capsule');


        cy.visit('/create');


        cy.get('textarea#message').type('This is a test capsule');


        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 1);

        const formattedTime = futureDate.toISOString().slice(0, 16);
        cy.get('input#schedule').type(formattedTime);
        futureDate.setHours(futureDate.getHours() + 5);

        cy.get('button[type="submit"]').click();

        cy.visit('/');
        cy.contains(futureDate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        );
    });

    it('displays an error if capsule is opened before scheduled time', () => {
        cy.visit('/login');


        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="password"]').type('password');
        cy.get('button[type="submit"]').click();


        cy.url().should('eq', 'http://127.0.0.1:5173/');
        cy.visit('/');


        cy.contains('Waiting').first().click();

        cy.contains("This capsule is not ready to be opened yet");

    });
});
