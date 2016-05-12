heroes-messageboard
===================

`heroes-messageboard` is designed to make a streaming a bit easier for Heroes
of the Storm(tm).

The goal of the project is to allow streamers fast and easy access to the
graphical capabilities provided and animations allowed by HTML5/CSS/Javascript
without having to write or learn Flash or After Effects.

![Preview](https://raw.githubusercontent.com/jnovack/heroes-messageboard/master/preview.jpg)


## Use

This is not intended for public consumption at this time, I have a lot of code
that needs to be converted to environment variables and dependencies that need
to be documented.  Stay tuned!

My intent is to (docker)[http://docker.io]ize the dependencies as much as
possible, rather than relying on third-party storage.


### Development

A `nodemon.json` file should be created in the root so that `grunt` can run
properly.  This would hold all run-time environment variables you do not wish
to commit to the git repo.

    {
        "env": {
            "PORT": 3000
        }
    }
