const express = require('express');
const cors    = require('cors');

const filtersRouter    = require('./routes/filters');
const categoriesRouter = require('./routes/categories');
const questionsRouter  = require('./routes/questions');
const responseRouter   = require('./routes/response');
const summaryRouter    = require('./routes/summary');

// SubNational routes
const subFiltersRouter    = require('./routes/subnational/filters');
const subCategoriesRouter = require('./routes/subnational/categories');
const subQuestionsRouter  = require('./routes/subnational/questions');
const subResponseRouter   = require('./routes/subnational/response');
const subSummaryRouter    = require('./routes/subnational/summary');

// National routes
const natFiltersRouter    = require('./routes/national/filters');
const natCategoriesRouter = require('./routes/national/categories');
const natQuestionsRouter  = require('./routes/national/questions');
const natResponseRouter   = require('./routes/national/response');
const natSummaryRouter    = require('./routes/national/summary');

const app = express();
app.use(cors());
app.use(express.json());

// WES Lab routes
app.use('/api/filters',        filtersRouter);
app.use('/api/categories',     categoriesRouter);
app.use('/api/questions',      questionsRouter);
app.use('/api/response',       responseRouter);
app.use('/api/summary',        summaryRouter);

// WES National routes
app.use('/api/national/filters',     natFiltersRouter);
app.use('/api/national/categories',  natCategoriesRouter);
app.use('/api/national/questions',   natQuestionsRouter);
app.use('/api/national/response',    natResponseRouter);
app.use('/api/national/summary',     natSummaryRouter);

// WES SubNational routes
app.use('/api/subnational/filters',    subFiltersRouter);
app.use('/api/subnational/categories', subCategoriesRouter);
app.use('/api/subnational/questions',  subQuestionsRouter);
app.use('/api/subnational/response',   subResponseRouter);
app.use('/api/subnational/summary',    subSummaryRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`WES API server running on port ${PORT}`));
