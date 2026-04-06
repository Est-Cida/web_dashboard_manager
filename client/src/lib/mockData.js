// Mock data matching the screenshots — used when API is unavailable
export const MOCK_FILTERS = {
  countries: ['All', 'DRC', 'SENEGAL', 'Uganda'],
  provinces: ['All', 'DAKAR', 'KINSHASA', 'NORTH_BU'],
};

export const MOCK_CATEGORIES = [
  { CategoryCode: '01 - ES Sam', CategoryLabel: 'ES Samples, Sampling and Sites' },
  { CategoryCode: '02 - Sample', CategoryLabel: 'Sample Transportation' },
  { CategoryCode: '03 - Lab',    CategoryLabel: 'Laboratory Methods' },
  { CategoryCode: '04 - Results',CategoryLabel: 'Results' },
  { CategoryCode: '05 - Chall',  CategoryLabel: 'Challenges and Comments' },
];

export const MOCK_QUESTIONS = {
  '01 - ES Sam': [
    { QuestionCode: '1.01',  Question: 'What is your sampling method?' },
    { QuestionCode: '1.02',  Question: 'What are the types of samples used?' },
    { QuestionCode: '1.03',  Question: 'What type of site do you have?' },
    { QuestionCode: '1.03a', Question: 'The precise the type' },
    { QuestionCode: '1.03b', Question: 'How many sites?' },
    { QuestionCode: '1.04',  Question: 'Do you have a composite site?' },
    { QuestionCode: '1.04a', Question: 'How many composite samples' },
    { QuestionCode: '1.05',  Question: 'What is the flow situation?' },
    { QuestionCode: '1.06',  Question: 'How frequent is sampling done?' },
    { QuestionCode: '1.07',  Question: 'Polio site indicator EV > 50%' },
    { QuestionCode: '1.07a', Question: 'Please indicate the EV rate.' },
  ],
  '02 - Sample': [
    { QuestionCode: '2.01',  Question: 'Reverse cold chain' },
    { QuestionCode: '2.01a', Question: 'Please specify' },
    { QuestionCode: '2.02',  Question: 'Temperature at the arrival to the lab' },
  ],
  '03 - Lab': [
    { QuestionCode: '3.01', Question: 'Primary concentration method' },
    { QuestionCode: '3.02', Question: 'Detection method used' },
  ],
  '04 - Results': [
    { QuestionCode: '4.01', Question: 'Were results reported on time?' },
  ],
  '05 - Chall': [
    { QuestionCode: '5.01', Question: 'Main challenge identified' },
  ],
};

export const MOCK_RESPONSE_CHART = {
  '1.01': [
    { country: 'DRC',     Grab: 1 },
    { country: 'SENEGAL', Grab: 1 },
    { country: 'Uganda',  Grab: 1, Trap: 1 },
  ],
  '1.02': [
    { country: 'DRC',     'Sewage/Wastewater': 1 },
    { country: 'SENEGAL', 'Sewage/Wastewater': 1 },
    { country: 'Uganda',  Both: 1 },
  ],
};

export const MOCK_SUMMARY = {
  countries: ['DRC', 'SENEGAL', 'Uganda'],
  categories: [
    {
      code: '01 - ES Sam',
      label: 'ES Samples, Sampling and Sites',
      questions: [
        { code: '1.01',  label: 'What is your sampling method?',     responses: { DRC: 'Grab', SENEGAL: 'Grab', Uganda: 'Grab' } },
        { code: '1.02',  label: 'What are the types of samples used?', responses: { DRC: 'Sewage/Wastewater', SENEGAL: 'Sewage/Wastewater', Uganda: 'Both' } },
        { code: '1.03',  label: 'What type of site do you have?',    responses: { DRC: 'Open Canal', SENEGAL: 'Closed Canal', Uganda: 'Both' } },
        { code: '1.03a', label: 'The precise the type',              responses: { DRC: 'n/a', SENEGAL: '', Uganda: 'n/a' } },
        { code: '1.03b', label: 'How many sites?',                   responses: { DRC: '2', SENEGAL: '14', Uganda: '11' } },
        { code: '1.04',  label: 'Do you have a composite site?',     responses: { DRC: 'No', SENEGAL: 'No', Uganda: 'No' } },
        { code: '1.04a', label: 'How many composite samples',        responses: { DRC: 'n/a', SENEGAL: 'n/a', Uganda: 'n/a' } },
        { code: '1.05',  label: 'What is the flow situation?',       responses: { DRC: 'Annual', SENEGAL: 'Annual', Uganda: 'Annual' } },
        { code: '1.06',  label: 'How frequent is sampling done?',    responses: { DRC: 'Monthly', SENEGAL: 'Monthly', Uganda: 'Weekly' } },
        { code: '1.07',  label: 'Polio site indicator EV > 50%',     responses: { DRC: 'Yes', SENEGAL: 'Yes', Uganda: 'Yes' } },
        { code: '1.07a', label: 'Please indicate the EV rate.',      responses: { DRC: 'n/a', SENEGAL: 'n/a', Uganda: 'n/a' } },
      ],
    },
    {
      code: '02 - Sample',
      label: 'Sample Transportation',
      questions: [
        { code: '2.01',  label: 'Reverse cold chain',                responses: { DRC: 'Isothermal Bag Cooler', SENEGAL: 'Cooler', Uganda: 'Cooler' } },
        { code: '2.01a', label: 'Please specify',                    responses: { DRC: 'n/a', SENEGAL: 'n/a', Uganda: 'n/a' } },
        { code: '2.02',  label: 'Temperature at the arrival to the lab', responses: { DRC: '≥80% between 2-8°', SENEGAL: '≥80% between 2-8°', Uganda: '≥80% between 2-8°' } },
      ],
    },
    {
      code: '03 - Lab',
      label: 'Laboratory Methods',
      questions: [
        { code: '3.01', label: 'Primary concentration method', responses: { DRC: 'Ultracentrifugation', SENEGAL: 'Filtration', Uganda: 'Ultracentrifugation' } },
        { code: '3.02', label: 'Detection method used',        responses: { DRC: 'RT-qPCR', SENEGAL: 'RT-qPCR', Uganda: 'RT-qPCR' } },
      ],
    },
    {
      code: '04 - Results',
      label: 'Results',
      questions: [
        { code: '4.01', label: 'Were results reported on time?', responses: { DRC: 'Yes', SENEGAL: 'Yes', Uganda: 'No' } },
      ],
    },
    {
      code: '05 - Chall',
      label: 'Challenges and Comments',
      questions: [
        { code: '5.01', label: 'Main challenge identified', responses: { DRC: 'Resource constraints', SENEGAL: 'Staffing', Uganda: 'Infrastructure' } },
      ],
    },
  ],
};
