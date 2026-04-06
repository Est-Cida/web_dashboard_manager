const express = require('express');
const cors    = require('cors');

const filtersRouter    = require('./routes/filters');
const categoriesRouter = require('./routes/categories');
const questionsRouter  = require('./routes/questions');
const responseRouter   = require('./routes/response');
const summaryRouter    = require('./routes/summary');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/filters',        filtersRouter);
app.use('/api/categories',     categoriesRouter);
app.use('/api/questions',      questionsRouter);
app.use('/api/response',       responseRouter);
app.use('/api/summary',        summaryRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`WES API server running on port ${PORT}`));
