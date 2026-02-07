# Design Document: ESLint Plugin React Integration

## Overview

This design integrates eslint-plugin-react into the existing Next.js application's ESLint flat config setup. The integration will add React-specific linting rules while preserving the current typescript-eslint and next/core-web-vitals configurations. The implementation uses ESLint's modern flat config format (eslint.config.js) and leverages the plugin's recommended rule sets for React 17+ with JSX runtime support.

## Architecture

### Configuration Structure

The ESLint configuration follows a flat config architecture with multiple configuration objects:

```
eslint.config.js
├── Ignore patterns (existing)
├── Next.js core-web-vitals (existing)
├── TypeScript ESLint rules (existing)
├── React plugin configuration (new)
└── Linter options (existing)
```

The React plugin configuration will be inserted as a new configuration object between the TypeScript rules and linter options, ensuring proper rule precedence and file targeting.

### Integration Points

1. **Package Dependencies**: eslint-plugin-react added to devDependencies in package.json
2. **ESLint Config**: New configuration object in eslint.config.js using flat config format
3. **File Targeting**: React rules applied to .tsx and .jsx files
4. **Existing Commands**: No changes to package.json scripts; existing lint commands work unchanged

## Components and Interfaces

### Package Dependency

**Component**: eslint-plugin-react npm package

**Version Strategy**: Use latest compatible version (^19.x or latest stable)

**Installation Method**:
```bash
pnpm add -D eslint-plugin-react
```

### ESLint Configuration Object

**Component**: React plugin configuration block in eslint.config.js

**Structure**:
```javascript
{
  files: ["**/*.tsx", "**/*.jsx"],
  plugins: {
    react: reactPlugin
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactPlugin.configs["jsx-runtime"].rules
  }
}
```

**Key Properties**:
- `files`: Glob patterns targeting React component files
- `plugins`: Plugin registration with "react" namespace
- `settings.react.version`: Automatic React version detection
- `rules`: Merged recommended and jsx-runtime rule sets

### Import Statement

**Component**: ES module import for eslint-plugin-react

**Format**:
```javascript
import reactPlugin from "eslint-plugin-react";
```

**Placement**: After existing imports, before config export

## Data Models

### Configuration Object Schema

```typescript
interface ReactConfigObject {
  files: string[];           // File patterns to apply rules to
  plugins: {
    react: PluginObject;     // Plugin instance
  };
  settings: {
    react: {
      version: "detect";     // Auto-detect React version
    };
  };
  rules: Record<string, RuleConfig>;  // Merged rule configurations
}
```

### Rule Configuration Format

