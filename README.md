<h1 align="center">VUIVUI Ecommerce made with Next.js</h1>

> This project was made to show a full ecommerce plataform made with Next.js and Nextjs Serverless functions to build the backend, using Nextjs, Redux, Tailwind CSS, Typescript, RESTful API

<div align="center">
  <sub>The ecommerce project. Built with by MWG</sub>
</div>

<br />

---

# :pushpin: Table of Contents

* [Website staging](#eyes-demo-website)
* [Technologies](#computer-technologies)
* [Features](#rocket-features)
* [How to run](#construction_worker-how-to-run)
* [Found a bug? Missing a specific feature?](#bug-issues)
* [Contributing](#tada-contributing)
* [Documents Slider](#slider)
* [License](#closed_book-license)

# :eyes: Demo Website
The demo website can be missing some features, clone and run the project to a full experience. <br>
👉 testing: https://test.vuivui.com
👉 staging: https://stg.vuivui.com

# :computer: Technologies
This project was made using the follow technologies:

* [Next.js](https://nextjs.org/) - To SSR, ISR and routes control     
* [TypeScript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)
* [Redux](https://github.com/reduxjs/redux)
* [React-hook-form](https://github.com/react-hook-form/react-hook-form)
* [SWR](https://github.com/vercel/swr)
* [Redux Wrapper for Next.js](https://github.com/kirill-konshin/next-redux-wrapper)

# :rocket: Features

- Authentication with Cookies Sessions.
- Reset Password using email
- List Products
- Filter products by Category
- Sort list of products
- Live search
- Add products to Wishlist
- Add products to Cart
- Checkout page
- Payment with Paypal
- Review Products

  
# :construction_worker: How to run
**You need to install [Node.js](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/) first, then:**

###### Guidline using source code && maintain ?

> Merchant's seller center website

| env    | develop | production |
| ------ | ------- | ---------- |
| yarn   | 1.22.5  | 1.22.5     |
| nodejs | v14.7.3 | v14.7.3    |
| port   | 3000    |            |

## Getting Started

### Clone the project

Clone this repo to your local machine using:

```bash
git clone https://git.vuivui.com/buyer/website/vuivui.ecommerce
```

Developer pull origin branch dev => new branch with feature/name

### Install the dependencies

1. Change the current working directory to the project:

```bash
cd vuivui.ecommerce
```

2. Simply install the package dependencies by command:

```bash
yarn
```

### Setting Config

Create .env root project

### Start project

- Start development server at root project:

  ```bash
   yarn start
  ```

- Start development develop at root project:

  ```bash
   yarn dev
  ```

- build project and start production:

  ```bash
  yarn build
  ```

  after that

  ```bash
  yarn start
  ```

### Tool for Debug

- This repo use Redux to manage state client, so we use extension Redux DevTools to debug: use [this extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) for chrome and coccoc or [this extension](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/) For firefox.

- Add more, you should use React Developer Tools to debug for ReactJs: use [this extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) for chrome and CocCoc or [this extension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) For Firefox.


### Rename env file
Rename `.env.exemple.local` to `.env.local`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
<br>

## <span id="slider"> [Documents Slider](doc_slider.md)</span>

# :closed_book: License




Released in 2022.
This project is under the MWG