<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import hljs from 'highlight.js/lib/core'

// Import common languages
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import swift from 'highlight.js/lib/languages/swift'
import kotlin from 'highlight.js/lib/languages/kotlin'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('php', php)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('swift', swift)
hljs.registerLanguage('kotlin', kotlin)

interface Props {
  code: string
  language?: string
  autoDetect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: '',
  autoDetect: true,
})

const codeRef = ref<HTMLElement>()

const highlightCode = () => {
  if (!codeRef.value) return

  if (props.language) {
    try {
      const result = hljs.highlight(props.code, { language: props.language })
      codeRef.value.innerHTML = result.value
    } catch {
      codeRef.value.textContent = props.code
    }
  } else if (props.autoDetect) {
    try {
      const result = hljs.highlightAuto(props.code)
      codeRef.value.innerHTML = result.value
    } catch {
      codeRef.value.textContent = props.code
    }
  } else {
    codeRef.value.textContent = props.code
  }
}

onMounted(() => {
  highlightCode()
})

watch(
  () => props.code,
  () => {
    highlightCode()
  },
)

watch(
  () => props.language,
  () => {
    highlightCode()
  },
)
</script>

<template>
  <pre class="code-block"><code ref="codeRef" class="hljs">{{ code }}</code></pre>
</template>

<style>
@import 'highlight.js/styles/atom-one-dark.css';

.code-block {
  margin: 0;
  padding: 0;
  background: transparent;
}

.code-block code {
  display: block;
  padding: 0;
  background: transparent;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: inherit;
  line-height: 1.5;
  tab-size: 2;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Customize theme colors to match our design */
.hljs {
  background: transparent !important;
  color: var(--color-text-primary);
}
</style>
