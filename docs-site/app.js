import { resolveSync } from './source-map-resolve-browser.js'

const code = document.querySelector('#code')
const codeUrl = document.querySelector('#code-url')
const output = document.querySelector('#result')
const button = document.querySelector('#resolve')

function resolveInput () {
  try {
    const result = resolveSync(code.value, codeUrl.value, () => {
      throw new Error('The example expects an embedded map; no external reader is configured.')
    })
    output.textContent = result === null ? 'No recognized source-map directive.' : JSON.stringify(result, null, 2)
  } catch (error) {
    output.textContent = `${error.name}: ${error.message}`
  }
}

button.addEventListener('click', resolveInput)
resolveInput()
