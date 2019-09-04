import Mailgen from 'mailgen'
import Mailgun from 'mailgun-js'

const {
  MAIL_API_KEY: apiKey = 'key-26568150d0bc087d701118c81b6405de',
  MAIL_DOMAIN: domain = 'sandbox052029cc14874e43a59c00d0a9a999bc.mailgun.org',
  MAIL_GOTO_WEBSITE = 'http://localhost:4000',
} = process.env

const mailgun = Mailgun({ apiKey, domain })
const mailgen = new Mailgen({
  theme: 'salted',
  product: {
    // Appears in header & footer of e-mails
    name: 'Camcloud',
    link: `${MAIL_GOTO_WEBSITE}/`,
    // Optional product logo
    // logo: `${MAIL_GOTO_WEBSITE}/img/logo.png`
  },
})

export const registerMail = ({ firstName, lastName, email }) => {
  const mail = {
    body: {
      greeting: 'Hallo',
      signature: 'Liebe Grüße,',
      name: `${firstName} ${lastName}`,
      intro:
        'Willkommen bei Camcloud! Wir freuen uns Sie bei uns begrüßen zu dürfen.',
      action: {
        instructions: `Um Ihren Account der eMail-Addresse ${email} zu aktivieren klicken Sie bitte hier`,
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Account aktivieren',
          link: `${MAIL_GOTO_WEBSITE}/activate/${token}?email=${email}`,
        },
      },
      outro:
        'Haben Sie Probleme mit Camcloud? Zögern Sie nicht und melden Sie sich bei uns!',
    },
  }

  return {
    from: 'Camcloud <no-reply@camcloud.now.sh>',
    to: email,
    subject: 'Willkommen bei Camcloud!',
    text: mailgen.generatePlaintext(mail),
    html: mailgen.generate(mail),
  }
}

export const passwordMail = ({ firstName, lastName, email }, token) => {
  const mail = {
    body: {
      greeting: 'Hallo',
      signature: 'Liebe Grüße,',
      name: `${firstName} ${lastName}`,
      intro:
        'Sie bekommen diese eMail da Sie das zurücksetzen Ihres Passwortes angefordert haben.',
      action: {
        instructions: `Um Ihre Passwort für die eMail-Addresse ${email} zurück zu setzen klicken Sie bitte hier`,
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Passwort setzen',
          link: `${MAIL_GOTO_WEBSITE}/reset-password/${token}?email=${email}`,
        },
      },
      outro:
        'Wenn Sie diese eMail nicht angefordert haben, klicken Sie den oberen Link nicht & ignorieren Sie diese eMail.',
    },
  }

  return {
    from: 'Camcloud <no-reply@camcloud.now.sh>',
    to: email,
    subject: `Passwort für ${email} zurücksetzen`,
    text: mailgen.generatePlaintext(mail),
    html: mailgen.generate(mail),
  }
}

export const camAlarmMail = (
  { firstName, lastName, email },
  { _id: camId, name },
  date,
) => {
  const mail = {
    body: {
      greeting: 'Achtung',
      signature: 'Liebe Grüße,',
      name: `${firstName} ${lastName}`,
      intro: `Am ${new Date(date).toLocaleString(
        'de-DE',
      )} hat Ihre Kamera "${name}" eine Bewegung erkannt und aufgezeichnet!`,
      action: {
        instructions: `Um ihre Aufnahme zu überprüfen, die Kamera einzusehen oder den Überwachnungszeitraum zu ändern klicken Sie hier:`,
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Aufnahme ansehen',
          link: `${MAIL_GOTO_WEBSITE}/cam/${camId}`,
        },
      },
      outro:
        'Sie werden benachrichtigt da Ihre Kamera eine Bewegung innerhalb der Alarmzeiten und innerhalb des Überwachunggsbereiches erfasst und aufgezeichnet hat. Sie können sowohl die Alarmzeiten als auch den Überwachungsbereich unter dem obrigen Link ändern.',
    },
  }

  return {
    from: 'Camcloud <alarm@camcloud.now.sh>',
    to: email,
    subject: `[ALARM] ${name} hat eine Bewegung aufgezeichnet`,
    text: mailgen.generatePlaintext(mail),
    html: mailgen.generate(mail),
  }
}

export const camOfflineMail = (
  { firstName, lastName, email },
  { _id: camId, name },
  date,
) => {
  const mail = {
    body: {
      greeting: 'Achtung',
      signature: 'Liebe Grüße,',
      name: `${firstName} ${lastName}`,
      intro: `Am ${new Date(date).toLocaleString(
        'de-DE',
      )} war Ihre Kamera "${name}" nicht zu erreichen!`,
      action: {
        instructions: `Bitte überprüfen Sie ihre Kamera und DDNS Einstellungen! Ihre Kamera können Sie hier einsehen:`,
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Kamera ansehen',
          link: `${MAIL_GOTO_WEBSITE}/cam/${camId}`,
        },
      },
      outro:
        'Sie werden benachrichtigt da Ihre Kamera nicht erreichbar ist/war. Dieses Problem kann, aber muss sich nicht, von alleine lösen.',
    },
  }

  return {
    from: 'Camcloud <healthcheck@camcloud.now.sh>',
    to: email,
    subject: `[HEALTHCHECK] ${name} war offline`,
    text: mailgen.generatePlaintext(mail),
    html: mailgen.generate(mail),
  }
}

export default async mail => mailgun.messages().send(mail)
