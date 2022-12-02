# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of login page"](https://github.com/Funk3/tinyapp/blob/main/docs/login_page.png)
!["Screenshot of register page"](https://github.com/Funk3/tinyapp/blob/main/docs/register_page.png)
!["Screenshot of "myurls" page"](https://github.com/Funk3/tinyapp/blob/main/docs/myurls_page.png)
!["Screenshot of url editing page"](https://github.com/Funk3/tinyapp/blob/main/docs/url_edit.png)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Bugs

Do note that if you close and restart the server while still having a cookie, it will break the app. This is due to the fact that the databases are stored in memory and are deleted once the app is closed. Please delete your cookie when restarting the server!



