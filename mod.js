import Ask from 'https://deno.land/x/ask@1.0.6/mod.ts'

const ask = new Ask()

const answers = await ask.prompt([
  {
    name: 'hyper connect string',
    type: 'input',
    message: 'hyper:'
  }
])

console.log(answers)