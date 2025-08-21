const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', (req, res) => res.json({ ok: true }));

module.exports = app;