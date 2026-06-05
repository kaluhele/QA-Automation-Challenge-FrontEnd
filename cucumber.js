export default {
  default: {
    require: [
      'ts-node/register',
      'src/steps/**/*.ts'
    ],
    paths: ['src/features/**/*.feature'],
    format: ['progress'],
    publishQuiet: true
  }
};
