# Simple EAM Demo Script (25 Minutes)

## Preparation (Before Demo)

- Ensure all services are running (`docker-compose up -d`)
- Load PV scenario (`yarn init-db-pv --reset` in server directory)
- Prepare browser tabs: App, Keycloak Admin, Neo4j Browser
- Be logged in as admin user
- **Excalidraw Test**: Quickly verify that the diagram editor loads

---

## **Part 1: Overview & Login (3 Minutes)**

### **Slide: Enterprise Architecture Management**

> "Welcome to the Simple EAM demo - a modern Enterprise Architecture Management solution with integrated visual diagram editor. Today I'll show you how Solar Panels GmbH manages and visualizes their entire IT landscape."

### **Live Demo - Login & Dashboard**

1. **Open App**: `http://localhost:3000`
2. **Demonstrate Login**:
   - "We use Keycloak for secure authentication"
   - Login as `admin / admin`
3. **Show Dashboard**:
   - "Here we see the key KPIs of our Enterprise Architecture"
   - Briefly explain numbers: 85 Business Capabilities, 23 Applications, 10 AI Components, etc.

---

## **Part 2: Navigation & Business Capabilities (4 Minutes)**

### **Show Navigation**

> "The app is intuitively structured - all important EA areas are directly accessible."

### **Demonstrate Business Capabilities**

1. **Navigate to Business Capabilities**
2. **Show Table**:
   - "Solar Panels GmbH has 85 Business Capabilities in 3 levels"
   - **Demonstrate Filtering**: Search for "Manufacturing Operations"
   - **Show/Hide Columns**: Owner, Status, Maturity Level
3. **Open Capability**: Click "Manufacturing Operations"
   - **Show View Mode**: All details, tags, maturity level
   - **Demonstrate Edit Mode**: "Editing is simple and intuitive"
   - **Show Relationships**: "Here we see which Applications support this Capability"

---

## **Part 3: Diagrams & Visual Architecture (5 Minutes) - NEW!**

### **Diagram Editor as Highlight**

1. **Navigate to Diagrams**
2. **Show Excalidraw Integration**:
   > "Simple EAM provides an integrated visual diagram editor based on Excalidraw for professional EA diagrams."

### **Live Diagram Creation**

3. **Create New Diagram**:
   - **Click "Create New Diagram"**
   - **Enter Title**: "Solar Manufacturing Architecture Overview"
   - **Description**: "High-level view of our manufacturing systems"
4. **Demonstrate Excalidraw Features**:
   - **Draw Rectangles** for Applications: "Solar MES", "Quality System", "ERP"
   - **Add Arrows** for data flows
   - **Text Labels** for descriptions
   - **Use Colors** for categorization
   - **Collaborative Functions**: "Teams can work simultaneously"

### **Diagram Management**

5. **Save and Manage**:
   - **Auto-Save Feature**: "Automatic saving every few seconds"
   - **Version History**: "Complete version control for all changes"
   - **Export Options**: PNG, SVG, JSON for different use cases

### **Business Value**

> "Visual diagrams make complex EA structures understandable for all stakeholders - from Technical Architects to Management."

---

## **Part 4: Applications & Integration (4 Minutes)**

### **Application Portfolio**

1. **Navigate to Applications**
2. **Demonstrate Filtering**:
   - Filter by Technology Stack: "Java"
   - Filter by Lifecycle Status: "Production"
3. **Application Details**:
   - **Open "Solar MES Platform"**
   - **Show Comprehensive Information**: Technology Stack, Hosting, Lifecycle
   - **Demonstrate Relationships**:
     - "Supports Manufacturing Operations"
     - "Uses Customer Master Data"
     - "Hosted on EKS Production Cluster"
     - **NEW**: "Depicted in Manufacturing Architecture Diagram"

---

## **Part 5: AI Components - Innovation Showcase (4 Minutes)**

### **AI/ML Integration**

1. **Navigate to AI Components**
2. **Emphasize Innovation Aspect**:
   > "Solar Panels GmbH uses AI for intelligent manufacturing and quality control - visualized in our Architecture Diagrams."
3. **Show AI Components**:
   - **Open "Quality Prediction System"**
   - **Demonstrate Metrics**: 99.2% Accuracy, €450,000 Training Costs
   - **ML-specific Fields**: Model Type, Training Data, Performance Metrics
4. **Show Integration**:
   - "Uses Quality Test Results for training"
   - "Hosted on EKS Production Cluster"
   - "Supports Quality Management Capability"
   - **NEW**: "Visualized in AI/ML Architecture Diagram"

---

## **Part 6: Data Architecture & Infrastructure (3 Minutes)**

### **Data Objects & Architecture**

1. **Show Data Objects**:
   - "Structured data management with retention policies"
   - **Open "Production Metrics"**: Classification, Retention, Owner
