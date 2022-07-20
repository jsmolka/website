# sudo apt-get install fonttools

pyftsubset Inter.ttf --unicodes="U+0000-017F,U+2000-201F,U+20AC,U+2190,U+2192,U+21A9" --layout-features="calt,ccmp,kern,cv07,tnum" --flavor="woff2" --output-file="../static/fonts/inter.woff2"
pyftsubset JetBrainsMono.ttf --unicodes="U+0000-017F" --layout-features="" --flavor="woff2" --output-file="../static/fonts/jetbrains-mono.woff2"
pyftsubset JetBrainsMono-Italic.ttf --unicodes="U+0000-017F" --layout-features="" --flavor="woff2" --output-file="../static/fonts/jetbrains-mono-italic.woff2"

function hash() {
  echo $(sha256sum $1 | awk '{ print $1 }')
}

hash_inter=$(hash ../static/fonts/inter.woff2)
hash_jetbrains_mono=$(hash ../static/fonts/jetbrains-mono.woff2)
hash_jetbrains_mono_italic=$(hash ../static/fonts/jetbrains-mono-italic.woff2)

echo -n "// Auto generated by subset.sh

@font-face {
  font-family: 'Inter';
  font-weight: 100 900;
  font-display: block;
  src: url('/fonts/inter.woff2?version=${hash_inter}') format('woff2');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-weight: 100 800;
  font-display: block;
  font-style: normal;
  src: url('/fonts/jetbrains-mono.woff2?version=${hash_jetbrains_mono}') format('woff2');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-weight: 100 800;
  font-display: block;
  font-style: italic;
  src: url('/fonts/jetbrains-mono-italic.woff2?version=${hash_jetbrains_mono_italic}') format('woff2');
}
" > "../assets/scss/_typography.scss"

echo -n "<!-- Auto generated by subset.sh -->

<link href=\"/fonts/inter.woff2?version=${hash_inter}\" rel=\"preload\" as=\"font\" type=\"font/woff2\" crossorigin=\"\">
<link href=\"/fonts/jetbrains-mono.woff2?version=${hash_jetbrains_mono}\" rel=\"preload\" as=\"font\" type=\"font/woff2\" crossorigin=\"\">
<link href=\"/fonts/jetbrains-mono-italic.woff2?version=${hash_jetbrains_mono_italic}\" rel=\"preload\" as=\"font\" type=\"font/woff2\" crossorigin=\"\">
" > "../layouts/partials/preload.html"
