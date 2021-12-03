const root = __dirname + '/../../';

module.exports = {
  corePlugins: {
    container: false,
  },
  theme: {
    colors: {
      backdrop: {
        0: 'var(--backdrop-0)',
        1: 'var(--backdrop-1)',
        2: 'var(--backdrop-2)',
        3: 'var(--backdrop-3)',
      },
      neutral: {
        0: 'var(--neutral-0)',
        1: 'var(--neutral-1)',
        2: 'var(--neutral-2)',
        3: 'var(--neutral-3)',
      },
      accent: 'var(--accent)',
    },
    fontFamily: {
      alliance: 'alliance, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      mono: 'mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    screens: {
      sm: '40rem',
      md: '45rem',
      lg: '64rem',
      xl: '80rem',
    },
    extend: {
      width: {
        fit: 'fit-content',
      },
    },
  },
  variants: {
    extend: {
      borderWidth: [
        'first',
        'last',
      ],
      margin: [
        'first',
        'last',
      ],
      padding: [
        'first',
        'last',
      ],
    },
  },
  purge: {
    enabled: process.env.HUGO_ENVIRONMENT === 'production',
    content: [
      root + 'assets/**/*.js',
      root + 'assets/**/*.scss',
      root + 'content/**/*.md',
      root + 'content/**/*.html',
      root + 'layouts/**/*.html',
    ],
  },
};
