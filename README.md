# BBB Calculations

Weight calculator for Jim Wendler's [Boring But Big: Beefcake](https://www.jimwendler.com/blogs/jimwendler-com/boring-but-big-beefcake-training) 5/3/1 program.

Enter a training max per lift and every set for the cycle is worked out. Progress is saved in the browser's localStorage, and finishing a cycle raises the training max (+5 kg squat/deadlift, +2.5 kg press/bench).

## Development

```bash
npm install
npm run dev
```

`npm run build` exports a static site to `build/`, which Netlify publishes (see `netlify.toml`).