2. **Demonstrate Infrastructure**:
   - **Show "EKS Production Cluster"**
   - **Cloud-Native Approach**: AWS Services, Container Orchestration
   - **Costs & Capacities**: "Transparent TCO management"
3. **Diagram Connection**:
   - "All infrastructure components are visualized in our Technical Architecture Diagrams"

---

## **Part 7: Import/Export & Collaboration (2 Minutes)**

### **Excel Integration & Diagram Export**

1. **Open Import/Export** (Burger Menu)
2. **Demonstrate Template Download**:
   - Download "Business Capabilities Template"
   - **Show Excel**: "Pre-built structure for easy data entry"
3. **Diagram Export NEW**:
   - **Return to a diagram**
   - **Show Export Options**: "PNG for presentations, SVG for web, JSON for backup"
   - **Collaboration**: "Diagrams can be edited and shared in teams"

---

## **Conclusion: Technical Architecture & Vision (Remaining Time)**

### **Tech Stack Highlight with Diagram Integration**

> "Modern, scalable architecture with visual modeling:"

1. **Briefly mention**:
   - **Neo4j**: "Graph database for natural EA relationships"
   - **GraphQL**: "Efficient API with Type Safety"
   - **Next.js 15**: "Modern React application with SSR"
   - **Excalidraw**: "Integrated visual diagram editor"
   - **Material UI**: "Consistent, professional UI"
   - **Docker**: "Container-based deployment"

### **Live Architecture Visualization**

2. **Briefly show Neo4j Browser** (if time):
   - Visualize some nodes and relationships
   - "Graph-based queries in milliseconds"
   - **Connection to diagrams**: "This data can be directly visualized in Excalidraw diagrams"

### **Summary & Vision**

> "Simple EAM offers a unique combination:"

- ✅ **Complete EA Transparency** with Business Capabilities, Applications, Data & Infrastructure
- ✅ **AI/ML Integration** for modern digital transformation
- ✅ **Visual Diagram Editor** for professional EA visualization
- ✅ **Excel Import/Export** for easy data migration
- ✅ **Collaborative Workflow** with real-time diagram editing
- ✅ **Intuitive User Interface** for EA teams
- ✅ **Scalable Cloud-Native Architecture**

### **Outlook**

> "Next features: Automatic diagram generation from data, Advanced Analytics Dashboard, API Management integration"

### **Questions & Answers**

"I'm happy to answer your questions about implementation, architecture, diagram functionality, or specific use cases."

---

## **Demo Tips - Extended:**

### **Preparation:**

- **Test Excalidraw beforehand** - ensure the editor loads quickly
- **Prepare simple diagram** as backup if live drawing doesn't work
- **Share screen** in high resolution (especially important for diagrams)
- **Browser zoom 110-125%** for better readability
- **Check touchpad/mouse functionality** for Excalidraw

### **During Demo:**

- **Slow diagram creation** - viewers should be able to follow
- **Explain functions while drawing** - "Here I'm drawing a data flow"
- **Emphasize business value** - "Now everyone can understand the architecture"
- **Highlight collaborative aspects** - "Teams work together on diagrams"

### **For Diagram Editor:**

- **Use simple shapes** - rectangles, circles, arrows
- **Use colors strategically** - different colors for different system types
- **Keep text readable** - choose sufficient font size
- **Don't get too complex** - 4-5 elements are enough for demo

### **Backup Plan:**

- **Pre-made diagram screenshots** if Excalidraw doesn't work
- **Alternative browser** ready
- **Simple shapes prepared** - for quick demonstration

### **Storytelling for Diagrams:**

- **"Visualization makes EA accessible"** - for all stakeholders
- **"Living documentation"** - diagrams stay current through integration
- **"Collaboration becomes easy"** - teams work visually together

---

## **Key Demo Messages:**

### **Positioning Statement**

"Simple EAM is the only Enterprise Architecture Management platform that combines comprehensive data management with integrated visual modeling, making EA accessible to both technical and business stakeholders."

### **Differentiation Points**

1. **Integrated Diagram Editor** - No need for separate tools like Visio or Lucidchart
2. **AI/ML Component Management** - Unique capability for modern digital organizations
3. **Graph Database Foundation** - Natural modeling of complex relationships
4. **Real-time Collaboration** - Teams can work together on diagrams simultaneously
5. **Excel Integration** - Easy migration from existing EA documentation

### **Target Audience Messages**

- **For IT Architects**: "Professional tooling with technical depth"
- **For EA Managers**: "Complete overview with visual communication"
- **For Business Stakeholders**: "Understandable diagrams and clear relationships"
- **For CTOs**: "Modern, scalable platform ready for cloud-native environments"

This extended demo showcases Simple EAM as a **complete EA management platform** with special focus on **visual architecture modeling**, **AI integration**, and **collaborative workflows**. The diagram editor is positioned as a differentiating feature and practical benefit for EA teams.
