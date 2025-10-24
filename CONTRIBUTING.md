# Contributing to Quaxis Clarus Token

Thank you for your interest in contributing to the Quaxis Clarus ($CLA) token project!

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Token.git
   cd Token
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Making Changes

1. Make your changes in your feature branch
2. Follow the existing code style and conventions
3. Add or update tests as needed
4. Update documentation if required

### Code Quality

Before submitting your changes, ensure:

```bash
# Format your code
npm run format

# Check formatting
npm run lint:format

# Lint Solidity files
npm run lint:sol

# Compile contracts
npm run build

# Run tests
npm test
```

All checks should pass without errors.

### Commit Messages

- Use clear, descriptive commit messages
- Start with a verb in present tense (Add, Fix, Update, etc.)
- Keep the first line under 50 characters
- Add details in the body if needed

Example:
```
Add vesting schedule validation

- Validate cliff duration is less than total duration
- Add tests for edge cases
- Update documentation
```

## Submitting Changes

1. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference any related issues
   - Explain what changes you made and why
   - Include any breaking changes

3. **Wait for review**:
   - Maintainers will review your PR
   - Address any feedback or requested changes
   - Once approved, your PR will be merged

## Types of Contributions

### Bug Reports

If you find a bug:
1. Check if it's already reported in Issues
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node version, OS, etc.)

### Feature Requests

For new features:
1. Check if it's already requested
2. Create an issue describing:
   - The feature and its benefits
   - Use cases
   - Possible implementation approach

### Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add examples or tutorials
- Improve API documentation
- Translate documentation

### Code Contributions

When contributing code:
- Follow Solidity best practices
- Write comprehensive tests
- Update relevant documentation
- Ensure backward compatibility when possible

## Smart Contract Guidelines

### Security First

- Never introduce security vulnerabilities
- Follow OpenZeppelin patterns and conventions
- Consider gas optimization but prioritize security
- Add NatSpec documentation to all functions

### Testing

- Write tests for all new functionality
- Ensure edge cases are covered
- Aim for high test coverage
- Test on both Hardhat network and testnet

### Style Guide

- Follow the existing code style
- Use consistent naming conventions
- Add comments for complex logic
- Keep functions small and focused

## Review Process

1. **Automated Checks**: GitHub Actions will run tests and linting
2. **Code Review**: Maintainers will review your code
3. **Testing**: Changes will be tested on testnet if needed
4. **Merge**: Once approved, changes will be merged

## Questions?

If you have questions:
- Check existing documentation
- Search through closed issues
- Open a new discussion on GitHub
- Reach out to maintainers

## Code of Conduct

Be respectful and professional:
- Be welcoming and inclusive
- Respect different viewpoints
- Accept constructive criticism
- Focus on what's best for the project

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Quaxis Clarus Token! 🚀
