module.exports = {
  // Type definitions (selectable with up and down arrow keys)
  types: [
    { value: 'feat', name: 'feat:     New feature' },
    { value: 'fix', name: 'fix:      Bug fix' },
    { value: 'docs', name: 'docs:     Documentation changes' },
    { value: 'style', name: 'style:    Code style (formatting, missing semicolons, etc.)' },
    { value: 'refactor', name: 'refactor: Code refactoring (no bug fixes or new features)' },
    { value: 'perf', name: 'perf:     Performance improvements' },
    { value: 'test', name: 'test:     Adding or modifying tests' },
    { value: 'build', name: 'build:    Build process or external dependencies' },
    { value: 'ci', name: 'ci:       Changes to CI configuration or scripts' },
    { value: 'chore', name: 'chore:    Changes to the build process or auxiliary tools/libraries' },
    { value: 'revert', name: 'revert:   Revert a previous commit' }
  ],

  // Scope definitions (selectable with up and down arrow keys)
  scopes: [
    ['components', 'Component related'],
    ['hooks', 'Hook related'],
    ['utils', 'Utility related'],
    ['element-ui', 'Changes to element-ui'],
    ['styles', 'Style related'],
    ['deps', 'Project dependencies'],
    ['auth', 'Changes to auth'],
    ['other', 'Other changes'],
    // If selecting custom, it will prompt for a custom scope input. You can also skip this and set allowCustomScopes to true.
    ['custom', 'None of the above? I want to customize']
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),

  // Allow custom scope input in addition to empty and custom options
  // allowCustomScopes: true,

  // allowTicketNumber: false,
  // isTicketNumberRequired: false,
  // ticketNumberPrefix: 'TICKET-',
  // ticketNumberRegExp: '\\d{1,5}',

  // Define scope overrides for each type, e.g. fix
  /*
  scopeOverrides: {
    fix: [
      { name: 'merge' },
      { name: 'style' },
      { name: 'e2eTest' },
      { name: 'unitTest' }
    ]
  },
  */

  // Interactive prompt messages
  messages: {
    type: 'Ensure your commit follows the Angular convention!\nSelect the type of commit you are making:',
    scope: '\nSelect a scope (optional):',
    // Prompt when custom scope is selected
    customScope: 'Enter a custom scope:',
    subject: 'Write a short and concise change description:\n',
    body: 'Write a more detailed change description (optional). Use "|" for new lines:\n',
    breaking: 'List any breaking changes (optional):\n',
    footer: 'List any issues closed by this change (optional). For example: #31, #34:\n',
    confirmCommit: 'Confirm commit?'
  },

  // Only ask for breaking change if type is feat or fix
  allowBreakingChanges: ['feat', 'fix'],

  // Skip specific questions
  // skipQuestions: ['body', 'footer'],

  // Subject length limit
  subjectLimit: 100,
  breaklineChar: '|' // Support for body and footer
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true,
}