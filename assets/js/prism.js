const Prism = require('prismjs');
require('prismjs/components/prism-clike');
require('prismjs/components/prism-c');
require('prismjs/components/prism-cpp');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-batch');
require('prismjs/components/prism-diff');
require('prismjs/components/prism-python');
require('prismjs/components/prism-toml');
require('prismjs/plugins/diff-highlight/prism-diff-highlight');

Prism.languages.armv4t = {
  comment: {
    pattern: /;.*/,
    greedy: true,
  },
  function: /\b(lsl|asr|lsr|ror|bx|b|bl|and|eor|sub|sbc|rsb|add|adc|sbc|rsc|tst|teq|cmp|cmn|orr|mov|bic|mvn|mrs|msr|mla|mul|umull|mulal|smull|smlal|ldr|ldrb|ldrh|str|strb|strh|ldrsb|ldrsh|ldmed|ldmea|ldmfd|ldmfa|stmed|stmea|stmfd|stmfa|swp|swpb|push|pop)s?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al|nv)?\b/,
  keyword: /\b(r0|r1|r2|r3|r4|r5|r6|r7|r8|r9|r10|r11|r12|r13|r14|r15|pc|lr|sp)\b/,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
};

Prism.languages.drizzle = {
	comment: {
		pattern: /(^|[^\\])#.*/,
		lookbehind: true
	},
	'triple-quoted-string': {
		pattern: /(?:[rub]|br|rb)?(""")[\s\S]*?\1/i,
		greedy: true,
		alias: 'string'
	},
	string: {
		pattern: /(?:[rub]|br|rb)?(")(?:\\.|(?!\1)[^\\\r\n])*\1/i,
		greedy: true
	},
	function: {
		pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
		lookbehind: true
	},
	'class-name': {
		pattern: /(\bclass\s+)\w+/i,
		lookbehind: true
	},
	keyword: /\b(assert|block|break|case|class|continue|def|elif|else|extends|false|for|if|in|noop|null|print|return|super|switch|this|true|var|while|yield)\b/,
	boolean: /\b(?:false|null|true)\b/,
	number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
	punctuation: /[{}[\];(),.:]/
};

Prism.languages.cpp.keyword = [
  Prism.languages.cpp.keyword,
  /\b(u8|u16|u32|u64|s8|s16|s32|s64|uint)\b/,
];
