# Contributing to SEO Analyzer Pro

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/seo-analyzer.git`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Set up development environment (see INSTALLATION.md)

## Code Standards

### TypeScript
- Use strict mode
- Define types for all functions and variables
- Use interfaces for object types
- Avoid `any` type

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Functions/variables: camelCase (e.g., `getUserData()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- Files: kebab-case (e.g., `user-profile.tsx`)

### Formatting
- Use Prettier for code formatting
- 2-space indentation
- 80-character line limit for comments
- Use semicolons

### Comments
```typescript
// Use for single-line comments

/**
 * Use JSDoc for function documentation
 * @param param - Description
 * @returns Description
 */
function example(param: string): void {}
```

## Making Changes

### Before Starting
- Check existing issues to avoid duplicates
- Discuss major features in an issue first
- Follow the project structure

### During Development
- Write clean, readable code
- Add comments for complex logic
- Keep commits atomic and descriptive
- Test your changes thoroughly

### Commit Messages
```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(audit): add critical issue detection

Implement detection for missing meta tags and SSL certificates.
Scans all pages and reports critical issues separately.

Closes #123
```

## Testing

### Before Submitting PR
1. Run linter: `npm run lint`
2. Format code: `npm run format`
3. Run tests: `npm run test`
4. Check types: `npm run type-check` (frontend)
5. Build: `npm run build`

### Writing Tests
```typescript
describe('Feature', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = functionUnderTest(input)
    
    // Assert
    expect(result).toBe('expected')
  })
})
```

## Pull Requests

### PR Title
- Use clear, descriptive titles
- Reference issue number: `Fix: issue with audit (#123)`

### PR Description
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No new warnings generated

## Related Issues
Closes #123
```

## Review Process

1. Automated checks must pass
2. Code review required
3. All comments addressed
4. Approval from maintainers
5. Merge to main branch

## Reporting Bugs

### Bug Report Template
```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS]
- Browser: [e.g., Chrome]
- Node version: [e.g., 18.0.0]

## Screenshots
If applicable, add screenshots
```

## Feature Requests

### Feature Request Template
```markdown
## Description
Description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How it could work

## Alternative Solutions
Other approaches considered
```

## Documentation

- Update README.md for user-facing changes
- Update relevant guides (BACKEND_GUIDE.md, FRONTEND_GUIDE.md)
- Add code comments for complex logic
- Update API documentation

## Performance

Before submitting:
- Check for N+1 queries
- Optimize database queries
- Minimize bundle size impact
- Profile performance with tools

## Security

- Validate all user input
- Don't commit secrets or credentials
- Use parameterized queries
- Keep dependencies updated
- Report security issues privately

## Community

- Be respectful and constructive
- Help other contributors
- Share knowledge and experience
- Ask questions in discussions

## Questions?

Open an issue or ask in discussions. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
