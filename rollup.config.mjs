import compiler from "@ampproject/rollup-plugin-closure-compiler";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
export default {
  input: 'scripts/main.js',
  output: {
    file: 'scripts/main.js',
    format: 'es'
  },
  external: [
    '@minecraft/server'
  ],
  plugins: [
    
    json(), terser({
    compress:{
      toplevel: true,
      unsafe_methods: true,
      passes:3,
      booleans: true,
      keep_fargs: false,
      toplevel:true,
    },
    mangle:false,
     keep_fnames: true,    // <-- preserve function names
      format: {
        beautify: true,     // <-- keep readable formatting
        comments: false,    // <-- strip comments if you want
      }
  })
],
  
}
