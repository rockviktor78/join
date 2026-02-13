# AI Context Architecture

This directory contains **context documentation** for GitHub Copilot to improve code generation quality and consistency.

## 📁 Structure

```
.ai/
├── README.md                    # This file
├── architecture.md              # System architecture and layers
├── coding-rules.md              # BEM, mobile-first, conventions
├── project-overview.md          # Project goals and tech stack
├── ui-patterns.md               # Component patterns and layouts
├── state-management.md          # Firebase, session, DOM state
├── global-principles.md         # Core decision-making principles
└── agents/
    ├── frontend-agent.md        # UI/UX specialist
    ├── css-agent.md             # BEM and styling expert
    └── refactor-agent.md        # Code quality specialist
```

## 🎯 Purpose

This structure enables GitHub Copilot to:

- Understand project architecture
- Follow established patterns
- Generate consistent code
- Respect project conventions
- Make context-aware suggestions

## 🚀 How It Works

With `chat.useNestedAgentsMdFiles: true` enabled in VS Code, Copilot:

1. Indexes all `.md` files in `.ai/`
2. Uses them as context for code generation
3. Respects defined rules and patterns
4. Can be invoked with `@frontend-agent`, `@css-agent`, etc.

## 📝 Core Documents

### architecture.md

- System layers (UI → App → Domain → Infrastructure)
- Data flow patterns
- Module structure
- Anti-patterns to avoid

### coding-rules.md

- **BEM CSS naming convention**
- **Mobile-first responsive design**
- **Inline media queries**
- JavaScript functional patterns
- Performance rules

### project-overview.md

- What is Join? (Kanban project management)
- Tech stack (HTML/CSS/JS + Firebase)
- Key features
- Design system
- Project constraints

### ui-patterns.md

- Layout patterns (mobile/desktop)
- Header, sidebar, navigation
- Common components (buttons, cards, modals)
- Responsive breakpoints
- Accessibility patterns

### state-management.md

- Session storage usage
- Firebase data structure
- DOM state via CSS classes
- API wrapper pattern
- Cache strategy

### global-principles.md

- **Simplicity** over complexity
- **Maintainability** over quick fixes
- **Scalability** over premature optimization
- **Standards compliance** over shortcuts
- **User experience** over developer convenience

## 🤖 Agent Modes

### @frontend-agent

Specializes in:

- Semantic HTML structure
- BEM CSS architecture
- Mobile-first responsive design
- Accessibility (ARIA, keyboard nav)
- Component patterns

### @css-agent

Specializes in:

- BEM naming enforcement
- Mobile-first approach
- Inline media queries
- Design token usage
- Performance optimization

### @refactor-agent

Specializes in:

- Code quality improvements
- Removing duplication
- Reducing complexity
- Extracting functions
- Naming consistency

## 🔧 Usage Examples

### Generate a new component

```
@frontend-agent Create a task card component with title, description,
assignees, and priority indicator. Mobile-first, BEM naming.
```

### Fix CSS issues

```
@css-agent This component needs proper BEM naming and mobile-first
responsive design. Current code: [paste code]
```

### Improve code quality

```
@refactor-agent This function is too complex and has duplication.
Simplify without changing behavior.
```

## 📊 Benefits

### Before (Without Context)

- Inconsistent naming conventions
- Mixed responsive approaches
- Unclear architecture
- Framework-specific suggestions
- Generic code patterns

### After (With Context)

- ✅ Strict BEM naming
- ✅ Mobile-first by default
- ✅ Follows project architecture
- ✅ Vanilla JS patterns
- ✅ Project-specific solutions

## 🔒 Privacy

- This folder is **local only** (`.git/info/exclude`)
- Not committed to repository
- Not shared with team (unless desired)
- Safe for project-specific context

## 🛠 Maintenance

Update these files when:

- Architecture changes
- New patterns emerge
- Conventions evolve
- New components are standardized
- Team agrees on new rules

## 📖 Learn More

This approach is inspired by:

- Context-driven AI development
- Knowledge-based code generation
- Pattern library documentation
- Architecture Decision Records (ADRs)

## 💡 Pro Tips

1. **Keep it concise** - Copilot reads quickly
2. **Be specific** - Clear rules > vague suggestions
3. **Use examples** - Show correct vs incorrect patterns
4. **Update regularly** - Keep context fresh
5. **Test agents** - Verify they work as expected

---

**Remember:** This is not just documentation. It's **active context** that shapes every code suggestion Copilot makes.
