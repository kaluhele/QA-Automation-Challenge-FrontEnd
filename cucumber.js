export default {
  default: {
    require: [
      'ts-node/register',
      'src/steps/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    paths: ['src/features/**/*.feature'],
    format: [
      'progress-bar',
      'json:./reports/cucumber-report.json',
      'html:./reports/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    parallel: 1
  }
};
