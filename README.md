# gadget-checkin v1.0.0

![build status][https://travis-ci.org/jessgusclark/gadget-checkin.svg?branch=master]

This gadget displays the number of files currently checked out to the user in each site and gives the user the option to check them all back in.


## Version v1.0.0

No longer in development, V1 is ready for prime time! It has been a little over two years since this gadget has been refreshed. V1 includes fixes to prevent files being checked in that are under workflow, scheduled or set to expire. Also, it has gone back to being exclusively a dashboard gadget as the sidebar functionality was causing some issues on the dashboard.

For developers wanting to contribute or explore the code, it has been broken out into different classes. Also, tests were added for some of the functionality. The gadget is based of my [Gadget-Starter](https://github.com/jessgusclark/gadget-starter) code that I use for the majority of my OU Gadgets.

## Install

### Clone the repo and host locally

Make sure [npm](https://www.npmjs.com/), and [Gulp](http://gulpjs.com/) are installed on your machine.

```

npm install

gulp

```

Upload the /build folder to your production server and install via [OmniUpdate's Instructions](http://support.omniupdate.com/oucampus10/setup/gadgets/new-gadget.html)


### Install via GitHub pages

Make sure you always have the latest version and the quickest install by installing via GitHub.

Using [OmniUpdate's Instructions](http://support.omniupdate.com/oucampus10/setup/gadgets/new-gadget.html), when asked for the URL please use: https://jessgusclark.github.io/gadget-checkin/build/

## Contributing

Yes! Fork and put in a pull request. Report issues in the issues tab.
