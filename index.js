const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const readline = require("readline")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth")

  const sock = makeWASocket({
    auth: state
  })

  sock.ev.on("creds.update", saveCreds)

  // 🔥 LOGIN POR NÚMERO
  if (!sock.authState.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question("Digite seu número (com DDD): ", async (numero) => {
      const code = await sock.requestPairingCode(numero)
      console.log("🔑 Código:", code)
      rl.close()
    })
  }

  // BOT ONLINE
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update

    if (connection === "close") {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBot()
      }
    } else if (connection === "open") {
      console.log("✅ Bot conectado!")
    }
  })

  // COMANDO
  ssock.ev.on("messages.upsert", async ({ messages }) => {
  const msg = messages[0]
  if (!msg.message) return

  // 🚫 só responde em GRUPO
  if (!msg.key.remoteJid.endsWith("@g.us")) return

  const msgType = Object.keys(msg.message)[0]

  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message[msgType]?.text ||
    ""

  // comando /ping
  if (text === "/ping") {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "pong 🏓"
    })
  }
})

    const msg = messages[0]
    if (!msg.message) return

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text

    if (text === "/ping") {
      await sock.sendMessage(msg.key.remoteJid, { text: "pong 🏓" })
    }
  })
}

startBot()
