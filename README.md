<h1 align="center">Forum API</h1>

<p align="center">
  Forum API: Register, login, post threads, comments, and replies effortlessly build with
  <a href="https://github.com/hapijs/hapi">
    HapiJs
  </a>
</p>

<p align="center">
  <a href="https://twitter.com/RyoPermana33">
    <img src="https://img.shields.io/twitter/follow/dubdotco?style=flat&label=muhammad-rio&logo=x&color=0bf&logoColor=fff" alt="Twitter" />
  </a>
  <img src="https://img.shields.io/badge/Coverage-100%25-brightgreen.svg"/>
</p>

<p align="center">
  <a href="https://github.com/hapijs/hapi">
    <img src="https://raw.githubusercontent.com/hapijs/assets/master/images/hapi.png" width="300px" alt="HapiJs" />
  </a>
</p>

## Quick Start
To develop locally, you will need to clone this repository and set up all the env vars outlined in the [`.env.example` file](https://github.com/muhamadrio-code/forum-api/blob/master/.env.example).

Once that's done, you can use the following commands to run the app locally:

1. Install all required dependencies
```
npm install
```
2. Run migrations
```
npm run migrate up

// or to running on test environtment
npm run migrate:test up
```
3. Run in develepment mode 
```
npm run dev
```

## Features

- User Sign Up
- User Login/Logout
- Post a Thread
- Add Comment to Thread
- Add Comment Reply

## Tech Stack
- [HapiJs](https://github.com/hapijs/hapi)
- Postgres






