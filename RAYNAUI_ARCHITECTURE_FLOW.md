# RaynaUI Architecture Flow Diagram

## 🏗️ Complete System Architecture

```mermaid
graph TB
    %% User Interface Layer
    subgraph "User Interface Layer"
        CLI[CLI Commands]
        WEB[Website/Documentation]
        AI[AI Generator]
    end

    %% Core CLI System
    subgraph "CLI System (packages/raynaui)"
        CLI_INIT[init command]
        CLI_ADD[add command]
        CLI_BUILD[build command]
        CLI_MCP[MCP server]
        CLI_VIEW[view command]
        CLI_SEARCH[search command]
    end

    %% Registry System
    subgraph "Registry System"
        REGISTRY_INDEX[Registry Index]
        REGISTRY_UI[UI Components]
        REGISTRY_BLOCKS[Blocks]
        REGISTRY_CHARTS[Charts]
        REGISTRY_THEMES[Themes]
        REGISTRY_HOOKS[Hooks]
        REGISTRY_LIB[Library Utils]
        REGISTRY_EXAMPLES[Examples]
    end

    %% Build System
    subgraph "Build System"
        BUILD_SCRIPTS[Build Scripts]
        CAPTURE_SCRIPTS[Capture Scripts]
        REGISTRY_BUILD[Registry Builder]
        REGISTRY_SYNC[Registry Sync]
    end

    %% AI Generator System
    subgraph "AI Generator (packages/ai-generator)"
        AI_ENGINE[AI Engine]
        AI_TEMPLATES[Templates]
        AI_FS[File System Manager]
        AI_CLI[AI CLI]
    end

    %% Applications
    subgraph "Applications"
        APP_V4[V4 App]
        APP_WWW[WWW App]
        APP_DEMO[Demo App]
    end

    %% External Services
    subgraph "External Services"
        ANTHROPIC[Anthropic API]
        NPM[NPM Registry]
        GITHUB[GitHub]
    end

    %% Data Flow
    CLI --> CLI_INIT
    CLI --> CLI_ADD
    CLI --> CLI_BUILD
    CLI --> CLI_MCP
    CLI --> CLI_VIEW
    CLI --> CLI_SEARCH

    CLI_INIT --> REGISTRY_INDEX
    CLI_ADD --> REGISTRY_INDEX
    CLI_BUILD --> BUILD_SCRIPTS
    CLI_MCP --> REGISTRY_INDEX

    REGISTRY_INDEX --> REGISTRY_UI
    REGISTRY_INDEX --> REGISTRY_BLOCKS
    REGISTRY_INDEX --> REGISTRY_CHARTS
    REGISTRY_INDEX --> REGISTRY_THEMES
    REGISTRY_INDEX --> REGISTRY_HOOKS
    REGISTRY_INDEX --> REGISTRY_LIB
    REGISTRY_INDEX --> REGISTRY_EXAMPLES

    BUILD_SCRIPTS --> REGISTRY_BUILD
    REGISTRY_BUILD --> REGISTRY_SYNC
    CAPTURE_SCRIPTS --> APP_WWW

    AI --> AI_ENGINE
    AI --> AI_TEMPLATES
    AI --> AI_FS
    AI --> AI_CLI

    AI_ENGINE --> ANTHROPIC
    AI_FS --> REGISTRY_INDEX

    WEB --> REGISTRY_INDEX
    APP_V4 --> REGISTRY_INDEX
    APP_WWW --> REGISTRY_INDEX

    REGISTRY_INDEX --> NPM
    REGISTRY_INDEX --> GITHUB
```

## 🔄 Detailed Component Flow

### 1. CLI Command Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant Registry
    participant FileSystem
    participant NPM

    User->>CLI: npx raynaui init
    CLI->>FileSystem: Check project structure
    CLI->>Registry: Get available components
    CLI->>FileSystem: Create components.json
    CLI->>NPM: Install dependencies
    CLI->>FileSystem: Create utils.ts
    CLI->>User: Project initialized

    User->>CLI: npx raynaui add button
    CLI->>Registry: Find button component
    CLI->>Registry: Get dependencies
    CLI->>FileSystem: Write component files
    CLI->>NPM: Install dependencies
    CLI->>User: Component added

    User->>CLI: npx raynaui add dashboard-01
    CLI->>Registry: Find dashboard block
    CLI->>Registry: Resolve all dependencies
    CLI->>FileSystem: Write block files
    CLI->>NPM: Install all dependencies
    CLI->>User: Block added
