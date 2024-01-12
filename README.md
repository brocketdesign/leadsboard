Email Fetcher Application Setup Guide

Hello! Ready to dive into the world of email fetching with a simple click? Let's get you set up with this handy Email Fetcher Application that sifts through Gmail looking for those precious 'DOMimmo - Réponse annonce' emails. Don't worry, it's as easy as pie!
Prerequisites

Before we get rolling, make sure you have these installed:

    Node.js (Download it from Node.js website)
    Git (Snag it from Git website)

Got 'em? Great! Let's move to the fun part.
Installation

First, we need to clone the repository from GitHub to your local machine. Here's the magic spell to do that:

sh

git clone https://github.com/your-username/email-fetcher.git
cd email-fetcher

Replace https://github.com/your-username/email-fetcher.git with the actual URL of your repository. Now, let's install all those gears and cogs that make our app tick:

sh

npm run install-client
npm run install-server

This might take a minute or two, so feel free to grab a coffee or challenge yourself to a quick round of squats!
Running the Application

Once the installation is done and you're all caffeinated, it's time to bring the app to life:

sh

npm start

This command will start both the server and the client simultaneously. You'll see some action in your command prompt, and voila! The app will open up in your default browser faster than a cat on a hot tin roof.
Fetching Emails

To fetch those emails, just click the 'Authenticate with Google' button to log in to your Gmail account. Then, hit 'Fetch Emails' to start the magic. The app will look for emails with the subject 'DOMimmo - Reponse annonce', extract the juicy details, and present them in a neat table for you.
Under the Hood

The app uses regular expressions (those weird /\Titre : (.*)\r\n/ patterns) to extract details from the emails. It's like a treasure hunt, but for data!
