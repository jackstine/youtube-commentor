import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace'
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = process.env.ROLLUP_WATCH === 'false';

const prod = replace({
  // can replace constants as well
  preventAssignment: true,
  process: JSON.stringify({
    env: {
      ENDPOINT: "https://api.ytcommenter.byteofcode.io/",
    }
  }),
})

const dev = replace({
  // can replace constants as well
  preventAssignment: true,
  process: JSON.stringify({
    env: {
      ENDPOINT: "http://localhost:8080/",
    }
  }),
})

const environment = production ? prod : dev

const plugins = function (cssFile) {
  return [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production
      }
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: cssFile }),
    environment,
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ]
}


function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

const o = {
  sourcemap: !production,
  compact: production,
  format: 'iife'
}

export default [{
    input: 'src/injection.js',
    output: {
      ...o,
      name: 'app',
      file: 'public/build/injection/injection.js'
    },
    plugins: plugins("injection.css"),
    watch: {
      clearScreen: false
    }
  },
  {
    input: 'src/popup.js',
    output: {
      ...o,
      name: 'app',
      file: 'public/build/popup/popup.js'
    },
    plugins: plugins('popup.css'),
    watch: {
      clearScreen: false
    }
  }
]
