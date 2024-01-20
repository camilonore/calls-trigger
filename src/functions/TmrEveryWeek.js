const { app } = require('@azure/functions')
const { chromium } = require('playwright-chromium')
const { Resend } = require('resend')

const resend = new Resend('re_KHpXAM8J_KDfSdBf5BGKbdh1pjVkK2Mg2')
const URL =
  'https://www.uptc.edu.co/sitio/portal/sitios/universidad/rectoria/relinter/convoc/conv_sal/index.html'

app.timer('timerTrigger1', {
  schedule: '0 0 10 * * 1',
  handler: async (myTimer, context) => {
    context.log('Timer function processed request [TmrEveryWeek].')
    const browser = await chromium.launch()
    const page = await browser.newPage()

    await page.goto(URL)
    const listOfParents = await page.$$eval('h4', (titles) => {
      return titles.map((title) => title.parentElement.innerHTML)
    })

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'caminore22@gmail.com',
      subject: 'Lista de Convocatorias Intercambio UPTC!! 🚀',
      html: listOfParents.join('<hr/>')
    })

    if (error) {
      context.error({ ok: false, error })
      return console.error({ ok: false, error })
    }
    context.log({ ok: true, data })
    return console.log({ ok: true, data })
  }
})
