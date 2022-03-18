var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/ogigg/teamdeck-helper', // Update to point to your repository  
        user: {
            name: 'Oskar Gierszewski', // update to use your name
            email: 'gierszon10@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)