```typescript
type RuleConfig = 
  | "off" 
  | "warn" 
  | "error" 
  | ["off" | "warn" | "error", ...any[]];
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Configuration Validity

*For any* ESLint configuration file after integration, parsing the configuration should succeed without syntax errors and return a valid configuration array.

**Validates: Requirements 2.1, 2.2**

### Property 2: Existing Configuration Preservation

*For any* TypeScript or JavaScript file in the project, if it was linted before the integration, it should still be linted after the integration with all previous rules still applied.

**Validates: Requirements 2.4, 7.3**

### Property 3: React Rules Application to Component Files

*For any* file matching the patterns "**/*.tsx" or "**/*.jsx", linting should apply all enabled React-specific rules from the recommended and jsx-runtime rule sets, and violations of these rules should be detected.

**Validates: Requirements 2.3, 4.3**

### Property 4: Custom Rule Precedence

*For any* React rule that is overridden in the rules section with a custom configuration, the custom configuration should take precedence over the default recommended configuration, and violations should be reported according to the custom severity level.

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 5: Lint Command Execution

*For any* set of files containing React components, executing the "pnpm lint" command should check all files with React rules and report violations with file locations and rule names.

**Validates: Requirements 6.1, 6.3**

### Property 6: Auto-Fix Functionality

*For any* auto-fixable React rule violation, executing the "pnpm lint:fix" command should automatically correct the violation.

**Validates: Requirements 6.2**

### Property 7: Exit Code Behavior

*For any* linting execution that finds violations, the process should exit with a non-zero exit code, and for any execution with no violations, it should exit with code 0.

**Validates: Requirements 6.4**

## Error Handling

### Installation Errors

**Scenario**: pnpm fails to install eslint-plugin-react

**Handling**:
- pnpm will display error message with failure reason
- Check for network connectivity issues
- Verify package registry accessibility
- Check for version compatibility conflicts

### Configuration Syntax Errors

**Scenario**: Invalid JavaScript syntax in eslint.config.js

**Handling**:
- ESLint will fail to load configuration with syntax error message
- Error message will include line number and description
- Developer must fix syntax before linting can proceed

### Plugin Loading Errors

**Scenario**: eslint-plugin-react fails to load or is not found

**Handling**:
- ESLint will throw "Failed to load plugin" error
- Verify plugin is installed in node_modules
- Check import statement syntax
- Ensure plugin is listed in package.json devDependencies

### Version Detection Failures

**Scenario**: React version cannot be detected automatically

**Handling**:
- Plugin will fall back to latest React version rules
- Warning may be logged to console
- Manual version specification can be added to settings if needed

### Rule Conflicts

**Scenario**: React rules conflict with existing TypeScript or Next.js rules

**Handling**:
- Later configuration objects override earlier ones in flat config
- React config object should be positioned to avoid overriding critical TypeScript rules
- Specific rule conflicts can be resolved by explicit rule configuration
- Document any intentional rule overrides with comments

## Testing Strategy

### Unit Testing Approach

**Configuration Validation Tests**:
- Test that eslint.config.js exports a valid configuration array
- Test that the React plugin is properly imported
- Test that the configuration object structure matches expected schema
- Test that file patterns correctly target .tsx and .jsx files

**Integration Tests**:
- Create sample React components with known rule violations
- Run ESLint and verify violations are detected
- Test that auto-fix functionality works for fixable React rules
- Verify existing TypeScript and Next.js rules still function

**Edge Cases**:
- Empty React component files
- React components with TypeScript-specific syntax
- Files with both React and Next.js specific patterns
- Components using React 19 features

### Property-Based Testing Approach

Property-based tests will use fast-check (already in devDependencies) to verify universal properties across many generated inputs. Each test will run a minimum of 100 iterations.

**Property Test 1: Configuration Validity** (Property 1)
- Generate various valid ESLint configuration modifications
- Verify each configuration parses without errors
- Tag: **Feature: eslint-plugin-react-integration, Property 1: Configuration validity after integration**

**Property Test 2: Existing Configuration Preservation** (Property 2)
- Generate various file paths (TypeScript, JavaScript, React components)
- Verify files linted before are still linted after with same rules
- Tag: **Feature: eslint-plugin-react-integration, Property 2: Existing configuration preservation**

**Property Test 3: React Rules Application to Component Files** (Property 3)
- Generate React component code with various patterns and known violations
- Verify React rules are applied to .tsx and .jsx files and violations detected
- Tag: **Feature: eslint-plugin-react-integration, Property 3: React rules application to component files**

**Property Test 4: Custom Rule Precedence** (Property 4)
- Generate various rule override configurations with different severity levels
- Verify custom rules take precedence and violations reported at custom severity
- Tag: **Feature: eslint-plugin-react-integration, Property 4: Custom rule precedence**

**Property Test 5: Lint Command Execution** (Property 5)
- Execute lint commands with various file sets containing React components
- Verify React violations are reported with file locations and rule names
- Tag: **Feature: eslint-plugin-react-integration, Property 5: Lint command execution**

**Property Test 6: Auto-Fix Functionality** (Property 6)
- Generate code with auto-fixable React violations
- Verify lint:fix command corrects violations
- Tag: **Feature: eslint-plugin-react-integration, Property 6: Auto-fix functionality**

**Property Test 7: Exit Code Behavior** (Property 7)
- Generate code with and without violations
- Verify exit codes match violation presence (non-zero with violations, zero without)
- Tag: **Feature: eslint-plugin-react-integration, Property 7: Exit code correctness**

### Testing Balance

- **Unit tests** focus on specific configuration scenarios, integration points, and edge cases
- **Property tests** verify universal correctness properties across all possible inputs
- Together they provide comprehensive coverage: unit tests catch concrete configuration bugs, property tests verify general correctness of the linting system behavior

### Manual Verification Steps

1. Run `pnpm lint` and verify React rule violations are reported
2. Run `pnpm lint:fix` and verify auto-fixable violations are corrected
3. Run `pnpm check` and verify linting is included in the check process
4. Inspect ESLint output to confirm React rule names appear (e.g., react/jsx-key)
5. Verify no breaking changes to existing development workflow
