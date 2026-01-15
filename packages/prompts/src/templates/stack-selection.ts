/**
 * Stack Selection Prompt Template
 * Prompt for when a tech stack is selected
 */

import type { TechStack } from '@ironbackend/core';

/**
 * Generate a stack-specific prompt section
 */
export function generateStackPrompt(stack: TechStack): string {
    return `# Technology Stack: ${stack.name}

## Language & Framework
- **Language:** ${stack.language} ${stack.languageVersion}
- **Framework:** ${stack.framework} ${stack.frameworkVersion}

## Database
- **Type:** ${stack.database.type}
- **ORM:** ${stack.database.orm}
${stack.database.driver ? `- **Driver:** ${stack.database.driver}` : ''}

## Messaging & Async
- **Type:** ${stack.messaging.type}
- **Provider:** ${stack.messaging.provider}

## Authentication
${stack.authentication}

## Logging
${stack.logging}

## Testing Strategy
| Test Type | Tool | Target |
|-----------|------|--------|
| Unit | ${stack.testing.unit} | ${stack.testing.coverageTarget}% coverage |
| Integration | ${stack.testing.integration} | Key flows |
${stack.testing.e2e ? `| E2E | ${stack.testing.e2e} | Critical paths |` : ''}

## Deployment
${stack.deployment.map(d => `- ${d}`).join('\n')}

## Coding Conventions

When writing code for this stack, follow these conventions:

${stack.conventions.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Code Examples

### Entity/Model
Use ${stack.database.orm} patterns for data modeling.

### Repository
Implement repository interfaces using ${stack.database.orm}.

### Service
Services orchestrate domain logic, inject repositories.

### Controller/Handler
Handle HTTP concerns only, delegate to services.`;
}

/**
 * Generate stack-specific code style hints
 */
export function generateStackCodeStyle(stack: TechStack): string {
    const codeStyles: Record<string, string> = {
        'node-nestjs': `// NestJS Style
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  
  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}`,
        'java-spring': `// Spring Boot Style
@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }
}`,
        'dotnet-aspnetcore': `// ASP.NET Core Style
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    
    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    public async Task<User?> FindByIdAsync(Guid id)
    {
        return await _userRepository.FindByIdAsync(id);
    }
}`,
        'python-fastapi': `# FastAPI Style
class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    async def find_by_id(self, id: UUID) -> User | None:
        return await self.user_repository.find_by_id(id)`
    };

    return codeStyles[stack.id] || '// Follow stack conventions';
}

/**
 * Generate stack comparison for selection
 */
export function generateStackComparisonPrompt(stacks: TechStack[]): string {
    const header = `# Technology Stack Selection Guide

Choose the right stack based on your requirements:

`;

    const comparison = stacks.map(stack => `
## ${stack.name}
- **Language:** ${stack.language} ${stack.languageVersion}
- **Framework:** ${stack.framework}
- **Best for:** ${getStackStrengths(stack)}
`).join('\n');

    return header + comparison;
}

function getStackStrengths(stack: TechStack): string {
    const strengths: Record<string, string> = {
        'node-nestjs': 'Fast development, TypeScript ecosystem, real-time apps',
        'java-spring': 'Enterprise apps, strong typing, mature ecosystem',
        'dotnet-aspnetcore': 'Microsoft stack, high performance, enterprise features',
        'python-fastapi': 'Data science, ML integration, rapid prototyping'
    };
    return strengths[stack.id] || 'General purpose backend development';
}