```

### 2. Registry System Flow

```mermaid
graph LR
    subgraph "Registry Sources"
        UI[UI Components]
        BLOCKS[Blocks]
        CHARTS[Charts]
        THEMES[Themes]
        HOOKS[Hooks]
        LIB[Library]
        EXAMPLES[Examples]
    end

    subgraph "Registry Processing"
        INDEX[Registry Index]
        SCHEMA[Schema Validation]
        RESOLVE[Dependency Resolution]
        BUILD[Build Process]
    end

    subgraph "Registry Output"
        JSON[registry.json]
        INDEX_TS[__index__.tsx]
        PUBLIC[public/r/]
        DOCS[Documentation]
    end

    UI --> INDEX
    BLOCKS --> INDEX
    CHARTS --> INDEX
    THEMES --> INDEX
    HOOKS --> INDEX
    LIB --> INDEX
    EXAMPLES --> INDEX

    INDEX --> SCHEMA
    SCHEMA --> RESOLVE
    RESOLVE --> BUILD

    BUILD --> JSON
    BUILD --> INDEX_TS
    BUILD --> PUBLIC
    BUILD --> DOCS
```

### 3. AI Generator Flow

```mermaid
sequenceDiagram
    participant User
    participant AI_CLI
    participant AI_Engine
    participant Anthropic
    participant Templates
    participant FileSystem

    User->>AI_CLI: raynaui-ai generate "button"
    AI_CLI->>AI_Engine: Generate component
    AI_Engine->>Anthropic: Send prompt
    Anthropic->>AI_Engine: Return JSON spec
    AI_Engine->>Templates: Generate code
    Templates->>AI_Engine: Return component files
    AI_Engine->>FileSystem: Write files
    AI_Engine->>AI_CLI: Return result
    AI_CLI->>User: Component generated

    User->>AI_CLI: raynaui-ai init
    AI_CLI->>FileSystem: Create project structure
    AI_CLI->>User: Project initialized
```

### 4. Build System Flow

```mermaid
graph TB
    subgraph "Build Process"
        BUILD_REGISTRY[Build Registry]
        CAPTURE_SCREENSHOTS[Capture Screenshots]
        SYNC_REGISTRY[Sync Registry]
        GENERATE_DOCS[Generate Documentation]
    end

    subgraph "Input Sources"
        REGISTRY_FILES[Registry Files]
        COMPONENT_FILES[Component Files]
        BLOCK_FILES[Block Files]
        THEME_FILES[Theme Files]
    end

    subgraph "Build Output"
        REGISTRY_JSON[registry.json]
        SCREENSHOTS[Screenshots]
        PUBLIC_R[public/r/]
        DOCS_SITE[Documentation Site]
    end

    REGISTRY_FILES --> BUILD_REGISTRY
    COMPONENT_FILES --> BUILD_REGISTRY
    BLOCK_FILES --> BUILD_REGISTRY
    THEME_FILES --> BUILD_REGISTRY

    BUILD_REGISTRY --> REGISTRY_JSON
    BUILD_REGISTRY --> PUBLIC_R

    BLOCK_FILES --> CAPTURE_SCREENSHOTS
    CAPTURE_SCREENSHOTS --> SCREENSHOTS

    REGISTRY_JSON --> SYNC_REGISTRY
    SYNC_REGISTRY --> PUBLIC_R

    REGISTRY_JSON --> GENERATE_DOCS
    GENERATE_DOCS --> DOCS_SITE
```

### 5. Component Collection Structure

```mermaid
graph TB
    subgraph "Component Types"
        UI[UI Components]
        BLOCKS[Blocks]
        CHARTS[Charts]
        THEMES[Themes]
        HOOKS[Hooks]
        LIB[Library]
        EXAMPLES[Examples]
    end

    subgraph "UI Components"
        BUTTON[Button]
        CARD[Card]
        INPUT[Input]
        MODAL[Modal]
        NAV[Navigation]
        FORM[Form]
    end

    subgraph "Blocks"
        DASHBOARD[Dashboard]
        LOGIN[Login]
        PROFILE[Profile]
        SETTINGS[Settings]
        ANALYTICS[Analytics]
    end

    subgraph "Charts"
        LINE[Line Chart]
        BAR[Bar Chart]
        PIE[Pie Chart]
        AREA[Area Chart]
        SCATTER[Scatter Plot]
    end

    subgraph "Themes"
        NEW_YORK[New York]
        DEFAULT[Default]
        CUSTOM[Custom]
    end

    UI --> BUTTON
    UI --> CARD
    UI --> INPUT
    UI --> MODAL
    UI --> NAV
    UI --> FORM

    BLOCKS --> DASHBOARD
    BLOCKS --> LOGIN
    BLOCKS --> PROFILE
    BLOCKS --> SETTINGS
    BLOCKS --> ANALYTICS

    CHARTS --> LINE
    CHARTS --> BAR
    CHARTS --> PIE
    CHARTS --> AREA
    CHARTS --> SCATTER

    THEMES --> NEW_YORK
    THEMES --> DEFAULT
    THEMES --> CUSTOM
