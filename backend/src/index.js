const express = require('express')

require('dotenv').config()
const pool = require('./mysql')

const app = express()

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1')

        res.json({
            status: "ok",
            database: "connected"
        } // send to frontned

        )
    } catch (err) {
        console.log("DB error: ", err)

        res.status(500).json({
            status: "error",
            database: "disconnected",
            message: err.message
            // 500 server error 
        })
    }

})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})