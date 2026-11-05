# CineRental 🎬

A movie rental practice project built with **Next.js (App Router)**, **React Context + useReducer** and **Tailwind CSS v4**.

## Features
- Movie grid with posters, genre, star rating and price
- Sidebar filter: All Movies / Trending / New Releases / Coming Soon
- Movie details popup (click a poster or title)
- Shopping cart: add, remove, total price, checkout
- Duplicate guard — a movie can only be in the cart once
- Toast notifications (react-toastify)
- Dark / light mode toggle
- Responsive: mobile, tablet, desktop
- Close popups with the ✕ button, the Escape key, or clicking outside

## Run it
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Folder map
```
app/            layout.js (fonts + providers), page.js (the home page), globals.css (theme)
components/     all UI pieces (Header, Sidebar, MovieCard, modals ...)
context/        CartContext (cart state) + ThemeContext (dark mode)
reducers/       cartReducer.js — the pure function that updates the cart
data/           movies.js — the movie list
public/posters/ poster artwork
```