```

### 6. MCP (Model Context Protocol) Integration

```mermaid
sequenceDiagram
    participant IDE
    participant MCP_Server
    participant Registry
    participant CLI

    IDE->>MCP_Server: List available tools
    MCP_Server->>IDE: Return tool list

    IDE->>MCP_Server: Search components
    MCP_Server->>Registry: Query registry
    Registry->>MCP_Server: Return results
    MCP_Server->>IDE: Return component list

    IDE->>MCP_Server: Get component examples
    MCP_Server->>Registry: Get examples
    Registry->>MCP_Server: Return examples
    MCP_Server->>IDE: Return example code

    IDE->>MCP_Server: Add component
    MCP_Server->>CLI: Execute add command
    CLI->>Registry: Get component
    CLI->>IDE: Component added
```

### 7. File Structure and Dependencies

```mermaid
graph TB
    subgraph "Project Structure"
        ROOT[RaynaUI Root]
        APPS[apps/]
        PACKAGES[packages/]
        SCRIPTS[scripts/]
    end

    subgraph "Apps"
        V4[apps/v4/]
        WWW[apps/www/]
    end

    subgraph "Packages"
        CLI[packages/raynaui/]
        AI[packages/ai-generator/]
        TESTS[packages/tests/]
    end

    subgraph "V4 App Structure"
        V4_REGISTRY[registry/]
        V4_COMPONENTS[components/]
        V4_SCRIPTS[scripts/]
        V4_PUBLIC[public/]
    end

    subgraph "WWW App Structure"
        WWW_REGISTRY[registry/]
        WWW_CONTENT[content/]
        WWW_SCRIPTS[scripts/]
        WWW_PUBLIC[public/]
    end

    ROOT --> APPS
    ROOT --> PACKAGES
    ROOT --> SCRIPTS

    APPS --> V4
    APPS --> WWW

    PACKAGES --> CLI
    PACKAGES --> AI
    PACKAGES --> TESTS

    V4 --> V4_REGISTRY
    V4 --> V4_COMPONENTS
    V4 --> V4_SCRIPTS
    V4 --> V4_PUBLIC

    WWW --> WWW_REGISTRY
    WWW --> WWW_CONTENT
    WWW --> WWW_SCRIPTS
    WWW --> WWW_PUBLIC
```

## 🔧 Key Integration Points

### 1. CLI ↔ Registry Integration
- CLI reads from registry to get component definitions
- CLI writes to registry to add new components
- Registry provides dependency resolution
- Registry handles file path mapping

### 2. AI Generator ↔ Registry Integration
- AI Generator uses registry patterns for component generation
- Generated components follow registry schema
- AI Generator can add components to registry
- Registry provides training data for AI

### 3. Build System ↔ Registry Integration
- Build system processes registry files
- Build system generates public registry
- Build system captures screenshots
- Build system syncs between apps

### 4. MCP ↔ Registry Integration
- MCP server provides registry access to IDEs
- MCP server enables AI-assisted development
- MCP server handles registry queries
- MCP server manages component installation

### 5. Website ↔ Registry Integration
- Website displays registry contents
- Website provides component documentation
- Website enables component preview
- Website manages component installation

## 🚀 Data Flow Summary

1. **Component Creation**: Components are created in registry files
2. **Registry Processing**: Build system processes registry and generates outputs
3. **CLI Access**: CLI reads registry to provide component installation
4. **AI Generation**: AI uses registry patterns to generate new components
5. **Website Display**: Website displays registry contents and documentation
6. **MCP Integration**: MCP provides registry access to development tools
7. **User Installation**: Users install components via CLI or website
8. **Dependency Management**: System manages all dependencies automatically

This architecture creates a complete ecosystem where components can be created, managed, distributed, and used seamlessly across different tools and platforms. 