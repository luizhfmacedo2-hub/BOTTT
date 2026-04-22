const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth")

  const sock = makeWASocket({
    auth: state
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {
    const { connection } = update

    if (connection === "open") {
      console.log("✅ Bot conectado!")
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0]
      if (!msg || !msg.message) return

      const from = msg.key?.remoteJid
      if (!from || !from.endsWith("@g.us")) return

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        ""

      if (text === "/ping") {
        await sock.sendMessage(from, { text: "pong 🏓" })
      }

    } catch (e) {
      console.log("Erro:", e)
    }
  })
}

startBot()
